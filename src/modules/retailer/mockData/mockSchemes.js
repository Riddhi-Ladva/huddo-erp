export const mockSchemes = [
  {
    id: "SCH-001",
    name: "Monsoon Sports Bonanza",
    description: "Flat 10% discount on all Sports category items for order quantities of 10 pairs or more.",
    discountType: "Percentage",
    discountValue: 10,
    validFrom: "2026-06-01",
    validTo: "2026-06-30",
    applicableProducts: "All Sports Shoes",
    minOrderQty: 10,
    applicableTiers: ["Gold", "Platinum"], // Retailer is Gold, so this is applicable!
    isActive: true
  },
  {
    id: "SCH-002",
    name: "Formal Wear Premium Upgrade",
    description: "Get flat ₹500 off on every formal shoe purchase. Minimum bill value ₹15,000.",
    discountType: "Flat",
    discountValue: 500,
    validFrom: "2026-06-05",
    validTo: "2026-06-25",
    applicableProducts: "Urban Elite Loafers & Royal Oxford Dress Shoes",
    minOrderQty: 5,
    applicableTiers: ["Platinum"], // Retailer is Gold, so not applicable!
    isActive: true
  },
  {
    id: "SCH-003",
    name: "Sneakers Volume Boost",
    description: "Earn 1.5x Loyalty Reward points on all casual sneakers. Valid for all retailers.",
    discountType: "Reward Multiplier",
    discountValue: 1.5,
    validFrom: "2026-06-01",
    validTo: "2026-06-20",
    applicableProducts: "FlexiWalk Canvas Sneakers",
    minOrderQty: 1,
    applicableTiers: ["Standard", "Silver", "Gold", "Platinum"],
    isActive: true
  },
  {
    id: "SCH-004",
    name: "End of Season Clearance",
    description: "Clearance discount of 15% on cork sandals. Applicable to Gold and Platinum tiers.",
    discountType: "Percentage",
    discountValue: 15,
    validFrom: "2026-06-10",
    validTo: "2026-06-25",
    applicableProducts: "SunBreeze Cork Sandals",
    minOrderQty: 20,
    applicableTiers: ["Gold", "Platinum"],
    isActive: true
  },
  {
    id: "SCH-005",
    name: "Spring Festival Launch Offer",
    description: "Introductory 5% discount on all catalog items. (EXPIRED)",
    discountType: "Percentage",
    discountValue: 5,
    validFrom: "2026-03-01",
    validTo: "2026-04-15",
    applicableProducts: "All Products",
    minOrderQty: 1,
    applicableTiers: ["Standard", "Silver", "Gold", "Platinum"],
    isActive: false // Expired
  }
];
