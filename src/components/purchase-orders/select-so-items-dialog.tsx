import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductLineItem } from "@/types/sales-order";
import { MOCK_SALES_ORDERS_LIST } from "@/data/mock-sales-order";
import { X, ArrowRight } from "lucide-react";
import { POItem } from "@/types/purchase-order";

// All mock SO items we use across SOs
const ALL_SO_ITEMS: (ProductLineItem & { soItem: string, requiredQtyMtr: number, soId: string, soNo: string })[] = [
  // SO-2026-1015 (id: "1") — Zara
  { id: "line-1", productId: "ST001", name: "Men's Casual Shirt", type: "Half Sleeve Regular Collar", color: "White", sizeBreakdown: { XS: 50, S: 100, M: 150, L: 120, XL: 80, XXL: 0 }, rate: 250, soItem: "SO001-01", requiredQtyMtr: 900.00, soId: "1", soNo: "SO-2026-1015" } as any,
  { id: "line-2", productId: "ST003", name: "Men's Casual Shirt", type: "Half Sleeve Cuban Collar", color: "Navy", sizeBreakdown: { XS: 30, S: 80, M: 120, L: 100, XL: 70, XXL: 0 }, rate: 250, soItem: "SO001-02", requiredQtyMtr: 760.00, soId: "1", soNo: "SO-2026-1015" } as any,
  { id: "line-3", productId: "TS001", name: "Men's Polo T-Shirt", type: "Half Sleeve", color: "Black", sizeBreakdown: { XS: 40, S: 80, M: 120, L: 100, XL: 60, XXL: 0 }, rate: 250, soItem: "SO001-03", requiredQtyMtr: 640.00, soId: "1", soNo: "SO-2026-1015" } as any,
  // SO-2026-1001 (id: "2") — H&M
  { id: "line-7", productId: "HM001", name: "Women's Linen Blouse", type: "Relaxed Fit", color: "Ivory", sizeBreakdown: { XS: 60, S: 120, M: 140, L: 100, XL: 50, XXL: 0 }, rate: 230, soItem: "SO004-01", requiredQtyMtr: 700.00, soId: "2", soNo: "SO-2026-1001" } as any,
  { id: "line-8", productId: "HM002", name: "Men's Chino Trouser", type: "Slim Fit", color: "Beige", sizeBreakdown: { XS: 20, S: 70, M: 110, L: 90, XL: 40, XXL: 0 }, rate: 290, soItem: "SO004-02", requiredQtyMtr: 480.00, soId: "2", soNo: "SO-2026-1001" } as any,
  // SO-2026-1002 (id: "3") — Zara (draft)
  { id: "line-4", productId: "DJ001", name: "Denim Jacket", type: "Regular Fit", color: "Blue", sizeBreakdown: { XS: 20, S: 60, M: 90, L: 80, XL: 50, XXL: 0 }, rate: 350, soItem: "SO002-01", requiredQtyMtr: 540.00, soId: "3", soNo: "SO-2026-1002" } as any,
  { id: "line-5", productId: "ST004", name: "Slim Fit Trouser", type: "Regular", color: "Khaki", sizeBreakdown: { XS: 30, S: 70, M: 110, L: 90, XL: 60, XXL: 0 }, rate: 280, soItem: "SO002-02", requiredQtyMtr: 420.00, soId: "3", soNo: "SO-2026-1002" } as any,
  // SO-2026-1003 (id: "4") — Levi's
  { id: "line-9",  productId: "LV001", name: "Slim Fit Jeans", type: "511 Slim", color: "Dark Indigo", sizeBreakdown: { XS: 0, S: 80, M: 130, L: 110, XL: 60, XXL: 20 }, rate: 420, soItem: "SO005-01", requiredQtyMtr: 660.00, soId: "4", soNo: "SO-2026-1003" } as any,
  { id: "line-10", productId: "LV002", name: "Denim Shorts", type: "Cut Off", color: "Light Wash", sizeBreakdown: { XS: 30, S: 60, M: 90, L: 70, XL: 30, XXL: 0 }, rate: 380, soItem: "SO005-02", requiredQtyMtr: 360.00, soId: "4", soNo: "SO-2026-1003" } as any,
  // SO-2026-1004 (id: "5") — Uniqlo
  { id: "line-11", productId: "UQ001", name: "Men's Ultra Light Down Jacket", type: "Packable", color: "Navy", sizeBreakdown: { XS: 30, S: 80, M: 150, L: 120, XL: 70, XXL: 20 }, rate: 550, soItem: "SO006-01", requiredQtyMtr: 1200.00, soId: "5", soNo: "SO-2026-1004" } as any,
  { id: "line-12", productId: "UQ002", name: "Women's Fleece Jacket", type: "Full Zip", color: "Off White", sizeBreakdown: { XS: 50, S: 100, M: 130, L: 90, XL: 40, XXL: 0 }, rate: 480, soItem: "SO006-02", requiredQtyMtr: 820.00, soId: "5", soNo: "SO-2026-1004" } as any,
  { id: "line-13", productId: "UQ003", name: "Men's Oxford Shirt", type: "Regular Fit", color: "White", sizeBreakdown: { XS: 20, S: 60, M: 110, L: 95, XL: 55, XXL: 10 }, rate: 310, soItem: "SO006-03", requiredQtyMtr: 590.00, soId: "5", soNo: "SO-2026-1004" } as any,
  // SO-2026-1005 (id: "6") — Marks & Spencer
  { id: "line-14", productId: "MS001", name: "Women's Tailored Blazer", type: "Single Button", color: "Charcoal", sizeBreakdown: { XS: 30, S: 80, M: 100, L: 80, XL: 40, XXL: 10 }, rate: 680, soItem: "SO007-01", requiredQtyMtr: 940.00, soId: "6", soNo: "SO-2026-1005" } as any,
  { id: "line-15", productId: "MS002", name: "Men's Formal Trousers", type: "Straight Fit", color: "Navy", sizeBreakdown: { XS: 0, S: 60, M: 120, L: 110, XL: 70, XXL: 20 }, rate: 520, soItem: "SO007-02", requiredQtyMtr: 760.00, soId: "6", soNo: "SO-2026-1005" } as any,
  // SO-2026-1008 (id: "7") — Zara (cancelled)
  { id: "line-6", productId: "TS002", name: "Men's Polo T-Shirt", type: "Short Sleeve", color: "White", sizeBreakdown: { XS: 25, S: 65, M: 100, L: 85, XL: 45, XXL: 0 }, rate: 220, soItem: "SO003-01", requiredQtyMtr: 380.00, soId: "7", soNo: "SO-2026-1008" } as any,
];

