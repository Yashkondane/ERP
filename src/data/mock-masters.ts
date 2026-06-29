import { Supplier } from "@/types/supplier";

export interface MasterPattern {
  code: string;
  brand: string;
  fit: string;
  image?: string;
}

export const INITIAL_MASTER_PATTERNS: MasterPattern[] = [
  { code: "PAT001", brand: "Allen Solly", fit: "Slim Fit" },
  { code: "PAT002", brand: "Peter England", fit: "Regular Fit" },
  { code: "PAT003", brand: "Customer A", fit: "Special Fit" },
  { code: "PA101", brand: "Allen Solley", fit: "Casual Fit" },
  { code: "PA102", brand: "Zara", fit: "Regular Fit" },
  { code: "PA103", brand: "H&M", fit: "Slim Fit" },
  { code: "PA104", brand: "Allen Solley", fit: "Slim Fit" },
  { code: "PA105", brand: "Zara", fit: "Oversized" },
  { code: "PA106", brand: "Levi's", fit: "Regular Fit" },
];

export interface MasterFit {
  id: string;
  name: string;
}

export const INITIAL_MASTER_FITS: MasterFit[] = [
  { id: "FIT-01", name: "Regular" },
  { id: "FIT-02", name: "Slim Fit" },
  { id: "FIT-03", name: "Oversized" },
  { id: "FIT-04", name: "Casual Fit" },
];

export interface MasterFabric {
  id: string;
  name: string;
}

export const INITIAL_MASTER_FABRICS: MasterFabric[] = [
  { id: "FAB-01", name: "Cotton Poplin" },
  { id: "FAB-02", name: "Linen" },
  { id: "FAB-03", name: "Denim" },
  { id: "FAB-04", name: "Polyester" },
];

export interface MasterBrand {
  id: string;
  name: string;
  fullName: string;
}

export const INITIAL_MASTER_BRANDS: MasterBrand[] = [
  { id: "BRD-01", name: "Zara", fullName: "Zara fashion group" },
  { id: "BRD-02", name: "H&M", fullName: "Hennes & Mauritz" },
  { id: "BRD-03", name: "Levi's", fullName: "Levi Strauss & Co." },
  { id: "BRD-04", name: "Allen Solly", fullName: "Premium workwear" },
  { id: "BRD-05", name: "Peter England", fullName: "Menswear brand" },
];

export interface MasterColor {
  id: string;
  name: string;
  hexCode: string;
}

export const INITIAL_MASTER_COLORS: MasterColor[] = [
  { id: "COL-01", name: "White", hexCode: "#ffffff" },
  { id: "COL-02", name: "Black", hexCode: "#000000" },
  { id: "COL-03", name: "Navy", hexCode: "#000080" },
  { id: "COL-04", name: "Red", hexCode: "#ef4444" },
  { id: "COL-05", name: "Grey", hexCode: "#808080" },
];

export interface MasterBuyer {
  id: string;
  logo: string;
  accountDeptNo: string;
  warehouseDeptNo: string;
  transport: string;
  creditTerms: string;
  defaultAgent: string;
  defaultBrand?: string;
  companyName: string;
  billingAddress: string;
  shippingAddress: string;
  gstNumber: string;
  notes: string;
}

