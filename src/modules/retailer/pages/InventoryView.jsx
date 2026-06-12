import React, { useState } from 'react';
import { Search, Archive, AlertCircle, HelpCircle } from 'lucide-react';

import { mockInventory } from '../mockData/mockInventory';
import StatusBadge from '../components/StatusBadge';

export default function InventoryView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');

  // Extracts lists for filter dropdowns
  const categories = ['All', ...new Set(mockInventory.map(item => item.category))];
  const sizes = ['All', ...new Set(mockInventory.map(item => item.size))].sort((a,b) => a - b);
  const colors = ['All', ...new Set(mockInventory.map(item => item.color))];

  // Filtering stock ledger
  const filteredStock = mockInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSize = selectedSize === 'All' || item.size === selectedSize;
    const matchesColor = selectedColor === 'All' || item.color === selectedColor;

    return matchesSearch && matchesCat && matchesSize && matchesColor;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-display">Inventory Stock Availability</h1>
        <p className="text-xs text-slate-500 font-medium font-sans">View-only real-time SKU stock levels, size allocations, and warehouse status codes.</p>
      </div>

      {/* Filter panel */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
        
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search SKU code or product model name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange bg-white font-medium text-slate-705"
          />
        </div>

        {/* Dropdown controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold text-slate-500">
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Filter by Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-700 focus:outline-none"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Filter by Size</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-700 focus:outline-none"
            >
              {sizes.map(size => <option key={size} value={size}>{size === 'All' ? 'All Sizes' : `Size ${size}`}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Filter by Color</label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-700 focus:outline-none"
            >
              {colors.map(col => <option key={col} value={col}>{col === 'All' ? 'All Colors' : col}</option>)}
            </select>
          </div>
        </div>

      </div>

      {/* Info Notice card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 text-xs text-slate-650">
        <HelpCircle className="w-5 h-5 text-slate-450 shrink-0" />
        <p className="font-semibold text-slate-600">
          <span className="font-bold text-slate-800">Notice:</span> Stock levels are synchronized in real-time with our distribution centers. Invoices will deduct stock counts instantly. As a dealer/retailer, this dashboard is <span className="font-bold text-brand-orange">Read-Only</span>.
        </p>
      </div>

      {/* Stock Table Grid */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-semibold text-slate-750">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="px-5 py-3">SKU Identifier</th>
                <th className="px-5 py-3">Product Model Name</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3 text-center">Shoe Size</th>
                <th className="px-5 py-3">Color Variant</th>
                <th className="px-5 py-3 text-center">Stock Quantity</th>
                <th className="px-5 py-3 text-right font-bold">Status Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStock.length > 0 ? (
                filteredStock.map((item) => (
                  <tr key={item.sku} className="hover:bg-slate-50/40">
                    <td className="px-5 py-3.5 font-mono font-bold tracking-wide text-slate-800">{item.sku}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">{item.name}</td>
                    <td className="px-5 py-3.5 text-slate-450 uppercase">{item.category}</td>
                    <td className="px-5 py-3.5 text-center font-bold">S-{item.size}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-605">{item.color}</td>
                    <td className="px-5 py-3.5 text-center font-extrabold text-slate-850">{item.stock} pairs</td>
                    <td className="px-5 py-3.5 text-right"><StatusBadge status={item.status} /></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Archive className="w-9 h-9 text-slate-300" />
                      <p className="text-slate-500 text-xs font-semibold">No stock records found matching filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
