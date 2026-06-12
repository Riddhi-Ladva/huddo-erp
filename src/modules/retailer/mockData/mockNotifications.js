export const mockNotifications = [
  {
    id: "NOT-001",
    type: "order", // order / payment / scheme / commission
    title: "Order Shipped",
    message: "Your order #ORD-1003 has been shipped via BlueDart. Tracking code BD-771029.",
    timestamp: "2026-06-12 10:30 AM",
    read: false
  },
  {
    id: "NOT-002",
    type: "payment",
    title: "Payment Verified",
    message: "UTR8004928194 for order #ORD-1004 has been successfully approved by Accounts.",
    timestamp: "2026-06-11 04:15 PM",
    read: false
  },
  {
    id: "NOT-003",
    type: "commission",
    title: "Commission Settled",
    message: "Commission of ₹499.50 for order #ORD-1002 has been credited to your rewards wallet.",
    timestamp: "2026-06-07 05:00 PM",
    read: false
  },
  {
    id: "NOT-004",
    type: "scheme",
    title: "New Scheme Active",
    message: "Monsoon Sports Bonanza is now live! Get 10% discount on sports category catalog items.",
    timestamp: "2026-06-01 09:00 AM",
    read: false
  },
  {
    id: "NOT-005",
    type: "order",
    title: "Order Delivered",
    message: "Order #ORD-1002 has been delivered to your store address.",
    timestamp: "2026-06-06 01:20 PM",
    read: true
  },
  {
    id: "NOT-006",
    type: "payment",
    title: "Overdue Invoice Reminder",
    message: "Invoice INV-2026-008 is overdue by 23 days. Please settle ₹18,000 to prevent order lockdowns.",
    timestamp: "2026-06-05 09:00 AM",
    read: true
  },
  {
    id: "NOT-007",
    type: "commission",
    title: "Commission Pending",
    message: "A pending commission of ₹1,090 has been logged for your shipped order #ORD-1003.",
    timestamp: "2026-06-09 11:35 AM",
    read: true
  },
  {
    id: "NOT-008",
    type: "scheme",
    title: "Scheme Expiration Alert",
    message: "Sneakers Volume Boost scheme expires in 8 days. Boost order quantities to benefit.",
    timestamp: "2026-06-12 08:00 AM",
    read: false
  },
  {
    id: "NOT-009",
    type: "payment",
    title: "Receipt Upload Completed",
    message: "UTR0012938473 screenshot uploaded successfully for order #ORD-1007. Pending verification.",
    timestamp: "2026-06-11 03:05 PM",
    read: true
  },
  {
    id: "NOT-010",
    type: "order",
    title: "Draft Order Saved",
    message: "Order #ORD-1008 has been saved as Draft. Click place order to proceed to checkout.",
    timestamp: "2026-06-12 11:35 AM",
    read: true
  }
];
