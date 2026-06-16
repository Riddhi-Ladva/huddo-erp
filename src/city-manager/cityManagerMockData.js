// src/city-manager/cityManagerMockData.js

export const currentCityManager = {
  id: "CM001",
  name: "Arjun Patel",
  email: "arjun.patel@huddoshoes.com",
  mobile: "+91 91234 56789",
  city: "Ahmedabad",
  state: "Gujarat",
  employeeId: "EMP-CM-001",
  joiningDate: "2022-06-01",
  reportingTo: "Rajesh Mehta (State Manager — Gujarat)",
  avatar: null,
  incentiveSlab: "Slab C — 3% of city revenue above ₹4,00,000/month"
};

export const retailers = [
  {
    id: "R001",
    businessName: "Patel Footwear",
    ownerName: "Dinesh Patel",
    mobile: "+91 98001 11001",
    email: "dinesh@patelfootwear.com",
    shopAddress: "Shop 12, CG Road, Navrangpura, Ahmedabad",
    gstin: "24ABCDE1234F1Z5",
    pan: "ABCDE1234F",
    aadhaar: "XXXX-XXXX-1001",
    shopPhoto: null,
    category: "Platinum",
    status: "Active",
    assignedPromoter: "Suresh Promoter",
    totalOrders: 34,
    totalRevenue: 187000,
    pendingPayment: 12000,
    joinedDate: "2021-04-10",
    lastOrderDate: "2026-06-10",
    lastVisitDate: "2026-06-08",
    communicationHistory: [
      { date: "2026-06-08", type: "Visit", note: "Discussed new summer collection, placed pre-order intent" },
      { date: "2026-05-22", type: "Call", note: "Followed up on outstanding payment of ₹12,000" },
      { date: "2026-05-10", type: "Visit", note: "Delivered scheme booklet for May promo" }
    ]
  },
  {
    id: "R002",
    businessName: "Star Shoes",
    ownerName: "Ramesh Kumar",
    mobile: "+91 98002 22002",
    email: "ramesh@starshoes.com",
    shopAddress: "42, Vastrapur Lake Road, Vastrapur, Ahmedabad",
    gstin: "24FGHIJ5678K2Z6",
    pan: "FGHIJ5678K",
    aadhaar: "XXXX-XXXX-2002",
    shopPhoto: null,
    category: "Gold",
    status: "Active",
    assignedPromoter: "Suresh Promoter",
    totalOrders: 22,
    totalRevenue: 98000,
    pendingPayment: 0,
    joinedDate: "2022-01-15",
    lastOrderDate: "2026-06-08",
    lastVisitDate: "2026-06-05",
    communicationHistory: [
      { date: "2026-06-05", type: "Visit", note: "Reviewed slow-moving SKUs, suggested reorder plan" },
      { date: "2026-05-18", type: "Call", note: "Informed about June discount scheme" }
    ]
  },
  {
    id: "R003",
    businessName: "Classic Comfort",
    ownerName: "Anita Solanki",
    mobile: "+91 98007 77007",
    email: "anita@classiccomfort.com",
    shopAddress: "18, Satellite Road, Satellite, Ahmedabad",
    gstin: "24EFGHI5678P7Z2",
    pan: "EFGHI5678P",
    aadhaar: "XXXX-XXXX-3003",
    shopPhoto: null,
    category: "Gold",
    status: "Active",
    assignedPromoter: "Mukesh Promoter",
    totalOrders: 27,
    totalRevenue: 138000,
    pendingPayment: 19000,
    joinedDate: "2021-11-30",
    lastOrderDate: "2026-06-11",
    lastVisitDate: "2026-06-09",
    communicationHistory: [
      { date: "2026-06-09", type: "Visit", note: "Outstanding ₹19,000 discussed. Committed payment by 20th June" },
      { date: "2026-06-01", type: "Call", note: "Enquiry about new kids collection arrival date" }
    ]
  },
  {
    id: "R004",
    businessName: "Metro Walk",
    ownerName: "Vijay Nair",
    mobile: "+91 98003 33003",
    email: "vijay@metrowalk.com",
    shopAddress: "7, Ashram Road, Usmanpura, Ahmedabad",
    gstin: "24HIJKL9012M3Z8",
    pan: "HIJKL9012M",
    aadhaar: "XXXX-XXXX-4004",
    shopPhoto: null,
    category: "Silver",
    status: "Active",
    assignedPromoter: "Suresh Promoter",
    totalOrders: 15,
    totalRevenue: 62000,
    pendingPayment: 0,
    joinedDate: "2023-03-10",
    lastOrderDate: "2026-05-28",
    lastVisitDate: "2026-06-03",
    communicationHistory: [
      { date: "2026-06-03", type: "Visit", note: "Introduced to new sports range. Interested in 2 models." }
    ]
  },
  {
    id: "R005",
    businessName: "Footstep Fashion",
    ownerName: "Preeti Shah",
    mobile: "+91 98004 44004",
    email: "preeti@footstepfashion.com",
    shopAddress: "23, Prahlad Nagar Garden Road, Prahlad Nagar, Ahmedabad",
    gstin: "24MNOPQ3456N4Z9",
    pan: "MNOPQ3456N",
    aadhaar: "XXXX-XXXX-5005",
    shopPhoto: null,
    category: "Silver",
    status: "Active",
    assignedPromoter: "Mukesh Promoter",
    totalOrders: 12,
    totalRevenue: 48000,
    pendingPayment: 5500,
    joinedDate: "2023-07-22",
    lastOrderDate: "2026-06-02",
    lastVisitDate: "2026-05-30",
    communicationHistory: [
      { date: "2026-05-30", type: "Visit", note: "Low stock noticed. Urged to place order before June scheme ends." }
    ]
  },
  {
    id: "R006",
    businessName: "Urban Sole",
    ownerName: "Deepak Mishra",
    mobile: "+91 98005 55005",
    email: "deepak@urbansole.com",
    shopAddress: "5, Bodakdev Main Road, Bodakdev, Ahmedabad",
    gstin: "24RSTUV7890O5Z1",
    pan: "RSTUV7890O",
    aadhaar: "XXXX-XXXX-6006",
    shopPhoto: null,
    category: "Standard",
    status: "Active",
    assignedPromoter: "Suresh Promoter",
    totalOrders: 7,
    totalRevenue: 26000,
    pendingPayment: 0,
    joinedDate: "2024-01-08",
    lastOrderDate: "2026-05-15",
    lastVisitDate: "2026-05-20",
    communicationHistory: []
  },
  {
    id: "R007",
    businessName: "Sunrise Footwear",
    ownerName: "Harish Gupta",
    mobile: "+91 98006 66006",
    email: "harish@sunrisefootwear.com",
    shopAddress: "11, New CG Road, Chandkheda, Ahmedabad",
    gstin: "24WXYZ12345P6Z2",
    pan: "WXYZ12345P",
    aadhaar: "XXXX-XXXX-7007",
    shopPhoto: null,
    category: "Standard",
    status: "Pending Verification",
    assignedPromoter: "Mukesh Promoter",
    totalOrders: 0,
    totalRevenue: 0,
    pendingPayment: 0,
    joinedDate: "2026-06-10",
    lastOrderDate: null,
    lastVisitDate: "2026-06-10",
    communicationHistory: [
      { date: "2026-06-10", type: "Visit", note: "Onboarded during field visit. KYC documents collected." }
    ]
  }
];

