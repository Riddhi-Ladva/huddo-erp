import mongoose from 'mongoose';

// Auto paise-to-decimal amount converters
export const amountSchemaType = {
  type: Number,
  get: (v) => (v !== undefined ? v / 100 : v),
  set: (v) => (v !== undefined ? Math.round(v * 100) : v)
};

export const softDeletePlugin = (schema) => {
  // Add common fields
  schema.add({
    is_deleted: { 
      type: Boolean, 
      default: false, 
      index: true 
    },
    company_id: { 
      type: String, 
      default: '1', // default tenant
      index: true 
    }
  });

  // Configure JSON and Object output to always run getters (for paise-to-decimal conversion)
  schema.set('toJSON', { getters: true, virtuals: true });
  schema.set('toObject', { getters: true, virtuals: true });

  // Query middleware to filter out is_deleted = true by default
  const excludeDeleted = function() {
    const query = this.getQuery();
    // Allow override if explicitly querying is_deleted
    if (query && query.is_deleted !== undefined) {
      return;
    }
    this.where({ is_deleted: { $ne: true } });
  };

  schema.pre('find', excludeDeleted);
  schema.pre('findOne', excludeDeleted);
  schema.pre('findOneAndUpdate', excludeDeleted);
  schema.pre('updateMany', excludeDeleted);
  schema.pre('updateOne', excludeDeleted);
  schema.pre('countDocuments', excludeDeleted);
  schema.pre('aggregate', function(next) {
    // Exclude soft-deleted records from aggregations
    // Check if there is already a stage checking for is_deleted
    const stages = this.pipeline();
    const hasDeletedCheck = stages.some(stage => stage.$match && stage.$match.is_deleted !== undefined);
    if (!hasDeletedCheck) {
      this.pipeline().unshift({ $match: { is_deleted: { $ne: true } } });
    }
    next();
  });
};
