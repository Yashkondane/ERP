import { Buyer, ProductLineItem, CatalogProduct } from "@/types/sales-order";

export const MOCK_BUYERS: Buyer[] = [
  {
    id: "b-1",
    name: "ABC Garments Pvt Ltd",
    creditLimit: 5000000,
    balance: 1875000,
    billingAddress: {
      companyName: "ABC Garments Pvt Ltd",
      addressLine1: "Unit 1, 2nd Floor, Shanti Industrial Estate",
      addressLine2: "Sola Road",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380061",
      country: "India",
      gstin: "24ABCDE1234F1Z5",
      isDefault: true,
    },
    shippingAddress: {
      id: "addr-1",
      companyName: "ABC Garments Factory 1",
      addressLine1: "Plot 45, GIDC Apparel Park",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "382213",
      country: "India",
    },
    shippingAddresses: [
      {
        id: "addr-1",
        companyName: "ABC Garments Factory 1",
        addressLine1: "Plot 45, GIDC Apparel Park",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "382213",
        country: "India",
        gstin: "24ABCDE1234F1Z5",
      },
      {
        id: "addr-2",
        companyName: "ABC Garments Factory 2",
        addressLine1: "Unit 12, New Textile Hub",
        city: "Surat",
        state: "Gujarat",
        pincode: "395002",
        country: "India",
        gstin: "24ABCDE1234F1Z5",
      }
    ]
  },
  {
    id: "b-2",
    name: "Fashion Retailers Inc.",
    creditLimit: 2000000,
    balance: 500000,
    billingAddress: {
      companyName: "Fashion Retailers Inc.",
      addressLine1: "12 MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
      country: "India",
      gstin: "29XYZDE1234F1Z5",
      isDefault: true,
    },
    shippingAddress: {
      id: "addr-f2",
      companyName: "Fashion Retailers Warehouse",
      addressLine1: "45 Hosur Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560068",
      country: "India",
    }
  },
  {
    id: "b-3",
    name: "Zara Fashion Pvt Limited",
    creditLimit: 8000000,
    balance: 2450000,
    billingAddress: {
      companyName: "Zara Fashion Pvt Limited",
      addressLine1: "Unit 4, Phoenix Mill Compound",
      addressLine2: "Senapati Bapat Marg, Lower Parel",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400013",
      country: "India",
      gstin: "27AAACZ1234F1Z2",
      isDefault: true,
    },
    shippingAddress: {
      id: "addr-z3",
      companyName: "Zara Fashion Logistics Hub",
      addressLine1: "Warehouse No. 12, Bhiwandi Road",
      city: "Thane",
      state: "Maharashtra",
      pincode: "421302",
      country: "India",
    }
  },
  {
    id: "b-4",
    name: "H&M",
    creditLimit: 6000000,
    balance: 1200000,
    billingAddress: {
      companyName: "Hennes & Mauritz Retail Pvt Ltd",
      addressLine1: "Plot No. 2, Sector 18",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122015",
      country: "India",
      gstin: "06AAACH5678D1Z4",
      isDefault: true,
    },
    shippingAddress: {
      id: "addr-hm4",
      companyName: "H&M Distribution Center",
      addressLine1: "Gate 4, Bilaspur Industrial Area",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122413",
      country: "India",
    }
  },
  {
    id: "b-5",
    name: "Levi's",
    creditLimit: 5000000,
    balance: 1500000,
    billingAddress: {
      companyName: "Levi Strauss India Pvt Ltd",
      addressLine1: "8th Floor, Embassy Tech Zone",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560103",
      country: "India",
      gstin: "29AAACL9012E1Z8",
      isDefault: true,
    },
    shippingAddress: {
      id: "addr-lv5",
      companyName: "Levi's Warehouse",
      addressLine1: "No. 3, Nelamangala Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "562123",
      country: "India",
    }
  }
];

