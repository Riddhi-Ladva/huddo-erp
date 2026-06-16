// stateManagerMockData.js (mockData.js)

export const currentStateManager = {
  id: "SM001",
  name: "Rajesh Mehta",
  email: "rajesh.mehta@huddoshoes.com",
  mobile: "+91 98765 43210",
  state: "Gujarat",
  stateCode: "GJ",
  reportingTo: "Vikram Shah (Country Manager - India)",
  joiningDate: "2022-03-15",
  employeeId: "EMP-SM-001",
  avatar: null,
  incentiveSlab: "Slab B - 4% of state revenue above ₹10L/month"
};

export const cityManagers = [
  { id: "CM001", name: "Arjun Patel", city: "Ahmedabad", mobile: "+91 91234 56789", email: "arjun@huddoshoes.com", joiningDate: "2022-06-01", status: "Active", retailersCount: 42, monthlyTarget: 500000, achieved: 423000, ordersThisMonth: 87, lastActive: "2026-06-13" },
  { id: "CM002", name: "Priya Desai", city: "Surat", mobile: "+91 93456 78901", email: "priya@huddoshoes.com", joiningDate: "2023-01-15", status: "Active", retailersCount: 35, monthlyTarget: 400000, achieved: 398000, ordersThisMonth: 74, lastActive: "2026-06-13" },
  { id: "CM003", name: "Karan Shah", city: "Vadodara", mobile: "+91 94567 89012", email: "karan@huddoshoes.com", joiningDate: "2022-09-10", status: "Active", retailersCount: 28, monthlyTarget: 350000, achieved: 287000, ordersThisMonth: 61, lastActive: "2026-06-12" },
  { id: "CM004", name: "Neha Joshi", city: "Rajkot", mobile: "+91 95678 90123", email: "neha@huddoshoes.com", joiningDate: "2023-05-20", status: "Active", retailersCount: 22, monthlyTarget: 280000, achieved: 265000, ordersThisMonth: 49, lastActive: "2026-06-13" },
  { id: "CM005", name: "Mihir Trivedi", city: "Morbi", mobile: "+91 96789 01234", email: "mihir@huddoshoes.com", joiningDate: "2023-08-01", status: "Active", retailersCount: 18, monthlyTarget: 220000, achieved: 134000, ordersThisMonth: 33, lastActive: "2026-06-11" },
  { id: "CM006", name: "Swati Raval", city: "Bhavnagar", mobile: "+91 97890 12345", email: "swati@huddoshoes.com", joiningDate: "2024-01-10", status: "Inactive", retailersCount: 14, monthlyTarget: 180000, achieved: 0, ordersThisMonth: 0, lastActive: "2026-05-28" },
];

export const retailers = [
  { id: "R001", businessName: "Patel Footwear", ownerName: "Dinesh Patel", city: "Ahmedabad", cityManagerId: "CM001", mobile: "+91 98001 11001", gstin: "24ABCDE1234F1Z5", category: "Platinum", status: "Active", totalOrders: 34, totalRevenue: 187000, pendingPayment: 12000, joinedDate: "2021-04-10", lastOrderDate: "2026-06-10" },
  { id: "R002", businessName: "Star Shoes", ownerName: "Ramesh Kumar", city: "Ahmedabad", cityManagerId: "CM001", mobile: "+91 98002 22002", gstin: "24FGHIJ5678K2Z6", category: "Gold", status: "Active", totalOrders: 22, totalRevenue: 98000, pendingPayment: 0, joinedDate: "2022-01-15", lastOrderDate: "2026-06-08" },
  { id: "R003", businessName: "Surat Sole House", ownerName: "Kavita Mehta", city: "Surat", cityManagerId: "CM002", mobile: "+91 98003 33003", gstin: "24KLMNO9012L3Z7", category: "Gold", status: "Active", totalOrders: 19, totalRevenue: 76000, pendingPayment: 8500, joinedDate: "2022-07-20", lastOrderDate: "2026-06-09" },
  { id: "R004", businessName: "Vadodara Walkers", ownerName: "Suresh Jain", city: "Vadodara", cityManagerId: "CM003", mobile: "+91 98004 44004", gstin: "24PQRST3456M4Z8", category: "Silver", status: "Active", totalOrders: 14, totalRevenue: 54000, pendingPayment: 4200, joinedDate: "2023-02-05", lastOrderDate: "2026-06-05" },
  { id: "R005", businessName: "Rajkot Step In", ownerName: "Bhavna Shah", city: "Rajkot", cityManagerId: "CM004", mobile: "+91 98005 55005", gstin: "24UVWXY7890N5Z9", category: "Silver", status: "Active", totalOrders: 11, totalRevenue: 42000, pendingPayment: 0, joinedDate: "2023-06-12", lastOrderDate: "2026-06-03" },
  { id: "R006", businessName: "New Era Footwear", ownerName: "Prakash Trivedi", city: "Morbi", cityManagerId: "CM005", mobile: "+91 98006 66006", gstin: "24ZABCD1234O6Z1", category: "Standard", status: "Pending Verification", totalOrders: 0, totalRevenue: 0, pendingPayment: 0, joinedDate: "2026-06-01", lastOrderDate: null },
  { id: "R007", businessName: "Classic Comfort", ownerName: "Anita Solanki", city: "Ahmedabad", cityManagerId: "CM001", mobile: "+91 98007 77007", gstin: "24EFGHI5678P7Z2", category: "Gold", status: "Active", totalOrders: 27, totalRevenue: 138000, pendingPayment: 19000, joinedDate: "2021-11-30", lastOrderDate: "2026-06-11" },
  { id: "R008", businessName: "Surat Comfort Walk", ownerName: "Jigar Patel", city: "Surat", cityManagerId: "CM002", mobile: "+91 98008 88008", gstin: "24JKLMN9012Q8Z3", category: "Standard", status: "Active", totalOrders: 8, totalRevenue: 28000, pendingPayment: 0, joinedDate: "2024-03-15", lastOrderDate: "2026-05-28" },
];

