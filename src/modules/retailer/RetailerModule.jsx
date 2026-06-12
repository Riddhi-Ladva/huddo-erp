/**
 * HUDDO ERP - Retailer Panel Module
 * 
 * INTEGRATION INSTRUCTIONS:
 * To integrate this module into the main application, follow these steps:
 * 
 * 1. Open 'src/App.jsx'
 * 2. Import the RetailerModule at the top of the file:
 *    import RetailerModule from './modules/retailer/RetailerModule';
 * 3. Add the Retailer Panel entry under the BUSINESS section inside the NAV_MENU array (e.g., around line 68):
 *    { id: "RetailerPanel", label: "Retailer Panel (Mock)", icon: Store, component: RetailerModule }
 * 
 * No other code edits are required. The module is fully isolated and self-contained.
 */

import React, { useState, useEffect } from 'react';
import { 
  Home, ShoppingCart, FileText, CreditCard, Archive, 
  Tag, Award, User, Bell, ShieldAlert, Lock, RefreshCw, Menu, X,
  ChevronLeft, ChevronRight
} from 'lucide-react';

// Context & Mock Data
import { RetailerAuthProvider, useRetailerAuth } from './context/RetailerAuthContext';
import { mockNotifications as initialNotifications } from './mockData/mockNotifications';

// Subpages
import Dashboard from './pages/Dashboard';
import PlaceOrder from './pages/PlaceOrder';
import MyOrders from './pages/MyOrders';
import BillingPayments from './pages/BillingPayments';
import InventoryView from './pages/InventoryView';
import Schemes from './pages/Schemes';
import CommissionRewards from './pages/CommissionRewards';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

