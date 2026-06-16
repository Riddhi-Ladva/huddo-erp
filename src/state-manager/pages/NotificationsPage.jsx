// src/state-manager/pages/NotificationsPage.jsx
import { useState } from 'react';
import { 
  Bell, CheckSquare, Target, ShoppingCart, CheckCircle2, ShieldCheck
} from 'lucide-react';

export default function NotificationsPage({ 
  notifications, 
  onMarkRead, 
  onMarkAllRead, 
  showToast 
}) {
  const [activeTab, setActiveTab] = useState('All'); // All | Unread | Approvals | Targets | Orders | System

  const unreadCount = notifications.filter(n => !n.read).length;

  const getFilteredNotifications = () => {
    return notifications.filter(n => {
      if (activeTab === 'All') return true;
      if (activeTab === 'Unread') return !n.read;
      if (activeTab === 'Approvals') return n.type === 'approval';
      if (activeTab === 'Targets') return n.type === 'target';
      if (activeTab === 'Orders') return n.type === 'order';
      return n.type === 'system' || n.type === 'alert';
    });
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'approval':
        return { icon: CheckSquare, color: 'text-amber-500 bg-amber-50 border-amber-100' };
      case 'target':
        return { icon: Target, color: 'text-emerald-500 bg-emerald-50 border-emerald-100' };
      case 'order':
        return { icon: ShoppingCart, color: 'text-blue-500 bg-blue-50 border-blue-100' };
      default:
        return { icon: Bell, color: 'text-slate-500 bg-slate-50 border-slate-100' };
    }
  };

  const handleMarkAll = () => {
    if (unreadCount === 0) {
      showToast("All notifications are already read.", "info");
      return;
    }
    onMarkAllRead();
    showToast("All notifications marked as read.", "success");
  };

  const filtered = getFilteredNotifications();

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">State Notifications Hub</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Review operational updates, state alerts, target progress triggers, and approval queues</p>
        </div>
        <button 
          onClick={handleMarkAll}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md self-start sm:self-center"
        >
          <ShieldCheck className="w-4 h-4 text-orange-500" /> Mark All as Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="overflow-x-auto select-none">
        <div className="flex border-b border-slate-200 min-w-max">
          {['All', 'Unread', 'Approvals', 'Targets', 'Orders', 'System'].map((tab) => {
            const count = tab === 'All' ? notifications.length
              : tab === 'Unread' ? unreadCount
              : tab === 'Approvals' ? notifications.filter(n => n.type === 'approval').length
              : tab === 'Targets' ? notifications.filter(n => n.type === 'target').length
              : tab === 'Orders' ? notifications.filter(n => n.type === 'order').length
              : notifications.filter(n => n.type === 'system' || n.type === 'alert').length;

            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-4 text-xs font-bold transition-all relative flex items-center gap-1.5 border-b-2 ${
                  isActive 
                    ? 'border-orange-500 text-orange-600 font-black' 
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <span>{tab}</span>
                <span className={`px-1.5 py-0.5 text-[9px] rounded-full font-bold ${
                  isActive 
                    ? 'bg-orange-100 text-orange-700' 
                    : (tab === 'Unread' && count > 0)
                    ? 'bg-orange-500 text-white animate-pulse font-black'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications list */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100">
        
        {filtered.length > 0 ? (
          filtered.map((n) => {
            const { icon: Icon, color: iconStyle } = getNotifIcon(n.type);
            return (
              <div 
                key={n.id} 
                className={`p-4 flex items-center justify-between gap-4 text-xs font-medium transition-all hover:bg-slate-50/50 ${
                  !n.read ? 'bg-orange-50/10' : ''
                }`}
              >
                
                {/* Left Icon + Middle message */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`p-2 rounded-xl border shrink-0 ${iconStyle}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-slate-800 text-[11px] leading-relaxed ${!n.read ? 'font-bold' : 'font-semibold'}`}>
                      {n.message}
                    </p>
                    <span className="text-[9px] text-slate-400 font-bold block mt-1">{n.time}</span>
                  </div>
                </div>

                {/* Right: Mark Read link */}
                {!n.read ? (
                  <button 
                    onClick={() => {
                      onMarkRead(n.id);
                      showToast("Notification marked as read.", "success");
                    }}
                    className="text-[10px] text-orange-600 hover:text-orange-700 font-bold hover:underline shrink-0"
                  >
                    Mark as Read
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-300 font-bold shrink-0">Read</span>
                )}

              </div>
            );
          })
        ) : (
          <div className="p-16 text-center text-slate-400 font-semibold flex flex-col items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-slate-200 stroke-1 mb-2" />
            <span>No notifications in this category!</span>
            <span className="text-[10px] text-slate-400 font-medium mt-1">You are completely up-to-date.</span>
          </div>
        )}

      </div>

    </div>
  );
}
