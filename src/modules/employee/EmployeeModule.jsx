import React, { useState, useEffect } from 'react';
import { 
  Home, User, Clock, Calendar, Bell, ShoppingCart, 
  MapPin, Target, Percent, Users, Landmark, Award, 
  CreditCard, TrendingUp, Archive, RefreshCw, AlertTriangle, 
  BarChart3, CheckSquare, ShoppingBag, Menu, X, ChevronLeft, ChevronRight, Settings, LogOut
} from 'lucide-react';

// Import Context
import { EmployeeAuthProvider, useEmployeeAuth } from './context/EmployeeAuthContext';

// Import Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import Orders from './pages/Orders';
import FieldTracking from './pages/FieldTracking';
import Targets from './pages/Targets';
import Commission from './pages/Commission';
import EmployeeDirectory from './pages/EmployeeDirectory';
import HrAttendance from './pages/HrAttendance';
import HrLeaves from './pages/HrLeaves';
import Payroll from './pages/Payroll';
import PerformanceReviews from './pages/PerformanceReviews';
import CommissionCalc from './pages/CommissionCalc';
import RevenueReports from './pages/RevenueReports';
import ExpenseTracking from './pages/ExpenseTracking';
import GstManagement from './pages/GstManagement';
import StockManagement from './pages/StockManagement';
import WarehouseManagement from './pages/WarehouseManagement';
import StockTransfers from './pages/StockTransfers';
import StockAlerts from './pages/StockAlerts';
import InventoryReports from './pages/InventoryReports';
import VendorManagement from './pages/VendorManagement';
import PurchaseOrders from './pages/PurchaseOrders';
import PurchaseApprovals from './pages/PurchaseApprovals';
import MaterialTracking from './pages/MaterialTracking';
import ProcurementReports from './pages/ProcurementReports';
import Tasks from './pages/Tasks';

// Import Mock Notifications
import { mockNotifications as initialNotifications } from './mockData/mockNotifications';