// Main Layout Component
function RetailerPanelLayout({ userRole, showToast, onSwitchRole }) {
  const { user } = useRetailerAuth();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Central Notification State to keep Bell and Page synchronized
  const [notifications, setNotifications] = useState(initialNotifications);

  // Header Dropdowns State
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns on click outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setIsNotifOpen(false);
      setIsProfileOpen(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  // Simulate async load when switching tabs
  const handleTabChange = (tabId) => {
    setLoading(true);
    setActiveTab(tabId);
    setMobileSidebarOpen(false);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // Notification management handlers
  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    showToast("Notification marked as read.", "success");
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast("Marked all notifications as read.", "success");
  };

  const handleDeleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast("Notification deleted.", "success");
  };

  // RBAC Role Security check
  if (user.role.toLowerCase() !== 'retailer') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-xs">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 animate-pulse">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 font-display">Access Denied (RBAC Protected)</h2>
        <p className="text-xs text-slate-550 font-medium max-w-sm mt-2">
          Your current session role is <span className="font-extrabold text-slate-850">"{user.role}"</span>. Only users with the <span className="font-bold text-brand-orange">"retailer"</span> role are authorized to access the Retailer Portal.
        </p>
        <div className="bg-slate-50 border border-slate-150 p-4.5 rounded-xl text-left mt-6 max-w-md text-xs font-semibold text-slate-605">
          <span className="font-extrabold text-slate-850 block mb-1">To access this panel:</span>
          Use the role dropdown in the Admin panel to switch your role to <span className="font-bold text-brand-orange">"Retailer"</span>. This will load the full Retailer Dashboard.
        </div>
      </div>
    );
  }

  // Sidebar navigation schema
  const SIDEBAR_ITEMS = [
    { id: 'Dashboard', label: 'Dashboard', icon: Home },
    { id: 'Place Order', label: 'Place Order', icon: ShoppingCart },
    { id: 'My Orders', label: 'My Orders', icon: FileText },
    { id: 'Billing & Invoices', label: 'Billing & Invoices', icon: CreditCard },
    { id: 'Inventory', label: 'Inventory', icon: Archive },
    { id: 'Schemes & Discounts', label: 'Schemes & Discounts', icon: Tag },
    { id: 'Commission & Rewards', label: 'Commission & Rewards', icon: Award },
    { id: 'Profile', label: 'Profile', icon: User },
    { id: 'Notifications', label: 'Notifications', icon: Bell, badge: unreadCount }
  ];

  // Helper to render active component
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard onNavigate={handleTabChange} />;
      case 'Place Order':
        return <PlaceOrder showToast={showToast} onNavigate={handleTabChange} />;
      case 'My Orders':
        return <MyOrders showToast={showToast} />;
      case 'Billing & Invoices':
        return <BillingPayments showToast={showToast} />;
      case 'Inventory':
        return <InventoryView />;
      case 'Schemes & Discounts':
        return <Schemes />;
      case 'Commission & Rewards':
        return <CommissionRewards />;
      case 'Profile':
        return <Profile showToast={showToast} />;
      case 'Notifications':
        return (
          <Notifications 
            notifications={notifications} 
            onMarkAsRead={handleMarkAsRead} 
            onMarkAllAsRead={handleMarkAllAsRead} 
            onDeleteNotification={handleDeleteNotification}
          />
        );
      default:
        return <Dashboard onNavigate={handleTabChange} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 relative font-sans antialiased text-slate-800 w-full">
      
      {/* 1. persistent Sidebar (matching Admin Panel exactly) */}
      <aside 
        onClick={stopPropagation}
        className={`bg-slate-900 text-slate-300 h-screen sticky top-0 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 ${
          sidebarCollapsed ? 'w-[64px]' : 'w-[256px]'
        } ${mobileSidebarOpen ? 'fixed inset-y-0 left-0 z-50 bg-slate-900 w-[256px] block' : 'hidden lg:flex'}`}
      >
        <div>
          {/* Logo Brand area (Matching Admin Sidebar top exactly) */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
            {(!sidebarCollapsed || mobileSidebarOpen) && (
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center font-bold text-white font-display text-base shadow-md">H</span>
                <span className="font-extrabold text-base tracking-wider text-white font-display">HUDDO ERP</span>
              </div>
            )}
            {sidebarCollapsed && !mobileSidebarOpen && (
              <span className="w-8 h-8 mx-auto rounded-lg bg-brand-orange flex items-center justify-center font-extrabold text-white font-display text-sm animate-fade-in">H</span>
            )}
            {mobileSidebarOpen && (
              <button className="lg:hidden p-1 text-slate-400 hover:text-white" onClick={() => setMobileSidebarOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Nav Items list */}
          <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]">
            <div className="space-y-1">
              {/* Section Header */}
              {(!sidebarCollapsed || mobileSidebarOpen) ? (
                <span className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 py-1.5">RETAILER PORTAL</span>
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
                    onClick={() => handleTabChange(item.id)}
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
        <div className="p-3 border-t border-slate-880 flex justify-center">
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-slate-850 rounded-lg text-slate-405 hover:text-white transition-colors cursor-pointer"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* 2. Topbar + Main Canvas Area (matching Admin layout exactly) */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar / Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs select-none">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-450">
            <span className="hover:text-slate-600 cursor-pointer">HUDDO ERP</span>
            <span>/</span>
            <span className="hover:text-slate-600 uppercase tracking-wider">RETAILER PORTAL</span>
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
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-brand-orange border-2 border-white rounded-full"></span>
                )}
              </button>

              {/* Notification dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                    <span className="text-xs font-bold text-slate-805 font-display">Notifications</span>
                    <button 
                      onClick={() => { setIsNotifOpen(false); handleMarkAllAsRead(); }}
                      className="text-[10px] text-brand-orange font-bold hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {notifications.slice(0, 4).map(n => (
                      <div key={n.id} className="text-[11px] font-semibold text-slate-600 border-b border-slate-50 pb-2 last:border-b-0">
                        <div className="flex justify-between items-center">
                          <span className={`font-bold block ${n.read ? 'text-slate-500' : 'text-slate-800'}`}>{n.title}</span>
                          {!n.read && <span className="w-1.5 h-1.5 bg-brand-orange rounded-full shrink-0"></span>}
                        </div>
                        <p className="text-slate-455 mt-0.5 font-normal leading-relaxed">{n.message}</p>
                        <span className="text-[9px] text-slate-400 font-bold block mt-1">{n.timestamp}</span>
                      </div>
                    ))}
                    <button
                      onClick={() => { setIsNotifOpen(false); handleTabChange('Notifications'); }}
                      className="w-full text-center text-[10px] text-slate-500 font-bold hover:text-brand-orange pt-1 block hover:underline"
                    >
                      View All Notifications
                    </button>
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
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="Retailer profile photo" className="w-full h-full object-cover" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2">
                  <div className="px-4 py-2 border-b border-slate-100 mb-1.5 bg-slate-50/50 rounded-t-xl">
                    <span className="font-bold text-slate-800 block text-xs font-display">{user.name}</span>
                    <span className="text-[10px] text-brand-orange font-bold block">Gold Tier Retailer</span>
                  </div>
                  
                  {onSwitchRole && (
                    <div className="px-4 py-2 border-b border-slate-100 mb-1.5">
                      <label className="block text-[8px] uppercase font-bold text-slate-400 mb-1">Switch Session Role</label>
                      <select
                        value="Retailer"
                        onChange={(e) => { onSwitchRole(e.target.value); setIsProfileOpen(false); }}
                        className="w-full text-[10px] border border-slate-200 rounded p-1 bg-white font-bold text-slate-700 focus:outline-none cursor-pointer"
                      >
                        <option value="Retailer">Retailer</option>
                        <option value="Founder">Founder (Admin)</option>
                        <option value="CEO">CEO (Admin)</option>
                        <option value="Admin">Admin (Admin)</option>
                      </select>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => { setIsProfileOpen(false); handleTabChange('Profile'); }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Shop Profile</span>
                  </button>
                  
                  <div className="border-t border-slate-100 my-1"></div>
                  
                  <button 
                    onClick={() => { setIsProfileOpen(false); if (onSwitchRole) onSwitchRole('Founder'); }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Log Out to Admin</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* 3. Main Dashboard canvas */}
        <main className="p-6 overflow-y-auto flex-1 max-w-[1600px] w-full mx-auto">
          {loading ? (
            /* Premium simulated skeleton loader */
            <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-xs animate-pulse space-y-4 min-h-[400px] flex flex-col justify-center">
              <div className="flex items-center justify-center gap-2.5 text-slate-400 text-xs font-bold font-display">
                <RefreshCw className="w-5 h-5 text-brand-orange animate-spin" />
                <span>Fetching retailer secure node statistics...</span>
              </div>
              <div className="space-y-3 max-w-md mx-auto w-full mt-4">
                <div className="h-4.5 bg-slate-100 rounded-md w-full"></div>
                <div className="h-4.5 bg-slate-100 rounded-md w-5/6"></div>
                <div className="h-4.5 bg-slate-100 rounded-md w-4/5"></div>
              </div>
            </div>
          ) : (
            renderActiveScreen()
          )}
        </main>
      </div>

    </div>
  );
}

// Wrapper to export RetailerModule with context
export default function RetailerModule({ userRole = "retailer", showToast, onSwitchRole }) {
  // Safe wrapper fallback if parent doesn't supply showToast hook
  const safeShowToast = showToast || ((msg, type) => {
    console.log(`[Toast Fallback] type: ${type}, msg: ${msg}`);
  });

  return (
    <RetailerAuthProvider currentRole={userRole}>
      <RetailerPanelLayout userRole={userRole} showToast={safeShowToast} onSwitchRole={onSwitchRole} />
    </RetailerAuthProvider>
  );
}
