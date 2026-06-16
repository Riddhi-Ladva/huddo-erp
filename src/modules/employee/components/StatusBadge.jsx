import React from 'react';

export default function StatusBadge({ status }) {
  const getStyles = () => {
    switch (status) {
      // Order & general statuses
      case 'Delivered':
      case 'Active':
      case 'Met':
      case 'Settled':
      case 'Passed':
      case 'Processed':
      case 'Approved':
      case 'Checked In':
      case 'Present':
      case 'Completed':
      case 'Filed':
      case 'Passed QC':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';

      case 'Shipped':
      case 'In Transit':
      case 'Active Only':
      case 'In Progress':
        return 'bg-sky-50 text-sky-700 border-sky-200';

      case 'Packed':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';

      case 'Processing':
      case 'Low Stock':
      case 'Partially Met':
      case 'Pending':
      case 'Submitted':
      case 'Requested':
      case 'Half Day':
        return 'bg-amber-50 text-amber-700 border-amber-200';

      case 'Draft':
      case 'Unread':
      case 'Not Checked In':
      case 'Not Started':
        return 'bg-slate-100 text-slate-600 border-slate-200';

      case 'Cancelled':
      case 'Rejected':
      case 'Out of Stock':
      case 'Critical':
      case 'Missed':
      case 'Absent':
      case 'Inactive':
      case 'Failed':
      case 'Failed QC':
        return 'bg-rose-50 text-rose-700 border-rose-200';

      case 'Returned':
      case 'Leave':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      
      case 'Holiday':
      case 'Weekend':
        return 'bg-slate-50 text-slate-500 border-slate-200';

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
