import React, { useState, useEffect } from 'react';
import { LogOut, Home, Store, DollarSign, Percent, Bell, Shield, ArrowRight, User, AlertCircle, Check } from 'lucide-react';
import PromoterDetail from './PromoterDetail';
import { DashboardLayout } from '../../../components/DesignSystem';
import MyProfile from '../../MyProfile';

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

  const SIDEBAR_ITEMS = [
    { id: 'Overview', label: 'My Dashboard', icon: Home },
    { id: 'Retailers', label: 'My Retailers', icon: Store },
    { id: 'Revenue', label: 'My Revenue Chain', icon: DollarSign },
    { id: 'Royalty', label: 'Royalty & Config', icon: Percent },
    { id: 'Notifications', label: 'Alerts Hub', icon: Bell, badge: unreadCount }
  ];

  return (
    <DashboardLayout
      userRole="Promoter"
      activeTab={activeScreen}
      setActiveTab={setActiveScreen}
      sidebarItems={SIDEBAR_ITEMS}
      onSwitchRole={onSwitchRole}
      notifications={[]}
      profile={{
        name: profile?.name || 'Suresh Raina',
        subtitle: `Code: ${profile?.promoter_code || 'PRO-2026-001'}`,
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
      }}
    >
      {/* Alert Banner / Payout Status Notification */}
      {profile && (
        <div className="mb-6">
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
      {activeScreen === 'Profile' ? (
        <MyProfile showToast={showToast} userRole={userRole} onSwitchRole={onSwitchRole} />
      ) : (
        <PromoterDetail 
          promoterId={promoterId} 
          userRole={userRole} 
          showToast={showToast} 
          onNavigate={() => {}} 
          initialTab={activeScreen}
        />
      )}
    </DashboardLayout>
  );
}
