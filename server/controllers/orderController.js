import Order from '../models/Order.js';

// 1. POST /api/v1/orders/:id/approve
export const approveOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
        data: null
      });
    }

    const userRole = req.user.role.name; // Founder, CountryManager, StateManager, CityManager
    const validLevels = ['CityManager', 'StateManager', 'CountryManager', 'Founder'];

    if (!validLevels.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only managers and founders can approve orders.',
        data: null
      });
    }

    // Find if the stage exists in the chain, or append/update it
    let stageIndex = order.approval_chain.findIndex((s) => s.level === userRole);
    
    const stageDetails = {
      level: userRole,
      approver: req.user._id,
      status: 'Approved',
      remarks: remarks || `Approved by ${userRole}`,
      actioned_at: new Date()
    };

    if (stageIndex === -1) {
      order.approval_chain.push(stageDetails);
    } else {
      order.approval_chain[stageIndex] = stageDetails;
    }

    // Logic: If Founder approves, or if it reaches CountryManager approval, the order is fully 'Approved'.
    // If approved by City/State Manager, we keep it in 'Submitted' state but update approval chain.
    if (userRole === 'Founder' || userRole === 'CountryManager') {
      order.status = 'Approved';
    } else {
      order.status = 'Processing'; // Advance status from Submitted to Processing
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order approved successfully at ${userRole} level.`,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// 2. POST /api/v1/orders/:id/reject
export const rejectOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    if (!remarks) {
      return res.status(400).json({
        success: false,
        message: 'Remarks/rejection reason is required.',
        data: null
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
        data: null
      });
    }

    const userRole = req.user.role.name;
    const validLevels = ['CityManager', 'StateManager', 'CountryManager', 'Founder'];

    if (!validLevels.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only managers and founders can reject orders.',
        data: null
      });
    }

    // Update approval chain stage
    let stageIndex = order.approval_chain.findIndex((s) => s.level === userRole);
    
    const stageDetails = {
      level: userRole,
      approver: req.user._id,
      status: 'Rejected',
      remarks,
      actioned_at: new Date()
    };

    if (stageIndex === -1) {
      order.approval_chain.push(stageDetails);
    } else {
      order.approval_chain[stageIndex] = stageDetails;
    }

    // If rejected at any stage, the entire order is marked as 'Cancelled'
    order.status = 'Cancelled';
    order.cancelled_reason = `Rejected at ${userRole} level: ${remarks}`;

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order rejected and cancelled at ${userRole} level.`,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
