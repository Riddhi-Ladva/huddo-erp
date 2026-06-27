import mongoose from 'mongoose';
import Order from '../models/Order.js';
import CommissionRecord from '../models/CommissionRecord.js';
import StockRecord from '../models/StockRecord.js';
import Invoice from '../models/Invoice.js';

// 1. GET /api/v1/reports/:type
export const getReport = async (req, res, next) => {
  try {
    const { type } = req.params;

    // CEO restriction on financial reports
    if (req.user && req.user.role && req.user.role.name === 'CEO') {
      const financialTypes = ['sales', 'revenue', 'commission'];
      if (financialTypes.includes(type.toLowerCase())) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: CEO has no access to financial reports.',
          data: null
        });
      }
    }

    const { startDate, endDate, company_id } = req.query;

    // Base date filters
    const dateCriteria = {};
    if (startDate && endDate) {
      dateCriteria.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      dateCriteria.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      dateCriteria.createdAt = { $lte: new Date(endDate) };
    }

    let reportData = [];

    switch (type.toLowerCase()) {
      case 'sales':
        // Sales Report: Aggregate confirmed orders grouped by retailer
        reportData = await Order.aggregate([
          {
            $match: {
              ...dateCriteria,
              status: { $in: ['Approved', 'Processing', 'Packed', 'Shipped', 'Delivered'] }
            }
          },
          {
            $group: {
              _id: '$retailer',
              totalSales: { $sum: '$grand_total' },
              totalTax: { $sum: '$tax_amount' },
              totalDiscount: { $sum: '$discount_amount' },
              orderCount: { $sum: 1 }
            }
          },
          {
            $lookup: {
              from: 'retailers',
              localField: '_id',
              foreignField: '_id',
              as: 'retailerDetails'
            }
          },
          { $unwind: '$retailerDetails' },
          {
            $project: {
              retailerName: '$retailerDetails.business_name',
              owner: '$retailerDetails.owner_name',
              totalSales: 1, // Automatic conversion by Mongoose only works on query models; here we divide by 100 manually
              totalTax: 1,
              totalDiscount: 1,
              orderCount: 1
            }
          },
          { $sort: { totalSales: -1 } }
        ]);
        break;

      case 'revenue':
        // Revenue Report: Aggregate paid invoices over time (grouped by year-month)
        reportData = await Invoice.aggregate([
          {
            $match: {
              ...dateCriteria,
              is_paid: true
            }
          },
          {
            $group: {
              _id: {
                year: { $year: '$paid_at' },
                month: { $month: '$paid_at' }
              },
              totalCollected: { $sum: '$total' },
              cgst: { $sum: '$cgst' },
              sgst: { $sum: '$sgst' },
              igst: { $sum: '$igst' },
              invoiceCount: { $sum: 1 }
            }
          },
          {
            $project: {
              period: {
                $concat: [
                  { $toString: '$_id.year' },
                  '-',
                  { $cond: [{ $lt: ['$_id.month', 10] }, '0', ''] },
                  { $toString: '$_id.month' }
                ]
              },
              totalCollected: 1,
              cgst: 1,
              sgst: 1,
              igst: 1,
              invoiceCount: 1
            }
          },
          { $sort: { period: -1 } }
        ]);
        break;

      case 'commission':
        // Commission Report: Grouped by user and commission type
        reportData = await CommissionRecord.aggregate([
          { $match: dateCriteria },
          {
            $group: {
              _id: {
                user: '$user',
                type: '$commission_type'
              },
              totalEarned: { $sum: '$amount' },
              approvedCount: { 
                $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] } 
              },
              paidCount: { 
                $sum: { $cond: [{ $eq: ['$status', 'Paid'] }, 1, 0] } 
              }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: '_id.user',
              foreignField: '_id',
              as: 'userDetails'
            }
          },
          { $unwind: '$userDetails' },
          {
            $project: {
              userName: '$userDetails.name',
              userEmail: '$userDetails.email',
              commissionType: '$_id.type',
              totalEarned: 1,
              approvedCount: 1,
              paidCount: 1
            }
          },
          { $sort: { totalEarned: -1 } }
        ]);
        break;

      case 'stock':
        // Stock Report: Grouped by product variant, showing current quantity vs reorder threshold
        reportData = await StockRecord.aggregate([
          {
            $group: {
              _id: '$product_variant',
              totalQuantity: { $sum: '$quantity' },
              warehousesCount: { $sum: 1 }
            }
          },
          {
            $lookup: {
              from: 'productvariants',
              localField: '_id',
              foreignField: '_id',
              as: 'variantDetails'
            }
          },
          { $unwind: '$variantDetails' },
          {
            $lookup: {
              from: 'products',
              localField: 'variantDetails.product',
              foreignField: '_id',
              as: 'productDetails'
            }
          },
          { $unwind: '$productDetails' },
          {
            $project: {
              sku: '$variantDetails.sku_variant',
              color: '$variantDetails.color',
              size: '$variantDetails.size',
              productName: '$productDetails.name',
              totalQuantity: 1,
              warehousesCount: 1
            }
          },
          { $sort: { totalQuantity: 1 } }
        ]);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: `Unknown report type '${type}'. Available types: sales, revenue, commission, stock.`,
          data: null
        });
    }

    res.status(200).json({
      success: true,
      message: `Report for '${type}' generated successfully.`,
      data: reportData
    });
  } catch (error) {
    next(error);
  }
};
