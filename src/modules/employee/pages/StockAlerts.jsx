import React, { useState } from 'react';
import { 
  AlertTriangle, RefreshCw, CheckCircle2, ShoppingCart, 
  HelpCircle, Sparkles, Inbox
} from 'lucide-react';
import { mockStock } from '../mockData/mockStock';
import StatusBadge from '../components/StatusBadge';

export default function StockAlerts({ showToast }) {
  // Populate alerts from items that are Low Stock or Out of Stock
  const [alerts, setAlerts] = useState(() => {
    return mockStock
      .filter(s => s.status === 'Low Stock' || s.status === 'Out of Stock')
      .map(s => ({
        ...s,
        severity: s.status === 'Out of Stock' ? 'Critical' : 'Low'
      }));
  });

  const handleAcknowledgeAlert = (alertId) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    showToast("Stock warning alert marked as acknowledged.", "success");
  };

  const handleReorderItem = (sku, productName) => {
    showToast(`Draft Purchase Order created for replenish quantity of ${productName} (SKU: ${sku}).`, "success");
  };

  return (
    <div className="space-y-6">
      
      {/* Top title header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-display">Inventory Alerts Console</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Audit critical low stock levels and manage reorder queues.</p>
      </div>

      {/* Roster of alerts */}
      {alerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alerts.map((a, i) => {
            const isCritical = a.severity === 'Critical';
            return (
              <div 
                key={i}
                className={`border rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[160px] ${
                  isCritical 
                    ? 'border-rose-300 bg-rose-50/10' 
                    : 'border-amber-300 bg-amber-50/10'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isCritical ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-extrabold text-slate-850 font-display">{a.productName}</h3>
                        <span className="text-[10px] text-slate-400 font-mono font-bold block mt-0.5">SKU: {a.sku}</span>
                      </div>
                    </div>
                    
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border uppercase ${
                      isCritical ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {a.severity} Severity
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white border border-slate-100 p-2 rounded-lg">
                      <span className={`text-lg font-bold block ${isCritical ? 'text-rose-600' : 'text-amber-605'}`}>{a.currentStock}</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Current Stock</span>
                    </div>
                    <div className="bg-white border border-slate-100 p-2 rounded-lg">
                      <span className="text-lg font-bold text-slate-700 block">{a.minLevel}</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Min Threshold</span>
                    </div>
                    <div className="bg-white border border-slate-100 p-2 rounded-lg flex flex-col justify-center">
                      <span className="font-semibold text-[9px] uppercase leading-none block">Status</span>
                      <div className="mt-1 block">
                        <StatusBadge status={a.status} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-3 border-t border-slate-100 pt-3.5">
                  <button 
                    onClick={() => handleReorderItem(a.sku, a.productName)}
                    className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Create Reorder PO</span>
                  </button>
                  <button 
                    onClick={() => handleAcknowledgeAlert(a.id)}
                    className="flex-1 py-1.5 border border-slate-205 hover:bg-slate-50 text-slate-600 rounded text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Acknowledge alert</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
          <div className="max-w-md">
            <h3 className="text-sm font-bold text-slate-800 font-display">Roster Cleared! No Stock Warnings</h3>
            <p className="text-[11px] text-slate-450 mt-1 font-semibold leading-relaxed">
              All regional SKU stock counts are strictly above defined minimum safety thresholds.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