interface SelectSalesOrderItemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  buyerId: string; // For Trims this is comma-separated SO IDs; for Fabric it's a single SO ID
  existingPoItems: POItem[];
  onNext: (selectedSoItem: ProductLineItem & { soItem: string, requiredQtyMtr: number }) => void;
  type?: "Fabric" | "Trims";
}

export function SelectSalesOrderItemsDialog({
  open,
  onOpenChange,
  buyerId,
  existingPoItems,
  onNext,
  type = "Fabric",
}: SelectSalesOrderItemsDialogProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const isTrim = type === "Trims";

  // Determine which SO IDs to show items for
  const selectedSoIds = isTrim
    ? buyerId.split(",").filter(Boolean)
    : [buyerId];

  // For Fabric: use the original single-SO mock
  const fabricSalesOrder = MOCK_SALES_ORDERS_LIST.find(so => so.id === buyerId);

  const fabricSoItems: (ProductLineItem & { soItem: string, requiredQtyMtr: number })[] = [
    { id: "line-1", productId: "ST001", name: "Men's Casual Shirt", type: "Half Sleeve Regular Collar", color: "White", sizeBreakdown: { XS: 50, S: 100, M: 150, L: 120, XL: 80, XXL: 0 }, rate: 250, soItem: "SO001-01", requiredQtyMtr: 900.00 } as any,
    { id: "line-2", productId: "ST003", name: "Men's Casual Shirt", type: "Half Sleeve Cuban Collar", color: "Navy", sizeBreakdown: { XS: 30, S: 80, M: 120, L: 100, XL: 70, XXL: 0 }, rate: 250, soItem: "SO001-02", requiredQtyMtr: 760.00 } as any,
    { id: "line-3", productId: "TS001", name: "Men's Polo T-Shirt", type: "Half Sleeve", color: "Black", sizeBreakdown: { XS: 40, S: 80, M: 120, L: 100, XL: 60, XXL: 0 }, rate: 250, soItem: "SO001-03", requiredQtyMtr: 640.00 } as any,
  ];

  // For Trims: group items by SO
  const trimItemsGrouped: { soNo: string; soId: string; items: typeof ALL_SO_ITEMS }[] = [];
  selectedSoIds.forEach(soId => {
    const items = ALL_SO_ITEMS.filter(item => item.soId === soId);
    if (items.length > 0) {
      trimItemsGrouped.push({ soId, soNo: items[0].soNo, items });
    }
  });

  const allTrimItems = trimItemsGrouped.flatMap(g => g.items);
  const soItems = isTrim ? allTrimItems : fabricSoItems;

  const handleNext = () => {
    if (!selectedItemId) return;
    const item = soItems.find(i => i.id === selectedItemId);
    if (item) {
      onNext(item);
      setTimeout(() => setSelectedItemId(null), 300);
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
        className={`${isLocked ? 'bg-slate-50/70' : 'hover:bg-blue-50/50 cursor-pointer transition-colors'} ${selectedItemId === item.id ? 'bg-blue-50/50' : ''}`}
        onClick={() => !isLocked && setSelectedItemId(item.id)}
      >
        <td className="px-4 py-4 text-center">
          <div className="flex justify-center">
            <input
              type="checkbox"
              checked={selectedItemId === item.id || isLocked}
              onChange={() => !isLocked && setSelectedItemId(item.id)}
              disabled={isLocked}
              className={`w-4 h-4 rounded cursor-pointer accent-[#0453B8] ${isLocked ? 'text-slate-400 border-slate-300' : 'text-[#0453B8] border-slate-300 focus:ring-[#0453B8]'}`}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </td>
        <td className={`px-4 py-4 font-bold text-center ${isLocked ? 'text-slate-500' : 'text-slate-900'}`}>{(item as any).soItem}</td>
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
        <td className="px-4 py-4">
          {activeSizes.length > 0 ? (
            <div className={`grid grid-cols-5 gap-1 mx-auto w-fit ${isLocked ? 'opacity-50' : ''}`}>
              {activeSizes.map(({ size, qty }) => (
                <div key={size} className="flex flex-col items-center border border-slate-200 rounded-md overflow-hidden min-w-[32px] bg-white shadow-sm">
                  <div className="text-[10px] w-full text-center py-0.5 font-bold text-[#0453B8] border-b border-slate-200 px-1.5 leading-tight">{size}</div>
                  <div className="w-full h-6 flex items-center justify-center text-[13px] font-semibold text-[#0453B8] px-1.5">{qty}</div>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-sm text-slate-400 flex justify-center">No sizes</span>
          )}
        </td>
        <td className={`px-4 py-4 text-center font-bold text-sm ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>{totalPcs}</td>
        <td className={`px-4 py-4 text-center font-bold text-sm ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>{(item as any).requiredQtyMtr.toFixed(2)}</td>
      </tr>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[1000px] h-[90vh] sm:h-[750px] flex flex-col p-0 overflow-hidden bg-white [&>button]:hidden shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-slate-200 flex flex-row items-center justify-between shadow-sm">
          <DialogTitle className="text-xl font-bold text-[#0F172A]">1. Select Sales Order Items</DialogTitle>
          <button onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {/* Header Info — only for Fabric */}
          {!isTrim && (
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-500">Sales Order No.</span>
                <div className="h-10 px-3 py-2 border border-slate-200 rounded-md text-sm bg-white font-medium flex items-center text-slate-700">SO001</div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-500">Buyer / Customer</span>
                <div className="h-10 px-3 py-2 border border-slate-200 rounded-md text-sm bg-white font-medium flex items-center">Zara</div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-500">Order Date</span>
                <div className="h-10 px-3 py-2 border border-slate-200 rounded-md text-sm bg-white font-medium flex items-center">15 May 2025</div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-500">Delivery Date</span>
                <div className="h-10 px-3 py-2 border border-slate-200 rounded-md text-sm bg-white font-medium flex items-center">30 Jun 2025</div>
              </div>
            </div>
          )}

          {/* Items Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F8FAFC] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-bold text-slate-700 text-center w-16">Select</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-center">SO Item</th>
                  <th className="px-4 py-3 font-bold text-slate-700">Product / Style</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-center">Color</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-center text-xs">Size Breakup</th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-center">Total Qty<br/><span className="text-xs text-slate-500 font-medium">(Pcs)</span></th>
                  <th className="px-4 py-3 font-bold text-slate-700 text-center">Required Qty<br/><span className="text-xs text-slate-500 font-medium">(Pcs From System)</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isTrim ? (
                  trimItemsGrouped.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-slate-400 text-sm">
                        No Sales Orders selected. Please select at least one Sales Order from the PO form.
                      </td>
                    </tr>
                  ) : (
                    trimItemsGrouped.map((group) => (
                      <>
                        {/* SO Group Header */}
                        <tr key={`group-${group.soId}`} className="bg-blue-50 border-b border-blue-100">
                          <td colSpan={7} className="px-4 py-2">
                            <span className="text-xs font-bold text-[#0453B8] uppercase tracking-wide">
                              Sales Order: {group.soNo}
                            </span>
                          </td>
                        </tr>
                        {group.items.map(item => {
                          const isLocked = existingPoItems.some(poItem => poItem.soItemId === item.id);
                          return renderRow(item, isLocked);
                        })}
                      </>
                    ))
                  )
                ) : (
                  fabricSoItems.map((item) => {
                    const isLocked = existingPoItems.some(poItem => poItem.soItemId === item.id);
                    return renderRow(item, isLocked);
                  })
                )}
              </tbody>
              <tfoot className="bg-slate-50/80 border-t border-slate-200">
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-right font-bold text-slate-700">Total Required (From System)</td>
                  <td className="px-4 py-4 text-center font-bold text-slate-900 text-[15px]">{totalRequired.toFixed(2)} Pcs</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end bg-slate-50 rounded-b-lg flex-shrink-0">
          <Button
            disabled={!selectedItemId}
            onClick={handleNext}
            className="bg-[#0453B8] hover:bg-blue-700 text-white font-bold px-6 py-2.5 h-auto text-sm shadow-sm transition-all disabled:opacity-50"
          >
            Next: Enter {isTrim ? "Trim" : "Fabric"} Items <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