export const orders = [
  { id: "ORD-2026-0541", retailerId: "R001", retailerName: "Patel Footwear", amount: 32500, status: "Pending Approval", paymentStatus: "Paid", utr: "UTR20260610001", orderDate: "2026-06-10", items: [{ product: "Huddo Sport X1", size: 8, color: "Black", qty: 6, price: 2800 }, { product: "Huddo Classic W2", size: 7, color: "White", qty: 10, price: 1450 }], requiresCityApproval: true, paymentScreenshot: null },
  { id: "ORD-2026-0539", retailerId: "R003", retailerName: "Classic Comfort", amount: 18200, status: "Approved", paymentStatus: "Paid", utr: "UTR20260609002", orderDate: "2026-06-09", items: [{ product: "Huddo Kids K3", size: 4, color: "Pink", qty: 12, price: 950 }, { product: "Huddo Formal F1", size: 9, color: "Brown", qty: 5, price: 1900 }], requiresCityApproval: false, paymentScreenshot: null },
  { id: "ORD-2026-0537", retailerId: "R002", retailerName: "Star Shoes", amount: 15600, status: "Processing", paymentStatus: "Paid", utr: "UTR20260608003", orderDate: "2026-06-08", items: [{ product: "Huddo Sport X1", size: 9, color: "Blue", qty: 4, price: 2800 }, { product: "Huddo Casual C2", size: 8, color: "Grey", qty: 6, price: 1200 }], requiresCityApproval: false, paymentScreenshot: null },
  { id: "ORD-2026-0530", retailerId: "R001", retailerName: "Patel Footwear", amount: 55000, status: "Pending Approval", paymentStatus: "Paid", utr: "UTR20260601007", orderDate: "2026-06-01", items: [{ product: "Huddo Premium P1", size: 10, color: "Black", qty: 20, price: 2750 }], requiresCityApproval: true, paymentScreenshot: null },
  { id: "ORD-2026-0522", retailerId: "R004", retailerName: "Metro Walk", amount: 9400, status: "Shipped", paymentStatus: "Paid", utr: "UTR20260525001", orderDate: "2026-05-25", items: [{ product: "Huddo Casual C2", size: 7, color: "Brown", qty: 5, price: 1200 }, { product: "Huddo Kids K3", size: 3, color: "Blue", qty: 8, price: 950 }], requiresCityApproval: false, paymentScreenshot: null },
  { id: "ORD-2026-0510", retailerId: "R005", retailerName: "Footstep Fashion", amount: 7800, status: "Delivered", paymentStatus: "Paid", utr: "UTR20260518002", orderDate: "2026-05-18", items: [{ product: "Huddo Classic W2", size: 6, color: "Beige", qty: 6, price: 1450 }], requiresCityApproval: false, paymentScreenshot: null },
  { id: "ORD-2026-0498", retailerId: "R003", retailerName: "Classic Comfort", amount: 22400, status: "Delivered", paymentStatus: "Paid", utr: "UTR20260510003", orderDate: "2026-05-10", items: [{ product: "Huddo Formal F1", size: 8, color: "Black", qty: 8, price: 1900 }, { product: "Huddo Sport X1", size: 9, color: "Red", qty: 3, price: 2800 }], requiresCityApproval: false, paymentScreenshot: null },
];

