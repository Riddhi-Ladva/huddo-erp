import React from 'react';
import { 
  ShoppingBag, CreditCard, Tag, Landmark, Phone, Star, 
  ArrowRight, CheckCircle2, AlertTriangle, Truck, FileText
} from 'lucide-react';
import { 
  StatWidget, 
  DashboardCard, 
  DashboardTable, 
  DashboardAreaChart 
} from '../../../components/DesignSystem';

import { mockRetailer } from '../mockData/mockRetailer';
import { mockOrders } from '../mockData/mockOrders';
import { mockInvoices } from '../mockData/mockInvoices';
import { mockSchemes } from '../mockData/mockSchemes';
import { mockCommissionSummary } from '../mockData/mockCommissions';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard({ onNavigate }) {
  // Calculations based on mock data
  const totalOrdersCount = mockOrders.length;
  
  const orderBreakdown = mockOrders.reduce((acc, curr) => {
    if (['Pending', 'Submitted'].includes(curr.paymentStatus) && curr.orderStatus !== 'Cancelled') {
      acc.pending += 1;
    } else if (['Approved', 'Processing', 'Packed', 'Shipped'].includes(curr.orderStatus)) {
      acc.approved += 1;
    } else if (curr.orderStatus === 'Delivered') {
      acc.delivered += 1;
    }
    return acc;
  }, { pending: 0, approved: 0, delivered: 0 });

  // Total Outstanding Payments
  const outstandingAmount = mockInvoices
    .filter(inv => inv.status === 'Pending' || inv.status === 'Overdue')
    .reduce((sum, inv) => sum + inv.total, 0);

  // Count active schemes applicable to Gold tier
  const activeSchemesCount = mockSchemes.filter(s => 
    s.isActive && s.applicableTiers.includes(mockRetailer.category)
  ).length;

  // Recent 5 orders
  const recentOrders = mockOrders
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Mock chart data representing purchase history
  const purchaseChartData = [
    { month: 'Jan', amount: 45000 },
    { month: 'Feb', amount: 62000 },
    { month: 'Mar', amount: 55000 },
    { month: 'Apr', amount: 84000 },
    { month: 'May', amount: 73000 },
    { month: 'Jun', amount: 96000 }
  ];

  const tableColumns = [
    { header: "Order ID", accessor: "id", render: (val) => <span className="font-bold text-slate-900">{val}</span> },
    { header: "Order Date", accessor: "date", render: (val) => <span className="text-slate-400 font-semibold">{val}</span> },
    { header: "Items Purchased", accessor: "items", render: (val, row) => {
      const totalItemsQty = row.items.reduce((sum, it) => sum + it.quantity, 0);
      return <span>{totalItemsQty} pairs</span>;
    }},
    { header: "Amount Total", accessor: "totalAmount", render: (val) => <span className="font-bold text-slate-800">₹{val.toLocaleString('en-IN')}</span> },
    { header: "Payment Verification", accessor: "paymentStatus", render: (val) => (
      <span className="flex items-center gap-1.5">
        <span className={`inline-block w-2 h-2 rounded-full ${
          val === 'Verified' ? 'bg-emerald-500' :
          val === 'Pending' ? 'bg-amber-400' : 'bg-rose-500'
        }`}></span>
        <span>{val}</span>
      </span>
    )},
    { header: "Tracking Status", accessor: "orderStatus", render: (val) => <StatusBadge status={val} /> }
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Section */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Background decorative gradient */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-brand-orange/15 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white flex items-center gap-1 shadow-sm">
              <Star className="w-3 h-3 fill-white" />
              {mockRetailer.category} Member
            </span>
            <span className="text-xs text-slate-400 font-bold">Code: {mockRetailer.retailerCode}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight font-display">Welcome back, {mockRetailer.businessName}!</h1>
          <p className="text-xs text-slate-400 font-medium">Manage your shoe inventory orders, check pending invoices, and review loyalty commissions.</p>
        </div>

        <div className="flex gap-2.5 shrink-0 z-10">
          <button 
            onClick={() => onNavigate('Place Order')}
            className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Place New Order</span>
          </button>
          <button 
            onClick={() => onNavigate('Billing & Invoices')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-705 text-slate-200 text-xs font-bold rounded-xl shadow-sm border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>View Invoices</span>
          </button>
        </div>
      </div>

      {/* 4 Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatWidget 
          title="Total Orders" 
          value={totalOrdersCount}
          delta={
            <div className="flex gap-2.5 text-[10px] font-bold text-slate-500 mt-1">
              <span className="flex items-center gap-0.5 text-blue-600 bg-blue-50 px-1 py-0.5 rounded">{orderBreakdown.pending} Pend</span>
              <span className="flex items-center gap-0.5 text-amber-600 bg-amber-50 px-1 py-0.5 rounded">{orderBreakdown.approved} Appr</span>
              <span className="flex items-center gap-0.5 text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">{orderBreakdown.delivered} Delv</span>
            </div>
          }
          icon={ShoppingBag}
          onClick={() => onNavigate('My Orders')}
        />
        <StatWidget 
          title="Payments Due" 
          value={`₹${outstandingAmount.toLocaleString('en-IN')}`}
          delta={<span className="text-rose-600 font-bold">Requires Settlement</span>}
          icon={CreditCard}
          colorClass="text-rose-500 bg-rose-50"
          onClick={() => onNavigate('Billing & Invoices')}
        />
        <StatWidget 
          title="Active Schemes" 
          value={activeSchemesCount}
          delta={
            <div className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded mt-1.5 inline-flex items-center gap-1 cursor-pointer" onClick={(e) => { e.stopPropagation(); onNavigate('Schemes & Discounts'); }}>
              <span>Available for Gold</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          }
          icon={Tag}
          colorClass="text-amber-500 bg-amber-50"
          onClick={() => onNavigate('Schemes & Discounts')}
        />
        <StatWidget 
          title="Monthly Rewards" 
          value={`₹${mockCommissionSummary.thisMonthEarned.toLocaleString('en-IN')}`}
          delta={
            <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-1.5 inline-block">
              Points: {mockCommissionSummary.loyaltyPoints} PTS
            </div>
          }
          icon={Landmark}
          colorClass="text-emerald-500 bg-emerald-50"
          onClick={() => onNavigate('Commission & Rewards')}
        />
      </div>

      {/* Main Grid: Recharts Performance + Managers info & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Monthly Purchase Performance */}
        <DashboardCard 
          title="Purchase Trend (Lifetime Analytics)" 
          subtitle="Plots the total value of products purchased by your retail shop monthly."
          className="lg:col-span-2"
        >
          <DashboardAreaChart 
            data={purchaseChartData} 
            xKey="month" 
            areaKey="amount" 
            formatter={(value) => [`₹${value.toLocaleString()}`, 'Purchases']}
          />
        </DashboardCard>

        {/* Right Col: Local Personnel Details & Quick Actions */}
        <div className="space-y-6">
          {/* City Manager Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 font-display">Assigned Managers</h3>
            
            {/* City Manager */}
            <div className="flex items-center gap-3.5 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-brand-orange flex items-center justify-center font-bold text-sm shrink-0">
                CM
              </div>
              <div className="text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">City Manager</span>
                <h4 className="font-extrabold text-slate-850 font-display">{mockRetailer.assignedCityManager}</h4>
                <div className="flex items-center gap-3 text-slate-500 font-medium mt-1">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-450" /> +91 9912837492</span>
                </div>
              </div>
            </div>

            {/* Field Promoter */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center font-bold text-sm shrink-0">
                FP
              </div>
              <div className="text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Field Promoter</span>
                <h4 className="font-extrabold text-slate-850 font-display">{mockRetailer.assignedPromoter}</h4>
                <div className="flex items-center gap-3 text-slate-500 font-medium mt-1">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-455" /> +91 9882938401</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-800 font-display">Quick Action Shortcuts</h3>
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold text-slate-700">
              <button 
                onClick={() => onNavigate('Place Order')}
                className="p-3 border border-slate-100 hover:border-brand-orange/40 hover:bg-orange-50/20 rounded-xl transition-all flex flex-col items-center gap-2 bg-slate-50/50 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 text-brand-orange" />
                <span>Place Order</span>
              </button>
              <button 
                onClick={() => onNavigate('Schemes & Discounts')}
                className="p-3 border border-slate-100 hover:border-brand-orange/40 hover:bg-orange-50/20 rounded-xl transition-all flex flex-col items-center gap-2 bg-slate-50/50 cursor-pointer"
              >
                <Tag className="w-5 h-5 text-amber-500" />
                <span>View Schemes</span>
              </button>
              <button 
                onClick={() => onNavigate('Billing & Invoices')}
                className="p-3 border border-slate-100 hover:border-brand-orange/40 hover:bg-orange-50/20 rounded-xl transition-all flex flex-col items-center gap-2 bg-slate-50/50 col-span-2 cursor-pointer"
              >
                <Landmark className="w-5 h-5 text-emerald-500" />
                <span>Verify Invoices & Pay History</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Orders Listing */}
      <DashboardCard 
        title="Recent Order Activity" 
        subtitle="Tracks status progression for your last 5 footwear orders."
        headerActions={
          <button 
            onClick={() => onNavigate('My Orders')}
            className="text-xs font-bold text-brand-orange hover:text-brand-orange-hover hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        }
      >
        <DashboardTable 
          columns={tableColumns} 
          data={recentOrders} 
          emptyText="No orders placed yet."
        />
      </DashboardCard>
    </div>
  );
}
