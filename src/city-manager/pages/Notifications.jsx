// src/city-manager/pages/Notifications.jsx
import { 
  CheckSquare, Target, Store, Bell, CheckCircle2
} from 'lucide-react';

export default function Notifications({ 
  notifications, 
  onMarkRead, 
  onMarkAllRead, 
  showToast 
}) {
  
  const handleMarkOne = (id) => {
    onMarkRead(id);
    showToast('Notification marked as read.', 'success');
  };

  const handleMarkAll = () => {
    onMarkAllRead();
    showToast('All notifications marked as read.', 'success');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'approval':
        return (
          <div className="p-2 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl shrink-0">
            <CheckSquare className="w-4 h-4" />
          </div>
        );
      case 'target':
        return (
          <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl shrink-0">
            <Target className="w-4 h-4" />
          </div>
        );
      case 'retailer':
        return (
          <div className="p-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl shrink-0">
            <Store className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="p-2 bg-slate-50 text-slate-500 border border-slate-200 rounded-xl shrink-0">
            <Bell className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">Notifications</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Inbox warnings, target milestones, and compliance updates</p>
        </div>
        
        {notifications.some(n => !n.read) && (
          <button 
            onClick={handleMarkAll}
            className="flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-55 rounded-xl text-xs font-bold text-slate-705 transition-all self-start sm:self-center cursor-pointer shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Mark All Read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm p-4 space-y-3">
        {notifications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4 transition-all ${
                  !notif.read ? 'bg-orange-500/[0.01]' : ''
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  {getIcon(notif.type)}
                  <div className="space-y-1 text-xs font-semibold text-slate-700">
                    <p className={`${!notif.read ? 'font-bold text-slate-850' : 'text-slate-500'}`}>
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 font-bold block">{notif.time}</span>
                  </div>
                </div>

                {!notif.read && (
                  <button 
                    onClick={() => handleMarkOne(notif.id)}
                    className="text-[10px] text-orange-605 font-bold hover:underline shrink-0 self-center"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-450 italic text-xs font-semibold flex flex-col items-center justify-center space-y-2">
            <Bell className="w-10 h-10 stroke-1 text-slate-300 animate-pulse" />
            <span>Your inbox is empty. No notifications at this time.</span>
          </div>
        )}
      </div>

    </div>
  );
}
