import React, { useState } from 'react';
import { 
  Percent, Award, CheckCircle2, SlidersHorizontal, 
  HelpCircle, Sparkles, UserCheck
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import CustomDataTable from '../components/CustomDataTable';

export default function CommissionCalc({ showToast }) {
  const [activeSubTab, setActiveSubTab] = useState("commissions"); // commissions | promoter_royalty
  const [filterRole, setFilterRole] = useState("All");

  // Mock commission calculations data
  const [commissions, setCommissions] = useState([
    { id: "CALC-001", name: "Arjun Mehta", role: "Sales Executive", orders: 6, sales: 138000, percentage: 5.0, amount: 6900, status: "Pending" },
    { id: "CALC-002", name: "Suresh Rao", role: "Sales Executive", orders: 4, sales: 150000, percentage: 5.0, amount: 7500, status: "Pending" },
    { id: "CALC-003", name: "Vikram Shah", role: "Sales Manager", orders: 12, sales: 345000, percentage: 2.0, amount: 6900, status: "Processed" },
    { id: "CALC-004", name: "Ketan Mehta", role: "Sales Executive", orders: 0, sales: 0, percentage: 5.0, amount: 0, status: "Processed" }
  ]);

  // Mock promoter royalties data
  const [royalties, setRoyalties] = useState([
    { id: "ROY-001", name: "Pooja Hegde", retailers: 4, revenue: 120000, percentage: 3.0, amount: 3600, status: "Pending" },
    { id: "ROY-002", name: "Ranveer Singh", retailers: 2, revenue: 85000, percentage: 3.0, amount: 2550, status: "Pending" },
    { id: "ROY-003", name: "Deepika Padukone", retailers: 6, revenue: 250000, percentage: 4.0, amount: 10000, status: "Processed" }
  ]);

  const handleSettleCommission = (calcId) => {
    setCommissions(prev => prev.map(c => 
      c.id === calcId ? { ...c, status: "Processed" } : c
    ));
    const target = commissions.find(c => c.id === calcId);
    showToast(`Successfully settled commission ledger of ₹${target?.amount.toLocaleString()} for ${target?.name}.`, "success");
  };

  const handleSettleRoyalty = (royId) => {
    setRoyalties(prev => prev.map(r => 
      r.id === royId ? { ...r, status: "Processed" } : r
    ));
    const target = royalties.find(r => r.id === royId);
    showToast(`Successfully settled royalty fee of ₹${target?.amount.toLocaleString()} for promoter ${target?.name}.`, "success");
  };

  const handleBulkSettleCommissions = () => {
    setCommissions(prev => prev.map(c => ({ ...c, status: "Processed" })));
    showToast("Successfully settled all pending commission ledger lines.", "success");
  };

  const handleBulkSettleRoyalties = () => {
    setRoyalties(prev => prev.map(r => ({ ...r, status: "Processed" })));
    showToast("Successfully settled all pending promoter royalty fee lines.", "success");
  };

  const filteredCommissions = React.useMemo(() => {
    if (filterRole === "All") return commissions;
    return commissions.filter(c => c.role === filterRole);
  }, [commissions, filterRole]);

  const commColumns = [
    { header: "ID", accessor: "id" },
    { header: "Employee Name", accessor: "name", render: (val) => <span className="font-bold text-slate-850">{val}</span> },
    { header: "Active Role", accessor: "role" },
    { header: "Orders Count", accessor: "orders" },
    { header: "Sales Outlay", accessor: "sales", render: (val) => `₹${val.toLocaleString()}` },
    { header: "Commission %", accessor: "percentage", render: (val) => `${val}%` },
    { header: "Calculated Share", accessor: "amount", render: (val) => <span className="font-extrabold text-brand-orange">₹{val.toLocaleString()}</span> },
    { header: "Status", accessor: "status", render: (val) => <StatusBadge status={val === 'Processed' ? 'Settled' : 'Pending'} /> },
    { 
      header: "Action", 
      accessor: "id", 
      sortable: false, 
      render: (val, row) => (
        row.status === 'Pending' ? (
          <button 
            onClick={() => handleSettleCommission(val)}
            className="flex items-center gap-0.5 px-2.5 py-1 text-[10px] font-bold rounded-lg border border-brand-orange bg-brand-orange text-white hover:bg-brand-orange-hover transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Settle Ledger</span>
          </button>
        ) : null
      )
    }
  ];

  const royColumns = [
    { header: "ID", accessor: "id" },
    { header: "Promoter Name", accessor: "name", render: (val) => <span className="font-bold text-slate-850">{val}</span> },
    { header: "Retailers Added", accessor: "retailers" },
    { header: "Revenue Outlay", accessor: "revenue", render: (val) => `₹${val.toLocaleString()}` },
    { header: "Royalty %", accessor: "percentage", render: (val) => `${val}%` },
    { header: "Royalty Amount", accessor: "amount", render: (val) => <span className="font-extrabold text-indigo-600">₹{val.toLocaleString()}</span> },
    { header: "Status", accessor: "status", render: (val) => <StatusBadge status={val === 'Processed' ? 'Settled' : 'Pending'} /> },
    { 
      header: "Action", 
      accessor: "id", 
      sortable: false, 
      render: (val, row) => (
        row.status === 'Pending' ? (
          <button 
            onClick={() => handleSettleRoyalty(val)}
            className="flex items-center gap-0.5 px-2.5 py-1 text-[10px] font-bold rounded-lg border border-indigo-650 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Settle Fee</span>
          </button>
        ) : null
      )
    }
  ];

  const pendingCommCount = commissions.filter(c => c.status === 'Pending').length;
  const pendingRoyCount = royalties.filter(r => r.status === 'Pending').length;

  return (
    <div className="space-y-6">
      
      {/* Top dashboard control headers */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Settlement calculations</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Disburse pending sales commissions and promoter royalties fee ledger lines.</p>
        </div>

        {activeSubTab === 'commissions' ? (
          pendingCommCount > 0 && (
            <button 
              onClick={handleBulkSettleCommissions}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Bulk Settle Commissions ({pendingCommCount})</span>
            </button>
          )
        ) : (
          pendingRoyCount > 0 && (
            <button 
              onClick={handleBulkSettleRoyalties}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Bulk Settle Royalties ({pendingRoyCount})</span>
            </button>
          )
        )}
      </div>

      {/* Sub tabs selector */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab("commissions")}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'commissions' ? 'border-brand-orange text-brand-orange bg-orange-50/10' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>Sales Team Commissions</span>
        </button>

        <button
          onClick={() => setActiveSubTab("promoter_royalty")}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'promoter_royalty' ? 'border-indigo-600 text-indigo-650 bg-indigo-50/10' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Promoters Royalties</span>
        </button>
      </div>

      {/* Roster list table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        
        {activeSubTab === 'commissions' ? (
          <>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Commissions Calculations ledger</span>
              
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="text-[10px] border border-slate-200 rounded p-1 bg-white font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Roles</option>
                  <option value="Sales Executive">Sales Executive</option>
                  <option value="Sales Manager">Sales Manager</option>
                </select>
              </div>
            </div>

            <CustomDataTable 
              columns={commColumns}
              data={filteredCommissions}
              searchKeys={["name", "role", "status"]}
              searchPlaceholder="Search commissions calculations..."
            />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-855 uppercase tracking-wider font-display">Promoter Royalty Share Ledger</span>
            </div>

            <CustomDataTable 
              columns={royColumns}
              data={royalties}
              searchKeys={["name", "status"]}
              searchPlaceholder="Search promoter royalties..."
            />
          </>
        )}

      </div>

    </div>
  );
}
