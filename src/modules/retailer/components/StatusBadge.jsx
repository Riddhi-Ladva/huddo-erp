import React from 'react';

export default function StatusBadge({ status }) {
  // Return color styling based on the status text
  const getStyles = () => {
    switch (status) {
      // Order statuses
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Shipped':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Packed':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Approved':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Draft':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Returned':
        return 'bg-purple-50 text-purple-700 border-purple-200';

      // Payment & Verification statuses
      case 'Verified':
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Rejected':
      case 'Overdue':
        return 'bg-rose-50 text-rose-700 border-rose-200';

      // Inventory Stock statuses
      case 'In Stock':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Low Stock':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Out of Stock':
        return 'bg-rose-50 text-rose-700 border-rose-200';

      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStyles()}`}>
      {status}
    </span>
  );
}