export const leads = [
  { id: "L001", businessName: "Sunrise Sports", ownerName: "Kamal Thakkar", mobile: "+91 99001 00111", area: "Gota, Ahmedabad", status: "Contacted", notes: "Interested in sports range. Follow up next week.", lastContact: "2026-06-09", source: "Field Visit" },
  { id: "L002", businessName: "City Shoe Hub", ownerName: "Farida Bano", mobile: "+91 99002 00222", area: "Maninagar, Ahmedabad", status: "Interested", notes: "Wants product catalog and pricing. Sending today.", lastContact: "2026-06-11", source: "Referral" },
  { id: "L003", businessName: "Comfort Zone", ownerName: "Raj Trivedi", mobile: "+91 99003 00333", area: "Bopal, Ahmedabad", status: "Meeting Scheduled", notes: "Meeting on 15th June at their shop.", lastContact: "2026-06-12", source: "Field Visit" },
  { id: "L004", businessName: "Walk Easy", ownerName: "Sonal Mehta", mobile: "+91 99004 00444", area: "Thaltej, Ahmedabad", status: "Not Interested", notes: "Currently tied up with another brand. Revisit in 3 months.", lastContact: "2026-06-01", source: "Cold Call" },
  { id: "L005", businessName: "Step Right", ownerName: "Bharat Patel", mobile: "+91 99005 00555", area: "Naroda, Ahmedabad", status: "Contacted", notes: "Initial contact made. Needs follow-up.", lastContact: "2026-06-13", source: "Field Visit" },
];

