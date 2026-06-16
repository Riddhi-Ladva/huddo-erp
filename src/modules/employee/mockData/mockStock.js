export const mockWarehouses = [
  { id: "WH-001", name: "Mumbai Central Hub", location: "Thane, Maharashtra", capacity: 50000, used: 38000, itemsCount: 15400 },
  { id: "WH-002", name: "Gujarat Roster Depot", location: "Sanand, Ahmedabad", capacity: 30000, used: 12000, itemsCount: 4800 },
  { id: "WH-003", name: "Delhi North Store", location: "Okhla, New Delhi", capacity: 40000, used: 35000, itemsCount: 14100 }
];

export const mockStock = [
  { id: "STK-001", productName: "Huddo Running Shoes Blue", sku: "HS-RS-BL-09", category: "Sports", size: "9", color: "Blue", currentStock: 450, minLevel: 100, status: "In Stock", warehouseId: "WH-001" },
  { id: "STK-002", productName: "Huddo Running Shoes Blue", sku: "HS-RS-BL-10", category: "Sports", size: "10", color: "Blue", currentStock: 75, minLevel: 100, status: "Low Stock", warehouseId: "WH-001" },
  { id: "STK-003", productName: "Huddo Casual Sneakers White", sku: "HS-CS-WT-08", category: "Casual", size: "8", color: "White", currentStock: 120, minLevel: 50, status: "In Stock", warehouseId: "WH-002" },
  { id: "STK-004", productName: "Huddo Casual Sneakers White", sku: "HS-CS-WT-09", category: "Casual", size: "9", color: "White", currentStock: 30, minLevel: 50, status: "Low Stock", warehouseId: "WH-002" },
  { id: "STK-005", productName: "Huddo Leather Boots Black", sku: "HS-LB-BK-09", category: "Formal", size: "9", color: "Black", currentStock: 80, minLevel: 40, status: "In Stock", warehouseId: "WH-003" },
  { id: "STK-006", productName: "Huddo Leather Boots Black", sku: "HS-LB-BK-10", category: "Formal", size: "10", color: "Black", currentStock: 15, minLevel: 40, status: "Low Stock", warehouseId: "WH-003" },
  { id: "STK-007", productName: "Huddo Comfort Slides Grey", sku: "HS-CS-GY-08", category: "Slides", size: "8", color: "Grey", currentStock: 300, minLevel: 150, status: "In Stock", warehouseId: "WH-001" },
  { id: "STK-008", productName: "Huddo Comfort Slides Grey", sku: "HS-CS-GY-09", category: "Slides", size: "9", color: "Grey", currentStock: 0, minLevel: 150, status: "Out of Stock", warehouseId: "WH-001" },
  { id: "STK-009", productName: "Huddo Sports Grip Yellow", sku: "HS-SG-YL-08", category: "Sports", size: "8", color: "Yellow", currentStock: 180, minLevel: 80, status: "In Stock", warehouseId: "WH-003" },
  { id: "STK-010", productName: "Huddo Sports Grip Yellow", sku: "HS-SG-YL-09", category: "Sports", size: "9", color: "Yellow", currentStock: 5, minLevel: 80, status: "Low Stock", warehouseId: "WH-003" },
  { id: "STK-011", productName: "Huddo Tennis Court Pro Red", sku: "HS-TC-RD-09", category: "Sports", size: "9", color: "Red", currentStock: 110, minLevel: 40, status: "In Stock", warehouseId: "WH-002" },
  { id: "STK-012", productName: "Huddo Tennis Court Pro Red", sku: "HS-TC-RD-10", category: "Sports", size: "10", color: "Red", currentStock: 0, minLevel: 40, status: "Out of Stock", warehouseId: "WH-002" }
];

export const mockTransfers = [
  { id: "TR-501", fromWarehouse: "Mumbai Central Hub", toWarehouse: "Gujarat Roster Depot", product: "Huddo Running Shoes Blue (Size 9)", quantity: 150, status: "Completed", date: "2026-06-10" },
  { id: "TR-502", fromWarehouse: "Delhi North Store", toWarehouse: "Mumbai Central Hub", product: "Huddo Sports Grip Yellow (Size 8)", quantity: 50, status: "In Transit", date: "2026-06-14" },
  { id: "TR-503", fromWarehouse: "Mumbai Central Hub", toWarehouse: "Delhi North Store", product: "Huddo Comfort Slides Grey (Size 8)", quantity: 100, status: "Requested", date: "2026-06-16" }
];
