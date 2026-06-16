export const mockEmployees = {
  sales_executive: {
    id: "EMP-001",
    name: "Arjun Mehta",
    role: "sales_executive",
    department: "Sales",
    designation: "Sales Executive",
    reportingManagerId: "EMP-050",
    reportingManagerName: "Vikram Shah",
    cityId: "CITY-04",
    stateId: "STATE-02",
    joiningDate: "2023-06-15",
    salary: 32000,
    locationTrackingEnabled: true,
    email: "arjun.mehta@huddo.com",
    mobile: "+91 98765 43210",
    address: "B-402, Shanti Vihar, Rajkot, Gujarat",
    aadhaar: "XXXX-XXXX-4567",
    pan: "ABCDE1234F",
    bankDetails: {
      accountNumber: "XXXX-XXXX-9876",
      ifsc: "ICIC0000102",
      bankName: "ICICI Bank"
    },
    documents: [
      { name: "Aadhaar Card", type: "pdf", size: "1.2 MB" },
      { name: "PAN Card", type: "pdf", size: "0.8 MB" },
      { name: "Offer Letter", type: "pdf", size: "2.4 MB" }
    ]
  },
  sales_manager: {
    id: "EMP-050",
    name: "Vikram Shah",
    role: "sales_manager",
    department: "Sales",
    designation: "Sales Manager",
    reportingManagerId: "EMP-100",
    reportingManagerName: "Rohan Hudda",
    cityId: "CITY-04",
    stateId: "STATE-02",
    joiningDate: "2021-04-10",
    salary: 65000,
    locationTrackingEnabled: false,
    email: "vikram.shah@huddo.com",
    mobile: "+91 98765 12345",
    address: "102, Royal Residency, Ahmedabad, Gujarat",
    aadhaar: "XXXX-XXXX-8901",
    pan: "FGHIJ5678K",
    bankDetails: {
      accountNumber: "XXXX-XXXX-5432",
      ifsc: "HDFC0000060",
      bankName: "HDFC Bank"
    },
    documents: [
      { name: "Aadhaar Card", type: "pdf", size: "1.1 MB" },
      { name: "PAN Card", type: "pdf", size: "0.9 MB" },
      { name: "Appraisal Letter 2025", type: "pdf", size: "1.5 MB" }
    ]
  },
  hr_manager: {
    id: "EMP-020",
    name: "Nisha Sen",
    role: "hr_manager",
    department: "Human Resources",
    designation: "HR Manager",
    reportingManagerId: "EMP-100",
    reportingManagerName: "Rohan Hudda",
    cityId: "CITY-01",
    stateId: "STATE-01",
    joiningDate: "2022-01-15",
    salary: 58000,
    locationTrackingEnabled: false,
    email: "nisha.sen@huddo.com",
    mobile: "+91 91234 56789",
    address: "Flat 4A, Green Meadows, Mumbai, Maharashtra",
    aadhaar: "XXXX-XXXX-2345",
    pan: "KLMNO9012P",
    bankDetails: {
      accountNumber: "XXXX-XXXX-1122",
      ifsc: "KKBK0000643",
      bankName: "Kotak Mahindra Bank"
    },
    documents: [
      { name: "Aadhaar Card", type: "pdf", size: "1.3 MB" },
      { name: "PAN Card", type: "pdf", size: "0.7 MB" }
    ]
  },
  finance_manager: {
    id: "EMP-030",
    name: "Sanjay Joshi",
    role: "finance_manager",
    department: "Finance",
    designation: "Finance Manager",
    reportingManagerId: "EMP-100",
    reportingManagerName: "Rohan Hudda",
    cityId: "CITY-01",
    stateId: "STATE-01",
    joiningDate: "2020-11-01",
    salary: 75000,
    locationTrackingEnabled: false,
    email: "sanjay.joshi@huddo.com",
    mobile: "+91 92345 67890",
    address: "Block C-12, Orchid Tower, Thane, Maharashtra",
    aadhaar: "XXXX-XXXX-6789",
    pan: "QRSTU3456V",
    bankDetails: {
      accountNumber: "XXXX-XXXX-3344",
      ifsc: "BARB0THANE",
      bankName: "Bank of Baroda"
    },
    documents: [
      { name: "Aadhaar Card", type: "pdf", size: "1.4 MB" },
      { name: "PAN Card", type: "pdf", size: "0.8 MB" },
      { name: "CA Certificate", type: "pdf", size: "3.2 MB" }
    ]
  },
  inventory_manager: {
    id: "EMP-040",
    name: "Ramesh Patel",
    role: "inventory_manager",
    department: "Operations",
    designation: "Inventory Manager",
    reportingManagerId: "EMP-100",
    reportingManagerName: "Rohan Hudda",
    cityId: "CITY-05",
    stateId: "STATE-02",
    joiningDate: "2023-01-20",
    salary: 45000,
    locationTrackingEnabled: false,
    email: "ramesh.patel@huddo.com",
    mobile: "+91 93456 78901",
    address: "G-15, Shanti Sadan, Surat, Gujarat",
    aadhaar: "XXXX-XXXX-0123",
    pan: "WXYZ07890A",
    bankDetails: {
      accountNumber: "XXXX-XXXX-5566",
      ifsc: "SBIN0000412",
      bankName: "State Bank of India"
    },
    documents: [
      { name: "Aadhaar Card", type: "pdf", size: "1.0 MB" },
      { name: "PAN Card", type: "pdf", size: "0.9 MB" }
    ]
  },
  purchase_manager: {
    id: "EMP-045",
    name: "Karan Johar",
    role: "purchase_manager",
    department: "Procurement",
    designation: "Purchase Manager",
    reportingManagerId: "EMP-100",
    reportingManagerName: "Rohan Hudda",
    cityId: "CITY-01",
    stateId: "STATE-01",
    joiningDate: "2024-03-01",
    salary: 50000,
    locationTrackingEnabled: false,
    email: "karan.johar@huddo.com",
    mobile: "+91 94567 89012",
    address: "701, Pearl Residency, Bandra, Mumbai",
    aadhaar: "XXXX-XXXX-3456",
    pan: "BCDEF4567G",
    bankDetails: {
      accountNumber: "XXXX-XXXX-7788",
      ifsc: "AXIS0000005",
      bankName: "Axis Bank"
    },
    documents: [
      { name: "Aadhaar Card", type: "pdf", size: "1.5 MB" },
      { name: "PAN Card", type: "pdf", size: "0.8 MB" }
    ]
  },
  team_member: {
    id: "EMP-099",
    name: "Preeti Verma",
    role: "team_member",
    department: "Marketing",
    designation: "Associate Product Specialist",
    reportingManagerId: "EMP-020",
    reportingManagerName: "Nisha Sen",
    cityId: "CITY-01",
    stateId: "STATE-01",
    joiningDate: "2024-08-10",
    salary: 28000,
    locationTrackingEnabled: false,
    email: "preeti.verma@huddo.com",
    mobile: "+91 95678 90123",
    address: "Apartment 101, Nilgiri Heights, Pune, Maharashtra",
    aadhaar: "XXXX-XXXX-7890",
    pan: "GHIJK8901L",
    bankDetails: {
      accountNumber: "XXXX-XXXX-9900",
      ifsc: "HDFC0000104",
      bankName: "HDFC Bank"
    },
    documents: [
      { name: "Aadhaar Card", type: "pdf", size: "1.1 MB" },
      { name: "PAN Card", type: "pdf", size: "0.7 MB" },
      { name: "Graduation Certificate", type: "pdf", size: "2.1 MB" }
    ]
  }
};
