import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockEmployees } from '../mockData/mockEmployee';

const EmployeeAuthContext = createContext();

export function EmployeeAuthProvider({ children, initialRole = 'sales_executive', onRoleChange }) {
  // Try to load cached role, or default to initialRole
  const [activeRole, setActiveRoleState] = useState(() => {
    // Map human readable role names from App.jsx to match mock keys if necessary
    const cleaned = (initialRole || '').toLowerCase().replace(' ', '_');
    return mockEmployees[cleaned] ? cleaned : 'sales_executive';
  });

  const [currentEmployee, setCurrentEmployee] = useState(() => {
    return mockEmployees[activeRole] || mockEmployees.sales_executive;
  });

  // Sync state if initialRole changes from parent App.jsx
  useEffect(() => {
    if (initialRole) {
      const cleaned = initialRole.toLowerCase().replace(' ', '_');
      if (mockEmployees[cleaned] && cleaned !== activeRole) {
        setActiveRoleState(cleaned);
        setCurrentEmployee(mockEmployees[cleaned]);
      }
    }
  }, [initialRole]);

  const switchRole = (roleKey) => {
    if (mockEmployees[roleKey]) {
      setActiveRoleState(roleKey);
      setCurrentEmployee(mockEmployees[roleKey]);
      
      // Notify parent App.jsx if callback is provided
      if (onRoleChange) {
        // Map back to human readable role for App.jsx
        const labelMap = {
          sales_executive: "Sales Executive",
          sales_manager: "Sales Manager",
          hr_manager: "HR Manager",
          finance_manager: "Finance Manager",
          inventory_manager: "Inventory Manager",
          purchase_manager: "Purchase Manager",
          team_member: "Team Member"
        };
        onRoleChange(labelMap[roleKey] || roleKey);
      }
    }
  };

  return (
    <EmployeeAuthContext.Provider value={{ currentEmployee, activeRole, switchRole, setCurrentEmployee }}>
      {children}
    </EmployeeAuthContext.Provider>
  );
}

export function useEmployeeAuth() {
  const context = useContext(EmployeeAuthContext);
  if (!context) {
    throw new Error('useEmployeeAuth must be used within an EmployeeAuthProvider');
  }
  return context;
}
