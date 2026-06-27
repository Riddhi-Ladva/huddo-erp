// src/state-manager/components/Common.jsx
import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

// Toast Component
export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgClass = type === 'success' 
    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
    : type === 'error'
    ? 'bg-rose-50 border-rose-200 text-rose-800'
    : 'bg-amber-50 border-amber-200 text-amber-800';

  const Icon = type === 'success' 
    ? CheckCircle 
    : type === 'error' 
    ? AlertCircle 
    : Info;

  const iconColor = type === 'success' 
    ? 'text-emerald-500' 
    : type === 'error' 
    ? 'text-rose-500' 
    : 'text-amber-500';

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm animate-slide-in font-sans font-semibold text-xs ${bgClass}`}>
      <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
      <div className="flex-1">{message}</div>
      <button onClick={onClose} className="p-0.5 hover:bg-slate-200/50 rounded text-slate-400 hover:text-slate-600 transition-colors">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// Modal Component
export function Modal({ isOpen, onClose, title, children, confirmText, onConfirm, confirmVariant = 'orange', cancelText = 'Cancel' }) {
  if (!isOpen) return null;

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const confirmBtnClass = confirmVariant === 'orange'
    ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-100'
    : confirmVariant === 'rose'
    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-100'
    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100';

  return (
    <div 
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-zoom-in">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 text-xs text-slate-600 font-medium leading-relaxed overflow-y-auto max-h-[70vh]">
          {children}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-slate-800 text-xs font-bold transition-all"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button 
              onClick={onConfirm}
              className={`px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all ${confirmBtnClass}`}
            >
              {confirmText || 'Confirm'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Skeleton Loader Component
export function SkeletonLoader({ type = 'dashboard' }) {
  if (type === 'table') {
    return (
      <div className="w-full space-y-4 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-12 bg-slate-100 rounded-xl w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-28 bg-slate-100 rounded-2xl p-5 border border-slate-200/50 flex flex-col justify-between">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-8 bg-slate-200 rounded w-1/2"></div>
            <div className="h-3 bg-slate-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  // Default Dashboard skeleton
  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="h-24 bg-slate-100 rounded-2xl border border-slate-200/50 p-4 flex flex-col justify-between">
            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            <div className="h-6 bg-slate-200 rounded w-2/3"></div>
            <div className="h-2.5 bg-slate-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 h-80 bg-slate-100 rounded-2xl border border-slate-200/50 p-4">
          <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="h-56 bg-slate-200/50 rounded-xl w-full"></div>
        </div>
        <div className="lg:col-span-4 h-80 bg-slate-100 rounded-2xl border border-slate-200/50 p-4">
          <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-56 bg-slate-200/50 rounded-xl w-full"></div>
        </div>
      </div>

      {/* Table block */}
      <div className="h-64 bg-slate-100 rounded-2xl border border-slate-200/50 p-4">
        <div className="h-4 bg-slate-200 rounded w-1/6 mb-4"></div>
        <div className="space-y-3">
          <div className="h-10 bg-slate-200 rounded-lg w-full"></div>
          <div className="h-10 bg-slate-200 rounded-lg w-full"></div>
          <div className="h-10 bg-slate-200 rounded-lg w-full"></div>
        </div>
      </div>
    </div>
  );
}
