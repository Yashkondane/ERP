import { z } from "zod";

export const SizeBreakdownSchema = z.object({
  XS: z.number().min(0).optional(),
  S: z.number().min(0).optional(),
  M: z.number().min(0).optional(),
  L: z.number().min(0).optional(),
  XL: z.number().min(0).optional(),
  XXL: z.number().min(0).optional(),
  "3XL": z.number().min(0).optional(),
  "4XL": z.number().min(0).optional(),
  "5XL": z.number().min(0).optional(),
  "6XL": z.number().min(0).optional(),
});

export type SizeBreakdown = z.infer<typeof SizeBreakdownSchema>;

export const ProductLineItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  name: z.string(),
  image: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  type: z.string().optional(),
  color: z.string(),
  sizeBreakdown: SizeBreakdownSchema,
  rate: z.number().min(0),
});
export type ProductLineItem = z.infer<typeof ProductLineItemSchema>;

export const CatalogProductSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  category: z.string(),
  subcategory: z.string(),
  type: z.string(),
  color: z.string(),
  rate: z.number(),
  image: z.string().optional(),
});

export type CatalogProduct = z.infer<typeof CatalogProductSchema>;

export const AddressSchema = z.object({
  id: z.string().optional(),
  companyName: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  country: z.string(),
  gstin: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export type Address = z.infer<typeof AddressSchema>;

export const BuyerSchema = z.object({
  id: z.string(),
  name: z.string(),
  creditLimit: z.number(),
  balance: z.number(),
  billingAddress: AddressSchema,
  shippingAddress: AddressSchema.optional(),
  shippingAddresses: z.array(AddressSchema).optional(),
});

export type Buyer = z.infer<typeof BuyerSchema>;

export const AttachmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  type: z.string(),
});

export type Attachment = z.infer<typeof AttachmentSchema>;

export const SalesOrderSchema = z.object({
  salesOrderNo: z.string(),
  orderDate: z.date(),
  status: z.enum(["Draft", "Confirmed", "Sent", "Cancelled"]),

  buyerId: z.string().min(1, "Buyer is required"),
  buyerPoNo: z.string().min(1, "PO No is required"),
  poDate: z.date(),
  deliveryDate: z.date(),

  products: z.array(ProductLineItemSchema),
  attachments: z.array(AttachmentSchema),

  discountPercentage: z.number().min(0).max(100).optional(),
  cgstRate: z.number().optional(),
  sgstRate: z.number().optional(),
  internalNotes: z.string().optional(),
});

export type SalesOrder = z.infer<typeof SalesOrderSchema>;