export const visitLogs = [
  { id: "V001", date: "2026-06-13", retailerId: "R001", retailerName: "Patel Footwear", area: "CG Road", purpose: "Order Collection", outcome: "Order placed ₹32,500", checkIn: "10:05", checkOut: "11:20", gpsVerified: true },
  { id: "V002", date: "2026-06-13", retailerId: "R003", retailerName: "Classic Comfort", area: "Satellite Road", purpose: "Payment Follow-up", outcome: "Committed payment by 20th June", checkIn: "12:00", checkOut: "12:45", gpsVerified: true },
  { id: "V003", date: "2026-06-13", leadId: "L003", retailerName: "Comfort Zone (Lead)", area: "Bopal", purpose: "Lead Meeting", outcome: "Positive response — scheduling demo", checkIn: "14:30", checkOut: "15:15", gpsVerified: true },
  { id: "V004", date: "2026-06-12", retailerId: "R002", retailerName: "Star Shoes", area: "Vastrapur", purpose: "Relationship Visit", outcome: "Discussed new arrivals, no order today", checkIn: "10:30", checkOut: "11:15", gpsVerified: true },
  { id: "V005", date: "2026-06-12", retailerId: "R004", retailerName: "Metro Walk", area: "Ashram Road", purpose: "Order Collection", outcome: "Order to be placed by weekend", checkIn: "14:00", checkOut: "14:40", gpsVerified: false },
  { id: "V006", date: "2026-06-11", retailerId: "R003", retailerName: "Classic Comfort", area: "Satellite Road", purpose: "Order Collection", outcome: "Order ORD-2026-0539 placed — ₹18,200", checkIn: "11:00", checkOut: "11:55", gpsVerified: true },
];

export const promoters = [
  { id: "P001", name: "Suresh Wadhwani", code: "PROM-AHM-001", mobile: "+91 97001 11001", email: "suresh.w@promoter.com", retailersMapped: ["R001", "R002", "R004", "R006"], revenueThisMonth: 313500, royaltyEarned: 9405, status: "Active" },
  { id: "P002", name: "Mukesh Doshi", code: "PROM-AHM-002", mobile: "+91 97002 22002", email: "mukesh.d@promoter.com", retailersMapped: ["R003", "R005", "R007"], revenueThisMonth: 206000, royaltyEarned: 6180, status: "Active" },
];

export const myIncentive = {
  slab: "Slab C",
  rule: "3% of city revenue above ₹4,00,000 per month",
  thisMonthRevenue: 648000,
  baseThreshold: 400000,
  eligibleRevenue: 248000,
  rate: 0.03,
  thisMonthEarned: 7440,
  lastMonthEarned: 6820,
  ytdEarned: 48600,
  status: "Pending",
  payoutDate: "Last working day of June",
  history: [
    { month: "Jun 2026", revenue: 648000, eligible: 248000, earned: 7440, status: "Pending" },
    { month: "May 2026", revenue: 627000, eligible: 227000, earned: 6810, status: "Paid" },
    { month: "Apr 2026", revenue: 591000, eligible: 191000, earned: 5730, status: "Paid" },
    { month: "Mar 2026", revenue: 543000, eligible: 143000, earned: 4290, status: "Paid" },
    { month: "Feb 2026", revenue: 482000, eligible: 82000, earned: 2460, status: "Paid" },
    { month: "Jan 2026", revenue: 398000, eligible: 0, earned: 0, status: "Paid" },
  ]
};

