// src/city-manager/components/Common.jsx
import { useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, Info, Loader2 } from 'lucide-react';

// 1. Skeleton Loader Component
export function SkeletonLoader({ type = 'cards' }) {
  if (type === 'dashboard') {
    return (
      <div className="space-y-6 animate-pulse">
        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 h-80 bg-slate-200 rounded-2xl"></div>
          <div className="lg:col-span-5 h-80 bg-slate-200 rounded-2xl"></div>
        </div>
        {/* Tables Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-200 rounded-2xl"></div>
          <div className="h-64 bg-slate-200 rounded-2xl"></div>
          <div className="h-64 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-1/4"></div>
        <div className="h-12 bg-slate-200 rounded-xl"></div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-slate-150 rounded-xl"></div>
        ))}
      </div>
    );
  }

  // Cards Skeleton (default)
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-48 bg-slate-200 rounded-2xl"></div>
      ))}
    </div>
  );
}

// 2. Modal Component
export function Modal({ isOpen, title, onClose, children }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col relative z-10 animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {children}
        </div>
      </div>
    </div>
  );
}

// 3. Toast Component (auto-dismisses in 3s)
export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      bg: 'bg-emerald-50 border-emerald-100 text-emerald-800',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />
    },
    error: {
      bg: 'bg-rose-50 border-rose-100 text-rose-800',
      icon: <AlertTriangle className="w-4 h-4 text-rose-600" />
    },
    info: {
      bg: 'bg-blue-50 border-blue-100 text-blue-800',
      icon: <Info className="w-4 h-4 text-blue-600" />
    },
    loading: {
      bg: 'bg-slate-50 border-slate-150 text-slate-800',
      icon: <Loader2 className="w-4 h-4 text-slate-600 animate-spin" />
    }
  };

  const current = config[type] || config.info;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg animate-slide-in-right max-w-sm w-full bg-white">
      <div className={`p-1.5 rounded-lg ${current.bg} border shrink-0`}>
        {current.icon}
      </div>
      <p className="text-xs font-bold text-slate-700 flex-1">{message}</p>
      <button 
        onClick={onClose} 
        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
