"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ArrowLeft, FileText, MapPin, CheckCircle2, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { NotesPanel } from "@/components/sales-order/notes-panel";
import { AttachmentsModal } from "@/components/sales-order/attachments-modal";
import { useForm, FormProvider } from "react-hook-form";
import { MOCK_BUYERS, MOCK_SALES_ORDERS_LIST } from "@/data/mock-sales-order";
import { INITIAL_MASTER_SUPPLIERS } from "@/data/mock-masters";
import { AddItemDialog } from "@/components/purchase-orders/add-item-dialog";
import { POItemsTable } from "@/components/purchase-orders/po-items-table";
import { POItem } from "@/types/purchase-order";
import { useRouter } from "next/navigation";
import { SelectSalesOrderItemsDialog, ALL_SO_ITEMS } from "@/components/purchase-orders/select-so-items-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PurchaseOrderFormProps {
  initialPo?: any;
  isEditMode?: boolean;
  type: "Fabric" | "Trims";
  itemLabel: string; // e.g. "Material" or "Trim Item"
  specLabel?: string; // e.g. "GSM / Content" or "Specifications"
  itemOptions: string[]; // Options for dropdown
  backHref: string; // e.g. "/fabric-purchases"
}

export function PurchaseOrderForm({ 
  initialPo, 
  isEditMode = false,
  type,
  itemLabel,
  specLabel = "GSM / Content",
  itemOptions,
  backHref
}: PurchaseOrderFormProps) {
  const router = useRouter();
  
  const methods = useForm({
    defaultValues: {
      buyerId: initialPo?.buyerId || "b-3", // default to Zara Fashion
      supplier: initialPo?.supplier || "",
    }
  });

  const [poItems, setPoItems] = useState<POItem[]>(initialPo?.items || []);
  const [editingItem, setEditingItem] = useState<POItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSoItemContext, setSelectedSoItemContext] = useState<any | null>(null);
  const [selectedTrimItem, setSelectedTrimItem] = useState<string>(type === "Fabric" ? "Cotton Fabric" : "Button");
  const [selectedBuyerId, setSelectedBuyerId] = useState<string | null>(null);
  const [isLinkedToSo, setIsLinkedToSo] = useState(true);
  const [sortCategory, setSortCategory] = useState<string>("All Categories");

  const [showAddress, setShowAddress] = useState(true);

  useEffect(() => {
    if (poItems.length > 0) setShowAddress(false);
    else setShowAddress(true);
  }, [poItems.length]);

  useEffect(() => {
    if (initialPo) {
      methods.reset({
        ...initialPo,
        buyerId: initialPo.buyerId || "b-3",
        supplier: initialPo.supplier || ""
      });
      
      // Restore Buyer dropdown — use buyer name directly (matches MOCK_SALES_ORDERS_LIST)
      if (initialPo.buyer) {
        setSelectedBuyerId(initialPo.buyer);
      } else {
        // Fallback: look up from MOCK_BUYERS by id
        const buyerObj = MOCK_BUYERS.find(b => b.id === (initialPo.buyerId || "b-3"));
        if (buyerObj) setSelectedBuyerId(buyerObj.name);
      }

      // Restore pre-selected Sales Order IDs (comma-separated)
      if (initialPo.soIds) {
        methods.setValue("buyerId", initialPo.soIds);
      }

      if (type === "Trims" && initialPo.trimItem) {
        setSelectedTrimItem(initialPo.trimItem);
      }

      const numericQty = parseInt((initialPo.qty || "0").toString().replace(/[^0-9]/g, "")) || 1200;
      const rate = initialPo?.id === "FPO-5002" ? 185 : (initialPo?.rate || 180);
      const baseMaterial = initialPo?.material || initialPo?.itemDesc || (type === "Fabric" ? "Cotton Fabric" : "Button");
      
      const qty1 = Math.floor(numericQty * 0.4);
      const qty2 = Math.floor(numericQty * 0.4);
      const qty3 = numericQty - qty1 - qty2;
      const defaultDeliveryDate = initialPo?.delivery || "2026-06-21";
      
      setPoItems([
        {
          id: "item-1",
          material: type === "Fabric" ? baseMaterial : "Button",
          code: type === "Fabric" ? undefined : "BTN-18L-BLK",
          gsmContent: type === "Fabric" ? "180gsm CO" : "Standard",
          width: type === "Fabric" ? "44\"" : undefined,
          colorShade: type === "Fabric" ? "Grey" : "Black",
          requiredQty: Math.floor(qty1 * 0.95),
          qty: qty1,
          buffer: qty1 - Math.floor(qty1 * 0.95),
          uom: type === "Fabric" ? "mtr" : "pcs",
          rate: rate,
          gst: initialPo?.gst || 5,
          amount: qty1 * rate,
          deliveryDate: defaultDeliveryDate,
        },
        {
          id: "item-2",
          material: type === "Fabric" ? baseMaterial : "Label",
          code: type === "Fabric" ? undefined : "LBL-WVN-ZRA",
          gsmContent: type === "Fabric" ? "180gsm CO" : "Standard",
          width: type === "Fabric" ? "44\"" : undefined,
          colorShade: type === "Fabric" ? "Navy" : "Navy / White",
          requiredQty: Math.floor(qty2 * 0.95),
          qty: qty2,
          buffer: qty2 - Math.floor(qty2 * 0.95),
          uom: type === "Fabric" ? "mtr" : "pcs",
          rate: rate,
          gst: initialPo?.gst || 5,
          amount: qty2 * rate,
          deliveryDate: defaultDeliveryDate,
        },
        {
          id: "item-3",
          material: type === "Fabric" ? baseMaterial : "Hangtag",
          code: type === "Fabric" ? undefined : "HTG-PRM-BLK",
          gsmContent: type === "Fabric" ? "180gsm CO" : "Standard",
          width: type === "Fabric" ? "44\"" : undefined,
          colorShade: type === "Fabric" ? "White" : "Black",
          requiredQty: Math.floor(qty3 * 0.95),
          qty: qty3,
          buffer: qty3 - Math.floor(qty3 * 0.95),
          uom: type === "Fabric" ? "mtr" : "pcs",
          rate: rate,
          gst: initialPo?.gst || 5,
          amount: qty3 * rate,
          deliveryDate: defaultDeliveryDate,
        }
      ]);
    } else {
      setPoItems([]);
    }
  }, [initialPo, methods, type]);

  const handleAddItem = (item: POItem) => {
    if (editingItem) {
      setPoItems(prev => prev.map(i => i.id === item.id ? item : i));
    } else if (type === "Trims") {
      // Group by Trim Item + Code + Color — merge qty if same combination exists
      // Use functional updater to always read latest state (avoids stale closure bug)
      setPoItems(prev => {
        const existing = prev.find(
          i => i.material === item.material && i.code === item.code && i.colorShade === item.colorShade
        );
        if (existing) {
          return prev.map(i =>
            i.id === existing.id
              ? {
                  ...i,
                  qty: i.qty + item.qty,
                  requiredQty: (i.requiredQty || 0) + (item.requiredQty || 0),
                  buffer: (i.buffer || 0) + (item.buffer || 0),
                  amount: (i.qty + item.qty) * i.rate,
                }
              : i
          );
        } else {
          return [{ ...item, soItemId: selectedSoItemContext?.id }, ...prev];
        }
      });
    } else {
      setPoItems(prev => [{ ...item, soItemId: selectedSoItemContext?.id }, ...prev]);
    }
  };


  const handleEditClick = (item: POItem) => {
    setEditingItem(item);
    if (item.soItemId) {
      const found = ALL_SO_ITEMS.find(so => so.id === item.soItemId);
      if (found) setSelectedSoItemContext(found);
    }
    setIsAddDialogOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    setPoItems(poItems.filter(item => item.id !== itemId));
  };

  const handleOpenAddDialog = () => {
    setEditingItem(null);
    setSelectedSoItemContext(null);
    setIsAddDialogOpen(true);
  };

  const handleSoItemNext = (soItems: any[], trimItem?: string) => {
    const isFabric = type === "Fabric";
    const rate = 0;

    const newItems: POItem[] = [];

    soItems.forEach(soItem => {
      const baseQty = isFabric ? soItem.requiredQtyMtr : Object.values(soItem.sizeBreakdown || {}).reduce((a: any, b: any) => a + b, 0);
      
      const soName = soItem.name || "Product";
      const imgUrl = soName.includes("T-Shirt") ? "/men casual tshirt.jpeg" : 
                     soName.includes("Shirt") ? "/men casual half shirt.jpg" :
                     soName.includes("Jacket") ? "/mens casual full sleeve shirt.jpg" : "/men regualr fit shirt.jpeg";
                     
      if (isFabric) {
        const materialCategory = selectedTrimItem || "Cotton Fabric";
        newItems.push({
          id: "item-" + Math.random().toString(36).substr(2, 9),
          soItemId: soItem.id,
          material: materialCategory,
          code: undefined,
          gsmContent: "180gsm CO",
          width: "44\"",
          colorShade: "White",
          requiredQty: baseQty,
          qty: 0,
          buffer: 0,
          uom: "mtr",
          rate: rate,
          gst: 5,
          amount: 0,
          deliveryDate: "",
          images: [],
          productName: soName,
          productImage: imgUrl,
          productCode: soItem.productId,
          productFit: soItem.type,
          soNo: soItem.soNo,
        });
      } else {
        ["Button", "Label", "Hangtag"].forEach(mat => {
          const multiplier = mat === "Button" ? 7 : 1;
          const reqQty = baseQty * multiplier;
          newItems.push({
            id: "item-" + Math.random().toString(36).substr(2, 9),
            soItemId: soItem.id,
            material: mat,
            code: "TRM-001",
            gsmContent: "Standard",
            width: undefined,
            colorShade: "Black",
            requiredQty: reqQty,
            qty: 0,
            buffer: 0,
            uom: "pcs",
            rate: rate,
            gst: 5,
            amount: 0,
            deliveryDate: "",
            images: [],
            productName: soName,
            productImage: imgUrl,
            productCode: soItem.productId,
            productFit: soItem.type,
            soNo: soItem.soNo,
          });
        });
      }
    });

    setPoItems(prev => [...newItems, ...prev]);
  };

  const handleQtyChange = (itemId: string, newQty: number) => {
    setPoItems(poItems.map(item => 
      item.id === itemId 
        ? { ...item, qty: newQty, amount: newQty * (item.rate || 0) } 
        : item
    ));
  };

  const handleRateChange = (itemId: string, newRate: number) => {
    setPoItems(poItems.map(item => 
      item.id === itemId 
        ? { ...item, rate: newRate, amount: (item.qty || 0) * newRate } 
        : item
    ));
  };

  const handleDateChange = (itemId: string, newDate: string) => {
    setPoItems(poItems.map(item => 
      item.id === itemId ? { ...item, deliveryDate: newDate } : item
    ));
  };

  const handleColorChange = (itemId: string, newColor: string) => {
    setPoItems(poItems.map(item => 
      item.id === itemId ? { ...item, colorShade: newColor } : item
    ));
  };

  const handleGsmChange = (itemId: string, newGsm: string) => {
    setPoItems(poItems.map(item => 
      item.id === itemId ? { ...item, gsmContent: newGsm } : item
    ));
  };

  const handleWidthChange = (itemId: string, newWidth: string) => {
    setPoItems(poItems.map(item => 
      item.id === itemId ? { ...item, width: newWidth } : item
    ));
  };

  const handleImageChange = (itemId: string, imageUrl: string) => {
    setPoItems(poItems.map(item => 
      item.id === itemId ? { ...item, fabricImage: imageUrl } : item
    ));
  };

  const filteredPoItems = poItems.filter(item => 
    !selectedTrimItem || item.material === selectedTrimItem
  );

  const qtyByUom = filteredPoItems.reduce((acc, item) => {
    const uom = item.uom || (type === 'Fabric' ? 'mtr' : 'pcs');
    acc[uom] = (acc[uom] || 0) + (Number(item.qty) || 0);
    return acc;
  }, {} as Record<string, number>);

  const totalQtyDisplay = Object.keys(qtyByUom).length > 0 
    ? Object.entries(qtyByUom).map(([uom, qty]) => `${qty.toLocaleString('en-IN')} ${uom}`).join(' + ')
    : `0 ${type === 'Fabric' ? 'mtr' : 'pcs'}`;
  const subTotal = poItems.reduce((acc, item) => acc + item.amount, 0);
  const totalGst = poItems.reduce((acc, item) => acc + (item.amount * item.gst / 100), 0);
  const grandTotal = subTotal + totalGst;

  const handleSave = () => {
    router.push(backHref);
  };

  const selectedSupplier = methods.watch("supplier") as string;
  const selectedSoIds = (methods.watch("buyerId") || "").split(",").filter(Boolean);

  const SUPPLIER_ADDRESSES: Record<string, { line1: string, line2: string, gstin: string }> = {
    "Arvind Mills": { line1: "Naroda Road, Near Railway Station", line2: "Ahmedabad, Gujarat - 380025, India", gstin: "24AABCA1234F1Z5" },
    "Vardhman Textiles": { line1: "Chandigarh Road", line2: "Ludhiana, Punjab - 141010, India", gstin: "03AAACV1234F1Z5" },
    "Raymond Fabrics": { line1: "Panchgram, Post Office - Khaperkheda", line2: "Chhindwara, MP - 480106, India", gstin: "23AABCR1234F1Z5" },
    "Welspun": { line1: "Welspun City, Village Versamedi", line2: "Anjar, Gujarat - 370110, India", gstin: "24AABCW1234F1Z5" },
    "YKK Zippers": { line1: "Sector-3, HSIIDC Industrial Estate", line2: "Bawal, Haryana - 123501, India", gstin: "06AABCY1234F1Z5" },
    "Laxmi Buttons": { line1: "15, Mangaldas Road, Lohar Chawl", line2: "Mumbai, Maharashtra - 400002, India", gstin: "27AABCL1234F1Z5" },
    "Super Labels": { line1: "Plot No. 45, Udyog Vihar Phase 1", line2: "Gurugram, Haryana - 122016, India", gstin: "06AABCS1234F1Z5" },
    "Vardhman Threads": { line1: "Chandigarh Road", line2: "Ludhiana, Punjab - 141010, India", gstin: "03AAACV1234F1Z5" },
    "Reliance Packaging": { line1: "Reliance Corporate Park, Ghansoli", line2: "Navi Mumbai, Maharashtra - 400701, India", gstin: "27AABCR1234F1Z5" },
  };
  const supplierAddressInfo = SUPPLIER_ADDRESSES[selectedSupplier] || SUPPLIER_ADDRESSES["Arvind Mills"];

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col h-full overflow-hidden bg-slate-50/50">
        <div className="flex-1 overflow-y-auto px-5 py-5 pb-4 hide-scrollbar">
          {/* Header */}
          <div className="flex flex-col mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <Link href={backHref} className="p-2 bg-white hover:bg-slate-50 rounded-full border border-slate-200 text-slate-500 hover:text-[#0453B8] transition-colors mt-0.5">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center w-11 h-11 text-blue-600 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-6">
                    <h1 className="text-xl font-semibold text-slate-900">
                      {isEditMode ? `Edit ${type} Purchase Order` : `New ${type} Purchase Order`}
                    </h1>
                    <div className="flex items-stretch gap-4">
                      {/* PO Number Badge */}
                      <div className="flex flex-col bg-blue-50/80 border border-blue-100 rounded-lg px-5 py-3 shadow-sm min-w-[140px]">
                        <span className="text-[11px] font-bold text-[#0453B8]/80 uppercase tracking-wider mb-1.5">PO NUMBER</span>
                        <span className="text-lg font-black text-[#0453B8] tracking-wide leading-none">
                          {initialPo?.id || (type === "Fabric" ? "FPO-1453" : "TPO-8006")}
                        </span>
                      </div>
                      
                      {/* PO Date Badge */}
                      <div className="flex flex-col bg-slate-50 border border-slate-200 rounded-lg px-5 py-3 shadow-sm min-w-[140px]">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          PO DATE
                        </span>
                        <div className="flex flex-col">
                          <span className="text-lg font-black text-slate-700 tracking-wide leading-none mb-1.5">
                            {isEditMode ? initialPo?.date || "06-JUN-2026" : "06-JUN-2026"}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider leading-none">
                            SATURDAY
                          </span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      {isEditMode && (
                        <div className="flex flex-col bg-emerald-50 border border-emerald-100 rounded-lg px-5 py-3 shadow-sm min-w-[140px]">
                          <span className="text-[11px] font-bold text-emerald-600/80 uppercase tracking-wider mb-1.5">
                            STATUS
                          </span>
                          <span className="text-lg font-black text-emerald-700 tracking-wide leading-none">
                            {initialPo?.status || "Draft"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <Link href={backHref}>
                  <Button variant="outline" className="h-10 px-4 text-slate-700 bg-white font-medium shadow-sm">
                    <FileText className="w-4 h-4 mr-2" />
                    View POs
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-5">
            {/* Left Column (Main Content) */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">
              
              {/* 1. Supplier & PO Details */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0453B8] text-white text-xs font-bold">1</div>
                  <h2 className="text-sm font-bold text-slate-900">Supplier & PO Details</h2>
                </div>
                
                <div className={`grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5 mb-6`}>
                  {/* Supplier */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600">Supplier <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Select 
                        value={methods.watch("supplier") || ""}
                        onValueChange={(val) => methods.setValue("supplier", val)}
                      >
                        <SelectTrigger className="w-full h-10 border-slate-200 text-sm focus:ring-[#0453B8] bg-white font-medium truncate">
                          <SelectValue placeholder="Select Supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          {INITIAL_MASTER_SUPPLIERS
                            .filter(s => type === "Fabric" ? ["Fabric", "Both"].includes(s.category) : ["Trims", "Both"].includes(s.category))
                            .map(supplier => (
                              <SelectItem key={supplier.name} value={supplier.name}>{supplier.name}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Buyer */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600">Buyer <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Select
                        value={selectedBuyerId || ""}
                        onValueChange={(val) => {
                          const hasLinkedItems = poItems.some(i => i.soItemId);
                          if (hasLinkedItems && !window.confirm("Changing the buyer will clear all selected products from the table. Continue?")) {
                            return;
                          }
                          setSelectedBuyerId(val); 
                          methods.setValue("buyerId", ""); 
                          if (hasLinkedItems) {
                            setPoItems(prev => prev.filter(i => !i.soItemId));
                          }
                        }}
                      >
                        <SelectTrigger className="w-full h-10 border-slate-200 text-sm focus:ring-[#0453B8] bg-white font-medium truncate">
                          <SelectValue placeholder="Select Buyer" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(new Set(MOCK_SALES_ORDERS_LIST.map(so => so.buyer))).map(buyer => (
                            <SelectItem key={buyer} value={buyer}>{buyer}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Sales Order */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600 flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={isLinkedToSo} 
                        onChange={(e) => {
                          setIsLinkedToSo(e.target.checked);
                          if (!e.target.checked) {
                            methods.setValue("buyerId", "");
                          }
                        }}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-[#0453B8] focus:ring-[#0453B8] cursor-pointer"
                      />
                      <span className="text-slate-700">
                        Add Products {isLinkedToSo && <span className="text-red-500">*</span>}
                      </span>
                    </Label>
                    <div className="relative">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            disabled={!isLinkedToSo || !selectedBuyerId || !selectedTrimItem}
                            className="w-full justify-between h-10 border-slate-200 text-sm font-normal truncate disabled:opacity-50 disabled:cursor-not-allowed bg-white px-3"
                          >
                            {poItems.filter(i => i.soItemId).length > 0 
                              ? `${poItems.filter(i => i.soItemId).length} product${poItems.filter(i => i.soItemId).length > 1 ? "s" : ""} selected` 
                              : <span className="text-muted-foreground">{!selectedTrimItem ? "Select Category First" : "Select Products"}</span>}
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[600px] max-h-[500px] flex flex-col p-0 shadow-2xl rounded-xl border-slate-200 overflow-hidden" align="start">
                          {(() => {
                            let filteredItems = ALL_SO_ITEMS;
                            if (selectedBuyerId) {
                              const buyerSoIds = MOCK_SALES_ORDERS_LIST.filter(so => so.buyer === selectedBuyerId).map(so => so.id);
                              filteredItems = filteredItems.filter(item => buyerSoIds.includes(item.soId));
                            }
                            
                            return (
                              <>
                                <div className="overflow-y-auto p-3 flex-1 custom-scrollbar max-h-[400px]">
                                  <div className="grid grid-cols-3 gap-3">
                                    {filteredItems.map((item) => {
                                      const soName = item.name || "Product";
                                      const imgUrl = soName.includes("T-Shirt") ? "/men casual tshirt.jpeg" : 
                                                     soName.includes("Shirt") ? "/men casual half shirt.jpg" :
                                                     soName.includes("Jacket") ? "/mens casual full sleeve shirt.jpg" : "/men regualr fit shirt.jpeg";
                                      const isSelected = poItems.some(i => i.soItemId === item.id);
                                      
                                      return (
                                        <DropdownMenuItem
                                          key={item.id}
                                          onSelect={(e) => {
                                            e.preventDefault();
                                            if (isSelected) {
                                              setPoItems(prev => prev.filter(i => i.soItemId !== item.id));
                                            } else {
                                              handleSoItemNext([item]);
                                            }
                                          }}
                                          className={`relative p-3 flex flex-col items-center gap-3 rounded-xl overflow-hidden cursor-pointer transition-all border !bg-transparent focus:!bg-transparent ${
                                            isSelected ? 'border-[#0453B8] bg-blue-50/30 shadow-sm' : 'border-slate-200 hover:border-[#0453B8]/50 hover:bg-slate-50'
                                          }`}
                                        >
                                          <div className="h-24 w-24 shrink-0 relative overflow-hidden bg-white rounded-lg border border-slate-200 flex items-center justify-center p-2 shadow-sm">
                                            <img src={imgUrl} alt={soName} className="w-full h-full object-contain mix-blend-multiply" />
                                          </div>
                                          
                                          <div className="flex flex-col items-center justify-center w-full text-center">
                                            <span className="text-[#0453B8] font-bold text-[10px] uppercase tracking-wide mb-0.5">{item.productId}</span>
                                            <span className="text-slate-900 font-bold text-xs truncate w-full" title={soName}>{soName}</span>
                                          </div>

                                          <div className="absolute top-2 right-2">
                                            <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors border shadow-sm ${isSelected ? 'bg-[#0453B8] border-[#0453B8] text-white' : 'bg-white border-slate-300'}`}>
                                              {isSelected && <Check className="w-3.5 h-3.5" />}
                                            </div>
                                          </div>
                                        </DropdownMenuItem>
                                      );
                                    })}
                                    {filteredItems.length === 0 && (
                                      <div className="py-8 text-center text-slate-500 text-sm font-medium col-span-3">
                                        No products found for this buyer.
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between shrink-0 items-center">
                                  <label className="flex items-center gap-2.5 cursor-pointer text-sm font-bold text-slate-700 hover:text-[#0453B8] transition-colors" onClick={(e) => e.stopPropagation()}>
                                    <input
                                      type="checkbox"
                                      className="w-4 h-4 rounded border-slate-300 text-[#0453B8] focus:ring-[#0453B8] cursor-pointer"
                                      checked={filteredItems.length > 0 && filteredItems.every(item => poItems.some(i => i.soItemId === item.id))}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          const unselected = filteredItems.filter(item => !poItems.some(i => i.soItemId === item.id));
                                          if (unselected.length > 0) handleSoItemNext(unselected);
                                        } else {
                                          setPoItems(prev => prev.filter(i => !filteredItems.some(f => f.id === i.soItemId)));
                                        }
                                      }}
                                    />
                                    Select All Products
                                  </label>
                                </div>
                              </>
                            );
                          })()}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {methods.watch("buyerId") && (
                      <span className="text-[11px] font-bold text-emerald-600 tracking-tight px-0.5">Payment Terms: 30 days credit</span>
                    )}
                  </div>





                  {/* Agent / Broker */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600 uppercase">Agent / Broker</Label>
                    <Input defaultValue="Nitin Bhai" className="h-10 text-sm bg-white" />
                  </div>
                </div>


                <div className="flex items-center justify-between mt-4">
                  <h3 className="text-sm font-bold text-slate-800">Supplier Address</h3>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAddress(!showAddress)}
                    className="text-[#0453B8] font-bold h-8 text-xs hover:bg-blue-50"
                  >
                    {showAddress ? "Hide Address" : "Unhide Address"}
                  </Button>
                </div>
                
                {showAddress && (
                  <div className="flex flex-col md:flex-row gap-5 items-stretch mt-2 animate-in fade-in duration-300">
                    <div className="border border-slate-200 rounded-lg p-5 flex-1 flex flex-col bg-white w-full min-h-[164px] text-left">
                      <div className="flex items-center justify-between mb-4 h-8">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4 text-[#0453B8]" />
                          </div>
                          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                            Address Details <span className="text-red-500">*</span>
                          </h3>
                        </div>
                      </div>
                      {selectedSupplier ? (
                        <div className="text-sm text-slate-600 space-y-1 pl-11 flex-1">
                          <p className="font-medium text-slate-900">{selectedSupplier}</p>
                          <p>{supplierAddressInfo.line1}</p>
                          <p>{supplierAddressInfo.line2}</p>
                          <p className="text-slate-500 mt-2">GSTIN: {supplierAddressInfo.gstin}</p>
                        </div>
                      ) : (
                        <div className="text-sm text-slate-400 pl-11 flex-1 flex items-center mt-2">
                          Please select a supplier to view their address details.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Items Table (REUSED COMPONENT) */}
              <POItemsTable
                items={filteredPoItems}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteItem}
                onOpenAddDialog={handleOpenAddDialog}
                onQtyChange={handleQtyChange}
                onRateChange={handleRateChange}
                onDateChange={handleDateChange}
                onColorChange={handleColorChange}
                onGsmChange={handleGsmChange}
                onWidthChange={handleWidthChange}
                onImageChange={handleImageChange}
                totalQtyDisplay={totalQtyDisplay}
                itemLabel={itemLabel}
                specLabel={specLabel}
                type={type}
                headerContent={
                  <div className="flex items-center text-slate-600 font-bold text-sm">
                    <span className="ml-1">(</span>
                    <Select 
                      value={selectedTrimItem} 
                      onValueChange={(newVal) => {
                        setSelectedTrimItem(newVal);
                      }}
                    >
                      <SelectTrigger className="w-auto h-auto px-1 py-0 border-none shadow-none text-slate-600 font-bold focus:ring-0 bg-transparent hover:bg-slate-100 rounded">
                         <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                         {type === "Trims" ? (
                           <>
                             <SelectItem value="Button">Button</SelectItem>
                             <SelectItem value="Label">Label</SelectItem>
                             <SelectItem value="Hangtag">Hangtag</SelectItem>
                           </>
                         ) : (
                           <>
                             <SelectItem value="Cotton Fabric">Cotton Fabric</SelectItem>
                             <SelectItem value="Linen">Linen</SelectItem>
                           </>
                         )}
                      </SelectContent>
                    </Select>
                    <span>)</span>
                  </div>
                }
              />
            </div>

            {/* Right Column (Sidebar) */}
            <div className="w-full xl:w-[320px] flex flex-col gap-5 flex-shrink-0">
              {/* PO Number/Date moved to header */}

              <NotesPanel isReadOnly={false} />
              
              <AttachmentsModal isReadOnly={false} />

              {/* PO Summary Totals */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-5">PO Summary</h3>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Sub Total</span>
                    <span className="font-semibold text-slate-900">₹ {subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 mt-1">
                    <div className="flex items-center gap-2">
                      <span>Discount</span>
                      <div className="flex border border-slate-200 rounded bg-white w-24 overflow-hidden">
                        <select className="w-10 px-1 border-r border-slate-200 bg-slate-50 text-xs focus:outline-none">
                          <option>%</option>
                        </select>
                        <input type="text" defaultValue="0" className="w-14 text-right px-2 text-xs focus:outline-none" />
                      </div>
                    </div>
                    <span className="font-semibold text-slate-900">₹ 0.00</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 mt-1">
                    <span>Total GST</span>
                    <span className="font-semibold text-slate-900">₹ {totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 mt-1">
                    <span>Freight</span>
                    <div className="flex items-center border border-slate-200 rounded bg-white w-24 overflow-hidden px-2 h-7 focus-within:ring-1 focus-within:ring-[#0453B8] focus-within:border-[#0453B8]">
                      <span className="text-xs text-slate-500 font-medium flex-shrink-0">₹</span>
                      <input type="number" defaultValue="0.00" className="w-full text-right pl-1 text-xs focus:outline-none h-full bg-transparent font-medium text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 mt-1">
                    <span>Round Off</span>
                    <div className="flex items-center border border-slate-200 rounded bg-white w-24 overflow-hidden px-2 h-7 focus-within:ring-1 focus-within:ring-[#0453B8] focus-within:border-[#0453B8]">
                      <span className="text-xs text-slate-500 font-medium flex-shrink-0 whitespace-nowrap leading-none mt-0.5">±₹</span>
                      <input type="number" defaultValue="0.00" className="w-full text-right pl-1 text-xs focus:outline-none h-full bg-transparent font-medium text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 border-t border-slate-200 pt-4">
                    <span className="font-bold text-slate-900">Grand Total</span>
                    <span className="font-bold text-[#0453B8] text-lg">₹ {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="flex-shrink-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-10">
          <Button onClick={handleSave} variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium h-10 px-6">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedSupplier} variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium h-10 px-6 disabled:opacity-50 disabled:cursor-not-allowed">
            <FileText className="w-4 h-4 mr-2 opacity-70" /> {isEditMode ? "Update Draft" : "Save Draft"}
          </Button>
          <Button onClick={handleSave} disabled={!selectedSupplier} className="h-10 px-6 bg-[#0453B8] hover:bg-blue-700 text-white font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
            {isEditMode ? "Save PO Changes" : "Send to Supplier"}
          </Button>
        </div>
        
        <AddItemDialog 
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddItem={handleAddItem}
          editItem={editingItem}
          soItem={selectedSoItemContext}
          itemOptions={type === "Fabric" ? ["Cotton Fabric", "Linen"] : itemOptions}
          itemLabel={itemLabel}
          specLabel={specLabel}
          type={type}
          trimItem={selectedTrimItem}
          soItemTotalPcs={selectedSoItemContext ? Object.values(selectedSoItemContext.sizeBreakdown || {}).reduce((a: number, b) => a + (b as number), 0) : 0}
          initialValues={selectedSoItemContext ? {
            requiredQty: selectedSoItemContext.requiredQtyMtr,
            qty: selectedSoItemContext.requiredQtyMtr,
            // For Fabric: pre-fill material name and garment color
            // For Trims: material = trim type (e.g. "Button"), color comes from the variant picker
            colorShade: type === "Fabric" ? selectedSoItemContext.color : "",
            material: type === "Fabric" ? "Cotton Fabric" : selectedTrimItem,
            uom: type === "Fabric" ? "mtr" : "pcs",
          } : undefined}
        />
      </div>
    </FormProvider>
  );
}
