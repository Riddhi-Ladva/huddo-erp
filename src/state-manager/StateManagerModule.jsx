// src/state-manager/StateManagerModule.jsx
import { useState, useEffect, useRef } from 'react';

// Import Layout
import StateManagerLayout from './components/StateManagerLayout';
import { Toast, SkeletonLoader } from './components/Common';

// Import Mock Data
import { 
  cityManagers as initialCityManagers, 
  retailers as initialRetailers, 
  orders as initialOrders, 
  monthlyRevenueData, 
  cityPerformanceData, 
  fieldForceData as initialFieldForceData, 
  pendingApprovals as initialPendingApprovals, 
  myIncentive, 
  notifications as initialNotifications 
} from './mockData';

// Import Pages
import Dashboard from './pages/Dashboard';
import CityManagers from './pages/CityManagers';
import Retailers from './pages/Retailers';
import TerritoryMap from './pages/TerritoryMap';
import Orders from './pages/Orders';
import Approvals from './pages/Approvals';
import SalesMonitoring from './pages/SalesMonitoring';
import TargetManagement from './pages/TargetManagement';
import FieldForce from './pages/FieldForce';
import MyIncentive from './pages/MyIncentive';
import Reports from './pages/Reports';
import NotificationsPage from './pages/NotificationsPage';

