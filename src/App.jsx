import './mockApi'; // Global window.fetch interceptor
import React, { useState, useEffect } from 'react';
import { 
  Home, GitBranch, LayoutGrid, Map, Users, UsersRound, Award, Store, Package, 
  ShoppingCart, CreditCard, Percent, TrendingUp, Target, MapPin, CheckSquare, 
  Archive, Shield, Bell, BarChart3, Lock, ChevronLeft, ChevronRight, Search, 
  Menu, LogOut, Settings, User, X, ShoppingBag
} from 'lucide-react';
import { Toast } from './components/Common';

// Import All 21 Modules
import Dashboard from './modules/Dashboard';
import UserRoleManagement from './modules/UserRoleManagement';
import Hierarchy from './modules/Hierarchy';
import Employees from './modules/Employees';
import Teams from './modules/Teams';
import Departments from './modules/Departments';
import Promoters from './modules/Promoters';
import Retailers from './modules/Retailers';
import Products from './modules/Products';
import Orders from './modules/Orders';
import BillingPayments from './modules/BillingPayments';
import Commissions from './modules/Commissions';
import Territory from './modules/Territory';
import Sales from './modules/Sales';
import Targets from './modules/Targets';
import Approvals from './modules/Approvals';
import FieldTracking from './modules/FieldTracking';
import Notifications from './modules/Notifications';
import Reports from './modules/Reports';
import Security from './modules/Security';
import Inventory from './modules/Inventory';
import Purchase from './modules/Purchase';
import Customers from './modules/Customers';
import PettyCash from './modules/PettyCash';
import RetailerModule from './modules/retailer/RetailerModule';
// CM-MODULE: Import Country Manager Module
import CountryManagerModule from './modules/country-manager/CountryManagerModule';
// SM-MODULE: Import State Manager Module
import StateManagerModule from './state-manager/StateManagerModule';
// CTY-MODULE: Import City Manager Module
import CityManagerModule from './city-manager/CityManagerModule';
// PROMO-MODULE: Import Promoter Module
import PromoterModule from './modules/promoter/PromoterModule';
// EMPLOYEE-MODULE: Import Employee Module
import EmployeeModule from './modules/employee/EmployeeModule';



