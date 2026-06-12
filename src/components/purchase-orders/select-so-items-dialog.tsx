import { useState, Fragment } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductLineItem } from "@/types/sales-order";
import { MOCK_SALES_ORDERS_LIST } from "@/data/mock-sales-order";
import { X, ArrowRight } from "lucide-react";
import { POItem } from "@/types/purchase-order";

// All mock SO items we use across SOs
export const ALL_SO_ITEMS: (ProductLineItem & { soItem: string, requiredQtyMtr: number, soId: string, soNo: string })[] = [
  // SO-2026-001 (id: "1") — Zara
  { id: "line-1", productId: "ST001", name: "Men's Casual Shirt", type: "Half Sleeve Regular Collar", color: "White", sizeBreakdown: { XS: 50, S: 100, M: 150, L: 120, XL: 80, XXL: 0 }, rate: 250, soItem: "SO001-01", requiredQtyMtr: 900.00, soId: "1", soNo: "SO-2026-001" } as any,
  { id: "line-2", productId: "ST003", name: "Men's Casual Shirt", type: "Half Sleeve Cuban Collar", color: "Navy", sizeBreakdown: { XS: 30, S: 80, M: 120, L: 100, XL: 70, XXL: 0 }, rate: 250, soItem: "SO001-02", requiredQtyMtr: 760.00, soId: "1", soNo: "SO-2026-001" } as any,
  { id: "line-3", productId: "TS001", name: "Men's Polo T-Shirt", type: "Half Sleeve", color: "Black", sizeBreakdown: { XS: 40, S: 80, M: 120, L: 100, XL: 60, XXL: 0 }, rate: 250, soItem: "SO001-03", requiredQtyMtr: 640.00, soId: "1", soNo: "SO-2026-001" } as any,
  // SO-2026-002 (id: "2") — H&M
  { id: "line-7", productId: "HM001", name: "Women's Linen Blouse", type: "Relaxed Fit", color: "Ivory", sizeBreakdown: { XS: 60, S: 120, M: 140, L: 100, XL: 50, XXL: 0 }, rate: 230, soItem: "SO004-01", requiredQtyMtr: 700.00, soId: "2", soNo: "SO-2026-002" } as any,
  { id: "line-8", productId: "HM002", name: "Men's Chino Trouser", type: "Slim Fit", color: "Beige", sizeBreakdown: { XS: 20, S: 70, M: 110, L: 90, XL: 40, XXL: 0 }, rate: 290, soItem: "SO004-02", requiredQtyMtr: 480.00, soId: "2", soNo: "SO-2026-002" } as any,
  // SO-2026-003 (id: "3") — Zara (draft)
  { id: "line-4", productId: "DJ001", name: "Denim Jacket", type: "Regular Fit", color: "Blue", sizeBreakdown: { XS: 20, S: 60, M: 90, L: 80, XL: 50, XXL: 0 }, rate: 350, soItem: "SO002-01", requiredQtyMtr: 540.00, soId: "3", soNo: "SO-2026-003" } as any,
  { id: "line-5", productId: "ST004", name: "Slim Fit Trouser", type: "Regular", color: "Khaki", sizeBreakdown: { XS: 30, S: 70, M: 110, L: 90, XL: 60, XXL: 0 }, rate: 280, soItem: "SO002-02", requiredQtyMtr: 420.00, soId: "3", soNo: "SO-2026-003" } as any,
  // SO-2026-004 (id: "4") — Levi's
  { id: "line-9",  productId: "LV001", name: "Slim Fit Jeans", type: "511 Slim", color: "Dark Indigo", sizeBreakdown: { XS: 0, S: 80, M: 130, L: 110, XL: 60, XXL: 20 }, rate: 420, soItem: "SO005-01", requiredQtyMtr: 660.00, soId: "4", soNo: "SO-2026-004" } as any,
  { id: "line-10", productId: "LV002", name: "Denim Shorts", type: "Cut Off", color: "Light Wash", sizeBreakdown: { XS: 30, S: 60, M: 90, L: 70, XL: 30, XXL: 0 }, rate: 380, soItem: "SO005-02", requiredQtyMtr: 360.00, soId: "4", soNo: "SO-2026-004" } as any,
  // SO-2026-005 (id: "5") — Uniqlo
  { id: "line-11", productId: "UQ001", name: "Men's Ultra Light Down Jacket", type: "Packable", color: "Navy", sizeBreakdown: { XS: 30, S: 80, M: 150, L: 120, XL: 70, XXL: 20 }, rate: 550, soItem: "SO006-01", requiredQtyMtr: 1200.00, soId: "5", soNo: "SO-2026-005" } as any,
  { id: "line-12", productId: "UQ002", name: "Women's Fleece Jacket", type: "Full Zip", color: "Off White", sizeBreakdown: { XS: 50, S: 100, M: 130, L: 90, XL: 40, XXL: 0 }, rate: 480, soItem: "SO006-02", requiredQtyMtr: 820.00, soId: "5", soNo: "SO-2026-005" } as any,
  { id: "line-13", productId: "UQ003", name: "Men's Oxford Shirt", type: "Regular Fit", color: "White", sizeBreakdown: { XS: 20, S: 60, M: 110, L: 95, XL: 55, XXL: 10 }, rate: 310, soItem: "SO006-03", requiredQtyMtr: 590.00, soId: "5", soNo: "SO-2026-005" } as any,
  // SO-2026-006 (id: "6") — Marks & Spencer
  { id: "line-14", productId: "MS001", name: "Women's Tailored Blazer", type: "Single Button", color: "Charcoal", sizeBreakdown: { XS: 30, S: 80, M: 100, L: 80, XL: 40, XXL: 10 }, rate: 680, soItem: "SO007-01", requiredQtyMtr: 940.00, soId: "6", soNo: "SO-2026-006" } as any,
  { id: "line-15", productId: "MS002", name: "Men's Formal Trousers", type: "Straight Fit", color: "Navy", sizeBreakdown: { XS: 0, S: 60, M: 120, L: 110, XL: 70, XXL: 20 }, rate: 520, soItem: "SO007-02", requiredQtyMtr: 760.00, soId: "6", soNo: "SO-2026-006" } as any,
  // SO-2026-007 (id: "7") — Zara (cancelled)
  { id: "line-6", productId: "TS002", name: "Men's Polo T-Shirt", type: "Short Sleeve", color: "White", sizeBreakdown: { XS: 25, S: 65, M: 100, L: 85, XL: 45, XXL: 0 }, rate: 220, soItem: "SO003-01", requiredQtyMtr: 380.00, soId: "7", soNo: "SO-2026-007" } as any,
];