export default function StateManagerModule({ showToast: parentShowToast, onSwitchRole }) {
  // Navigation Routing Tab
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Search state managed globally
  const [searchQuery, setSearchQuery] = useState('');

  // Global Collections State (enabling mutations)
  const [cityManagers, setCityManagers] = useState(initialCityManagers);
  const [retailers, setRetailers] = useState(initialRetailers);
  const [orders, setOrders] = useState(initialOrders);
  const [pendingApprovals, setPendingApprovals] = useState(initialPendingApprovals);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [fieldForceData] = useState(initialFieldForceData);
  
  const [approvalHistory, setApprovalHistory] = useState([
    { id: "H001", item: "ORD-2026-0539 from Classic Comfort", type: "Large Order", decision: "Approved", date: "2026-06-09", reason: null },
    { id: "H002", item: "ORD-2026-0534 from Star Shoes", type: "Large Order", decision: "Approved", date: "2026-06-07", reason: null }
  ]);

  // Filter override when navigating from map to managers
  const [cityFilterOverride, setCityFilterOverride] = useState('');

  // Simulated Skeleton Loader on Tab Switch
  const timerRef = useRef(null);

  const handleTabChange = (tab) => {
    setLoading(true);
    setActiveTab(tab);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleNavigateWithFilter = (targetTab, filterVal) => {
    setCityFilterOverride(filterVal);
    handleTabChange(targetTab);
  };

  // Toast handler
  const showToast = (message, type = 'success') => {
    if (parentShowToast) {
      parentShowToast(message, type);
    } else {
      setToast({ message, type });
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  // CORE BUSINESS MUTATORS (State management across components)
  // ────────────────────────────────────────────────────────────────────────
  
  // 1. Order Approvals
  const handleApproveOrder = (orderId) => {
    // Update order status to Approved
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'Approved', requiresStateApproval: false };
      }
      return o;
    }));
    
    // Find item details
    const order = orders.find(o => o.id === orderId);
    
    // Remove from pending approvals
    setPendingApprovals(prev => prev.filter(a => a.orderId !== orderId));
    
    // Add to history log
    if (order) {
      const histItem = {
        id: `H-${Date.now()}`,
        item: `${order.id} from ${order.retailerName}`,
        type: 'Large Order',
        decision: 'Approved',
        date: new Date().toISOString().split('T')[0],
        reason: 'Authorized by State Manager'
      };
      setApprovalHistory(prev => [histItem, ...prev]);
    }
  };

  const handleRejectOrder = (orderId, reason) => {
    // Update order status to Cancelled
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'Cancelled', requiresStateApproval: false };
      }
      return o;
    }));

    // Find item details
    const order = orders.find(o => o.id === orderId);

    // Remove from pending approvals
    setPendingApprovals(prev => prev.filter(a => a.orderId !== orderId));

    // Add to history log
    if (order) {
      const histItem = {
        id: `H-${Date.now()}`,
        item: `${order.id} from ${order.retailerName}`,
        type: 'Large Order',
        decision: 'Rejected',
        date: new Date().toISOString().split('T')[0],
        reason: reason
      };
      setApprovalHistory(prev => [histItem, ...prev]);
    }
  };

  // 2. Generic Approvals (from Approvals Page Workspace)
  const handleApproveApproval = (approvalId) => {
    const item = pendingApprovals.find(a => a.id === approvalId);
    if (!item) return;

    if (item.type === 'Large Order') {
      handleApproveOrder(item.orderId);
    } else if (item.type === 'Retailer Registration') {
      // Approve retailer registration
      setRetailers(prev => prev.map(r => {
        if (r.businessName === item.retailer) {
          return { ...r, status: 'Active' };
        }
        return r;
      }));
      
      // Remove from pending approvals
      setPendingApprovals(prev => prev.filter(a => a.id !== approvalId));

      // Add to history log
      const histItem = {
        id: `H-${Date.now()}`,
        item: item.retailer,
        type: item.type,
        decision: 'Approved',
        date: new Date().toISOString().split('T')[0],
        reason: 'Verified and registered active in system'
      };
      setApprovalHistory(prev => [histItem, ...prev]);
    }
  };

  const handleRejectApproval = (approvalId, reason) => {
    const item = pendingApprovals.find(a => a.id === approvalId);
    if (!item) return;

    if (item.type === 'Large Order') {
      handleRejectOrder(item.orderId, reason);
    } else if (item.type === 'Retailer Registration') {
      // Reject retailer registration
      setRetailers(prev => prev.map(r => {
        if (r.businessName === item.retailer) {
          return { ...r, status: 'Rejected' };
        }
        return r;
      }));

      // Remove from pending approvals
      setPendingApprovals(prev => prev.filter(a => a.id !== approvalId));

      // Add to history log
      const histItem = {
        id: `H-${Date.now()}`,
        item: item.retailer,
        type: item.type,
        decision: 'Rejected',
        date: new Date().toISOString().split('T')[0],
        reason: reason
      };
      setApprovalHistory(prev => [histItem, ...prev]);
    }
  };

  // 3. Retailer onboarding verification direct hooks
  const handleApproveRetailer = (retailerId) => {
    const retailer = retailers.find(r => r.id === retailerId);
    if (!retailer) return;

    // Set Retailer status to Active
    setRetailers(prev => prev.map(r => {
      if (r.id === retailerId) {
        return { ...r, status: 'Active' };
      }
      return r;
    }));

    // Find and remove matching pending approval item
    setPendingApprovals(prev => prev.filter(a => a.retailer !== retailer.businessName));

    // Log in History
    const histItem = {
      id: `H-${Date.now()}`,
      item: retailer.businessName,
      type: 'Retailer Registration',
      decision: 'Approved',
      date: new Date().toISOString().split('T')[0],
      reason: 'Shop profile and GSTIN verified active'
    };
    setApprovalHistory(prev => [histItem, ...prev]);
  };

  const handleRejectRetailer = (retailerId) => {
    const retailer = retailers.find(r => r.id === retailerId);
    if (!retailer) return;

    // Set Retailer status to Rejected
    setRetailers(prev => prev.map(r => {
      if (r.id === retailerId) {
        return { ...r, status: 'Rejected' };
      }
      return r;
    }));

    // Find and remove matching pending approval item
    setPendingApprovals(prev => prev.filter(a => a.retailer !== retailer.businessName));

    // Log in History
    const histItem = {
      id: `H-${Date.now()}`,
      item: retailer.businessName,
      type: 'Retailer Registration',
      decision: 'Rejected',
      date: new Date().toISOString().split('T')[0],
      reason: 'Registration requirements deficit'
    };
    setApprovalHistory(prev => [histItem, ...prev]);
  };

  // 4. Assign City Manager to a new city area
  const handleAssignCity = (cmId, cityName, date) => {
    setCityManagers(prev => prev.map(cm => {
      if (cm.id === cmId) {
        return {
          ...cm,
          city: cityName,
          retailersCount: cm.retailersCount + 2, // Mock incremental count
          lastActive: date
        };
      }
      return cm;
    }));
  };

  // 5. Targets inline save
  const handleSaveTargets = (newTargets) => {
    setCityManagers(prev => prev.map(cm => {
      if (newTargets[cm.id] !== undefined) {
        return {
          ...cm,
          monthlyTarget: Number(newTargets[cm.id])
        };
      }
      return cm;
    }));
  };

  // 6. Notifications hub mark read
  const handleMarkRead = (notifId) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === notifId) {
        return { ...n, read: true };
      }
      return n;
    }));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Helper counts for layout badges
  const pendingApprovalsCount = pendingApprovals.length;
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Render active route components
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <Dashboard 
            cityManagers={cityManagers}
            retailers={retailers}
            orders={orders}
            monthlyRevenueData={monthlyRevenueData}
            cityPerformanceData={cityPerformanceData}
            fieldForceData={fieldForceData}
            onApprove={(id) => handleApproveApproval(id)}
            onReject={() => {
              // Trigger reject sequence on approvals tab
              handleTabChange("Approvals");
              showToast("Provide rejection reason in workspace card.", "info");
            }}
            onNavigate={handleTabChange}
          />
        );
      case 'City Managers':
        return (
          <CityManagers 
            cityManagers={cityManagers}
            retailers={retailers}
            onAssignCity={handleAssignCity}
            onNavigate={handleTabChange}
            showToast={showToast}
            initialCityFilter={cityFilterOverride}
          />
        );
      case 'Retailers':
        return (
          <Retailers 
            retailers={retailers}
            cityManagers={cityManagers}
            orders={orders}
            onApproveRetailer={handleApproveRetailer}
            onRejectRetailer={handleRejectRetailer}
            showToast={showToast}
          />
        );
      case 'Territory Map':
        return (
          <TerritoryMap 
            cityPerformanceData={cityPerformanceData}
            cityManagers={cityManagers}
            onNavigate={handleTabChange}
            onNavigateWithFilter={handleNavigateWithFilter}
          />
        );
      case 'Orders':
        return (
          <Orders 
            orders={orders}
            cityManagers={cityManagers}
            onApproveOrder={handleApproveOrder}
            onRejectOrder={handleRejectOrder}
            showToast={showToast}
          />
        );
      case 'Approvals':
        return (
          <Approvals 
            pendingApprovals={pendingApprovals}
            approvalHistory={approvalHistory}
            onApproveApproval={handleApproveApproval}
            onRejectApproval={handleRejectApproval}
            showToast={showToast}
          />
        );
      case 'Sales Monitoring':
        return (
          <SalesMonitoring 
            orders={orders}
            retailers={retailers}
            cityManagers={cityManagers}
            monthlyRevenueData={monthlyRevenueData}
            cityPerformanceData={cityPerformanceData}
            showToast={showToast}
          />
        );
      case 'Targets':
        return (
          <TargetManagement 
            cityManagers={cityManagers}
            onSaveTargets={handleSaveTargets}
            showToast={showToast}
          />
        );
      case 'Field Force':
        return (
          <FieldForce 
            fieldForceData={fieldForceData}
            showToast={showToast}
          />
        );
      case 'My Incentive':
        return (
          <MyIncentive 
            monthlyRevenueData={monthlyRevenueData}
            myIncentive={myIncentive}
            showToast={showToast}
          />
        );
      case 'Reports':
        return (
          <Reports 
            orders={orders}
            retailers={retailers}
            cityManagers={cityManagers}
            cityPerformanceData={cityPerformanceData}
            monthlyRevenueData={monthlyRevenueData}
            fieldForceData={fieldForceData}
            showToast={showToast}
          />
        );
      case 'Notifications':
        return (
          <NotificationsPage 
            notifications={notifications}
            onMarkRead={handleMarkRead}
            onMarkAllRead={handleMarkAllRead}
            showToast={showToast}
          />
        );
      default:
        return <div className="p-8 text-center text-xs font-semibold text-slate-400">Section coming soon!</div>;
    }
  };

  return (
    <StateManagerLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      pendingApprovalsCount={pendingApprovalsCount}
      unreadNotificationsCount={unreadNotificationsCount}
      onSwitchRole={onSwitchRole}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    >
      {loading ? (
        <SkeletonLoader type={activeTab === 'Dashboard' ? 'dashboard' : activeTab === 'City Managers' || activeTab === 'Retailers' || activeTab === 'Orders' ? 'table' : 'cards'} />
      ) : (
        renderActiveTab()
      )}
      
      {/* Toast Manager */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </StateManagerLayout>
  );
}
