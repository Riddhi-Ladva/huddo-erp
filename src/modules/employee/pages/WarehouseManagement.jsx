import React, { useState } from 'react';
import { 
  Landmark, Package, MapPin, SlidersHorizontal, AlertCircle
} from 'lucide-react';
import { mockWarehouses, mockStock } from '../mockData/mockStock';
import StatusBadge from '../components/StatusBadge';
import CustomDataTable from '../components/CustomDataTable';

export default function WarehouseManagement() {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(mockWarehouses[0]?.id || null);

  // Filter stock for the selected warehouse
  const warehouseStock = React.useMemo(() => {
    if (!selectedWarehouseId) return [];
    return mockStock.filter(s => s.warehouseId === selectedWarehouseId);
  }, [selectedWarehouseId]);

  const selectedWarehouse = mockWarehouses.find(w => w.id === selectedWarehouseId);

  const columns = [
    { header: "SKU Code", accessor: "sku", render: (val) => <span className="font-mono font-bold text-slate-800">{val}</span> },
    { header: "Product Name", accessor: "productName", render: (val) => <span className="font-bold text-slate-800">{val}</span> },
    { header: "Category", accessor: "category" },
    { header: "Size", accessor: "size" },
    { header: "Color", accessor: "color" },
    { header: "Stock count", accessor: "currentStock", render: (val) => <span className="font-extrabold text-slate-700">{val} Units</span> },
    { header: "Status", accessor: "status", render: (val) => <StatusBadge status={val} /> }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top title header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-display">Warehouse Management</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Track location storage capacities, stock levels, and item distributions.</p>
      </div>

      {/* Warehouse cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockWarehouses.map((wh, i) => {
          const isSelected = selectedWarehouseId === wh.id;
          const usagePct = Math.round((wh.used / wh.capacity) * 100);
          return (
            <div 
              key={i}
              onClick={() => setSelectedWarehouseId(wh.id)}
              className={`border rounded-xl p-5 shadow-sm transition-all cursor-pointer flex flex-col justify-between min-h-[160px] ${
                isSelected 
                  ? 'border-brand-orange bg-orange-50/5 ring-1 ring-brand-orange shadow-md' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-slate-850 font-display">{wh.name}</h3>
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {wh.location}
                    </span>
                  </div>
                  <Landmark className={`w-5 h-5 ${isSelected ? 'text-brand-orange' : 'text-slate-400'}`} />
                </div>

                <div className="mt-4 flex justify-between text-[10px] font-bold text-slate-550">
                  <span>Capacity Allocated</span>
                  <span>{wh.used.toLocaleString()} / {wh.capacity.toLocaleString()} cft</span>
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${usagePct >= 85 ? 'bg-rose-500' : 'bg-brand-orange'}`} style={{ width: `${usagePct}%` }}></div>
                </div>
                <div className="flex justify-between text-[9px] font-bold text-slate-400">
                  <span>Usage Ratio: {usagePct}%</span>
                  <span>{wh.itemsCount.toLocaleString()} items registered</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Warehouse Stock breakdown table */}
      {selectedWarehouse ? (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">
                Stock Breakdown: {selectedWarehouse.name}
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                Roster of active product inventory levels physically stored at this location.
              </p>
            </div>
            
            <div className="text-[10px] text-slate-400 font-bold">
              Found {warehouseStock.length} items logged
            </div>
          </div>

          <CustomDataTable 
            columns={columns}
            data={warehouseStock}
            searchKeys={["sku", "productName", "category", "status"]}
            searchPlaceholder="Search warehouse inventory..."
          />
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400 text-xs font-semibold bg-white border border-slate-205 rounded-xl flex flex-col items-center justify-center gap-2 shadow-xs">
          <AlertCircle className="w-8 h-8 text-slate-350" />
          <span>Please select a warehouse above to audit its internal stocks.</span>
        </div>
      )}

    </div>
  );
}