export const cityTargets = {
  monthly: { target: 750000, achieved: 648000, period: "June 2026" },
  quarterly: { target: 2100000, achieved: 1838000, period: "Q1 FY2026-27" },
  yearly: { target: 8500000, achieved: 4312000, period: "FY2026-27" },
  retailerTargets: [
    { retailerId: "R001", name: "Patel Footwear", target: 200000, achieved: 187000 },
    { retailerId: "R002", name: "Star Shoes", target: 120000, achieved: 98000 },
    { retailerId: "R003", name: "Classic Comfort", target: 160000, achieved: 138000 },
    { retailerId: "R004", name: "Metro Walk", target: 80000, achieved: 62000 },
    { retailerId: "R005", name: "Footstep Fashion", target: 60000, achieved: 48000 },
    { retailerId: "R006", name: "Urban Sole", target: 40000, achieved: 26000 },
  ],
  kpis: {
    achievementPct: 86.4,
    revenueGrowth: 11.3,
    orderCount: 87,
    retailerAcquisition: 1,
    leadsGenerated: 5
  }
};

export const monthlyRevenueData = [
  { month: "Jul'25", revenue: 412000, target: 500000 },
  { month: "Aug'25", revenue: 498000, target: 520000 },
  { month: "Sep'25", revenue: 445000, target: 530000 },
  { month: "Oct'25", revenue: 567000, target: 580000 },
  { month: "Nov'25", revenue: 612000, target: 600000 },
  { month: "Dec'25", revenue: 734000, target: 620000 },
  { month: "Jan'26", revenue: 398000, target: 650000 },
  { month: "Feb'26", revenue: 482000, target: 650000 },
  { month: "Mar'26", revenue: 543000, target: 680000 },
  { month: "Apr'26", revenue: 580000, target: 700000 },
  { month: "May'26", revenue: 627000, target: 720000 },
  { month: "Jun'26", revenue: 648000, target: 750000 },
];

export const retailerSalesData = [
  { name: "Patel Footwear", revenue: 187000, orders: 34, category: "Platinum" },
  { name: "Classic Comfort", revenue: 138000, orders: 27, category: "Gold" },
  { name: "Star Shoes", revenue: 98000, orders: 22, category: "Gold" },
  { name: "Metro Walk", revenue: 62000, orders: 15, category: "Silver" },
  { name: "Footstep Fashion", revenue: 48000, orders: 12, category: "Silver" },
  { name: "Urban Sole", revenue: 26000, orders: 7, category: "Standard" },
];

export const pendingApprovals = [
  { id: "APR001", type: "Large Order", orderId: "ORD-2026-0541", retailer: "Patel Footwear", amount: 32500, items: 2, date: "2026-06-10", urgency: "High" },
  { id: "APR002", type: "Large Order", orderId: "ORD-2026-0530", retailer: "Patel Footwear", amount: 55000, items: 1, date: "2026-06-01", urgency: "High" },
  { id: "APR003", type: "Retailer Registration", retailer: "Sunrise Footwear", city: "Ahmedabad", date: "2026-06-10", urgency: "Medium" },
];

export const notifications = [
  { id: "N001", type: "approval", message: "Order ORD-2026-0541 from Patel Footwear (₹32,500) awaiting your approval", time: "2 hours ago", read: false },
  { id: "N002", type: "approval", message: "Order ORD-2026-0530 from Patel Footwear (₹55,000) is 12 days old — urgent approval needed", time: "Today 09:00", read: false },
  { id: "N003", type: "target", message: "June target: 86.4% achieved with 17 days remaining. Push for ₹1,02,000 more.", time: "Yesterday", read: true },
  { id: "N004", type: "lead", message: "Lead L003 (Comfort Zone) meeting scheduled for 15th June", time: "2 days ago", read: true },
  { id: "N005", type: "retailer", message: "Classic Comfort has outstanding payment of ₹19,000 for 14 days", time: "3 days ago", read: true },
  { id: "N006", type: "system", message: "New retailer Sunrise Footwear registration submitted — pending your verification", time: "3 days ago", read: true },
];