export const MOCK_PRODUCTS: ProductLineItem[] = [
  {
    id: "line-1",
    productId: "MT001",
    name: "Men's Polo T-Shirt",
    category: "Men's T-Shirt",
    subcategory: "T-Shirt",
    type: "Half Sleeves",
    brandName: "Zara",
    color: "Black",
    fabric: "Cotton Poplin",
    fit: "Regular",
    pattern: { code: "PAT001", brand: "Allen Solly", fit: "Slim Fit" },
    sqNumber: "SKU1000293",
    sizeBreakdown: { S: 10, M: 20, L: 15, XL: 5, XXL: 0, "3XL": 5, "4XL": 0 },
    rate: 250.00,
  },
  {
    id: "line-2",
    productId: "MT002",
    name: "Men's Casual T-Shirt",
    category: "Men's T-Shirt",
    subcategory: "T-Shirt",
    type: "Full Sleeves",
    brandName: "H&M",
    color: "Navy",
    fabric: "Linen",
    fit: "Slim Fit",
    pattern: { code: "PAT002", brand: "Peter England", fit: "Regular Fit" },
    sqNumber: "SKU1000294",
    sizeBreakdown: { S: 5, M: 10, L: 8, XL: 2, XXL: 0 },
    rate: 250.00,
  },
  {
    id: "line-3",
    productId: "MH001",
    name: "Men's Casual Shirt",
    category: "Men's Shirt",
    subcategory: "Shirt",
    type: "Half Sleeves",
    brandName: "No Brand",
    color: "Grey",
    fabric: "Polyester",
    fit: "Oversized",
    pattern: { code: "PAT003", brand: "Customer A", fit: "Special Fit" },
    sqNumber: "SKU1000295",
    sizeBreakdown: { S: 5, M: 10, L: 10, XL: 5, XXL: 0, "3XL": 2 },
    rate: 600.00,
  }
];

export const MOCK_CATALOG_PRODUCTS: CatalogProduct[] = [
  { id: "cat-1", code: "MT001", name: "Polo T-Shirt", category: "Men's T-Shirt", subcategory: "T-Shirt", type: "Half Sleeves", sqNumber: "1000000001", color: "Black", rate: 250.00 },
  { id: "cat-2", code: "MT002", name: "Polo T-Shirt", category: "Men's T-Shirt", subcategory: "T-Shirt", type: "Half Sleeves", sqNumber: "1000000002", color: "Navy", rate: 250.00 },
  { id: "cat-3", code: "MH001", name: "Hoodie", category: "Men's T-Shirt", subcategory: "Hoodie", type: "Full Sleeves", sqNumber: "1000000003", color: "Grey", rate: 600.00 },
  { id: "cat-4", code: "WD001", name: "Summer Dress", category: "Women's Shirt", subcategory: "Dress", type: "Sleeveless", sqNumber: "1000000004", color: "White", rate: 700.00 },
  { id: "cat-5", code: "WTR001", name: "Slim Fit Trouser", category: "Women's Shirt", subcategory: "Trouser", type: "Full Length", sqNumber: "1000000005", color: "Black", rate: 550.00 },
  { id: "cat-6", code: "KT001", name: "Kids T-Shirt", category: "Kids' Wear", subcategory: "T-Shirt", type: "Half Sleeves", sqNumber: "1000000006", color: "Blue", rate: 180.00 },
  { id: "cat-7", code: "MS001", name: "Oxford Shirt", category: "Men's Shirt", subcategory: "Shirt", type: "Full Sleeves", sqNumber: "1000000007", color: "White", rate: 420.00 },
  { id: "cat-8", code: "MS002", name: "Linen Shirt", category: "Men's Shirt", subcategory: "Shirt", type: "Half Sleeves", sqNumber: "1000000008", color: "Beige", rate: 480.00 },
  { id: "cat-9", code: "MJ001", name: "Denim Jacket", category: "Men's Shirt", subcategory: "Jacket", type: "Full Sleeves", sqNumber: "1000000009", color: "Blue", rate: 950.00 },
  { id: "cat-10", code: "MT003", name: "Crew Neck Tee", category: "Men's T-Shirt", subcategory: "T-Shirt", type: "Half Sleeves", sqNumber: "1000000010", color: "Red", rate: 220.00 },
  { id: "cat-11", code: "WSK001", name: "Pleated Skirt", category: "Women's Shirt", subcategory: "Skirt", type: "Knee Length", sqNumber: "1000000011", color: "Navy", rate: 520.00 },
  { id: "cat-12", code: "WS001", name: "Formal Blouse", category: "Women's Shirt", subcategory: "Shirt", type: "Full Sleeves", sqNumber: "1000000012", color: "Pink", rate: 430.00 },
  { id: "cat-13", code: "WTP001", name: "Crop Top", category: "Women's T-Shirt", subcategory: "Top", type: "Sleeveless", sqNumber: "1000000013", color: "Black", rate: 260.00 },
  { id: "cat-14", code: "WTR002", name: "Wide Leg Pant", category: "Women's T-Shirt", subcategory: "Trouser", type: "Full Length", sqNumber: "1000000014", color: "Olive", rate: 620.00 },
  { id: "cat-15", code: "KH001", name: "Kids Hoodie", category: "Kids' Wear", subcategory: "Hoodie", type: "Full Sleeves", sqNumber: "1000000015", color: "Grey", rate: 360.00 },
  { id: "cat-16", code: "KS001", name: "Kids Shorts", category: "Kids' Wear", subcategory: "Shorts", type: "Knee Length", sqNumber: "1000000016", color: "Khaki", rate: 210.00 },
  { id: "cat-17", code: "KD001", name: "Kids Dress", category: "Kids' Wear", subcategory: "Dress", type: "Sleeveless", sqNumber: "1000000017", color: "Yellow", rate: 390.00 },
  { id: "cat-18", code: "KTR001", name: "Kids Jogger", category: "Kids' Wear", subcategory: "Trouser", type: "Full Length", sqNumber: "1000000018", color: "Black", rate: 280.00 },
];

