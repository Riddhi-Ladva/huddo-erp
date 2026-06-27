import React from 'react';
import { 
  ShoppingBag, CreditCard, Tag, Landmark, Phone, Star, 
  ArrowRight, CheckCircle2, AlertTriangle, Truck, Layers, FileText
} from 'lucide-react';
import { 
  StatWidget, 
  DashboardCard, 
  DashboardTable, 
  DashboardAreaChart,
  PrimaryButton,
  SecondaryButton 
} from '../../../components/DesignSystem';

// Use similar mock structure but tailored for Distributor
const mockDistributor = {
  id: "DST-001",
  businessName: "Huddo Mega Distributors",
  ownerName: "Vijay Sharma",
  mobileNumber: "9812345678",
  emailAddress: "vijay@huddodistributors.com",
  warehouseAddress: "Plot 45, Sector 4, Industrial Area, Pune",
  state: "Maharashtra",
  city: "Pune",
  gstNumber: "27BBBBB2222B2Z2",
  category: "Platinum", // Platinum / Gold / Silver
  assignedCityManager: "Sanjay Joshi",
  distributorCode: "DST-PLAT-001",
  accountStatus: "Active"
};

const mockDistributorOrders = [
  { id: "ORD-D-991", date: "2026-06-17", pairs: 1200, totalAmount: 480000, paymentStatus: "Verified", orderStatus: "Processing" },
  { id: "ORD-D-988", date: "2026-06-15", pairs: 850, totalAmount: 340000, paymentStatus: "Verified", orderStatus: "Shipped" },
  { id: "ORD-D-982", date: "2026-06-12", pairs: 2000, totalAmount: 800000, paymentStatus: "Verified", orderStatus: "Delivered" },
  { id: "ORD-D-975", date: "2026-06-08", pairs: 1500, totalAmount: 600000, paymentStatus: "Pending", orderStatus: "Processing" },
  { id: "ORD-D-969", date: "2026-06-03", pairs: 1000, totalAmount: 400000, paymentStatus: "Verified", orderStatus: "Delivered" },
];

