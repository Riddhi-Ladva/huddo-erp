// PROMO-MODULE: Promoter own full-screen workspace dashboard.
// Embedded with welcome message, notifications bell, quick navigation buttons, and payment banners.

import React, { useState, useEffect } from 'react';
import { LogOut, Home, Store, DollarSign, Percent, Bell, Shield, ArrowRight, User, AlertCircle, Check } from 'lucide-react';
import PromoterDetail from './PromoterDetail';

export default function PromoterDashboard({ userRole = 'Promoter', showToast, onSwitchRole }) {
  const [activeScreen, setActiveScreen] = useState('Overview'); // Overview | Retailers | Revenue | Royalty | Notifications

  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [profile, setProfile] = useState(null);

  const promoterId = 1; // Suresh Raina

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch(`/api/promoters/${promoterId}/dashboard`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile_snapshot);
        setPendingAmount(data.summary_cards.pending_royalty || 0);
      }

      const notifRes = await fetch(`/api/promoters/${promoterId}/notifications`);
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setUnreadCount(notifData.unread_count || 0);
      }
    } catch (err) {
      console.error("Failed to load own dashboard stats", err);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [activeScreen]);

  return (
    <div className="min-h-screen flex bg-slate-50 relative font-sans antialiased text-slate-800">
      {/* Sidebar */}
      <aside className="bg-slate-900 text-slate-300 w-[240px] h-screen sticky top-0 flex flex-col justify-between shrink-0 z-30">
        <div>
          {/* Brand header */}
          <div className="h-16 flex items-center gap-2 px-4 border-b border-slate-800">
            <span className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center font-bold text-white text-base">H</span>
            <span className="font-extrabold text-base tracking-wider text-white">HUDDO ERP</span>
          </div>

          <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-800/20">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Workspace Role</span>
            <span className="font-bold text-slate-200 text-xs mt-0.5 block">Independent Promoter</span>
          </div>

          <nav className="p-3 space-y-1 mt-2">
            {[
              { id: 'Overview', label: 'My Dashboard', icon: Home },
              { id: 'Retailers', label: 'My Retailers', icon: Store },
              { id: 'Revenue', label: 'My Revenue Chain', icon: DollarSign },
              { id: 'Royalty', label: 'Royalty & Config', icon: Percent },
              { id: 'Notifications', label: 'Alerts Hub', icon: Bell, badge: unreadCount }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveScreen(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all relative ${
                    isActive 
                      ? 'bg-brand-orange text-white shadow-md' 
                      : 'hover:bg-slate-800 hover:text-white text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="bg-rose-500 text-white rounded-full px-1.5 py-0.5 text-[9px] font-extrabold leading-none">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile dropdown and switch role */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          {/* Quick RBAC Swapper */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-lg p-2 text-xs font-semibold">
            <label className="text-[9px] uppercase font-bold text-slate-500 block mb-1">Exit Promoter Role</label>
            <select
              value="Promoter"
              onChange={(e) => onSwitchRole(e.target.value)}
              className="w-full text-[10px] border border-slate-700 bg-slate-900 rounded p-1 font-bold text-slate-300 focus:outline-none"
            >
              <option value="Promoter">Promoter Session</option>
              <option value="Founder">Founder</option>
              <option value="CEO">CEO</option>
              <option value="Admin">Admin</option>
              <option value="Country Manager">Country Manager</option>
              <option value="State Manager">State Manager</option>
              <option value="City Manager">City Manager</option>
              <option value="Finance Manager">Finance Manager</option>
              <option value="Retailer">Retailer</option>
            </select>
          </div>

          <button
            onClick={() => onSwitchRole('Founder')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 hover:text-white text-xs font-bold rounded-lg text-slate-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch to Admin Panel</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <span>PROMOTER WORKSPACE</span>
            <span>/</span>
            <span className="text-slate-400 uppercase tracking-wider">{activeScreen}</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveScreen('Notifications')}
              className="relative p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-800 transition-all"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
              )}
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" alt="Promoter avatar" className="w-8 h-8 rounded-full border object-cover" />
              <div>
                <span className="font-bold text-slate-800 block">{profile?.name || 'Suresh Raina'}</span>
                <span className="text-[10px] text-slate-400 block font-bold">Code: {profile?.promoter_code || 'PRO-2026-001'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Alert Banner / Payout Status Notification */}
        {profile && (
          <div className="px-6 pt-4">
            {profile.payment_status === 'Paid' ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center gap-2 text-xs font-semibold">
                <Check className="w-4 h-4 text-emerald-600 font-extrabold" />
                <span>All settlements are fully settled. Thank you for your partnership!</span>
              </div>
            ) : profile.payment_status === 'Partial' ? (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>You have a pending payout of ₹{pendingAmount.toLocaleString('en-IN')}. Settlement batch is partially paid.</span>
                </div>
                <button onClick={() => setActiveScreen('Royalty')} className="text-amber-800 font-bold hover:underline flex items-center gap-0.5">
                  <span>View Statements</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-lg flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span>Payout Pending: Outstanding balance is ₹{pendingAmount.toLocaleString('en-IN')}. Finance manager clearance pending.</span>
                </div>
                <button onClick={() => setActiveScreen('Royalty')} className="text-rose-800 font-bold hover:underline flex items-center gap-0.5">
                  <span>View Statements</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Dashboard Main Screen */}
        <main className="p-6 overflow-y-auto flex-1 w-full max-w-[1600px] mx-auto">
          <PromoterDetail 
            promoterId={promoterId} 
            userRole={userRole} 
            showToast={showToast} 
            onNavigate={() => {}} 
            initialTab={activeScreen}
          />
        </main>
      </div>
    </div>
  );
}