function EmployeeWorkspace({ userRole, showToast, onSwitchRole }) {
  const { currentEmployee, activeRole, switchRole } = useEmployeeAuth();
  
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Notification States
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Sync state if activeRole changes via dev tools
  useEffect(() => {
    setActiveTab("Dashboard");
  }, [activeRole]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (notifId) => {
    setNotifications(prev => prev.map(n => 
      n.id === notifId ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast("All notifications marked as read.", "success");
  };

  const handleDevRoleChange = (roleLabel) => {
    const keyMap = {
      "Sales Executive": "sales_executive",
      "Sales Manager": "sales_manager",
      "HR Manager": "hr_manager",
      "Finance Manager": "finance_manager",
      "Inventory Manager": "inventory_manager",
      "Purchase Manager": "purchase_manager",
      "Team Member": "team_member"
    };
    const key = keyMap[roleLabel] || 'sales_executive';
    switchRole(key);
    showToast(`Role switched to: ${roleLabel}`, "success");
  };

  // Nav configuration mapping
  const getNavItems = () => {
    const common = [
      { id: "Dashboard", label: "Dashboard", icon: Home },
      { id: "Profile", label: "Profile", icon: User },
      { id: "Leave", label: "Leave Management", icon: Calendar }
    ];

    switch (activeRole) {
      case 'sales_executive':
        return [
          ...common,
          { id: "Attendance", label: "My Attendance", icon: Clock },
          { id: "My Orders", label: "My Orders", icon: ShoppingCart },
          { id: "Retailer Visits", label: "Retailer Visits", icon: MapPin },
          { id: "Targets", label: "Targets & KPIs", icon: Target },
          { id: "Commission", label: "Commission Ledger", icon: Percent }
        ];
      case 'sales_manager':
        return [
          ...common,
          { id: "Attendance", label: "My Attendance", icon: Clock },
          { id: "Team Orders", label: "Team Orders", icon: ShoppingCart },
          { id: "Retailer Visits", label: "Retailer Visits", icon: MapPin },
          { id: "Targets", label: "Targets & KPIs", icon: Target },
          { id: "Commission", label: "Commission Ledger", icon: Percent }
        ];
      case 'hr_manager':
        return [
          { id: "Dashboard", label: "Dashboard", icon: Home },
          { id: "Profile", label: "Profile", icon: User },
          { id: "Employee Directory", label: "Employee Directory", icon: Users },
          { id: "Attendance HR", label: "Attendance (HR)", icon: Clock },
          { id: "Leave Approvals", label: "Leave Approvals", icon: Calendar },
          { id: "Payroll", label: "Payroll Control", icon: Landmark },
          { id: "Performance Reviews", label: "Performance Reviews", icon: Award }
        ];
      case 'finance_manager':
        return [
          ...common,
          { id: "Attendance", label: "My Attendance", icon: Clock },
          { id: "Commission Calculations", label: "Commission Calc", icon: Percent },
          { id: "Revenue Reports", label: "Revenue Reports", icon: TrendingUp },
          { id: "Expense Tracking", label: "Expense Tracking", icon: CreditCard },
          { id: "GST Management", label: "GST Management", icon: Landmark },
          { id: "Payroll View", label: "Payroll View", icon: Landmark }
        ];
      case 'inventory_manager':
        return [
          ...common,
          { id: "Attendance", label: "My Attendance", icon: Clock },
          { id: "Stock Management", label: "Stock Management", icon: Archive },
          { id: "Warehouse", label: "Warehouse status", icon: Landmark },
          { id: "Stock Transfers", label: "Stock Transfers", icon: RefreshCw },
          { id: "Stock Alerts", label: "Stock Alerts", icon: AlertTriangle },
          { id: "Inventory Reports", label: "Inventory Reports", icon: BarChart3 }
        ];
      case 'purchase_manager':
        return [
          ...common,
          { id: "Attendance", label: "My Attendance", icon: Clock },
          { id: "Vendor Management", label: "Vendor Management", icon: Users },
          { id: "Purchase Orders", label: "Purchase Orders", icon: ShoppingCart },
          { id: "Purchase Approvals", label: "Purchase Approvals", icon: CheckSquare },
          { id: "Material Tracking", label: "Material Tracking", icon: ShoppingBag },
          { id: "Procurement Reports", label: "Procurement Reports", icon: BarChart3 }
        ];
      case 'team_member':
      default:
        return [
          ...common,
          { id: "Attendance", label: "My Attendance", icon: Clock },
          { id: "My Tasks", label: "My Tasks", icon: CheckSquare }
        ];
    }
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard onNavigate={setActiveTab} showToast={showToast} />;
      case 'Profile':
        return <Profile showToast={showToast} />;
      case 'Attendance':
        return <Attendance showToast={showToast} />;
      case 'Leave':
        return <Leave showToast={showToast} />;
      
      // Sales roles
      case 'My Orders':
      case 'Team Orders':
        return <Orders showToast={showToast} />;
      case 'Retailer Visits':
        return <FieldTracking showToast={showToast} />;
      case 'Targets':
        return <Targets />;
      case 'Commission':
        return <Commission showToast={showToast} />;

      // HR manager
      case 'Employee Directory':
        return <EmployeeDirectory showToast={showToast} />;
      case 'Attendance HR':
        return <HrAttendance showToast={showToast} />;
      case 'Leave Approvals':
        return <HrLeaves showToast={showToast} />;
      case 'Payroll':
        return <Payroll showToast={showToast} />;
      case 'Performance Reviews':
        return <PerformanceReviews showToast={showToast} />;

      // Finance manager
      case 'Commission Calculations':
        return <CommissionCalc showToast={showToast} />;
      case 'Revenue Reports':
        return <RevenueReports showToast={showToast} />;
      case 'Expense Tracking':
        return <ExpenseTracking showToast={showToast} />;
      case 'GST Management':
        return <GstManagement showToast={showToast} />;
      case 'Payroll View':
        return <Payroll showToast={showToast} />; // Render payroll page (which hides process PO for finance)

      // Inventory manager
      case 'Stock Management':
        return <StockManagement showToast={showToast} />;
      case 'Warehouse':
        return <WarehouseManagement />;
      case 'Stock Transfers':
        return <StockTransfers showToast={showToast} />;
      case 'Stock Alerts':
        return <StockAlerts showToast={showToast} />;
      case 'Inventory Reports':
        return <InventoryReports showToast={showToast} />;

      // Purchase manager
      case 'Vendor Management':
        return <VendorManagement showToast={showToast} />;
      case 'Purchase Orders':
        return <PurchaseOrders showToast={showToast} />;
      case 'Purchase Approvals':
        return <PurchaseApprovals showToast={showToast} />;
      case 'Material Tracking':
        return <MaterialTracking showToast={showToast} />;
      case 'Procurement Reports':
        return <ProcurementReports showToast={showToast} />;

      // Team Member
      case 'My Tasks':
        return <Tasks showToast={showToast} />;

      default:
        return <Dashboard onNavigate={setActiveTab} showToast={showToast} />;
    }
  };

  const navItems = getNavItems();
  const currentRoleLabel = {
    sales_executive: "Sales Executive",
    sales_manager: "Sales Manager",
    hr_manager: "HR Manager",
    finance_manager: "Finance Manager",
    inventory_manager: "Inventory Manager",
    purchase_manager: "Purchase Manager",
    team_member: "Team Member"
  }[activeRole] || "Sales Executive";

  return (
    <div className="min-h-screen flex bg-slate-50 relative font-sans antialiased text-slate-800 w-full employee-workspace">
      
      {/* 1. Sidebar */}
      <aside 
        className={`bg-slate-900 text-slate-350 h-screen sticky top-0 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 ${
          sidebarCollapsed ? 'w-[64px]' : 'w-[256px]'
        } ${mobileSidebarOpen ? 'fixed inset-y-0 left-0 z-50 bg-slate-900 w-[256px] block' : 'hidden lg:flex'}`}
      >
        <div>
          {/* Brand header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
            {(!sidebarCollapsed || mobileSidebarOpen) && (
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center font-bold text-white font-display text-base shadow-md">H</span>
                <span className="font-extrabold text-base tracking-wider text-white font-display">HUDDO PANEL</span>
              </div>
            )}
            {sidebarCollapsed && !mobileSidebarOpen && (
              <span className="w-8 h-8 mx-auto rounded-lg bg-brand-orange flex items-center justify-center font-extrabold text-white font-display text-sm">H</span>
            )}
            {mobileSidebarOpen && (
              <button 
                className="lg:hidden p-1 text-slate-400 hover:text-white cursor-pointer" 
                onClick={() => setMobileSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Roster items */}
          <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]">
            <div className="space-y-1">
              {(!sidebarCollapsed || mobileSidebarOpen) ? (
                <span className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 py-1.5">Employee Workspace</span>
              ) : (
                <div className="border-t border-slate-800/80 my-2"></div>
              )}

              {navItems.map(item => {
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
                        : 'hover:bg-slate-800 hover:text-white text-slate-450'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      {(!sidebarCollapsed || mobileSidebarOpen) && <span>{item.label}</span>}
                    </div>
                    {isActive && (!sidebarCollapsed || mobileSidebarOpen) && (
                      <span className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Sidebar collapse button */}
        <div className="p-3 border-t border-slate-805 flex justify-center">
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* 2. Topbar + Main canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar header controls */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs select-none">
          {/* Breadcrumb path */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="hover:text-slate-650">HUDDO ERP</span>
            <span>/</span>
            <span className="hover:text-slate-655 uppercase tracking-wider">{currentRoleLabel}</span>
            <span>/</span>
            <span className="text-slate-700 font-extrabold uppercase tracking-wider">{activeTab}</span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            
            {/* DEV TOOL switcher dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-lg p-1.5 text-[10px] font-extrabold select-none">
              <span className="text-slate-400 uppercase tracking-wider">Dev: Switch Role</span>
              <select
                value={currentRoleLabel}
                onChange={(e) => handleDevRoleChange(e.target.value)}
                className="border-0 bg-transparent font-extrabold text-brand-orange focus:outline-none cursor-pointer"
              >
                <option value="Sales Executive">Sales Executive</option>
                <option value="Sales Manager">Sales Manager</option>
                <option value="HR Manager">HR Manager</option>
                <option value="Finance Manager">Finance Manager</option>
                <option value="Inventory Manager">Inventory Manager</option>
                <option value="Purchase Manager">Purchase Manager</option>
                <option value="Team Member">Team Member</option>
              </select>
            </div>

            {/* Mobile Sidebar toggle */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-500 cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Notification bell badge */}
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-800 transition-all cursor-pointer relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-orange border-2 border-white rounded-full flex items-center justify-center text-[7px] text-white"></span>
                )}
              </button>

              {/* Notification feed dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-55 p-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                    <span className="text-xs font-bold text-slate-800 font-display">Notifications Hub</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-[10px] text-brand-orange font-bold hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs">
                    {notifications.map((n, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => handleMarkAsRead(n.id)}
                        className={`border-b border-slate-50 pb-2 last:border-b-0 cursor-pointer hover:bg-slate-50/50 p-1 rounded transition-colors ${!n.read ? 'bg-orange-50/10 border-l-2 border-l-brand-orange pl-1.5' : ''}`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-slate-850 block">{n.title}</span>
                          {!n.read && <span className="w-1.5 h-1.5 bg-brand-orange rounded-full"></span>}
                        </div>
                        <p className="text-slate-400 mt-0.5 font-medium leading-relaxed">{n.message}</p>
                        <span className="text-[9px] text-slate-400 font-bold block mt-1">{n.date} - {n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile trigger linking back to Admin */}
            <button 
              onClick={() => onSwitchRole && onSwitchRole('Founder')}
              className="px-3.5 py-1.5 border border-slate-205 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-xs font-bold text-slate-650 transition-all cursor-pointer flex items-center gap-1"
              title="Logout session to admin panel"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout Session</span>
            </button>

          </div>
        </header>

        {/* 3. Main canvas area */}
        <main className="p-6 overflow-y-auto flex-1 max-w-[1600px] w-full mx-auto">
          {renderActiveScreen()}
        </main>
      </div>

    </div>
  );
}

export default function EmployeeModule({ userRole = 'Sales Executive', showToast, onSwitchRole }) {
  return (
    <EmployeeAuthProvider initialRole={userRole} onRoleChange={onSwitchRole}>
      <EmployeeWorkspace userRole={userRole} showToast={showToast} onSwitchRole={onSwitchRole} />
    </EmployeeAuthProvider>
  );
}
