export const mockPurchaseOrders = [
  {
    poNumber: "PO-2026-001",
    vendorName: "Supreme Rubber Products",
    vendorId: "VND-001",
    date: "2026-06-01",
    deliveryDate: "2026-06-15",
    totalAmount: 120000,
    status: "Received",
    requestedBy: "Karan Johar",
    items: [
      { product: "Premium Rubber Outsoles (Size 9)", quantity: 1000, unitPrice: 80, total: 80000 },
      { product: "Premium Rubber Outsoles (Size 10)", quantity: 500, unitPrice: 80, total: 40000 }
    ],
    notes: "Expedited shipping requested for Q3 running shoes production.",
    timeline: [
      { status: "Draft", date: "2026-05-28", note: "Created by Karan Johar" },
      { status: "Submitted", date: "2026-05-29", note: "Submitted for approval" },
      { status: "Approved", date: "2026-06-01", note: "Approved by Sanjay Joshi" },
      { status: "Processing", date: "2026-06-02", note: "Dispatched by supplier" },
      { status: "Received", date: "2026-06-14", note: "Received at Mumbai Central Hub" }
    ],
    qcStatus: "Passed",
    qcNotes: "Rubber thickness and tensile strength passed QA test protocols."
  },
  {
    poNumber: "PO-2026-002",
    vendorName: "Apex Packaging Solutions",
    vendorId: "VND-002",
    date: "2026-06-03",
    deliveryDate: "2026-06-12",
    totalAmount: 45000,
    status: "Received",
    requestedBy: "Karan Johar",
    items: [
      { product: "Printed Shoeboxes - Standard Blue", quantity: 3000, unitPrice: 15, total: 45000 }
    ],
    notes: "Print colors must match HUDDO-Blue branding guidelines.",
    timeline: [
      { status: "Draft", date: "2026-06-02" },
      { status: "Submitted", date: "2026-06-02" },
      { status: "Approved", date: "2026-06-03" },
      { status: "Processing", date: "2026-06-05" },
      { status: "Received", date: "2026-06-12" }
    ],
    qcStatus: "Passed",
    qcNotes: "Branding colors verified. Box dimensions correct."
  },
  {
    poNumber: "PO-2026-003",
    vendorName: "Marvel Leather Tannery",
    vendorId: "VND-003",
    date: "2026-06-05",
    deliveryDate: "2026-06-25",
    totalAmount: 250000,
    status: "Processing",
    requestedBy: "Karan Johar",
    items: [
      { product: "Suede Leather - Premium Black (sq.ft)", quantity: 2000, unitPrice: 100, total: 200000 },
      { product: "Full Grain Brown Leather (sq.ft)", quantity: 500, unitPrice: 100, total: 50000 }
    ],
    notes: "Leather sheets must be free of scars and uneven thickness.",
    timeline: [
      { status: "Draft", date: "2026-06-04" },
      { status: "Submitted", date: "2026-06-04" },
      { status: "Approved", date: "2026-06-05" },
      { status: "Processing", date: "2026-06-08", note: "Goods are in transit via road transport" }
    ],
    qcStatus: "Pending",
    qcNotes: ""
  },
  {
    poNumber: "PO-2026-004",
    vendorName: "Standard Threads & Laces",
    vendorId: "VND-004",
    date: "2026-06-08",
    deliveryDate: "2026-06-18",
    totalAmount: 15000,
    status: "Received",
    requestedBy: "Rohit Sharma",
    items: [
      { product: "Polyester Shoelaces (1.2m White)", quantity: 5000, unitPrice: 2, total: 10000 },
      { product: "Nylon Stitching Thread (Spools)", quantity: 100, unitPrice: 50, total: 5000 }
    ],
    notes: "Lace tips must be sealed with hard plastic aglets.",
    timeline: [
      { status: "Draft", date: "2026-06-06" },
      { status: "Submitted", date: "2026-06-07" },
      { status: "Approved", date: "2026-06-08" },
      { status: "Processing", date: "2026-06-09" },
      { status: "Received", date: "2026-06-15" }
    ],
    qcStatus: "Failed",
    qcNotes: "10% of laces had missing plastic tips. Rejected batch and requested replacement."
  },
  {
    poNumber: "PO-2026-005",
    vendorName: "Supreme Rubber Products",
    vendorId: "VND-001",
    date: "2026-06-12",
    deliveryDate: "2026-06-28",
    totalAmount: 85000,
    status: "Approved",
    requestedBy: "Karan Johar",
    items: [
      { product: "EVA Insoles Comfort Cushion", quantity: 1700, unitPrice: 50, total: 85000 }
    ],
    notes: "Urgent order for replenishment of running shoe series.",
    timeline: [
      { status: "Draft", date: "2026-06-11" },
      { status: "Submitted", date: "2026-06-11" },
      { status: "Approved", date: "2026-06-12", note: "Approved for processing" }
    ],
    qcStatus: "Pending",
    qcNotes: ""
  },
  {
    poNumber: "PO-2026-006",
    vendorName: "Apex Packaging Solutions",
    vendorId: "VND-002",
    date: "2026-06-14",
    deliveryDate: "2026-06-24",
    totalAmount: 30000,
    status: "Submitted",
    requestedBy: "Rohit Sharma",
    items: [
      { product: "Shipping Cartons (L)", quantity: 600, unitPrice: 50, total: 30000 }
    ],
    notes: "5-ply corrugated cardboard boxes required.",
    timeline: [
      { status: "Draft", date: "2026-06-13" },
      { status: "Submitted", date: "2026-06-14", note: "Awaiting approval from Sanjay Joshi" }
    ],
    qcStatus: "Pending",
    qcNotes: ""
  },
  {
    poNumber: "PO-2026-007",
    vendorName: "Elite Buckles & Accessories",
    vendorId: "VND-005",
    date: "2026-06-15",
    deliveryDate: "2026-06-30",
    totalAmount: 28000,
    status: "Draft",
    requestedBy: "Karan Johar",
    items: [
      { product: "Metal Eyelets - Gold (Brass)", quantity: 20000, unitPrice: 1, total: 20000 },
      { product: "Metal Eyelets - Silver (Chrome)", quantity: 8000, unitPrice: 1, total: 8000 }
    ],
    notes: "Eyelets must have rust-resistant plating.",
    timeline: [
      { status: "Draft", date: "2026-06-15" }
    ],
    qcStatus: "Pending",
    qcNotes: ""
  },
  {
    poNumber: "PO-2026-008",
    vendorName: "Supreme Rubber Products",
    vendorId: "VND-001",
    date: "2026-06-10",
    deliveryDate: "2026-06-20",
    totalAmount: 40000,
    status: "Cancelled",
    requestedBy: "Karan Johar",
    items: [
      { product: "Premium Rubber Outsoles (Size 8)", quantity: 500, unitPrice: 80, total: 40000 }
    ],
    notes: "Replaced by PO-2026-001 sizing correction.",
    timeline: [
      { status: "Draft", date: "2026-06-09" },
      { status: "Submitted", date: "2026-06-09" },
      { status: "Cancelled", date: "2026-06-10", note: "Cancelled by buyer" }
    ],
    qcStatus: "Pending",
    qcNotes: ""
  }
];