export default function DistributorDashboard({ onNavigate }) {
  const totalOrdersCount = mockDistributorOrders.length;
  
  const orderBreakdown = mockDistributorOrders.reduce((acc, curr) => {
    if (curr.paymentStatus === 'Pending' && curr.orderStatus !== 'Cancelled') {
      acc.pending += 1;
    } else if (['Processing', 'Shipped'].includes(curr.orderStatus)) {
      acc.approved += 1;
    } else if (curr.orderStatus === 'Delivered') {
      acc.delivered += 1;
    }
    return acc;
  }, { pending: 0, approved: 0, delivered: 0 });

  const outstandingAmount = 940000; // Mock outstanding amount for bulk invoicing
  const activeSchemesCount = 4;
  const thisMonthIncentives = 78500;

  const distributionChartData = [
    { month: 'Jan', amount: 1200000 },
    { month: 'Feb', amount: 1850000 },
    { month: 'Mar', amount: 1500000 },
    { month: 'Apr', amount: 2400000 },
    { month: 'May', amount: 2100000 },
    { month: 'Jun', amount: 2950000 }
  ];

  const tableColumns = [
    { header: "Bulk Order ID", accessor: "id", render: (val) => <span className="font-bold text-slate-900">{val}</span> },
    { header: "Order Date", accessor: "date", render: (val) => <span className="text-slate-400 font-semibold">{val}</span> },
    { header: "Bulk Pairs", accessor: "pairs", render: (val) => <span>{val.toLocaleString()} pairs</span> },
    { header: "Amount Total", accessor: "totalAmount", render: (val) => <span className="font-bold text-slate-800">₹{val.toLocaleString('en-IN')}</span> },
    { header: "Payment Status", accessor: "paymentStatus", render: (val) => (
      <span className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${val === 'Verified' ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
        <span className="font-bold">{val}</span>
      </span>
    )},
    { header: "Tracking Status", accessor: "orderStatus", render: (val) => {
      const color = val === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    val === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-amber-50 text-amber-700 border-amber-200';
      return <span className={`px-2 py-0.5 border rounded-full text-[10px] font-bold ${color}`}>{val}</span>;
    }}
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Section */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Background decorative gradient */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-brand-orange/15 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-orange text-white flex items-center gap-1 shadow-sm">
              <Star className="w-3 h-3 fill-white" />
              {mockDistributor.category} Distributor
            </span>
            <span className="text-xs text-slate-400 font-bold">Code: {mockDistributor.distributorCode}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight font-display">Welcome back, {mockDistributor.businessName}!</h1>
          <p className="text-xs text-slate-400 font-medium">Manage wholesale distribution stocks, check pending statements, and review quarterly incentives.</p>
        </div>

        <div className="flex gap-2.5 shrink-0 z-10">
          <PrimaryButton 
            icon={ShoppingBag} 
            onClick={() => onNavigate('Place Order')}
          >
            Bulk Restock Order
          </PrimaryButton>
          <SecondaryButton 
            icon={FileText} 
            onClick={() => onNavigate('Billing & Invoices')}
            className="!bg-slate-800 !text-slate-200 !border-slate-700 hover:!bg-slate-700"
          >
            Statements
          </SecondaryButton>
        </div>
      </div>

      {/* 4 Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatWidget 
          title="Wholesale Orders" 
          value={totalOrdersCount}
          delta={
            <div className="flex gap-2 text-[10px] font-bold text-slate-500 mt-1">
              <span className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded">{orderBreakdown.pending} Pend</span>
              <span className="text-amber-600 bg-amber-50 px-1 py-0.5 rounded">{orderBreakdown.approved} Actv</span>
              <span className="text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">{orderBreakdown.delivered} Delv</span>
            </div>
          }
          icon={ShoppingBag}
          onClick={() => onNavigate('My Orders')}
        />
        <StatWidget 
          title="Outstanding Payable" 
          value={`₹${outstandingAmount.toLocaleString('en-IN')}`}
          delta={<span className="text-rose-600 font-bold">Settlement Overdue</span>}
          icon={CreditCard}
          colorClass="text-rose-500 bg-rose-50"
          onClick={() => onNavigate('Billing & Invoices')}
        />
        <StatWidget 
          title="Distributor Schemes" 
          value={activeSchemesCount}
          delta={<span className="text-amber-600 font-bold">Active Incentives</span>}
          icon={Tag}
          colorClass="text-amber-500 bg-amber-50"
          onClick={() => onNavigate('Schemes & Discounts')}
        />
        <StatWidget 
          title="Quarterly Reward Payout" 
          value={`₹${thisMonthIncentives.toLocaleString('en-IN')}`}
          delta={<span className="text-emerald-600 font-bold">Volume Bonus Earned</span>}
          icon={Landmark}
          colorClass="text-emerald-500 bg-emerald-50"
          onClick={() => onNavigate('Commission & Rewards')}
        />
      </div>

      {/* Main Grid: Recharts Performance + Managers info & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Monthly Purchase Performance */}
        <DashboardCard 
          title="Distribution Purchase Performance" 
          subtitle="Plots the value of bulk footwear purchases made by your distributing agency."
          className="lg:col-span-2"
        >
          <DashboardAreaChart 
            data={distributionChartData} 
            xKey="month" 
            areaKey="amount" 
            formatter={(val) => [`₹${val.toLocaleString()}`, 'Purchases']}
          />
        </DashboardCard>

        {/* Right Col: Local Personnel Details & Quick Actions */}
        <div className="space-y-6">
          {/* City Manager Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 font-display">Assigned Managers</h3>
            
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-brand-orange flex items-center justify-center font-bold text-sm shrink-0">
                CM
              </div>
              <div className="text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">City Manager</span>
                <h4 className="font-extrabold text-slate-800 font-display">{mockDistributor.assignedCityManager}</h4>
                <div className="flex items-center gap-3 text-slate-500 font-medium mt-1">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> +91 9912837492</span>
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
                className="p-3 border border-slate-100 hover:border-brand-orange/40 hover:bg-orange-50/20 rounded-xl transition-all flex flex-col items-center gap-2 bg-slate-50/50"
              >
                <ShoppingBag className="w-5 h-5 text-brand-orange" />
                <span>Bulk Order</span>
              </button>
              <button 
                onClick={() => onNavigate('Schemes & Discounts')}
                className="p-3 border border-slate-100 hover:border-brand-orange/40 hover:bg-orange-50/20 rounded-xl transition-all flex flex-col items-center gap-2 bg-slate-50/50"
              >
                <Tag className="w-5 h-5 text-amber-500" />
                <span>Distributor Deals</span>
              </button>
              <button 
                onClick={() => onNavigate('Billing & Invoices')}
                className="p-3 border border-slate-100 hover:border-brand-orange/40 hover:bg-orange-50/20 rounded-xl transition-all flex flex-col items-center gap-2 bg-slate-50/50 col-span-2"
              >
                <Landmark className="w-5 h-5 text-emerald-500" />
                <span>Statement History</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Orders Listing */}
      <DashboardCard 
        title="Recent Bulk Dispatch Orders" 
        subtitle="Tracks shipment and clearance progress for your bulk footwear allocations."
        headerActions={
          <button 
            onClick={() => onNavigate('My Orders')}
            className="text-xs font-bold text-brand-orange hover:text-brand-orange-hover hover:underline flex items-center gap-1"
          >
            <span>All Bulk Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        }
      >
        <DashboardTable 
          columns={tableColumns} 
          data={mockDistributorOrders} 
          emptyText="No bulk orders placed yet."
        />
      </DashboardCard>
    </div>
  );
}
