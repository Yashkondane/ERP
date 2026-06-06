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
    }
  }
];

export const MOCK_PRODUCTS: ProductLineItem[] = [
  {
    id: "line-1",
    productId: "PT-1001",
    name: "Polo T-Shirt",
    color: "Black",
    sizeBreakdown: { S: 10, M: 20, L: 15, XL: 5, XXL: 0 },
    rate: 250.00,
  },
  {
    id: "line-2",
    productId: "PT-1001",
    name: "Polo T-Shirt",
    color: "Navy",
    sizeBreakdown: { S: 5, M: 10, L: 8, XL: 2, XXL: 0 },
    rate: 250.00,
  },
  {
    id: "line-3",
    productId: "HD-2001",
    name: "Hoodie",
    color: "Grey",
    sizeBreakdown: { S: 5, M: 10, L: 10, XL: 5, XXL: 0 },
    rate: 600.00,
  }
];

export const MOCK_CATALOG_PRODUCTS: CatalogProduct[] = [
  { id: "cat-1", code: "PT-1001", name: "Polo T-Shirt", category: "Men Shirt", subcategory: "Half Sleeves", type: "Cotton", color: "Black", rate: 250.00 },
  { id: "cat-2", code: "PT-1002", name: "Polo T-Shirt", category: "Men Shirt", subcategory: "Half Sleeves", type: "Cotton", color: "Navy", rate: 250.00 },
  { id: "cat-3", code: "PT-1003", name: "Polo T-Shirt", category: "Men Shirt", subcategory: "Half Sleeves", type: "Cotton", color: "White", rate: 250.00 },
  { id: "cat-4", code: "HD-2001", name: "Hoodie", category: "Winter Wear", subcategory: "Full Sleeves", type: "Fleece", color: "Grey", rate: 600.00 },
  { id: "cat-5", code: "HD-2002", name: "Hoodie", category: "Winter Wear", subcategory: "Full Sleeves", type: "Fleece", color: "Black", rate: 600.00 },
  { id: "cat-6", code: "JS-3001", name: "Jeans", category: "Bottom Wear", subcategory: "Slim Fit", type: "Denim", color: "Blue", rate: 850.00 },
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
};
