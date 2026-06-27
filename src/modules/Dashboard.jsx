import React, { useState } from 'react';
import { TrendingUp, ShoppingCart, Store, Award, AlertCircle, Users, ArrowUpRight } from 'lucide-react';
import { 
  StatWidget, 
  DashboardCard, 
  DashboardTable, 
  DashboardLineChart, 
  DashboardBarChart, 
  DashboardPieChart 
} from '../components/DesignSystem';
import { monthlyRevenueTrends, statePerformanceData, orderStatusDistribution, initialRetailers, initialOrders } from '../mockData';

export default function Dashboard({ onNavigate, userRole = 'Founder' }) {
  const [stats, setStats] = useState([
    { title: "Total Revenue", value: "₹0", icon: TrendingUp, delta: "+0% MoM", colorClass: "text-emerald-600 bg-emerald-50" },
    { title: "Total Orders", value: "0", icon: ShoppingCart, delta: "+0% this week", colorClass: "text-brand-orange bg-orange-50" },
    { title: "Total Retailers", value: "0", icon: Store, delta: "0 Pending", colorClass: "text-blue-600 bg-blue-50" },
    { title: "Total Promoters", value: "0", icon: Award, delta: "0 Active now", colorClass: "text-purple-600 bg-purple-50" },
    { title: "Total Payment", value: "₹0", icon: AlertCircle, delta: "0 Overdue", colorClass: "text-rose-600 bg-rose-50" },
    { title: "Active Employees", value: "0", icon: Users, delta: "Across Departments", colorClass: "text-slate-600 bg-slate-100" }
  ]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [statePerformance, setStatePerformance] = useState([]);
  const [topRetailers, setTopRetailers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [totalOrderCount, setTotalOrderCount] = useState(0);

  React.useEffect(() => {
    fetch('/api/dashboard/founder')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && resData.data) {
          const d = resData.data;
          
          let revText = `₹${(d.overall.totalRevenue || 0).toLocaleString('en-IN')}`;
          if (d.overall.totalRevenue >= 10000000) {
            revText = `₹${(d.overall.totalRevenue / 10000000).toFixed(2)} Cr`;
          } else if (d.overall.totalRevenue >= 100000) {
            revText = `₹${(d.overall.totalRevenue / 100000).toFixed(2)} L`;
          }

          let outText = `₹${(d.overall.totalOutstanding || 0).toLocaleString('en-IN')}`;
          if (d.overall.totalOutstanding >= 10000000) {
            outText = `₹${(d.overall.totalOutstanding / 10000000).toFixed(2)} Cr`;
          } else if (d.overall.totalOutstanding >= 100000) {
            outText = `₹${(d.overall.totalOutstanding / 100000).toFixed(2)} L`;
          }

          setStats([
            { title: "Total Revenue", value: revText, icon: TrendingUp, delta: "+14.2% MoM", colorClass: "text-emerald-600 bg-emerald-50" },
            { title: "Total Orders", value: String(d.overall.totalOrders || 0), icon: ShoppingCart, delta: "+8% this week", colorClass: "text-brand-orange bg-orange-50" },
            { title: "Total Retailers", value: String(d.overall.totalRetailers || 0), icon: Store, delta: "1 Pending Verification", colorClass: "text-blue-600 bg-blue-50" },
            { title: "Total Promoters", value: String(d.overall.totalPromoters || 0), icon: Award, delta: "Active", colorClass: "text-purple-600 bg-purple-50" },
            { title: "Total Payment", value: outText, icon: AlertCircle, delta: "Overdue reminders sent", colorClass: "text-rose-600 bg-rose-50" },
            { title: "Active Employees", value: String(d.overall.totalEmployees || 0), icon: Users, delta: "Across 4 Departments", colorClass: "text-slate-600 bg-slate-100" }
          ]);

          setMonthlyTrends(d.monthlyRevenueTrends || []);
          setStatusDistribution(d.statusBreakdown || []);
          setStatePerformance(d.statePerformanceData || []);
          setTopRetailers(d.topRetailers || []);
          setRecentOrders(d.recentOrders || []);
          setTotalOrderCount(d.overall.totalOrders || 0);
        }
      })
      .catch(err => {
        console.error("Error loading dashboard data:", err);
        setMonthlyTrends(monthlyRevenueTrends);
        setStatusDistribution(orderStatusDistribution);
        setStatePerformance(statePerformanceData);
        setTopRetailers(initialRetailers.slice(0, 4));
        setRecentOrders(initialOrders.slice(0, 4));
      });
  }, []);

  const retailerColumns = [
    { header: "Name", accessor: "shopName", render: (val) => <span className="font-semibold text-slate-800">{val}</span> },
    { header: "City", accessor: "city", render: (val) => <span className="text-slate-500">{val}</span> },
    { header: "Revenue", accessor: "revenue", cellClassName: "text-right font-bold text-slate-900", render: (val) => <span>₹{val.toLocaleString('en-IN')}</span> }
  ];

  const orderColumns = [
    { header: "Order ID", accessor: "id", render: (val) => <span className="font-semibold text-slate-800">{val}</span> },
    ...(userRole === 'CEO' ? [] : [{ header: "Amount", accessor: "amount", render: (val) => <span className="font-bold text-slate-900">₹{val.toLocaleString('en-IN')}</span> }]),
    { header: "Status", accessor: "status", cellClassName: "text-right", render: (val) => {
      const color = val === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    val === 'Shipped' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    val === 'Approved' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                    'bg-amber-50 text-amber-700 border border-amber-200';
      return <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${color}`}>{val}</span>;
    }}
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">{userRole} Dashboard</h1>
        <p className="text-sm text-slate-500">Welcome back. Here is the operational distribution overview for Huddo Shoes today.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${userRole === 'CEO' ? 'lg:grid-cols-4 xl:grid-cols-4' : 'lg:grid-cols-3 xl:grid-cols-6'} gap-4`}>
        {stats.filter(stat => userRole !== 'CEO' || (stat.title !== "Total Revenue" && stat.title !== "Total Payment")).map((stat, i) => {
          let target = null;
          if (stat.title === "Total Revenue") target = "Sales";
          else if (stat.title === "Total Orders") target = "Orders";
          else if (stat.title === "Total Retailers") target = "Retailers";
          else if (stat.title === "Total Promoters") target = "Promoters";
          else if (stat.title === "Total Payment") target = "Billing";
          else if (stat.title === "Active Employees") target = "Employees";

          return (
            <StatWidget
              key={i}
              title={stat.title}
              value={stat.value}
              delta={stat.delta}
              icon={stat.icon}
              colorClass={stat.colorClass}
              onClick={target ? () => onNavigate(target) : undefined}
            />
          );
        })}
      </div>

      {/* Analytics Charts */}
      <div className={userRole === 'CEO' ? "grid grid-cols-1 gap-6" : "grid grid-cols-1 lg:grid-cols-3 gap-6"}>
        {/* Monthly Revenue Trend Line Chart */}
        {userRole !== 'CEO' && (
          <DashboardCard 
            title="Monthly Revenue Trend" 
            subtitle="Revenue trend plots total monthly billing collections."
            className="lg:col-span-2"
          >
            <DashboardLineChart
              data={monthlyTrends}
              xKey="month"
              lineKey="revenue"
              tickFormatter={(val) => `₹${val / 100000}L`}
              formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
            />
          </DashboardCard>
        )}

        {/* Order Status Donut Chart */}
        <DashboardCard 
          title="Order Status Distribution"
          subtitle="Status split of all pending and cleared orders."
          className={userRole === 'CEO' ? "lg:col-span-1 max-w-xl mx-auto w-full" : ""}
        >
          <DashboardPieChart
            data={statusDistribution}
            nameKey="name"
            valueKey="value"
            centerTextValue={String(totalOrderCount)}
            centerTextLabel="Total Orders"
          />
          <div className="grid grid-cols-5 gap-1 mt-4 text-center">
            {statusDistribution.map((entry, index) => {
              const colors = ['#f97316', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
              return (
                <div key={index} className="flex flex-col items-center">
                  <span className="w-2 h-2 rounded-full mb-1" style={{ backgroundColor: colors[index % colors.length] }}></span>
                  <span className="text-[9px] text-slate-550 font-bold tracking-tight block truncate w-full">{entry.name}</span>
                  <span className="text-xs font-bold text-slate-700">{entry.value}</span>
                </div>
              );
            })}
          </div>
        </DashboardCard>
      </div>

      <div className={userRole === 'CEO' ? "grid grid-cols-1 gap-6" : "grid grid-cols-1 lg:grid-cols-3 gap-6"}>
        {/* Top 5 Country/State Performance Bar Chart */}
        {userRole !== 'CEO' && (
          <DashboardCard
            title="State Revenue Ranking"
            subtitle="Top performing state boundaries based on billing."
          >
            <DashboardBarChart
              data={statePerformance}
              layout="vertical"
              yKey="state"
              barKey="revenue"
              tickFormatter={(val) => `₹${val / 100000}L`}
              formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
            />
          </DashboardCard>
        )}

        {/* Top Performing Retailers Table */}
        {userRole !== 'CEO' && (
          <DashboardCard
            title="Top Retailers"
            subtitle="Highest billing shopfronts in recent quarters."
            headerActions={
              <button 
                onClick={() => onNavigate("Retailers")} 
                className="text-xs font-bold text-brand-orange hover:text-brand-orange-hover flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            <DashboardTable
              columns={retailerColumns}
              data={topRetailers}
            />
          </DashboardCard>
        )}

        {/* Recent Orders Preview Table */}
        <DashboardCard
          title="Recent Orders"
          subtitle="Verification and logistics log tracking latest orders."
          className={userRole === 'CEO' ? "lg:col-span-1 max-w-3xl mx-auto w-full" : ""}
          headerActions={
            <button 
              onClick={() => onNavigate("Orders")} 
              className="text-xs font-bold text-brand-orange hover:text-brand-orange-hover flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          }
        >
          <DashboardTable
            columns={orderColumns}
            data={recentOrders}
          />
        </DashboardCard>
      </div>
    </div>
  );
}
