import React from 'react';
import { 
  ShoppingBag, CreditCard, Tag, Landmark, Phone, Mail, User, 
  ArrowRight, Store, Star, Calendar, FileText, CheckCircle2, AlertTriangle, Truck
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

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
            className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Place New Order</span>
          </button>
          <button 
            onClick={() => onNavigate('Billing & Invoices')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-755 text-slate-200 text-xs font-bold rounded-xl shadow-sm border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>View Invoices</span>
          </button>
        </div>
      </div>

      {/* 4 Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Orders */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
            <span className="p-2 bg-slate-50 text-slate-500 rounded-lg"><ShoppingBag className="w-4 h-4" /></span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 font-display">{totalOrdersCount}</span>
            <div className="flex gap-2.5 text-[10px] font-bold text-slate-500 mt-1.5">
              <span className="flex items-center gap-0.5 text-blue-600 bg-blue-50 px-1 py-0.5 rounded"><AlertTriangle className="w-3 h-3" /> {orderBreakdown.pending} Pend</span>
              <span className="flex items-center gap-0.5 text-amber-600 bg-amber-50 px-1 py-0.5 rounded"><Truck className="w-3 h-3" /> {orderBreakdown.approved} Appr</span>
              <span className="flex items-center gap-0.5 text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded"><CheckCircle2 className="w-3 h-3" /> {orderBreakdown.delivered} Delv</span>
            </div>
          </div>
        </div>

        {/* Card 2: Outstanding Payments */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payments Due</span>
            <span className="p-2 bg-rose-50 text-rose-500 rounded-lg"><CreditCard className="w-4 h-4" /></span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 font-display">₹{outstandingAmount.toLocaleString('en-IN')}</span>
            <div className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded mt-1.5 inline-block">
              Requires Settlement
            </div>
          </div>
        </div>

        {/* Card 3: Active Schemes */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Schemes</span>
            <span className="p-2 bg-amber-50 text-amber-500 rounded-lg"><Tag className="w-4 h-4" /></span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 font-display">{activeSchemesCount}</span>
            <div className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded mt-1.5 inline-flex items-center gap-1 cursor-pointer" onClick={() => onNavigate('Schemes & Discounts')}>
              <span>Available for Gold</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Card 4: Month Commission */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Rewards</span>
            <span className="p-2 bg-emerald-50 text-emerald-500 rounded-lg"><Landmark className="w-4 h-4" /></span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 font-display">₹{mockCommissionSummary.thisMonthEarned.toLocaleString('en-IN')}</span>
            <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-1.5 inline-block">
              Points: {mockCommissionSummary.loyaltyPoints} PTS
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Recharts Performance + Managers info & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Monthly Purchase Performance */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800 font-display">Purchase Trend (Lifetime Analytics)</h3>
            <p className="text-[11px] text-slate-400 font-medium">Plots the total value of products purchased by your retail shop monthly.</p>
          </div>
          <div className="h-64 flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={purchaseChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={10} stroke="#94a3b8" />
                <YAxis fontSize={10} stroke="#94a3b8" />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Purchases']} />
                <Area type="monotone" dataKey="amount" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorPurchases)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

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
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-450" /> +91 9882938401</span>
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
                <span>Place Order</span>
              </button>
              <button 
                onClick={() => onNavigate('Schemes & Discounts')}
                className="p-3 border border-slate-100 hover:border-brand-orange/40 hover:bg-orange-50/20 rounded-xl transition-all flex flex-col items-center gap-2 bg-slate-50/50"
              >
                <Tag className="w-5 h-5 text-amber-500" />
                <span>View Schemes</span>
              </button>
              <button 
                onClick={() => onNavigate('Billing & Invoices')}
                className="p-3 border border-slate-100 hover:border-brand-orange/40 hover:bg-orange-50/20 rounded-xl transition-all flex flex-col items-center gap-2 bg-slate-50/50 col-span-2"
              >
                <Landmark className="w-5 h-5 text-emerald-500" />
                <span>Verify Invoices & Pay History</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Orders Listing */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4.5">
          <div>
            <h3 className="text-sm font-bold text-slate-800 font-display">Recent Order Activity</h3>
            <p className="text-[11px] text-slate-400 font-medium font-sans">Tracks status progression for your last 5 footwear orders.</p>
          </div>
          <button 
            onClick={() => onNavigate('My Orders')}
            className="text-xs font-bold text-brand-orange hover:text-brand-orange-hover hover:underline flex items-center gap-1"
          >
            <span>All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <th className="px-4 py-2.5">Order ID</th>
                <th className="px-4 py-2.5">Order Date</th>
                <th className="px-4 py-2.5">Items Purchased</th>
                <th className="px-4 py-2.5">Amount Total</th>
                <th className="px-4 py-2.5">Payment Verification</th>
                <th className="px-4 py-2.5">Tracking Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((order) => {
                const totalItemsQty = order.items.reduce((sum, it) => sum + it.quantity, 0);
                return (
                  <tr key={order.id} className="hover:bg-slate-50/40">
                    <td className="px-4 py-3 font-bold text-slate-900">{order.id}</td>
                    <td className="px-4 py-3 text-slate-400">{order.date}</td>
                    <td className="px-4 py-3">{totalItemsQty} pairs</td>
                    <td className="px-4 py-3 font-bold text-slate-850">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                        order.paymentStatus === 'Verified' ? 'bg-emerald-500' :
                        order.paymentStatus === 'Pending' ? 'bg-amber-400' : 'bg-rose-500'
                      }`}></span>
                      {order.paymentStatus}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={order.orderStatus} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
