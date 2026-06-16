// CM-MODULE: Frontend entry point and router for the Country Manager Module
import React, { useState, useEffect } from 'react';
import { 
  Home, Layers, CheckSquare, Target, Percent, Users, BarChart3, Bell, 
  TrendingUp, Shield, LogOut, Settings, Menu, X, ChevronLeft, ChevronRight, RefreshCw, Lock
} from 'lucide-react';

import CountryManagerList from './pages/CountryManagerList';
import CountryManagerForm from './pages/CountryManagerForm';
import CountryManagerDetail from './pages/CountryManagerDetail';
import CountryManagerDashboard from './pages/CountryManagerDashboard';
import AnalyticsDeepDive from './pages/AnalyticsDeepDive';

export default function CountryManagerModule({ userRole = 'Founder', showToast, onSwitchRole }) {
  const safeShowToast = showToast || ((msg, type) => console.log(`[Toast] type: ${type}, msg: ${msg}`));

  // Admin routing state
  const [adminScreen, setAdminScreen] = useState('list'); // list | add | edit | detail
  const [selectedCmId, setSelectedCmId] = useState(null);

  // Own Workspace state (for Country Manager role)
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Stats / Badges for Own Workspace
  const [stats, setStats] = useState({ pendingApprovals: 0, unreadNotifications: 0 });
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (userRole.toLowerCase() === 'country manager') {
      const fetchOwnStats = async () => {
        try {
          const res = await fetch('/api/country-managers/1/profile'); // hardcoded CM ID 1 for Rajesh Sharma
          if (res.ok) {
            const data = await res.json();
            setProfile(data);
            setStats({
              pendingApprovals: data.pending_approval_count || 0,
              unreadNotifications: data.unread_notification_count || 0
            });
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchOwnStats();
    }
  }, [userRole, activeTab]);

  const handleAdminNavigate = (target) => {
    if (target === 'list') {
      setAdminScreen('list');
      setSelectedCmId(null);
    } else if (target === 'add') {
      setAdminScreen('add');
      setSelectedCmId(null);
    } else if (target.startsWith('edit-')) {
      setSelectedCmId(Number(target.split('edit-')[1]));
      setAdminScreen('edit');
    } else if (target.startsWith('detail-')) {
      setSelectedCmId(Number(target.split('detail-')[1]));
      setAdminScreen('detail');
    }
  };

  const stopPropagation = (e) => e.stopPropagation();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = () => {
      setIsNotifOpen(false);
      setIsProfileOpen(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // ────────────────────────────────────────────────────────────────────────
  // A. RETAILER/FOUNDER/CEO/ADMIN WORKSPACE VIEW
  // ────────────────────────────────────────────────────────────────────────
  if (userRole.toLowerCase() !== 'country manager') {
    switch (adminScreen) {
      case 'list':
        return <CountryManagerList onNavigate={handleAdminNavigate} showToast={safeShowToast} />;
      case 'add':
        return <CountryManagerForm onNavigate={handleAdminNavigate} showToast={safeShowToast} />;
      case 'edit':
        return <CountryManagerForm cmId={selectedCmId} onNavigate={handleAdminNavigate} showToast={safeShowToast} />;
      case 'detail':
        return <CountryManagerDetail cmId={selectedCmId} onNavigate={handleAdminNavigate} showToast={safeShowToast} userRole={userRole} />;
      default:
        return <CountryManagerList onNavigate={handleAdminNavigate} showToast={safeShowToast} />;
    }
  }

  // ────────────────────────────────────────────────────────────────────────
  // B. DEDICATED WORKSPACE FOR COUNTRY MANAGER ROLE (PAGE 4)
  // ────────────────────────────────────────────────────────────────────────
  
  const SIDEBAR_ITEMS = [
    { id: 'Dashboard', label: 'My Dashboard', icon: Home },
    { id: 'Territory', label: 'Territory & States', icon: Layers },
    { id: 'Approvals', label: 'Approvals Queue', icon: CheckSquare, badge: stats.pendingApprovals },
    { id: 'Targets', label: 'My Targets', icon: Target },
    { id: 'Commissions', label: 'Commission Ledger', icon: Percent },
    { id: 'State Managers', label: 'State Managers', icon: Users },
    { id: 'Analytics', label: 'Analytics Deep-Dive', icon: TrendingUp },
    { id: 'Reports', label: 'Reports Scoping', icon: BarChart3 },
    { id: 'Notifications', label: 'Notifications Hub', icon: Bell, badge: stats.unreadNotifications }
  ];

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <CountryManagerDashboard cmId={1} isTab={true} onNavigate={setActiveTab} showToast={safeShowToast} />;
      case 'Territory':
        return <CountryManagerDetail cmId={1} onNavigate={() => {}} showToast={safeShowToast} userRole={userRole} initialTab="Territory" />;
      case 'Approvals':
        return <CountryManagerDetail cmId={1} onNavigate={() => {}} showToast={safeShowToast} userRole={userRole} initialTab="Approvals" />;
      case 'Targets':
        return <CountryManagerDetail cmId={1} onNavigate={() => {}} showToast={safeShowToast} userRole={userRole} initialTab="Targets" />;
      case 'Commissions':
        return <CountryManagerDetail cmId={1} onNavigate={() => {}} showToast={safeShowToast} userRole={userRole} initialTab="Commissions" />;
      case 'State Managers':
        return <CountryManagerDetail cmId={1} onNavigate={() => {}} showToast={safeShowToast} userRole={userRole} initialTab="State Managers" />;
      case 'Analytics':
        return <AnalyticsDeepDive cmId={1} showToast={safeShowToast} />;
      case 'Reports':
        return <CountryManagerDetail cmId={1} onNavigate={() => {}} showToast={safeShowToast} userRole={userRole} initialTab="Reports" />;
      case 'Notifications':
        return <CountryManagerDetail cmId={1} onNavigate={() => {}} showToast={safeShowToast} userRole={userRole} initialTab="Notifications" />;
      default:
        return <CountryManagerDashboard cmId={1} isTab={true} onNavigate={setActiveTab} showToast={safeShowToast} />;
    }
  };

  // Override tabs for detail views inside the full-screen layout
  // When tabs are selected, we can reuse the CountryManagerDetail workspace but force its internal tab
  // To do this, we monkeypatch the default detail workspace or render it with preselected Tab properties.
  // In our code above, renderActiveScreen maps to CountryManagerDetail.
  // Wait, inside CountryManagerDetail, we pass the activeTab to it? No, CountryManagerDetail handles its own activeTab state.
  // To synchronize, let's create a custom rendering where we render CountryManagerDetail, but set its activeTab property or render specific views!
  // Oh! We can update CountryManagerDetail's activeTab dynamically if we pass it as a prop, or we can just render the individual tabs here!
  // In `CountryManagerDetail.jsx`, the default activeTab state is 'Overview', but since we also mapped them, we can modify CountryManagerDetail to sync with the activeTab prop or let the user click tabs inside the detail page!
  // Better yet: in `CountryManagerDetail.jsx`, let's check:
  // We can pass `activeTab` as a prop, and if `activeTab` changes, sync the state!
  // Let's modify `CountryManagerDetail.jsx`? Wait, we already created it, but wait: does CountryManagerDetail support setting activeTab from props?
  // Let's see: `export default function CountryManagerDetail({ cmId, onNavigate, showToast, userRole = 'Founder' })`.
  // Yes! If we pass `activeTab` as a prop or synchronize it, that would be ideal.
  // Wait! Let's check: inside `CountryManagerModule.jsx`, instead of mounting `CountryManagerDetail` for each tab, we can simply mount a SINGLE `<CountryManagerDetail cmId={1} onNavigate={() => {}} showToast={safeShowToast} userRole={userRole} />` and let the manager use the internal detail page tabs!
  // Yes! When they click "Territory & States", we just open `CountryManagerDetail` on the Overview tab, and they can click whatever tab they want!
  // Wait! Even better: we can render `CountryManagerDetail` directly as the workspace for ALL tabs except 'Dashboard' and 'Analytics', and when they click a sidebar tab, we can dynamically override the active tab state of the detail page if we pass it down!
  // Let's check how we can do this.
  // In `CountryManagerDetail.jsx`, we had:
  // `const [activeTab, setActiveTab] = useState('Overview');`
  // Let's change `CountryManagerDetail.jsx` slightly to synchronize `activeTab` if a prop is passed, or we can just pass down `initialTab` or similar!
  // Let's look at `CountryManagerDetail.jsx`'s definition. We can use a prop `initialTab` and set:
  // `const [activeTab, setActiveTab] = useState(initialTab || 'Overview');`
  // and in a `useEffect`:
  // `useEffect(() => { if (initialTab) setActiveTab(initialTab); }, [initialTab]);`
  // That is extremely robust and lets us control the active tab from the sidebar!
  // Let's modify `CountryManagerDetail.jsx` to support this `initialTab` prop. We'll do it using `replace_file_content` since it is a single contiguous change in `CountryManagerDetail.jsx`.

  return (
    <div className="min-h-screen flex bg-slate-50 relative font-sans antialiased text-slate-800 w-full cm-workspace">
      {/* 1. Sidebar */}
      <aside 
        onClick={stopPropagation}
        className={`bg-slate-900 text-slate-300 h-screen sticky top-0 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 ${
          sidebarCollapsed ? 'w-[64px]' : 'w-[256px]'
        } ${mobileSidebarOpen ? 'fixed inset-y-0 left-0 z-50 bg-slate-900 w-[256px] block' : 'hidden lg:flex'}`}
      >
        <div>
          {/* Logo Brand area */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
            {(!sidebarCollapsed || mobileSidebarOpen) && (
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center font-bold text-white font-display text-base shadow-md">H</span>
                <span className="font-extrabold text-base tracking-wider text-white font-display">HUDDO ERP</span>
              </div>
            )}
            {sidebarCollapsed && !mobileSidebarOpen && (
              <span className="w-8 h-8 mx-auto rounded-lg bg-brand-orange flex items-center justify-center font-extrabold text-white font-display text-sm">H</span>
            )}
            {mobileSidebarOpen && (
              <button className="lg:hidden p-1 text-slate-400 hover:text-white cursor-pointer" onClick={() => setMobileSidebarOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Nav Items list */}
          <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]">
            <div className="space-y-1">
              {(!sidebarCollapsed || mobileSidebarOpen) ? (
                <span className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 py-1.5">MANAGER WORKSPACE</span>
              ) : (
                <div className="border-t border-slate-800/80 my-2"></div>
              )}

              {/* Navigation Items */}
              {SIDEBAR_ITEMS.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                      isActive 
                        ? 'bg-brand-orange text-white shadow-md' 
                        : 'hover:bg-slate-800 hover:text-white text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      {(!sidebarCollapsed || mobileSidebarOpen) && <span>{item.label}</span>}
                    </div>
                    {(!sidebarCollapsed || mobileSidebarOpen) && item.badge > 0 && (
                      <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full ${
                        isActive ? 'bg-white text-brand-orange' : 'bg-brand-orange text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && (!sidebarCollapsed || mobileSidebarOpen) && (
                      <span className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Collapse bottom toggle switch */}
        <div className="p-3 border-t border-slate-800 flex justify-center">
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* 2. Topbar + Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar / Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs select-none">
          {/* Welcome Text */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="hover:text-slate-650">HUDDO ERP</span>
            <span>/</span>
            <span className="hover:text-slate-650 uppercase tracking-wider">COUNTRY MANAGER</span>
            <span>/</span>
            <span className="text-slate-700 font-extrabold uppercase tracking-wider">{activeTab}</span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            
            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={(e) => { e.stopPropagation(); setMobileSidebarOpen(true); }}
              className="lg:hidden p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-500 cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Notification Bell Badge */}
            <div className="relative" onClick={stopPropagation}>
              <button 
                onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
                className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-800 transition-all cursor-pointer relative"
              >
                <Bell className="w-4 h-4" />
                {stats.unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-brand-orange border-2 border-white rounded-full"></span>
                )}
              </button>

              {/* Notification dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                    <span className="text-xs font-bold text-slate-800 font-display">Notifications</span>
                    <button 
                      onClick={() => { setIsNotifOpen(false); handleMarkAllNotificationsRead(); }}
                      className="text-[10px] text-brand-orange font-bold hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs">
                    <div className="border-b border-slate-50 pb-2">
                      <span className="font-bold text-slate-800">Pending Shop Onboarding</span>
                      <p className="text-slate-400 mt-0.5 font-medium leading-relaxed">Apex Sole Distributors (Pune) registration request needs your Level 3 approval.</p>
                      <span className="text-[9px] text-slate-400 font-bold block mt-1">10 mins ago</span>
                    </div>
                    <div className="border-b border-slate-50 pb-2">
                      <span className="font-bold text-slate-800">Large Order Approval Alert</span>
                      <p className="text-slate-400 mt-0.5 font-medium leading-relaxed">Order ORD-5509 exceeds normal credit limits and needs approval.</p>
                      <span className="text-[9px] text-slate-400 font-bold block mt-1">2 hours ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar drop */}
            <div className="relative" onClick={stopPropagation}>
              <button 
                onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
                className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden shadow-xs cursor-pointer focus:outline-none"
              >
                <img src={profile?.profile_photo_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"} alt="Manager profile" className="w-full h-full object-cover" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2">
                  <div className="px-4 py-2 border-b border-slate-100 mb-1.5 bg-slate-50/50 rounded-t-xl">
                    <span className="font-bold text-slate-800 block text-xs font-display">{profile?.full_name}</span>
                    <span className="text-[10px] text-brand-orange font-bold block">Country Manager</span>
                  </div>
                  
                  {onSwitchRole && (
                    <div className="px-4 py-2 border-b border-slate-100 mb-1.5">
                      <label className="block text-[8px] uppercase font-bold text-slate-400 mb-1">Switch Session Role</label>
                      <select
                        value="Country Manager"
                        onChange={(e) => { onSwitchRole(e.target.value); setIsProfileOpen(false); }}
                        className="w-full text-[10px] border border-slate-200 rounded p-1 bg-white font-bold text-slate-700 focus:outline-none cursor-pointer"
                      >
                        <option value="Country Manager">Country Manager</option>
                        <option value="Founder">Founder (Admin)</option>
                        <option value="CEO">CEO (Admin)</option>
                        <option value="Admin">Admin (Admin)</option>
                      </select>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => { setIsProfileOpen(false); setActiveTab('Notifications'); }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>My Profile</span>
                  </button>
                  
                  <div className="border-t border-slate-100 my-1"></div>
                  
                  <button 
                    onClick={() => { setIsProfileOpen(false); if (onSwitchRole) onSwitchRole('Founder'); }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out to Admin</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* 3. Main Dashboard canvas */}
        <main className="p-6 overflow-y-auto flex-1 max-w-[1600px] w-full mx-auto">
          {renderActiveScreen()}
        </main>
      </div>

    </div>
  );
}
