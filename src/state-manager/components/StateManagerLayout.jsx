// src/state-manager/components/StateManagerLayout.jsx
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Store, Map, ShoppingCart, CheckSquare, 
  TrendingUp, Target, MapPin, BadgePercent, BarChart2, Bell, 
  ChevronLeft, ChevronRight, Search, LogOut
} from 'lucide-react';
import { currentStateManager } from '../mockData';

export default function StateManagerLayout({ 
  children, 
  activeTab, 
  setActiveTab, 
  pendingApprovalsCount, 
  unreadNotificationsCount, 
  onSwitchRole,
  searchQuery,
  setSearchQuery
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = () => {
      setIsNotifOpen(false);
      setIsProfileOpen(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const stopPropagation = (e) => e.stopPropagation();

  const NAV_MENU = [
    {
      section: "OVERVIEW",
      items: [
        { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard }
      ]
    },
    {
      section: "MY TERRITORY",
      items: [
        { id: "City Managers", label: "City Managers", icon: Users },
        { id: "Retailers", label: "Retailers", icon: Store },
        { id: "Territory Map", label: "Territory Map", icon: Map }
      ]
    },
    {
      section: "OPERATIONS",
      items: [
        { id: "Orders", label: "Orders", icon: ShoppingCart },
        { id: "Approvals", label: "Approvals", icon: CheckSquare, badge: pendingApprovalsCount }
      ]
    },
    {
      section: "PERFORMANCE",
      items: [
        { id: "Sales Monitoring", label: "Sales Monitoring", icon: TrendingUp },
        { id: "Targets", label: "Targets", icon: Target },
        { id: "Field Force", label: "Field Force", icon: MapPin }
      ]
    },
    {
      section: "FINANCIALS",
      items: [
        { id: "My Incentive", label: "My Incentive", icon: BadgePercent }
      ]
    },
    {
      section: "ADMIN",
      items: [
        { id: "Reports", label: "Reports", icon: BarChart2 },
        { id: "Notifications", label: "Notifications", icon: Bell, badge: unreadNotificationsCount }
      ]
    }
  ];

  // Breadcrumbs generator
  const getBreadcrumbs = () => {
    return ["HUDDO ERP", "STATE MANAGER", activeTab.toUpperCase()];
  };

  return (
    <div className="min-h-screen flex bg-slate-50 relative font-sans antialiased text-slate-800">
      
      {/* Sidebar */}
      <aside 
        className={`bg-slate-900 text-slate-300 h-screen sticky top-0 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 ${
          sidebarCollapsed ? 'w-[64px]' : 'w-[240px]'
        }`}
      >
        <div>
          {/* Logo Brand area */}
          <div className="h-16 flex flex-col justify-center px-4 border-b border-slate-800">
            {!sidebarCollapsed ? (
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-orange-600 flex items-center justify-center font-black text-white text-xs shadow-md">H</span>
                  <span className="font-extrabold text-sm tracking-wider text-white">HUDDO ERP</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold ml-8">State Manager Panel</span>
              </div>
            ) : (
              <span className="w-7 h-7 mx-auto rounded bg-orange-600 flex items-center justify-center font-extrabold text-white text-sm">H</span>
            )}
          </div>

          {/* User Profile Info Card */}
          {!sidebarCollapsed ? (
            <div className="mx-3 my-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-600 text-white font-extrabold flex items-center justify-center text-sm shadow-inner shrink-0">
                RM
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{currentStateManager.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  <span className="text-[10px] text-slate-400 font-semibold truncate">{currentStateManager.state} (GJ)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="my-4 flex justify-center">
              <div className="w-9 h-9 rounded-full bg-orange-600 text-white font-extrabold flex items-center justify-center text-xs shadow-inner cursor-pointer" title={currentStateManager.name}>
                RM
              </div>
            </div>
          )}

          {/* Nav Items */}
          <nav className="px-2 pb-4 space-y-4 overflow-y-auto max-h-[calc(100vh-210px)] select-none">
            {NAV_MENU.map((section, idx) => (
              <div key={idx} className="space-y-0.5">
                {!sidebarCollapsed ? (
                  <span className="block text-[9px] font-bold tracking-wider text-slate-500 uppercase px-3 py-1">{section.section}</span>
                ) : (
                  <div className="border-t border-slate-800/60 my-2 mx-2"></div>
                )}

                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all relative ${
                        isActive 
                          ? 'bg-slate-800 text-white border-l-4 border-orange-500 pl-2' 
                          : 'hover:bg-slate-800/50 hover:text-white text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      
                      {!sidebarCollapsed && item.badge > 0 && (
                        <span className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded-full ${
                          item.id === 'Approvals' 
                            ? 'bg-orange-500 text-white' 
                            : 'bg-slate-700 text-slate-200'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {sidebarCollapsed && item.badge > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full border border-slate-900"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Collapse Toggle */}
        <div className="p-3 border-t border-slate-800 flex justify-center">
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 tracking-wider">
            {getBreadcrumbs().map((b, i) => (
              <React.Fragment key={i}>
                <span className={i === getBreadcrumbs().length - 1 ? "text-slate-700" : "hover:text-slate-600"}>{b}</span>
                {i < getBreadcrumbs().length - 1 && <span className="text-slate-300 font-normal">/</span>}
              </React.Fragment>
            ))}
          </div>

          {/* Search bar & notification items */}
          <div className="flex items-center gap-4">
            
            {/* Search Placeholder */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search cities, retailers, orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold w-64 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-300 focus:bg-slate-100/30 transition-all"
              />
            </div>

            {/* Notifications Hub Trigger */}
            <div className="relative" onClick={stopPropagation}>
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 hover:text-slate-800 transition-all relative"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-600 rounded-full border border-white"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-40 p-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                    <span className="text-xs font-bold text-slate-800">State Notifications</span>
                    <button 
                      onClick={() => {
                        setIsNotifOpen(false);
                        setActiveTab("Notifications");
                      }}
                      className="text-[10px] text-orange-600 font-bold hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {unreadNotificationsCount > 0 ? (
                      <div className="text-xs font-medium text-slate-600 space-y-2">
                        <p className="p-1 rounded bg-orange-50/50 text-orange-900 text-[11px] border border-orange-100/50">
                          {unreadNotificationsCount} pending alerts scoped to Gujarat.
                        </p>
                        <div className="border-t border-slate-100 my-1 pt-1">
                          <span className="font-bold text-slate-700">ORD-2026-0541 awaits approval</span>
                          <p className="text-slate-400 mt-0.5 text-[10px]">Patel Footwear — ₹32,500</p>
                        </div>
                        <div className="border-t border-slate-100 pt-1">
                          <span className="font-bold text-slate-700">Gujarat Monthly Target Exceeded</span>
                          <p className="text-slate-400 mt-0.5 text-[10px]">June overall target achieved by 115.9%</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No unread notifications.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile/Logout Dropdown */}
            <div className="relative" onClick={stopPropagation}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-9 h-9 rounded-full border border-slate-200 overflow-hidden shadow-xs cursor-pointer flex items-center justify-center bg-slate-100 font-extrabold text-xs text-slate-700"
              >
                RM
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-40 py-2">
                  <div className="px-4 py-2 border-b border-slate-100 mb-1.5 bg-slate-50/50 rounded-t-2xl">
                    <span className="font-bold text-slate-800 block text-xs truncate">{currentStateManager.name}</span>
                    <span className="text-[10px] text-orange-600 font-bold block">Gujarat State Manager</span>
                  </div>
                  
                  <div className="px-4 py-2 border-b border-slate-100 mb-1.5">
                    <label className="block text-[8px] uppercase font-bold text-slate-400 mb-1">Switch Role Session</label>
                    <select
                      value="State Manager"
                      onChange={(e) => {
                        setIsProfileOpen(false);
                        onSwitchRole(e.target.value);
                      }}
                      className="w-full text-[10px] border border-slate-200 rounded-lg p-1.5 bg-white font-bold text-slate-700 focus:outline-none"
                    >
                      <option value="Founder">Founder</option>
                      <option value="CEO">CEO</option>
                      <option value="Admin">Admin</option>
                      <option value="Country Manager">Country Manager</option>
                      <option value="State Manager">State Manager</option>
                      <option value="City Manager">City Manager</option>
                      <option value="Finance Manager">Finance Manager</option>
                      <option value="Sales Executive">Sales Executive</option>
                      <option value="Retailer">Retailer</option>
                    </select>
                  </div>
                  
                  <button 
                    onClick={() => { setIsProfileOpen(false); setActiveTab("My Incentive"); }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <BadgePercent className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Incentives</span>
                  </button>
                  
                  <div className="border-t border-slate-100 my-1"></div>
                  
                  <button 
                    onClick={() => {
                      setIsProfileOpen(false);
                      onSwitchRole('Founder'); // Default Switch Role back
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Return to Admin</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Main Panel Content Canvas */}
        <main className="p-6 overflow-y-auto flex-1 max-w-[1600px] w-full mx-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
