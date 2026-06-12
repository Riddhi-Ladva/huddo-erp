import React, { useState } from 'react';
import { 
  Bell, Check, CheckSquare, Trash2, ShoppingBag, 
  CreditCard, Tag, Landmark, AlertCircle, Inbox
} from 'lucide-react';

export default function Notifications({ notifications, onMarkAsRead, onMarkAllAsRead, onDeleteNotification }) {
  const [filterType, setFilterType] = useState('All');

  const filteredNotifs = filterType === 'All'
    ? notifications
    : notifications.filter(n => n.type === filterType);

  const getNotifIcon = (type) => {
    switch (type) {
      case 'order':
        return (
          <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 border border-blue-100 shadow-xs">
            <ShoppingBag className="w-4 h-4" />
          </div>
        );
      case 'payment':
        return (
          <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100 shadow-xs">
            <CreditCard className="w-4 h-4" />
          </div>
        );
      case 'scheme':
        return (
          <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0 border border-amber-100 shadow-xs">
            <Tag className="w-4 h-4" />
          </div>
        );
      case 'commission':
        return (
          <div className="w-9 h-9 bg-purple-50 text-purple-650 rounded-xl flex items-center justify-center shrink-0 border border-purple-200 shadow-xs">
            <Landmark className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 shadow-xs">
            <Bell className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">System Notifications Inbox</h1>
          <p className="text-xs text-slate-500 font-medium font-sans">Manage your real-time transaction updates, scheme alerts, and commission logs.</p>
        </div>

        {notifications.some(n => !n.read) && (
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start cursor-pointer"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {/* Filter panel */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {['All', 'order', 'payment', 'scheme', 'commission'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-colors shrink-0 capitalize ${
                filterType === type
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'border border-slate-205 text-slate-500 bg-white hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              {type === 'all' ? 'All Alerts' : type}
            </button>
          ))}
        </div>

        <span className="text-[11px] font-bold text-slate-400 uppercase">
          Total: {filteredNotifs.length} Alerts
        </span>
      </div>

      {/* Notifications grid list */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-4.5 flex gap-4 items-start justify-between transition-colors ${
                notif.read ? 'bg-white hover:bg-slate-50/20' : 'bg-orange-50/10 hover:bg-orange-50/20'
              }`}
            >
              <div className="flex gap-3 items-start flex-1 min-w-0">
                {/* Status indicator */}
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-brand-orange mt-3.5 shrink-0 animate-ping"></span>
                )}
                
                {/* Type Icon */}
                {getNotifIcon(notif.type)}

                <div className="text-xs min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-extrabold font-display truncate ${notif.read ? 'text-slate-800' : 'text-slate-900'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-[9px] text-slate-400 font-bold font-mono">{notif.timestamp}</span>
                  </div>
                  <p className="text-slate-550 font-medium mt-1 leading-relaxed">{notif.message}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0 ml-4">
                {!notif.read && (
                  <button
                    onClick={() => onMarkAsRead(notif.id)}
                    className="p-1.5 hover:bg-slate-100 text-emerald-600 hover:text-emerald-700 rounded-lg transition-all"
                    title="Mark as Read"
                  >
                    <Check className="w-4 h-4 font-bold" />
                  </button>
                )}
                <button
                  onClick={() => onDeleteNotification(notif.id)}
                  className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-rose-600 rounded-lg transition-all"
                  title="Delete Notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-450 font-medium">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-xs font-semibold">Your notification inbox is clean!</p>
          </div>
        )}
      </div>

    </div>
  );
}
