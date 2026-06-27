import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Target from '../models/Target.js';
import Role from '../models/Role.js';
import { verifyJWT } from '../middleware/auth.js';

const router = express.Router();

// Helper to resolve Country Manager user ID from request parameter
async function resolveCMUser(idStr) {
  if (mongoose.isValidObjectId(idStr)) {
    const user = await User.findById(idStr);
    if (user) return user;
  }
  
  // Mock ID fallback: Rajesh Sharma is the Country Manager seeded with this email
  const user = await User.findOne({ email: 'rajesh@huddoerp.in' });
  return user;
}

// Helper to parse dates from period label
function getPeriodDates(periodType, periodLabel) {
  let period_start = new Date();
  let period_end = new Date();
  
  try {
    if (periodType === 'Monthly' && periodLabel.includes('-')) {
      const [year, month] = periodLabel.split('-').map(Number);
      if (!isNaN(year) && !isNaN(month)) {
        period_start = new Date(year, month - 1, 1);
        period_end = new Date(year, month, 0, 23, 59, 59);
      }
    } else if (periodType === 'Quarterly' && periodLabel.includes('-Q')) {
      const [yearStr, qStr] = periodLabel.split('-Q');
      const year = Number(yearStr);
      const q = Number(qStr);
      if (!isNaN(year) && !isNaN(q)) {
        period_start = new Date(year, (q - 1) * 3, 1);
        period_end = new Date(year, q * 3, 0, 23, 59, 59);
      }
    } else if (periodType === 'Yearly') {
      const year = Number(periodLabel);
      if (!isNaN(year)) {
        period_start = new Date(year, 0, 1);
        period_end = new Date(year, 12, 0, 23, 59, 59);
      }
    }
  } catch (err) {
    console.error('Error parsing period dates:', err);
  }
  
  return { period_start, period_end };
}

// 1. GET /api/v1/country-managers/:id/targets
router.get('/:id/targets', verifyJWT, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await resolveCMUser(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Country Manager not found.' });
    }

    // Fetch all targets assigned to this Country Manager
    const dbTargets = await Target.find({ assigned_to: user._id, is_deleted: { $ne: true } });
    
    // Group targets by title (period) and period_type
    const groups = {};
    dbTargets.forEach((t) => {
      const key = `${t.period_type}_${t.title}`;
      if (!groups[key]) {
        groups[key] = {
          id: t._id.toString(), // use one of the IDs as unique reference
          country_manager_id: 1, // mock compatible ID
          country_id: 1,
          target_type: t.period_type,
          target_period: t.title,
          revenue_target: 0,
          revenue_achieved: 0,
          revenue_pct: 0,
          order_count_target: 0,
          order_count_achieved: 0,
          retailer_target: 0,
          retailer_achieved: 0,
          new_cities_target: 0,
          new_cities_achieved: 0,
          status: 'Active'
        };
      }
      
      const group = groups[key];
      if (t.kpi_type === 'Revenue') {
        group.revenue_target = t.target_value;
        group.revenue_achieved = t.achieved_value;
        group.revenue_pct = t.achievement_percentage || 0;
        group.status = t.status;
      } else if (t.kpi_type === 'OrderCount') {
        group.order_count_target = t.target_value;
        group.order_count_achieved = t.achieved_value;
      } else if (t.kpi_type === 'RetailerAcquisition') {
        group.retailer_target = t.target_value;
        group.retailer_achieved = t.achieved_value;
      } else if (t.kpi_type === 'MarketExpansion') {
        group.new_cities_target = t.target_value;
        group.new_cities_achieved = t.achieved_value;
      }
    });

    const targetsList = Object.values(groups);
    res.status(200).json({
      success: true,
      targets: targetsList
    });
  } catch (error) {
    next(error);
  }
});

// 2. POST /api/v1/country-managers/:id/targets
router.post('/:id/targets', verifyJWT, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await resolveCMUser(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Country Manager not found.' });
    }

    const {
      target_type,
      target_period,
      revenue_target,
      order_count_target,
      retailer_target,
      new_cities_target
    } = req.body;

    // Backend validation
    if (!target_type || !['Monthly', 'Quarterly', 'Yearly'].includes(target_type)) {
      return res.status(400).json({ success: false, message: 'Invalid target type. Must be Monthly, Quarterly, or Yearly.' });
    }
    if (!target_period || typeof target_period !== 'string' || target_period.trim() === '') {
      return res.status(400).json({ success: false, message: 'Period label is required.' });
    }
    if (revenue_target === undefined || isNaN(revenue_target) || Number(revenue_target) < 0) {
      return res.status(400).json({ success: false, message: 'Revenue target must be a non-negative number.' });
    }
    if (order_count_target === undefined || isNaN(order_count_target) || Number(order_count_target) < 0) {
      return res.status(400).json({ success: false, message: 'Order count target must be a non-negative number.' });
    }
    if (retailer_target === undefined || isNaN(retailer_target) || Number(retailer_target) < 0) {
      return res.status(400).json({ success: false, message: 'Retailer target must be a non-negative number.' });
    }
    if (new_cities_target === undefined || isNaN(new_cities_target) || Number(new_cities_target) < 0) {
      return res.status(400).json({ success: false, message: 'New cities target must be a non-negative number.' });
    }

    // Resolve date boundaries
    const { period_start, period_end } = getPeriodDates(target_type, target_period);

    const kpiMappings = [
      { type: 'Revenue', value: Number(revenue_target) },
      { type: 'OrderCount', value: Number(order_count_target) },
      { type: 'RetailerAcquisition', value: Number(retailer_target) },
      { type: 'MarketExpansion', value: Number(new_cities_target) }
    ];

    // Upsert targets for each KPI type
    for (const kpi of kpiMappings) {
      await Target.findOneAndUpdate(
        {
          assigned_to: user._id,
          period_type: target_type,
          title: target_period,
          kpi_type: kpi.type,
          is_deleted: { $ne: true }
        },
        {
          $set: {
            target_value: kpi.value,
            period_start,
            period_end,
            scope_level: 'Country',
            status: 'Active'
          }
        },
        { upsert: true, new: true, runValidators: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Targets saved successfully.'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