export const orders = [
  { id: "ORD-2026-0541", retailerId: "R001", retailerName: "Patel Footwear", city: "Ahmedabad", amount: 32500, status: "Pending Approval", paymentStatus: "Paid", utr: "UTR20260610001", orderDate: "2026-06-10", items: 8, requiresStateApproval: true },
  { id: "ORD-2026-0539", retailerId: "R007", retailerName: "Classic Comfort", city: "Ahmedabad", amount: 18200, status: "Approved", paymentStatus: "Paid", utr: "UTR20260609002", orderDate: "2026-06-09", items: 5, requiresStateApproval: false },
  { id: "ORD-2026-0537", retailerId: "R003", retailerName: "Surat Sole House", city: "Surat", amount: 41000, status: "Pending Approval", paymentStatus: "Paid", utr: "UTR20260608003", orderDate: "2026-06-08", items: 11, requiresStateApproval: true },
  { id: "ORD-2026-0534", retailerId: "R002", retailerName: "Star Shoes", city: "Ahmedabad", amount: 15600, status: "Shipped", paymentStatus: "Paid", utr: "UTR20260607004", orderDate: "2026-06-07", items: 4, requiresStateApproval: false },
  { id: "ORD-2026-0530", retailerId: "R004", retailerName: "Vadodara Walkers", city: "Vadodara", amount: 22800, status: "Delivered", paymentStatus: "Paid", utr: "UTR20260605005", orderDate: "2026-06-05", items: 7, requiresStateApproval: false },
  { id: "ORD-2026-0528", retailerId: "R005", retailerName: "Rajkot Step In", city: "Rajkot", amount: 9400, status: "Processing", paymentStatus: "Paid", utr: "UTR20260603006", orderDate: "2026-06-03", items: 3, requiresStateApproval: false },
  { id: "ORD-2026-0520", retailerId: "R001", retailerName: "Patel Footwear", city: "Ahmedabad", amount: 55000, status: "Pending Approval", paymentStatus: "Paid", utr: "UTR20260601007", orderDate: "2026-06-01", items: 14, requiresStateApproval: true },
];

export const monthlyRevenueData = [
  { month: "Jul'25", revenue: 780000, target: 900000 },
  { month: "Aug'25", revenue: 920000, target: 900000 },
  { month: "Sep'25", revenue: 860000, target: 950000 },
  { month: "Oct'25", revenue: 1050000, target: 950000 },
  { month: "Nov'25", revenue: 1120000, target: 1000000 },
  { month: "Dec'25", revenue: 1380000, target: 1000000 },
  { month: "Jan'26", revenue: 890000, target: 1100000 },
  { month: "Feb'26", revenue: 940000, target: 1100000 },
  { month: "Mar'26", revenue: 1010000, target: 1100000 },
  { month: "Apr'26", revenue: 1180000, target: 1200000 },
  { month: "May'26", revenue: 1240000, target: 1200000 },
  { month: "Jun'26", revenue: 1507000, target: 1300000 },
];

