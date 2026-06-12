export interface POItem {
  id: string;
  material: string; // The item name/description
  gsmContent?: string; // Kept for backward compatibility or trims
  gsm?: string;
  width?: string;
  colorShade: string; // Color/Shade or variation
  requiredQty?: number;
  buffer?: number;
  qty: number;
  uom: string;
  rate: number;
  gst: number;
  amount: number;
  soItemId?: string; // Links this PO item to a specific Sales Order Item
  images?: { name: string; url: string }[];
  code?: string; // Item code (mostly used for Trims)
  deliveryDate?: string;
  productName?: string;
  productImage?: string;
  productCode?: string;
  productFit?: string;
  soNo?: string;
  fabricImage?: string;
}
