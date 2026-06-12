import React, { createContext, useContext, useState, useEffect } from 'react';

const RetailerAuthContext = createContext();

export const RetailerAuthProvider = ({ children, currentRole = "retailer" }) => {
  const [user, setUser] = useState({
    id: "RTL-001",
    name: "Raj Footwear",
    role: currentRole,
    category: "Gold",
    cityManagerId: "CM-007",
    promoterId: "PRO-003"
  });

  // Keep role in sync if it is changed from the main App header role-selector
  useEffect(() => {
    setUser(prev => ({ ...prev, role: currentRole.toLowerCase() }));
  }, [currentRole]);

  return (
    <RetailerAuthContext.Provider value={{ user }}>
      {children}
    </RetailerAuthContext.Provider>
  );
};

export const useRetailerAuth = () => {
  const context = useContext(RetailerAuthContext);
  if (!context) {
    throw new Error("useRetailerAuth must be used within a RetailerAuthProvider");
  }
  return context;
};