export const INITIAL_SALES_ORDER = {
  salesOrderNo: "SO-26-000125",
  orderDate: new Date("2026-06-06"),
  status: "Draft" as const,
  buyerId: "b-1",
  buyerPoNo: "PO-4587",
  poDate: new Date("2026-06-06"),
  deliveryDate: new Date("2026-06-21"),
  products: MOCK_PRODUCTS,
  attachments: [
    { id: "att-1", name: "Buyer_PO_4587.pdf", size: 245000, type: "pdf" },
    { id: "att-2", name: "Spec_Sheet_V2.xlsx", size: 120000, type: "xlsx" },
    { id: "att-3", name: "Product_Image.jpg", size: 532000, type: "image" },
  ],
  discountPercentage: 5,
  cgstRate: 9,
  sgstRate: 9,
  roundOff: 0,
};

export const EMPTY_SALES_ORDER = {
  salesOrderNo: "SO-26-000126",
  orderDate: new Date(),
  status: "Draft" as const,
  buyerId: "",
  buyerPoNo: "",
  poDate: new Date(),
  deliveryDate: new Date(new Date().setDate(new Date().getDate() + 15)),
  products: [],
  attachments: [],
  discountPercentage: 0,
  cgstRate: 9,
  sgstRate: 9,
  roundOff: 0,
  internalNotes: "",
};

export interface SalesOrderListItem {
  id: string;
  soNo: string;
  orderDate: string;
  buyer: string;
  location: string;
  deliveryDate: string;
  status: "Draft" | "Confirmed" | "Cancelled";
  amount: number;
}

export const MOCK_SALES_ORDERS_LIST: SalesOrderListItem[] = [
  { id: "1", soNo: "SO-2026-1015", orderDate: "2026-06-01", buyer: "Zara Fashion Pvt Limited", location: "Mumbai, Maharashtra", deliveryDate: "2026-06-17", status: "Confirmed", amount: 1250000 },
  { id: "2", soNo: "SO-2026-1001", orderDate: "2026-06-02", buyer: "H&M", location: "Bengaluru, Karnataka", deliveryDate: "2026-06-11", status: "Confirmed", amount: 450000 },
  { id: "3", soNo: "SO-2026-1002", orderDate: "2026-06-02", buyer: "Zara Fashion Pvt Limited", location: "Mumbai, Maharashtra", deliveryDate: "2026-06-18", status: "Draft", amount: 890000 },
  { id: "4", soNo: "SO-2026-1003", orderDate: "2026-06-03", buyer: "Levi's", location: "New Delhi, Delhi", deliveryDate: "2026-06-24", status: "Draft", amount: 320000 },
  { id: "5", soNo: "SO-2026-1004", orderDate: "2026-06-04", buyer: "Uniqlo", location: "Pune, Maharashtra", deliveryDate: "2026-07-04", status: "Confirmed", amount: 675000 },
  { id: "6", soNo: "SO-2026-1005", orderDate: "2026-06-04", buyer: "Marks & Spencer", location: "Kolkata, West Bengal", deliveryDate: "2026-06-04", status: "Confirmed", amount: 1100000 },
  { id: "7", soNo: "SO-2026-1008", orderDate: "2026-06-05", buyer: "Zara Fashion Pvt Limited", location: "Mumbai, Maharashtra", deliveryDate: "2026-06-28", status: "Cancelled", amount: 250000 },
];
