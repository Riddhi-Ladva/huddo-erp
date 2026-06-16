// src/city-manager/components/CityManagerLayout.jsx
import { useState } from 'react';
import { 
  LayoutDashboard, Store, UserPlus, Clock, ShoppingCart, CheckSquare, 
  MapPin, Lightbulb, Award, TrendingUp, Target, BadgePercent, 
  BarChart2, Bell, ChevronLeft, ChevronRight, User, LogOut, Settings, Search, X
} from 'lucide-react';

export default function CityManagerLayout({ 
  activeTab, 
  setActiveTab, 
  pendingApprovalsCount = 0, 
  unreadNotificationsCount = 0,
  pendingRetailersCount = 0,
  onSwitchRole,
  searchQuery,
  setSearchQuery,
  children 
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const navGroups = [
    {
      section: "OVERVIEW",
      items: [
        { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard }
      ]
    },
    {
      section: "RETAILERS",
      items: [
        { id: "My Retailers", label: "My Retailers", icon: Store },
        { id: "Onboard Retailer", label: "Onboard Retailer", icon: UserPlus },
        { id: "Pending Verification", label: "Pending Verification", icon: Clock, badge: pendingRetailersCount }
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
      section: "FIELD WORK",
      items: [
        { id: "Visit Logs", label: "Visit Logs", icon: MapPin },
        { id: "Market Leads", label: "Market Leads", icon: Lightbulb }
      ]
    },
    {
      section: "PROMOTERS",
      items: [
        { id: "Promoter View", label: "Promoter View", icon: Award }
      ]
    },
    {
      section: "PERFORMANCE",
      items: [
        { id: "Sales Monitoring", label: "Sales Monitoring", icon: TrendingUp },
        { id: "Targets", label: "Targets", icon: Target },
        { id: "My Incentive", label: "My Incentive", icon: BadgePercent }
      ]
    },
    {
      section: "REPORTS",
      items: [
        { id: "Reports", label: "Reports", icon: BarChart2 },
        { id: "Notifications", label: "Notifications", icon: Bell, badge: unreadNotificationsCount }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 relative font-sans antialiased text-slate-800">
      
      {/* Collapsible Sidebar */}
      <aside 
        className={`bg-slate-900 text-slate-300 h-screen sticky top-0 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 ${
          sidebarCollapsed ? 'w-[64px]' : 'w-[240px]'
        }`}
      >
        <div>
          {/* Logo Brand area */}
          <div className="h-16 flex flex-col justify-center px-4 border-b border-slate-800/80">
            {!sidebarCollapsed ? (
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="w-6.5 h-6.5 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-white font-display text-sm shadow-md">H</span>
                  <span className="font-extrabold text-sm tracking-wider text-white font-display">HUDDO ERP</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold ml-8 mt-0.5">City Manager</span>
              </div>
            ) : (
              <span className="w-8 h-8 mx-auto rounded-lg bg-orange-600 flex items-center justify-center font-extrabold text-white font-display text-sm">H</span>
            )}
          </div>

          {/* User Badge under Logo */}
          {!sidebarCollapsed ? (
            <div className="p-4 mx-3 my-4 bg-slate-800/40 border border-slate-800/60 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-600 text-white font-black text-sm flex items-center justify-center border-2 border-slate-700">
                AP
              </div>
              <div className="min-w-0">
                <span className="block font-bold text-xs text-white truncate">Arjun Patel</span>
                <span className="inline-block px-1.5 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[8px] font-extrabold rounded mt-1">
                  Ahmedabad
                </span>
              </div>
            </div>
          ) : (
            <div className="my-4 flex justify-center">
              <div className="w-8 h-8 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center border border-slate-700 cursor-pointer" title="Arjun Patel (Ahmedabad)">
                AP
              </div>
            </div>
          )}

          {/* Navigation group */}
          <nav className="px-2 pb-4 space-y-4 overflow-y-auto max-h-[calc(100vh-210px)] select-none">
            {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-0.5">
                {!sidebarCollapsed ? (
                  <span className="block text-[8px] font-bold tracking-wider text-slate-500 uppercase px-3 py-1.5">{group.section}</span>
                ) : (
                  <div className="border-t border-slate-800/80 my-2"></div>
                )}

                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all relative ${
                        isActive 
                          ? 'border-l-4 border-orange-500 text-orange-500 bg-orange-500/5' 
                          : 'hover:bg-slate-800 hover:text-white text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      
                      {!sidebarCollapsed && item.badge > 0 && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black text-center min-w-[16px] ${
                          item.id === 'Approvals' || item.id === 'Pending Verification'
                            ? 'bg-rose-500 text-white' 
                            : 'bg-orange-500 text-white'
                        }`}>
                          {item.badge}
                        </span>
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

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer">HUDDO ERP</span>
            <span>/</span>
            <span className="hover:text-slate-600 uppercase tracking-wider">AHMEDABAD</span>
            <span>/</span>
            <span className="text-slate-700 font-bold uppercase tracking-wider">{activeTab}</span>
          </div>

          {/* Search bar & dropdowns */}
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search retailers, orders, leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold w-64 focus:outline-none focus:bg-white focus:border-slate-300 text-slate-700"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Notification popover */}
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 hover:text-slate-800 transition-all relative"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-orange-600 border-2 border-white rounded-full"></span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-40 p-4 animate-scale-up">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                    <span className="text-xs font-bold text-slate-800">Alert Center</span>
                    <button 
                      onClick={() => { setActiveTab('Notifications'); setIsNotifOpen(false); }}
                      className="text-[10px] text-orange-600 font-bold hover:underline"
                    >
                      View all
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs">
                      <span className="font-bold text-slate-800 block">Verification Request</span>
                      <p className="text-slate-400 mt-0.5 font-medium">New retailer Sunrise Footwear awaits verification.</p>
                      <span className="text-[9px] text-slate-400 font-bold block mt-1">Gota Area</span>
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-slate-800 block">Pending Order Approval</span>
                      <p className="text-slate-400 mt-0.5 font-medium">ORD-2026-0541 from Patel Footwear (₹32,500) requires action.</p>
                      <span className="text-[9px] text-slate-400 font-bold block mt-1">2 hours ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden shadow-xs cursor-pointer flex items-center justify-center bg-orange-600 text-white font-bold text-xs"
              >
                AP
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-40 py-2 animate-scale-up">
                  <div className="px-4 py-2 border-b border-slate-100 mb-1.5 bg-slate-50/50 rounded-t-xl">
                    <span className="font-bold text-slate-800 block text-xs">Arjun Patel</span>
                    <span className="text-[10px] text-orange-600 font-bold block">City Manager — Ahmedabad</span>
                  </div>
                  
                  {onSwitchRole && (
                    <div className="px-4 py-2 border-b border-slate-100 mb-1.5">
                      <label className="block text-[8px] uppercase font-bold text-slate-400 mb-1">Switch role (RBAC)</label>
                      <select
                        onChange={(e) => { onSwitchRole(e.target.value); setIsProfileOpen(false); }}
                        defaultValue="City Manager"
                        className="w-full text-[10px] border border-slate-200 rounded p-1 bg-white font-bold text-slate-700 focus:outline-none"
                      >
                        <option value="Founder">Founder</option>
                        <option value="CEO">CEO</option>
                        <option value="Admin">Admin</option>
                        <option value="Country Manager">Country Manager</option>
                        <option value="State Manager">State Manager</option>
                        <option value="City Manager">City Manager</option>
                        <option value="Retailer">Retailer</option>
                      </select>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => { setIsProfileOpen(false); setActiveTab('My Incentive'); }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Incentives</span>
                  </button>
                  
                  <button 
                    onClick={() => { setIsProfileOpen(false); setActiveTab('Targets'); }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Quota Targets</span>
                  </button>
                  
                  <div className="border-t border-slate-100 my-1"></div>
                  
                  <button 
                    onClick={() => { setIsProfileOpen(false); onSwitchRole('Founder'); }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Sign Out Session</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Main canvas */}
        <main className="p-6 overflow-y-auto flex-1 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
