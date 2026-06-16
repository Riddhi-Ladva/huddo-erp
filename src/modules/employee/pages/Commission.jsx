import React, { useState } from 'react';
import { 
  Percent, DollarSign, Wallet, CheckSquare, 
  Gift, SlidersHorizontal, ArrowDownToLine
} from 'lucide-react';
import { mockCommissions } from '../mockData/mockCommissions';
import StatusBadge from '../components/StatusBadge';
import CustomDataTable from '../components/CustomDataTable';

export default function Commission({ showToast }) {
  const [filterMonth, setFilterMonth] = useState("All");

  const filteredRecords = React.useMemo(() => {
    if (filterMonth === "All") return mockCommissions.records;
    return mockCommissions.records.filter(r => r.date.startsWith(`2026-0${filterMonth}`) || r.date.startsWith(`2026-${filterMonth}`));
  }, [filterMonth]);

  const handleExportLedger = () => {
    console.log("Exporting Commission Ledger:", filteredRecords);
    showToast("Commission ledger report downloaded successfully (Logged in console).", "success");
  };

  const columns = [
    { header: "Record ID", accessor: "id" },
    { header: "Order ID", accessor: "orderId", render: (val) => <span className="font-bold text-slate-800">{val}</span> },
    { header: "Sale Amount", accessor: "saleAmount", render: (val) => `₹${val.toLocaleString()}` },
    { header: "Commission %", accessor: "percentage", render: (val) => `${val}%` },
    { header: "Commission Earned", accessor: "amount", render: (val) => <span className="font-extrabold text-brand-orange">₹{val.toLocaleString()}</span> },
    { header: "Commission Status", accessor: "status", render: (val) => <StatusBadge status={val} /> },
    { header: "Date logged", accessor: "date" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Commission summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lifetime Commissions</span>
            <span className="text-xl font-bold text-slate-800 mt-1 block">₹{mockCommissions.summary.lifetimeEarned.toLocaleString()}</span>
            <span className="text-xs text-slate-500 font-medium">Accumulated rewards ledger</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-650">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Commissions This Month</span>
            <span className="text-xl font-bold text-slate-800 mt-1 block">₹{mockCommissions.summary.thisMonthEarned.toLocaleString()}</span>
            <span className="text-xs text-emerald-605 font-medium">+15.2% vs previous month</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-brand-orange">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Settlement</span>
            <span className="text-xl font-bold text-rose-600 mt-1 block">₹{mockCommissions.summary.pendingSettlement.toLocaleString()}</span>
            <span className="text-xs text-slate-500 font-medium">Under clearance verification</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Commission Table list */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display flex items-center gap-2">
                <Percent className="w-4 h-4 text-slate-400" />
                Commissions Log Ledger
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Track your percentage share margins per retailer orders collected.</p>
            </div>

            <div className="flex items-center gap-2">
              <select 
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="text-[10px] border border-slate-200 rounded p-1 bg-white font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All Months</option>
                <option value="06">June 2026</option>
                <option value="05">May 2026</option>
                <option value="04">April 2026</option>
              </select>

              <button 
                onClick={handleExportLedger}
                className="p-1.5 border border-slate-200 hover:border-slate-305 rounded-lg text-slate-500 hover:text-slate-850 bg-white transition-colors cursor-pointer"
                title="Export Commissions"
              >
                <ArrowDownToLine className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <CustomDataTable 
            columns={columns}
            data={filteredRecords}
            searchKeys={["id", "orderId", "status"]}
            searchPlaceholder="Search commissions records..."
          />
        </div>

        {/* Incentive / Bonus list */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 font-display flex items-center gap-2">
              <Gift className="w-4 h-4 text-slate-400" />
              Incentives & Bonuses
            </h3>

            <div className="space-y-3">
              {mockCommissions.bonuses.map((b, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800 text-xs block">{b.description}</span>
                    <span className="text-[9px] text-slate-400 font-bold block">{b.date}</span>
                    <StatusBadge status={b.status} />
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600">₹{b.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-medium mt-4 italic text-center border-t border-slate-100 pt-3">
            Incentives calculated during final audit settlements.
          </div>
        </div>

      </div>

    </div>
  );
}
