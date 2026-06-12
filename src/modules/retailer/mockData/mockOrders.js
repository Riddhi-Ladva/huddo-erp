export const mockOrders = [
  {
    id: "ORD-1001",
    date: "2026-06-01",
    items: [
      { productId: "PROD-001", productName: "AeroSport Running Shoes", variant: "Size 8 / Orange", quantity: 5, price: 1500 },
      { productId: "PROD-002", productName: "Urban Elite Leather Loafers", variant: "Size 8 / Tan", quantity: 2, price: 2400 }
    ],
    totalAmount: 12300,
    paymentStatus: "Verified", // Verified / Pending / Rejected
    orderStatus: "Delivered", // Draft | Submitted | Approved | Processing | Packed | Shipped | Delivered | Cancelled | Returned
    utr: "UTR6002938101",
    paymentScreenshot: "https://images.unsplash.com/photo-1554224155-6f1d828236f2?w=500",
    notes: "Please deliver items between 10 AM and 5 PM.",
    timeline: [
      { status: "Submitted", timestamp: "2026-06-01 10:00 AM", description: "Order submitted by retailer" },
      { status: "Approved", timestamp: "2026-06-01 02:00 PM", description: "Order approved by City Manager" },
      { status: "Processing", timestamp: "2026-06-02 09:30 AM", description: "Order items allocated from inventory" },
      { status: "Packed", timestamp: "2026-06-02 04:00 PM", description: "Order packed and invoice generated" },
      { status: "Shipped", timestamp: "2026-06-03 11:00 AM", description: "Shipped via BlueDart Tracker: BD-882031" },
      { status: "Delivered", timestamp: "2026-06-05 02:30 PM", description: "Delivered and signed by Rajesh Kumar" }
    ]
  },
  {
    id: "ORD-1002",
    date: "2026-06-03",
    items: [
      { productId: "PROD-003", productName: "FlexiWalk Canvas Sneakers", variant: "Size 9 / White", quantity: 10, price: 999 }
    ],
    totalAmount: 9990,
    paymentStatus: "Verified",
    orderStatus: "Delivered",
    utr: "UTR6002938102",
    paymentScreenshot: "https://images.unsplash.com/photo-1554224155-6f1d828236f2?w=500",
    notes: "Requires urgent shipping.",
    timeline: [
      { status: "Submitted", timestamp: "2026-06-03 09:15 AM", description: "Order submitted by retailer" },
      { status: "Approved", timestamp: "2026-06-03 12:45 PM", description: "Order approved by City Manager" },
      { status: "Processing", timestamp: "2026-06-03 02:30 PM", description: "Order items allocated" },
      { status: "Packed", timestamp: "2026-06-03 05:00 PM", description: "Order packed" },
      { status: "Shipped", timestamp: "2026-06-04 10:00 AM", description: "Shipped via BlueDart" },
      { status: "Delivered", timestamp: "2026-06-06 01:15 PM", description: "Delivered and verified" }
    ]
  },
  {
    id: "ORD-1003",
    date: "2026-06-06",
    items: [
      { productId: "PROD-004", productName: "TrailBlazer Hiking Boots", variant: "Size 9 / Brown", quantity: 4, price: 3200 },
      { productId: "PROD-005", productName: "NeoLite Gym Trainers", variant: "Size 8 / Volt Green", quantity: 5, price: 1800 }
    ],
    totalAmount: 21800,
    paymentStatus: "Verified",
    orderStatus: "Shipped",
    utr: "UTR7001827403",
    paymentScreenshot: "https://images.unsplash.com/photo-1554224155-6f1d828236f2?w=500",
    notes: "",
    timeline: [
      { status: "Submitted", timestamp: "2026-06-06 04:30 PM", description: "Order submitted by retailer" },
      { status: "Approved", timestamp: "2026-06-07 10:00 AM", description: "Order approved" },
      { status: "Processing", timestamp: "2026-06-07 01:00 PM", description: "Items allocated" },
      { status: "Packed", timestamp: "2026-06-08 03:00 PM", description: "Packed in dispatch box" },
      { status: "Shipped", timestamp: "2026-06-09 11:30 AM", description: "Dispatched via Express Courier" }
    ]
  },
  {
    id: "ORD-1004",
    date: "2026-06-08",
    items: [
      { productId: "PROD-006", productName: "Royal Oxford Dress Shoes", variant: "Size 8 / Mahogany", quantity: 3, price: 2900 },
      { productId: "PROD-007", productName: "SunBreeze Cork Sandals", variant: "Size 8 / Beige", quantity: 6, price: 1200 }
    ],
    totalAmount: 15900,
    paymentStatus: "Verified",
    orderStatus: "Packed",
    utr: "UTR8004928194",
    paymentScreenshot: "https://images.unsplash.com/photo-1554224155-6f1d828236f2?w=500",
    notes: "Bubble wrap the Oxford shoes.",
    timeline: [
      { status: "Submitted", timestamp: "2026-06-08 11:00 AM", description: "Order submitted" },
      { status: "Approved", timestamp: "2026-06-08 02:30 PM", description: "Order approved" },
      { status: "Processing", timestamp: "2026-06-09 10:00 AM", description: "Allocating stocks" },
      { status: "Packed", timestamp: "2026-06-10 03:30 PM", description: "Packed, awaiting dispatch courier pickup" }
    ]
  },
  {
    id: "ORD-1005",
    date: "2026-06-09",
    items: [
      { productId: "PROD-001", productName: "AeroSport Running Shoes", variant: "Size 9 / Orange", quantity: 8, price: 1500 }
    ],
    totalAmount: 12000,
    paymentStatus: "Verified",
    orderStatus: "Processing",
    utr: "UTR9001928371",
    paymentScreenshot: "https://images.unsplash.com/photo-1554224155-6f1d828236f2?w=500",
    notes: "",
    timeline: [
      { status: "Submitted", timestamp: "2026-06-09 01:15 PM", description: "Order submitted" },
      { status: "Approved", timestamp: "2026-06-09 05:00 PM", description: "Order approved" },
      { status: "Processing", timestamp: "2026-06-10 09:00 AM", description: "Preparing components for packing" }
    ]
  },
  {
    id: "ORD-1006",
    date: "2026-06-10",
    items: [
      { productId: "PROD-008", productName: "Apex Court Tennis Shoes", variant: "Size 8 / White/Blue", quantity: 4, price: 1950 }
    ],
    totalAmount: 7800,
    paymentStatus: "Verified",
    orderStatus: "Approved",
    utr: "UTR9001928372",
    paymentScreenshot: "https://images.unsplash.com/photo-1554224155-6f1d828236f2?w=500",
    notes: "",
    timeline: [
      { status: "Submitted", timestamp: "2026-06-10 10:00 AM", description: "Order submitted by retailer" },
      { status: "Approved", timestamp: "2026-06-11 11:00 AM", description: "Order payment verified and approved" }
    ]
  },
  {
    id: "ORD-1007",
    date: "2026-06-11",
    items: [
      { productId: "PROD-001", productName: "AeroSport Running Shoes", variant: "Size 8 / Orange", quantity: 3, price: 1500 },
      { productId: "PROD-003", productName: "FlexiWalk Canvas Sneakers", variant: "Size 8 / White", quantity: 5, price: 999 }
    ],
    totalAmount: 9495,
    paymentStatus: "Pending",
    orderStatus: "Submitted",
    utr: "UTR0012938473",
    paymentScreenshot: "https://images.unsplash.com/photo-1554224155-6f1d828236f2?w=500",
    notes: "",
    timeline: [
      { status: "Submitted", timestamp: "2026-06-11 03:00 PM", description: "Order submitted, payment confirmation pending" }
    ]
  },
  {
    id: "ORD-1008",
    date: "2026-06-12",
    items: [
      { productId: "PROD-002", productName: "Urban Elite Leather Loafers", variant: "Size 8 / Tan", quantity: 10, price: 2400 }
    ],
    totalAmount: 24000,
    paymentStatus: "Pending",
    orderStatus: "Draft",
    utr: "",
    paymentScreenshot: "",
    notes: "Draft order for reference.",
    timeline: [
      { status: "Draft", timestamp: "2026-06-12 11:30 AM", description: "Order drafted" }
    ]
  },
  {
    id: "ORD-1009",
    date: "2026-05-15",
    items: [
      { productId: "PROD-003", productName: "FlexiWalk Canvas Sneakers", variant: "Size 8 / White", quantity: 6, price: 999 }
    ],
    totalAmount: 5994,
    paymentStatus: "Rejected",
    orderStatus: "Cancelled",
    utr: "BADUTR9999",
    paymentScreenshot: "https://images.unsplash.com/photo-1554224155-6f1d828236f2?w=500",
    notes: "Rejected due to invalid transaction reference.",
    timeline: [
      { status: "Submitted", timestamp: "2026-05-15 09:00 AM", description: "Order submitted" },
      { status: "Cancelled", timestamp: "2026-05-16 02:00 PM", description: "Order cancelled - payment verification failed" }
    ]
  },
  {
    id: "ORD-1010",
    date: "2026-05-20",
    items: [
      { productId: "PROD-005", productName: "NeoLite Gym Trainers", variant: "Size 8 / Volt Green", quantity: 4, price: 1800 }
    ],
    totalAmount: 7200,
    paymentStatus: "Verified",
    orderStatus: "Returned",
    utr: "UTR5002938188",
    paymentScreenshot: "https://images.unsplash.com/photo-1554224155-6f1d828236f2?w=500",
    notes: "Returned due to incorrect sizes shipped.",
    timeline: [
      { status: "Submitted", timestamp: "2026-05-20 10:00 AM", description: "Order submitted" },
      { status: "Approved", timestamp: "2026-05-20 04:00 PM", description: "Approved" },
      { status: "Processing", timestamp: "2026-05-21 09:00 AM", description: "Processing completed" },
      { status: "Packed", timestamp: "2026-05-21 02:00 PM", description: "Packed" },
      { status: "Shipped", timestamp: "2026-05-22 10:00 AM", description: "Shipped" },
      { status: "Delivered", timestamp: "2026-05-24 12:00 PM", description: "Delivered" },
      { status: "Returned", timestamp: "2026-05-28 04:00 PM", description: "Retailer returned order; stock received and credit note created" }
    ]
  }
];
