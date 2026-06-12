export const mockInvoices = [
  {
    invoiceNumber: "INV-2026-001",
    orderId: "ORD-1001",
    date: "2026-06-02",
    dueDate: "2026-06-12",
    amount: 10423.73,
    gstAmount: 1876.27, // 18% GST
    total: 12300,
    status: "Paid",
    items: [
      { sku: "SKU-APX-8O", name: "AeroSport Running Shoes (Size 8 / Orange)", hsn: "64041190", quantity: 5, price: 1271.19, gstRate: 18, total: 7500 },
      { sku: "SKU-LOF-8T", name: "Urban Elite Leather Loafers (Size 8 / Tan)", hsn: "64039190", quantity: 2, price: 2033.90, gstRate: 18, total: 4800 }
    ]
  },
  {
    invoiceNumber: "INV-2026-002",
    orderId: "ORD-1002",
    date: "2026-06-04",
    dueDate: "2026-06-14",
    amount: 8466.10,
    gstAmount: 1523.90,
    total: 9990,
    status: "Paid",
    items: [
      { sku: "SKU-CNV-9W", name: "FlexiWalk Canvas Sneakers (Size 9 / White)", hsn: "64041190", quantity: 10, price: 846.61, gstRate: 18, total: 9990 }
    ]
  },
  {
    invoiceNumber: "INV-2026-003",
    orderId: "ORD-1003",
    date: "2026-06-08",
    dueDate: "2026-06-18",
    amount: 18474.58,
    gstAmount: 3325.42,
    total: 21800,
    status: "Pending",
    items: [
      { sku: "SKU-HKB-9B", name: "TrailBlazer Hiking Boots (Size 9 / Brown)", hsn: "64039190", quantity: 4, price: 2711.86, gstRate: 18, total: 12800 },
      { sku: "SKU-GYM-8V", name: "NeoLite Gym Trainers (Size 8 / Volt Green)", hsn: "64041190", quantity: 5, price: 1525.42, gstRate: 18, total: 9000 }
    ]
  },
  {
    invoiceNumber: "INV-2026-004",
    orderId: "ORD-1004",
    date: "2026-06-10",
    dueDate: "2026-06-20",
    amount: 13474.58,
    gstAmount: 2425.42,
    total: 15900,
    status: "Pending",
    items: [
      { sku: "SKU-OXF-8M", name: "Royal Oxford Dress Shoes (Size 8 / Mahogany)", hsn: "64039190", quantity: 3, price: 2457.63, gstRate: 18, total: 8700 },
      { sku: "SKU-SND-8B", name: "SunBreeze Cork Sandals (Size 8 / Beige)", hsn: "64029990", quantity: 6, price: 1016.95, gstRate: 18, total: 7200 }
    ]
  },
  {
    invoiceNumber: "INV-2026-005",
    orderId: "ORD-1005",
    date: "2026-06-10",
    dueDate: "2026-06-20",
    amount: 10169.49,
    gstAmount: 1830.51,
    total: 12000,
    status: "Pending",
    items: [
      { sku: "SKU-APX-9O", name: "AeroSport Running Shoes (Size 9 / Orange)", hsn: "64041190", quantity: 8, price: 1271.19, gstRate: 18, total: 12000 }
    ]
  },
  {
    invoiceNumber: "INV-2026-006",
    orderId: "ORD-1006",
    date: "2026-06-11",
    dueDate: "2026-06-21",
    amount: 6610.17,
    gstAmount: 1189.83,
    total: 7800,
    status: "Pending",
    items: [
      { sku: "SKU-TEN-8W", name: "Apex Court Tennis Shoes (Size 8 / White/Blue)", hsn: "64041190", quantity: 4, price: 1652.54, gstRate: 18, total: 7800 }
    ]
  },
  {
    invoiceNumber: "INV-2026-007",
    orderId: "ORD-1007",
    date: "2026-06-12",
    dueDate: "2026-06-22",
    amount: 8046.61,
    gstAmount: 1448.39,
    total: 9495,
    status: "Pending",
    items: [
      { sku: "SKU-APX-8O", name: "AeroSport Running Shoes (Size 8 / Orange)", hsn: "64041190", quantity: 3, price: 1271.19, gstRate: 18, total: 4500 },
      { sku: "SKU-CNV-8W", name: "FlexiWalk Canvas Sneakers (Size 8 / White)", hsn: "64041190", quantity: 5, price: 846.61, gstRate: 18, total: 4995 }
    ]
  },
  {
    invoiceNumber: "INV-2026-008",
    orderId: "ORD-1000", // Past order from May
    date: "2025-05-10",
    dueDate: "2025-05-20",
    amount: 15254.24,
    gstAmount: 2745.76,
    total: 18000,
    status: "Overdue",
    items: [
      { sku: "SKU-OXF-8B", name: "Royal Oxford Dress Shoes (Size 8 / Black)", hsn: "64039190", quantity: 6, price: 2542.37, gstRate: 18, total: 18000 }
    ]
  }
];