export const cityPerformanceData = [
  { city: "Ahmedabad", revenue: 648000, target: 750000, retailers: 42, orders: 87 },
  { city: "Surat", revenue: 473000, target: 500000, retailers: 35, orders: 74 },
  { city: "Vadodara", revenue: 287000, target: 350000, retailers: 28, orders: 61 },
  { city: "Rajkot", revenue: 265000, target: 280000, retailers: 22, orders: 49 },
  { city: "Morbi", revenue: 134000, target: 220000, retailers: 18, orders: 33 },
  { city: "Bhavnagar", revenue: 0, target: 180000, retailers: 14, orders: 0 },
];

export const fieldForceData = [
  { id: "FF001", name: "Arjun Patel", role: "City Manager", city: "Ahmedabad", lastLocation: "CG Road, Ahmedabad", lastActive: "2026-06-13 14:32", todayVisits: 6, distanceKm: 38, clockIn: "09:05", clockOut: null, status: "Active" },
  { id: "FF002", name: "Priya Desai", role: "City Manager", city: "Surat", lastLocation: "Ring Road, Surat", lastActive: "2026-06-13 13:45", todayVisits: 5, distanceKm: 27, clockIn: "09:15", clockOut: null, status: "Active" },
  { id: "FF003", name: "Karan Shah", role: "City Manager", city: "Vadodara", lastLocation: "Alkapuri, Vadodara", lastActive: "2026-06-13 12:10", todayVisits: 4, distanceKm: 22, clockIn: "09:30", clockOut: null, status: "Active" },
  { id: "FF004", name: "Neha Joshi", role: "City Manager", city: "Rajkot", lastLocation: "150 Ft Ring Road, Rajkot", lastActive: "2026-06-13 11:55", todayVisits: 3, distanceKm: 15, clockIn: "10:00", clockOut: null, status: "Active" },
  { id: "FF005", name: "Mihir Trivedi", role: "City Manager", city: "Morbi", lastLocation: "Morbi Ceramic Zone", lastActive: "2026-06-12 16:45", todayVisits: 0, distanceKm: 0, clockIn: null, clockOut: null, status: "Not Checked In" },
];

export const pendingApprovals = [
  { id: "APR001", type: "Large Order", orderId: "ORD-2026-0541", retailer: "Patel Footwear", city: "Ahmedabad", amount: 32500, requestedBy: "Arjun Patel (City Manager)", date: "2026-06-10", urgency: "High" },
  { id: "APR002", type: "Large Order", orderId: "ORD-2026-0537", retailer: "Surat Sole House", city: "Surat", amount: 41000, requestedBy: "Priya Desai (City Manager)", date: "2026-06-08", urgency: "High" },
  { id: "APR003", type: "Large Order", orderId: "ORD-2026-0520", retailer: "Patel Footwear", city: "Ahmedabad", amount: 55000, requestedBy: "Arjun Patel (City Manager)", date: "2026-06-01", urgency: "Medium" },
  { id: "APR004", type: "Retailer Registration", retailer: "New Era Footwear", city: "Morbi", requestedBy: "Mihir Trivedi (City Manager)", date: "2026-06-01", urgency: "Low" },
];

export const stateTargets = {
  monthly: { target: 1300000, achieved: 1507000, period: "June 2026" },
  quarterly: { target: 3600000, achieved: 3731000, period: "Q1 FY2026-27" },
  yearly: { target: 14000000, achieved: 11287000, period: "FY2026-27" },
  kpis: {
    achievementPct: 115.9,
    revenueGrowth: 21.5,
    orderCount: 304,
    retailerAcquisition: 3,
    marketExpansion: 2
  }
};

export const myIncentive = {
  slab: "Slab B",
  rule: "4% of state revenue above ₹10,00,000 per month",
  thisMonthRevenue: 1507000,
  thisMonthEarned: 20280,
  lastMonthEarned: 19360,
  ytdEarned: 112400,
  status: "Pending Payout",
  payoutDate: "Last working day of June"
};

export const notifications = [
  { id: "N001", type: "approval", message: "Large order ORD-2026-0541 from Patel Footwear awaiting your approval", time: "2 hours ago", read: false },
  { id: "N002", type: "target", message: "Congratulations! Gujarat state has exceeded June monthly target by 15.9%", time: "Today 10:00", read: false },
  { id: "N003", type: "order", message: "Order ORD-2026-0537 (₹41,000) from Surat Sole House awaiting approval", time: "Yesterday", read: true },
  { id: "N004", type: "alert", message: "Morbi city has achieved only 60.9% of monthly target. 18 days remaining.", time: "2 days ago", read: true },
  { id: "N005", type: "system", message: "Monthly performance report for May 2026 is ready to download", time: "3 days ago", read: true },
];
