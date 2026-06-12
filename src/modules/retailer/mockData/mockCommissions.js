export const mockCommissionSummary = {
  lifetimeEarned: 42500,
  thisMonthEarned: 8400,
  pendingSettlement: 3100,
  loyaltyPoints: 1250
};

export const mockCommissions = [
  {
    id: "COM-1001",
    orderId: "ORD-1001",
    productName: "AeroSport Running Shoes & Urban Elite Loafers",
    saleAmount: 12300,
    commissionRate: 5, // 5% for Gold
    commissionAmount: 615,
    status: "Settled",
    date: "2026-06-05"
  },
  {
    id: "COM-1002",
    orderId: "ORD-1002",
    productName: "FlexiWalk Canvas Sneakers",
    saleAmount: 9990,
    commissionRate: 5,
    commissionAmount: 499.50,
    status: "Settled",
    date: "2026-06-07"
  },
  {
    id: "COM-1003",
    orderId: "ORD-1003",
    productName: "TrailBlazer Hiking Boots & NeoLite Gym Trainers",
    saleAmount: 21800,
    commissionRate: 5,
    commissionAmount: 1090,
    status: "Pending", // Order is Shipped, not yet Delivered/Settled
    date: "2026-06-09"
  },
  {
    id: "COM-1004",
    orderId: "ORD-1004",
    productName: "Royal Oxford Dress Shoes & SunBreeze Cork Sandals",
    saleAmount: 15900,
    commissionRate: 5,
    commissionAmount: 795,
    status: "Pending",
    date: "2026-06-10"
  },
  {
    id: "COM-1005",
    orderId: "ORD-1005",
    productName: "AeroSport Running Shoes",
    saleAmount: 12000,
    commissionRate: 5,
    commissionAmount: 600,
    status: "Pending",
    date: "2026-06-10"
  },
  {
    id: "COM-1006",
    orderId: "ORD-1006",
    productName: "Apex Court Tennis Shoes",
    saleAmount: 7800,
    commissionRate: 5,
    commissionAmount: 390,
    status: "Pending",
    date: "2026-06-11"
  },
  {
    id: "COM-0999",
    orderId: "ORD-0990", // Past order from May
    productName: "NeoLite Gym Trainers",
    saleAmount: 36000,
    commissionRate: 5,
    commissionAmount: 1800,
    status: "Settled",
    date: "2026-05-25"
  },
  {
    id: "COM-0998",
    orderId: "ORD-0988", // Past order from May
    productName: "Urban Elite Leather Loafers",
    saleAmount: 48000,
    commissionRate: 5,
    commissionAmount: 2400,
    status: "Settled",
    date: "2026-05-18"
  }
];

export const mockRewardsHistory = [
  {
    date: "2026-06-05",
    description: "Points credited for order #ORD-1001",
    points: 123,
    type: "credit"
  },
  {
    date: "2026-06-07",
    description: "Points credited for order #ORD-1002",
    points: 100,
    type: "credit"
  },
  {
    date: "2026-06-10",
    description: "Redeemed points on brand-exclusive merchandise",
    points: -500,
    type: "debit"
  },
  {
    date: "2026-05-25",
    description: "Points credited for order #ORD-0990",
    points: 360,
    type: "credit"
  },
  {
    date: "2026-05-18",
    description: "Points credited for order #ORD-0988",
    points: 480,
    type: "credit"
  },
  {
    date: "2026-04-10",
    description: "Welcome Loyalty points allocation",
    points: 687,
    type: "credit"
  }
];
