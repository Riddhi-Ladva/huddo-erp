import mongoose from 'mongoose';

export const genericController = (Model, populateOptions = []) => {
  return {
    // 1. GET /api/v1/{module} - List (paginated, sorted, searched, filtered)
    getAll: async (req, res, next) => {
      try {
        const {
          page = 1,
          limit = 10,
          sort = 'createdAt',
          order = 'desc',
          search = '',
          ...filters
        } = req.query;

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        // Build query criteria
        const criteria = { is_deleted: { $ne: true } };

        // Handle multi-tenancy if company_id is provided
        if (req.user && req.user.company_id) {
          criteria.company_id = req.user.company_id;
        }

        // Apply filters (e.g., status=Active)
        Object.keys(filters).forEach((key) => {
          if (filters[key] !== undefined && filters[key] !== '') {
            // Check if it's a valid object ID string, if so, cast it
            if (mongoose.isValidObjectId(filters[key])) {
              criteria[key] = new mongoose.Types.ObjectId(filters[key]);
            } else if (filters[key] === 'true' || filters[key] === 'false') {
              criteria[key] = filters[key] === 'true';
            } else {
              criteria[key] = filters[key];
            }
          }
        });

        // Apply search criteria using regex across typical text fields
        if (search) {
          const searchableFields = [];
          const schemaPaths = Model.schema.paths;
          
          const typicalFields = [
            'name', 'title', 'email', 'mobile', 'sku', 'sku_variant', 
            'business_name', 'owner_name', 'order_number', 'invoice_number',
            'employee_code', 'promoter_code', 'po_number'
          ];

          typicalFields.forEach((field) => {
            if (schemaPaths[field]) {
              searchableFields.push({ [field]: { $regex: search, $options: 'i' } });
            }
          });

          if (searchableFields.length > 0) {
            criteria.$or = searchableFields;
          }
        }

        // Sort configuration
        const sortOrder = order === 'asc' ? 1 : -1;
        const sortCriteria = { [sort]: sortOrder };

        // Fetch documents
        let query = Model.find(criteria)
          .sort(sortCriteria)
          .skip(skip)
          .limit(limitNum);

        // Dynamic populate
        if (populateOptions.length > 0) {
          populateOptions.forEach((option) => {
            query = query.populate(option);
          });
        }

        const data = await query;
        const total = await Model.countDocuments(criteria);

        res.status(200).json({
          success: true,
          message: `${Model.modelName}s retrieved successfully.`,
          data,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum)
          }
        });
      } catch (error) {
        next(error);
      }
    },

    // 2. GET /api/v1/{module}/:id - Single record
    getById: async (req, res, next) => {
      try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid record ID.',
            data: null
          });
        }

        let query = Model.findById(id);

        if (populateOptions.length > 0) {
          populateOptions.forEach((option) => {
            query = query.populate(option);
          });
        }

        const data = await query;

        if (!data) {
          return res.status(404).json({
            success: false,
            message: `${Model.modelName} not found.`,
            data: null
          });
        }

        res.status(200).json({
          success: true,
          message: `${Model.modelName} retrieved successfully.`,
          data
        });
      } catch (error) {
        next(error);
      }
    },

    // 3. POST /api/v1/{module} - Create
    create: async (req, res, next) => {
      try {
        // Enforce company tenancy on creations
        if (req.user && req.user.company_id) {
          req.body.company_id = req.user.company_id;
        }

        // If creating a User or Employee, check if we need to auto-link
        const doc = new Model(req.body);
        await doc.save();

        // Populate created doc if populating was requested
        let responseData = doc;
        if (populateOptions.length > 0) {
          responseData = await Model.findById(doc._id);
          for (const option of populateOptions) {
            responseData = await responseData.populate(option);
          }
        }

        res.status(201).json({
          success: true,
          message: `${Model.modelName} created successfully.`,
          data: responseData
        });
      } catch (error) {
        next(error);
      }
    },

    update: async (req, res, next) => {
      try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid record ID.',
            data: null
          });
        }

        let oldDoc = null;
        if (Model.modelName === 'User' || Model.modelName === 'Role') {
          oldDoc = await Model.findById(id);
        }

        const data = await Model.findByIdAndUpdate(
          id,
          { $set: req.body },
          { new: true, runValidators: true }
        );

        if (!data) {
          return res.status(404).json({
            success: false,
            message: `${Model.modelName} not found.`,
            data: null
          });
        }

        // Audit logging for User/Role updates
        if (Model.modelName === 'User' && oldDoc) {
          // Check if role, status or is_active changed
          const roleChanged = String(oldDoc.role) !== String(data.role) || oldDoc.roleName !== data.roleName;
          const statusChanged = oldDoc.status !== data.status || oldDoc.is_active !== data.is_active;

          if (roleChanged || statusChanged) {
            const { logAuditEvent } = await import('../utils/auditLogger.js');
            if (roleChanged) {
              await logAuditEvent(
                req.user?._id,
                'role-update',
                'users',
                data._id,
                { role: oldDoc.role, roleName: oldDoc.roleName },
                { role: data.role, roleName: data.roleName },
                req
              );
            }
            if (statusChanged) {
              await logAuditEvent(
                req.user?._id,
                'status-update',
                'users',
                data._id,
                { status: oldDoc.status, is_active: oldDoc.is_active },
                { status: data.status, is_active: data.is_active },
                req
              );
            }
          }
        } else if (Model.modelName === 'Role' && oldDoc) {
          const { logAuditEvent } = await import('../utils/auditLogger.js');
          await logAuditEvent(
            req.user?._id,
            'role-definition-update',
            'roles',
            data._id,
            oldDoc.permissions,
            data.permissions,
            req
          );
        }

        // Populate updated doc
        let responseData = data;
        if (populateOptions.length > 0) {
          for (const option of populateOptions) {
            responseData = await responseData.populate(option);
          }
        }

        res.status(200).json({
          success: true,
          message: `${Model.modelName} updated successfully.`,
          data: responseData
        });
      } catch (error) {
        next(error);
      }
    },

    // 5. DELETE /api/v1/{module}/:id - Soft Delete
    delete: async (req, res, next) => {
      try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid record ID.',
            data: null
          });
        }

        // We perform a soft delete by marking is_deleted = true
        const data = await Model.findByIdAndUpdate(
          id,
          { $set: { is_deleted: true } },
          { new: true }
        );

        if (!data) {
          return res.status(404).json({
            success: false,
            message: `${Model.modelName} not found.`,
            data: null
          });
        }

        res.status(200).json({
          success: true,
          message: `${Model.modelName} soft-deleted successfully.`,
          data: null
        });
      } catch (error) {
        next(error);
      }
    }
  };
};
