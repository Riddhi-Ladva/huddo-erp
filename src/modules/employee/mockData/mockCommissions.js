export const mockCommissions = {
  summary: {
    lifetimeEarned: 145000,
    thisMonthEarned: 12500,
    pendingSettlement: 9800
  },
  records: [
    { id: "COMM-201", orderId: "ORD-9001", saleAmount: 45000, percentage: 5.0, amount: 2250, status: "Settled", date: "2026-06-16" },
    { id: "COMM-202", orderId: "ORD-9002", saleAmount: 12000, percentage: 5.0, amount: 600, status: "Settled", date: "2026-06-15" },
    { id: "COMM-203", orderId: "ORD-9003", saleAmount: 25000, percentage: 5.0, amount: 1250, status: "Pending", date: "2026-06-14" },
    { id: "COMM-204", orderId: "ORD-9004", saleAmount: 8000, percentage: 5.0, amount: 400, status: "Pending", date: "2026-06-14" },
    { id: "COMM-205", orderId: "ORD-9006", saleAmount: 35000, percentage: 5.0, amount: 1750, status: "Settled", date: "2026-06-12" },
    { id: "COMM-206", orderId: "ORD-9007", saleAmount: 60000, percentage: 4.5, amount: 2700, status: "Settled", date: "2026-06-11" },
    { id: "COMM-207", orderId: "ORD-9008", saleAmount: 18000, percentage: 5.0, amount: 900, status: "Settled", date: "2026-06-10" },
    { id: "COMM-208", orderId: "ORD-9010", saleAmount: 21000, percentage: 5.0, amount: 1050, status: "Pending", date: "2026-06-08" },
    { id: "COMM-209", orderId: "ORD-9011", saleAmount: 32000, percentage: 5.0, amount: 1600, status: "Pending", date: "2026-06-07" },
    { id: "COMM-210", orderId: "ORD-9012", saleAmount: 9000, percentage: 5.0, amount: 450, status: "Settled", date: "2026-06-06" }
  ],
  bonuses: [
    { id: "BON-01", description: "Q3 Performance Bonus", amount: 5000, status: "Settled", date: "2026-05-30" },
    { id: "BON-02", description: "Highest Regional Sales Incentive", amount: 3000, status: "Settled", date: "2026-04-15" }
  ]
};