interface SelectSalesOrderItemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  buyerId: string; // For Trims this is comma-separated SO IDs; for Fabric it's a single SO ID
  existingPoItems: POItem[];
  onNext: (selectedSoItems: (ProductLineItem & { soItem: string, requiredQtyMtr: number, soId: string, soNo: string })[], trimItem?: string) => void;
  type?: "Fabric" | "Trims";
  supplierName?: string;
}

export function SelectSalesOrderItemsDialog({
  open,
  onOpenChange,
  buyerId,
  existingPoItems,
  onNext,
  type = "Fabric",
  supplierName,
}: SelectSalesOrderItemsDialogProps) {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [trimItem, setTrimItem] = useState<string>("");

  const isTrim = type === "Trims";

  // Determine which SO IDs to show items for
  const selectedSoIds = buyerId.split(",").filter(Boolean);

  const fabricSoItems: (ProductLineItem & { soItem: string, requiredQtyMtr: number })[] = [
    { id: "line-1", productId: "ST001", name: "Men's Casual Shirt", type: "Half Sleeve Regular Collar", color: "White", sizeBreakdown: { XS: 50, S: 100, M: 150, L: 120, XL: 80, XXL: 0 }, rate: 250, soItem: "SO001-01", requiredQtyMtr: 900.00 } as any,
    { id: "line-2", productId: "ST003", name: "Men's Casual Shirt", type: "Half Sleeve Cuban Collar", color: "Navy", sizeBreakdown: { XS: 30, S: 80, M: 120, L: 100, XL: 70, XXL: 0 }, rate: 250, soItem: "SO001-02", requiredQtyMtr: 760.00 } as any,
    { id: "line-3", productId: "TS001", name: "Men's Polo T-Shirt", type: "Half Sleeve", color: "Black", sizeBreakdown: { XS: 40, S: 80, M: 120, L: 100, XL: 60, XXL: 0 }, rate: 250, soItem: "SO001-03", requiredQtyMtr: 640.00 } as any,
  ];

  // For both Trims and Fabric: group items by SO
  const itemsGrouped: { soNo: string; soId: string; items: typeof ALL_SO_ITEMS }[] = [];
  selectedSoIds.forEach(soId => {
    const items = ALL_SO_ITEMS.filter(item => item.soId === soId);
    if (items.length > 0) {
      itemsGrouped.push({ soId, soNo: items[0].soNo, items });
    }
  });

  const soItems = itemsGrouped.flatMap(g => g.items);

  const handleNext = () => {
    if (selectedItemIds.length === 0) return;
    const items = soItems.filter(i => selectedItemIds.includes(i.id));
    if (items.length > 0) {
      onNext(items, trimItem);
      setTimeout(() => setSelectedItemIds([]), 300);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedItemIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    const availableItems = soItems.filter(item => !existingPoItems.some(poItem => poItem.soItemId === item.id));
    if (selectedItemIds.length === availableItems.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(availableItems.map(i => i.id));
    }
  };

  const totalRequired = soItems.reduce((acc, curr) => acc + curr.requiredQtyMtr, 0);

  const renderRow = (item: typeof soItems[0], isLocked: boolean) => {
    const totalPcs = Object.values(item.sizeBreakdown || {}).reduce((a, b) => a + (b as number), 0);
    const activeSizes = Object.entries(item.sizeBreakdown || {})
      .filter(([_, qty]) => qty !== undefined && (qty as number) > 0)
      .map(([size, qty]) => ({ size, qty: qty as number }));

    return (
      <tr
        key={item.id}
        className={`${isLocked ? 'bg-slate-50/70' : 'hover:bg-blue-50/50 cursor-pointer transition-colors'} ${selectedItemIds.includes(item.id) ? 'bg-blue-50/50' : ''}`}
        onClick={() => !isLocked && toggleSelection(item.id)}
      >
        <td className="px-4 py-4 text-center">
          <div className="flex justify-center">
            <input
              type="checkbox"
              checked={selectedItemIds.includes(item.id) || isLocked}
              onChange={() => !isLocked && toggleSelection(item.id)}
              disabled={isLocked}
              className={`w-4 h-4 rounded cursor-pointer accent-[#0453B8] ${isLocked ? 'text-slate-400 border-slate-300' : 'text-[#0453B8] border-slate-300 focus:ring-[#0453B8]'}`}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </td>
        <td className="px-4 py-4 text-center">
          <div className="h-12 w-12 mx-auto relative overflow-hidden bg-slate-100 rounded border border-slate-200 flex items-center justify-center p-1">
            <img 
              src={
                item.name.includes("T-Shirt") ? "/men casual tshirt.jpeg" : 
                item.name.includes("Shirt") ? "/men casual half shirt.jpg" :
                item.name.includes("Jacket") ? "/mens casual full sleeve shirt.jpg" : 
                "/men regualr fit shirt.jpeg"
              } 
              alt={item.name} 
              className={`w-full h-full object-contain mix-blend-multiply ${isLocked ? 'opacity-50 grayscale' : ''}`} 
            />
          </div>
        </td>
        <td className="px-4 py-4">
          <div className={`font-bold ${isLocked ? 'text-slate-500' : 'text-[#0453B8]'}`}>{item.productId}</div>
          <div className={`font-medium mt-0.5 ${isLocked ? 'text-slate-400' : 'text-slate-700'}`}>{item.name}</div>
          <div className="text-slate-500 text-[11px] mt-0.5">{item.type}</div>
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            <div className={`w-3.5 h-3.5 rounded-full border border-slate-300 shadow-sm ${item.color === 'White' ? 'bg-white' : item.color === 'Navy' ? 'bg-[#0F172A]' : item.color === 'Blue' ? 'bg-blue-600' : item.color === 'Khaki' ? 'bg-[#C3A882]' : 'bg-black'} ${isLocked ? 'opacity-50' : ''}`}></div>
            <span className={`font-semibold text-sm ${isLocked ? 'text-slate-400' : 'text-slate-700'}`}>{item.color}</span>
          </div>
        </td>
        <td className={`px-4 py-4 text-center font-bold text-sm ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>{totalPcs}</td>
        <td className={`px-4 py-4 text-center font-bold text-sm ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>{(item as any).requiredQtyMtr.toFixed(2)}</td>
      </tr>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[1000px] h-[90vh] sm:h-[750px] flex flex-col p-0 overflow-hidden bg-white [&>button]:hidden shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-slate-200 shadow-sm bg-slate-50/50">
          <div className="flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-bold text-[#0F172A]">
              1. Select Sales Order Items {supplierName && <span className="text-slate-500 font-medium ml-2">for {supplierName}</span>}
            </DialogTitle>
            <button onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {type === "Trims" && (
            <div className="mt-4 p-4 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100">
                <span className="text-[#0453B8] flex items-center justify-center w-5 h-5 text-xs rounded-full bg-blue-100 mr-1">2</span>
                Select Trim Item:
              </div>
              <Select value={trimItem} onValueChange={setTrimItem}>
                <SelectTrigger className="w-[300px] bg-white border-slate-200 focus:ring-[#0453B8] font-medium h-10">
                  <SelectValue placeholder="Select Trim Item (e.g. Button, Label)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Button">Button</SelectItem>
                  <SelectItem value="Label">Label</SelectItem>
                  <SelectItem value="Hangtag">Hangtag</SelectItem>
                </SelectContent>
              </Select>
              {!trimItem && (
                <span className="text-xs text-red-500 font-medium animate-pulse ml-2 flex items-center gap-1">
                  * Required
                </span>
              )}
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">


          {/* Items Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F8FAFC] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-bold text-slate-700 text-center w-16">
                    <input 
                      type="checkbox" 
                      onChange={toggleSelectAll} 
                      className="w-4 h-4 rounded cursor-pointer accent-[#0453B8] text-[#0453B8] border-slate-300 focus:ring-[#0453B8]"
                    />
                  </th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-center">Image</th>
                  <th className="px-4 py-3 font-bold text-slate-700">Product / Style</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-center">Color</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-center">Total Qty<br/><span className="text-xs text-slate-500 font-medium">(Pcs)</span></th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-center">Required Qty<br/><span className="text-xs text-slate-500 font-medium">(Pcs From System)</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {itemsGrouped.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-400 text-sm">
                      No Sales Orders selected. Please select at least one Sales Order from the PO form.
                    </td>
                  </tr>
                ) : (
                  itemsGrouped.map((group) => (
                    <Fragment key={group.soId}>
                      {/* SO Group Header */}
                      <tr key={`group-${group.soId}`} className="bg-blue-50 border-b border-blue-100">
                        <td colSpan={6} className="px-4 py-2">
                          <span className="text-xs font-bold text-[#0453B8] uppercase tracking-wide">
                            Sales Order: {group.soNo}
                          </span>
                        </td>
                      </tr>
                      {group.items.map(item => {
                        const isLocked = existingPoItems.some(poItem => poItem.soItemId === item.id);
                        return renderRow(item, isLocked);
                      })}
                    </Fragment>
                  ))
                )}
              </tbody>
              <tfoot className="bg-slate-50/80 border-t border-slate-200">
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-right font-bold text-slate-700">Total Required (From System)</td>
                  <td className="px-4 py-4 text-center font-bold text-slate-900 text-[15px]">{totalRequired.toFixed(2)} Pcs</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end items-center bg-slate-50 rounded-b-lg flex-shrink-0">
          <Button
            disabled={selectedItemIds.length === 0 || (type === "Trims" && !trimItem)}
            onClick={handleNext}
            className="bg-[#0453B8] hover:bg-blue-700 text-white font-bold px-6 py-2.5 h-auto text-sm shadow-sm transition-all disabled:opacity-50"
          >
            Add Selected Items <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