// Navigation Schema with Sections & Mapped Icons
const NAV_MENU = [
  {
    section: "OVERVIEW",
    items: [
      { id: "Dashboard", label: "Dashboard", icon: Home, component: Dashboard }
    ]
  },
  {
    section: "ORGANIZATION",
    items: [
      { id: "Hierarchy", label: "Hierarchy", icon: GitBranch, component: Hierarchy },
      { id: "Departments", label: "Departments", icon: LayoutGrid, component: Departments },
      { id: "Territories", label: "Territories", icon: Map, component: Territory }
    ]
  },
  {
    section: "PEOPLE",
    items: [
      { id: "Employees", label: "Employees", icon: Users, component: Employees },
      { id: "Teams", label: "Teams", icon: UsersRound, component: Teams },
      { id: "Promoters", label: "Promoters", icon: Award, component: PromoterModule },
      { id: "CountryManagers", label: "Country Managers", icon: Users, component: CountryManagerModule }
    ]
  },
  {
    section: "BUSINESS",
    items: [
      { id: "Retailers", label: "Retailers", icon: Store, component: Retailers },
      { id: "Products", label: "Products", icon: Package, component: Products },
      { id: "Orders", label: "Orders", icon: ShoppingCart, component: Orders },
      { id: "Customers", label: "Customers", icon: Users, component: Customers },
      { id: "RetailerPanel", label: "Retailer Panel (Mock)", icon: Store, component: RetailerModule }
    ]
  },
  {
    section: "FINANCE",
    items: [
      { id: "Billing", label: "Billing & Payments", icon: CreditCard, component: BillingPayments },
      { id: "Commissions", label: "Commissions", icon: Percent, component: Commissions },
      { id: "Sales", label: "Sales", icon: TrendingUp, component: Sales },
      { id: "Targets", label: "Targets", icon: Target, component: Targets },
      { id: "Petty Cash", label: "Petty Cash", icon: CreditCard, component: PettyCash }
    ]
  },
  {
    section: "OPERATIONS",
    items: [
      { id: "Field Tracking", label: "Field Tracking", icon: MapPin, component: FieldTracking },
      { id: "Approvals", label: "Approvals", icon: CheckSquare, component: Approvals },
      { id: "Inventory", label: "Inventory", icon: Archive, component: Inventory },
      { id: "Purchase", label: "Purchase & QR", icon: ShoppingBag, component: Purchase }
    ]
  },
  {
    section: "ADMINISTRATION",
    items: [
      { id: "Users & Roles", label: "Users & Roles", icon: Shield, component: UserRoleManagement },
      { id: "Notifications", label: "Notifications", icon: Bell, component: Notifications },
      { id: "Reports", label: "Reports", icon: BarChart3, component: Reports },
      { id: "Security & Audit", label: "Security & Audit", icon: Lock, component: Security }
    ]
  }
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // HUDDO-UPDATE: Core — Added simulated role state and RBAC route filtering
  const [currentRole, setCurrentRole] = useState(() => localStorage.getItem('huddo_role') || 'Founder');

  const handleRoleChange = (role) => {
    setCurrentRole(role);
    localStorage.setItem('huddo_role', role);
    showToast(`Simulated active session changed to: ${role}`, "success");
  };

  const canViewItem = (itemId) => {
    if (itemId === 'CountryManagers') {
      return ["Founder", "CEO", "Admin"].includes(currentRole);
    }
    if (itemId === 'Customers') {
      return ["Founder", "CEO", "Admin", "Country Manager", "State Manager", "City Manager"].includes(currentRole);
    }
    if (itemId === 'Petty Cash') {
      return ["Founder", "CEO", "Admin", "Finance Manager"].includes(currentRole);
    }
    return true;
  };

  useEffect(() => {
    if (!canViewItem(activeScreen)) {
      setActiveScreen('Dashboard');
    }
  }, [currentRole, activeScreen]);

  // Header menu states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Toast State
  const [toast, setToast] = useState(null);

  // Global Keybindings (Ctrl+K for search command palette)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Find active screen component
  let ActiveComponent = Dashboard;
  let activeLabel = "Dashboard";
  let activeSection = "OVERVIEW";

  for (const sect of NAV_MENU) {
    const match = sect.items.find(item => item.id === activeScreen);
    if (match) {
      ActiveComponent = match.component;
      activeLabel = match.label;
      activeSection = sect.section;
      break;
    }
  }

  // Filter modules for search palette
  const allNavItems = NAV_MENU.reduce((acc, curr) => [...acc, ...curr.items], []);
  const searchedItems = searchQuery.trim() === '' ? [] : allNavItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) && canViewItem(item.id)
  );

  // HUDDO-UPDATE: Retailer Panel - Full Screen override
  if (currentRole.toLowerCase() === 'retailer') {
    return (
      <RetailerModule 
        userRole={currentRole} 
        showToast={showToast} 
        onSwitchRole={(role) => handleRoleChange(role)}
      />
    );
  }

  // CM-MODULE: Country Manager Workspace - Full Screen override
  if (currentRole.toLowerCase() === 'country manager') {
    return (
      <CountryManagerModule 
        userRole={currentRole} 
        showToast={showToast} 
        onSwitchRole={(role) => handleRoleChange(role)}
      />
    );
  }

  // SM-MODULE: State Manager Workspace - Full Screen override
  if (currentRole.toLowerCase() === 'state manager') {
    return (
      <StateManagerModule 
        userRole={currentRole} 
        showToast={showToast} 
        onSwitchRole={(role) => handleRoleChange(role)}
      />
    );
  }

  // CTY-MODULE: City Manager Workspace - Full Screen override
  if (currentRole.toLowerCase() === 'city manager') {
    return (
      <CityManagerModule 
        userRole={currentRole} 
        showToast={showToast} 
        onSwitchRole={(role) => handleRoleChange(role)}
      />
    );
  }

  // PROMO-MODULE: Promoter Workspace - Full Screen override
  if (currentRole.toLowerCase() === 'promoter') {
    return (
      <PromoterModule 
        userRole={currentRole} 
        showToast={showToast} 
        onSwitchRole={(role) => handleRoleChange(role)}
      />
    );
  }

  // EMPLOYEE-MODULE: Employee Workspace - Full Screen override
  const employeeRoles = [
    'sales executive', 'sales manager', 'hr manager', 
    'finance manager', 'inventory manager', 'purchase manager', 
    'team member'
  ];
  if (employeeRoles.includes(currentRole.toLowerCase())) {
    return (
      <EmployeeModule 
        userRole={currentRole} 
        showToast={showToast} 
        onSwitchRole={(role) => handleRoleChange(role)}
      />
    );
  }


  return (
    <div className="min-h-screen flex bg-slate-50 relative font-sans antialiased text-slate-800">
      
      {/* 1. persistent Sidebar */}
      <aside 
        className={`bg-slate-900 text-slate-300 h-screen sticky top-0 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 ${
          sidebarCollapsed ? 'w-[64px]' : 'w-[256px]'
        }`}
      >
        <div>
          {/* Logo Brand area */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center font-bold text-white font-display text-base shadow-md">H</span>
                <span className="font-extrabold text-base tracking-wider text-white font-display">HUDDO ERP</span>
              </div>
            )}
            {sidebarCollapsed && (
              <span className="w-8 h-8 mx-auto rounded-lg bg-brand-orange flex items-center justify-center font-extrabold text-white font-display text-sm">H</span>
            )}
          </div>

          {/* Nav Items list */}
          <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]">
            {NAV_MENU.map((section, idx) => (
              <div key={idx} className="space-y-1">
                {/* Section Header */}
                {!sidebarCollapsed ? (
                  <span className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 py-1.5">{section.section}</span>
                ) : (
                  <div className="border-t border-slate-800/80 my-2"></div>
                )}

                {/* Section Items */}
                {section.items.filter(item => canViewItem(item.id)).map(item => {
                  const Icon = item.icon;
                  const isActive = activeScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveScreen(item.id)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all relative ${
                        isActive 
                          ? 'bg-brand-orange text-white shadow-md' 
                          : 'hover:bg-slate-800 hover:text-white text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                      {isActive && !sidebarCollapsed && (
                        <span className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Collapse bottom toggle switch */}
        <div className="p-3 border-t border-slate-800 flex justify-center">
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* 2. Topbar + Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          {/* Breadcrumb path */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer">HUDDO ERP</span>
            <span>/</span>
            <span className="hover:text-slate-600 uppercase tracking-wider">{activeSection}</span>
            <span>/</span>
            <span className="text-slate-700 font-bold">{activeLabel}</span>
          </div>

          {/* Action links */}
          <div className="flex items-center gap-4">
            {/* Search Launcher */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/50 rounded-lg text-slate-400 text-xs font-semibold w-56 transition-all"
            >
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span>Search Module (Ctrl+K)</span>
            </button>

            {/* Notification Bell Badge */}
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-800 transition-all"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-brand-orange border-2 border-white rounded-full"></span>
              </button>

              {/* Notification feed dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-40 p-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                    <span className="text-xs font-bold text-slate-800 font-display">System Notifications</span>
                    <button 
                      onClick={() => { setIsNotifOpen(false); showToast("Marked all notifications as read.", "success"); }}
                      className="text-[10px] text-brand-orange font-bold hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs">
                      <span className="font-bold text-slate-800 block">Pending Shop Verification</span>
                      <p className="text-slate-400 mt-0.5 font-medium">Apex Sole Distributors requested Silver category authorization in Pune.</p>
                      <span className="text-[9px] text-slate-400 font-bold block mt-1">10 mins ago</span>
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-slate-800 block">Large Order Review Required</span>
                      <p className="text-slate-400 mt-0.5 font-medium">Order ORD-5509 of value ₹1,50,000 exceeds standard limit limits.</p>
                      <span className="text-[9px] text-slate-400 font-bold block mt-1">2 hours ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar drop */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden shadow-xs cursor-pointer"
              >
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="Admin user profile photo" className="w-full h-full object-cover" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-40 py-2">
                  <div className="px-4 py-2 border-b border-slate-100 mb-1.5 bg-slate-50/50 rounded-t-xl">
                    <span className="font-bold text-slate-800 block text-xs font-display">Rohan Hudda</span>
                    <span className="text-[10px] text-brand-orange font-bold block">{currentRole} Session</span>
                  </div>
                  
                  <div className="px-4 py-2 border-b border-slate-100 mb-1.5">
                    <label className="block text-[8px] uppercase font-bold text-slate-400 mb-1">Select Active Role (RBAC)</label>
                    <select
                      value={currentRole}
                      onChange={(e) => { handleRoleChange(e.target.value); setIsProfileOpen(false); }}
                      className="w-full text-[10px] border border-slate-200 rounded p-1 bg-white font-bold text-slate-700 focus:outline-none"
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
                      <option value="Promoter">Promoter</option>
                    </select>

                  </div>
                  
                  <button 
                    onClick={() => { setIsProfileOpen(false); showToast("Opened profile setups.", "success"); }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Profile</span>
                  </button>
                  <button 
                    onClick={() => { setIsProfileOpen(false); showToast("Opened system configs.", "success"); }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Portal Settings</span>
                  </button>
                  
                  <div className="border-t border-slate-100 my-1"></div>
                  
                  <button 
                    onClick={() => { setIsProfileOpen(false); showToast("Sign-out request dispatched.", "error"); }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5 font-bold" />
                    <span>Logout Account</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* 3. Main Dashboard canvas */}
        <main className="p-6 overflow-y-auto flex-1 max-w-[1600px] w-full mx-auto">
          <ActiveComponent onNavigate={(target) => setActiveScreen(target)} showToast={showToast} userRole={currentRole} />
        </main>
      </div>

      {/* Global Command Palette search modal */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-xs p-4 pt-16 animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && setIsSearchOpen(false)}
        >
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search command palette..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm border-0 focus:outline-none w-full bg-white text-slate-800"
                autoFocus
              />
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-1 hover:bg-slate-100 rounded text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="max-h-60 overflow-y-auto p-2">
              {searchedItems.length > 0 ? (
                searchedItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveScreen(item.id);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-2.5 hover:bg-slate-50 rounded-lg text-xs font-bold flex items-center gap-2 text-slate-700 transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-slate-400" />
                    <span>Navigate to {item.label}</span>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                  {searchQuery.trim() === '' ? "Type key concepts to search modules..." : "No modules found matches query."}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Success/Error toast */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

    </div>
  );
}