export const INITIAL_MASTER_BUYERS: MasterBuyer[] = [
  {
    id: "BYR-01",
    logo: "",
    accountDeptNo: "ACC-101",
    warehouseDeptNo: "WH-201",
    transport: "Blue Dart",
    creditTerms: "30 Days",
    defaultAgent: "Ramesh Kumar",
    companyName: "Zara Fashion Pvt Limited",
    billingAddress: "45 Fashion Street, Mumbai, MH",
    shippingAddress: "Warehouse 2, Bhiwandi, MH",
    gstNumber: "27AADCB2230M1Z2",
    notes: "Top priority customer"
  },
  {
    id: "BYR-02",
    logo: "",
    accountDeptNo: "ACC-102",
    warehouseDeptNo: "WH-205",
    transport: "Delhivery",
    creditTerms: "45 Days",
    defaultAgent: "Suresh Singh",
    companyName: "H&M Retail",
    billingAddress: "12 Retail Hub, Delhi",
    shippingAddress: "North Hub, Gurugram, HR",
    gstNumber: "07AACHM1234K1Z5",
    notes: "Requires specific carton sizes"
  },
  {
    id: "BYR-03",
    logo: "",
    accountDeptNo: "ACC-103",
    warehouseDeptNo: "WH-206",
    transport: "FedEx",
    creditTerms: "15 Days",
    defaultAgent: "Amit Sharma",
    companyName: "benaton",
    billingAddress: "Mumbai, MH",
    shippingAddress: "Mumbai, MH",
    gstNumber: "27AADCB2230M1B3",
    notes: "Benaton orders"
  }
];

export const INITIAL_MASTER_SUPPLIERS: Supplier[] = [
  { code: "SUP-100", name: "Arvind Mills", contactPerson: "Rakesh", phone: "+91 9810000000", category: "Fabric", onTimePct: 86, rejectionPct: 0.4, openPos: 0, billingAddress: "Ahmedabad, Gujarat" },
  { code: "SUP-101", name: "Vardhman Textiles", contactPerson: "Vinod", phone: "+91 9810000013", category: "Fabric", onTimePct: 87, rejectionPct: 0.8, openPos: 1, billingAddress: "Ludhiana, Punjab" },
  { code: "SUP-102", name: "Raymond Fabrics", contactPerson: "Asha", phone: "+91 9810000026", category: "Fabric", onTimePct: 88, rejectionPct: 1.2, openPos: 2, billingAddress: "Mumbai, Maharashtra" },
  { code: "SUP-103", name: "Welspun", contactPerson: "Tariq", phone: "+91 9810000039", category: "Fabric", onTimePct: 89, rejectionPct: 1.6, openPos: 3, billingAddress: "Anjar, Gujarat" },
  { code: "SUP-104", name: "Trim & Co.", contactPerson: "Rakesh", phone: "+91 9810000052", category: "Both", onTimePct: 90, rejectionPct: 2.0, openPos: 4, billingAddress: "New Delhi, Delhi" },
  { code: "SUP-105", name: "Button House", contactPerson: "Vinod", phone: "+91 9810000065", category: "Trims", onTimePct: 91, rejectionPct: 2.4, openPos: 0, billingAddress: "Tirupur, Tamil Nadu" },
  { code: "SUP-106", name: "YKK Zippers", contactPerson: "Rajesh", phone: "+91 9810000066", category: "Trims", onTimePct: 92, rejectionPct: 1.1, openPos: 2, billingAddress: "Gurgaon, Haryana" },
  { code: "SUP-107", name: "Laxmi Buttons", contactPerson: "Suresh", phone: "+91 9810000067", category: "Trims", onTimePct: 85, rejectionPct: 1.5, openPos: 1, billingAddress: "Mumbai, Maharashtra" },
  { code: "SUP-108", name: "Super Labels", contactPerson: "Anita", phone: "+91 9810000068", category: "Trims", onTimePct: 88, rejectionPct: 2.1, openPos: 3, billingAddress: "Delhi" },
  { code: "SUP-109", name: "Vardhman Threads", contactPerson: "Ravi", phone: "+91 9810000069", category: "Trims", onTimePct: 94, rejectionPct: 0.9, openPos: 5, billingAddress: "Ludhiana, Punjab" },
  { code: "SUP-110", name: "Reliance Packaging", contactPerson: "Kiran", phone: "+91 9810000070", category: "Trims", onTimePct: 90, rejectionPct: 1.0, openPos: 4, billingAddress: "Mumbai, Maharashtra" },
  { code: "SUP-111", name: "Salsar Fashion", contactPerson: "Salsar", phone: "+91 9810000071", category: "Fabric", onTimePct: 95, rejectionPct: 0.5, openPos: 1, billingAddress: "Surat, Gujarat" }
];
