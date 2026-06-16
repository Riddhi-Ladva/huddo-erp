export const mockLeaves = {
  balances: {
    casual: { total: 12, used: 4, remaining: 8 },
    sick: { total: 6, used: 2, remaining: 4 },
    earned: { total: 15, used: 5, remaining: 10 }
  },
  requests: [
    { id: "LR-101", type: "Sick Leave", from: "2026-06-10", to: "2026-06-11", days: 2, reason: "Viral fever recovery", status: "Approved" },
    { id: "LR-102", type: "Casual Leave", from: "2026-05-12", to: "2026-05-13", days: 2, reason: "Family event in hometown", status: "Approved" },
    { id: "LR-103", type: "Earned Leave", from: "2026-04-15", to: "2026-04-18", days: 4, reason: "Self marriages/relatives attendance", status: "Approved" },
    { id: "LR-104", type: "Casual Leave", from: "2026-06-25", to: "2026-06-26", days: 2, reason: "Urgent personal work at home", status: "Pending" },
    { id: "LR-105", type: "Sick Leave", from: "2026-03-04", to: "2026-03-04", days: 1, reason: "Severe migraine", status: "Approved" },
    { id: "LR-106", type: "Earned Leave", from: "2026-02-10", to: "2026-02-15", days: 5, reason: "Leisure travel with parents", status: "Rejected" }
  ]
};
