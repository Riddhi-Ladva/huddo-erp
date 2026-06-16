export const mockTargets = {
  myTargets: [
    { period: "June 2026", type: "Monthly", targetValue: 300000, achieved: 245050, status: "Partially Met" },
    { period: "Q2 2026", type: "Quarterly", targetValue: 900000, achieved: 945000, status: "Met" },
    { period: "FY 2026-27", type: "Yearly", targetValue: 3600000, achieved: 1200000, status: "Partially Met" }
  ],
  kpis: {
    achievementPercent: 81.6,
    revenueGrowth: {
      value: 12.4,
      isPositive: true
    },
    orderCount: {
      achieved: 68,
      target: 80
    },
    retailerAcquisition: {
      achieved: 5,
      target: 6
    },
    marketExpansion: "Onboarded Rajkot West Area, expanding brand presence in Gondal belt."
  },
  history: [
    { period: "May 2026", type: "Monthly", targetValue: 280000, achieved: 290000, achievementPercent: 103.5, status: "Met" },
    { period: "April 2026", type: "Monthly", targetValue: 250000, achieved: 245000, achievementPercent: 98.0, status: "Partially Met" },
    { period: "Q1 2026", type: "Quarterly", targetValue: 800000, achieved: 780000, achievementPercent: 97.5, status: "Partially Met" },
    { period: "March 2026", type: "Monthly", targetValue: 270000, achieved: 245000, achievementPercent: 90.7, status: "Partially Met" },
    { period: "February 2026", type: "Monthly", targetValue: 240000, achieved: 180000, achievementPercent: 75.0, status: "Partially Met" },
    { period: "January 2026", type: "Monthly", targetValue: 220000, achieved: 140000, achievementPercent: 63.6, status: "Missed" }
  ]
};
