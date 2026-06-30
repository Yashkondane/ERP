"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ArrowLeft, FileText, MapPin, CheckCircle2, Check, ArrowRight, X } from "lucide-react";
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
  isViewMode?: boolean;
  type: "Fabric" | "Trims";
  itemLabel: string; // e.g. "Material" or "Trim Item"
  specLabel?: string; // e.g. "GSM / Content" or "Specifications"
  itemOptions: string[]; // Options for dropdown
  backHref: string; // e.g. "/fabric-purchases"
}

export function PurchaseOrderForm({ 
  initialPo, 
  isEditMode = false,
  isViewMode = false,
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
  const [selectedTrimItem, setSelectedTrimItem] = useState<string>(type === "Fabric" ? "All Fabrics" : "Button");
  const [selectedBuyerId, setSelectedBuyerId] = useState<string | null>(null);
  const [isLinkedToSo, setIsLinkedToSo] = useState(true);
  const [sortCategory, setSortCategory] = useState<string>("All Categories");

  const [showAddress, setShowAddress] = useState(true);
  const [viewMode, setViewMode] = useState<"address" | "so-table">("address");
  const [activeSoForLines, setActiveSoForLines] = useState<any | null>(null);
  const [selectedLines, setSelectedLines] = useState<Record<string, boolean>>({});
  
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [manualFormData, setManualFormData] = useState({
    type: "Cotton Fabric",
    description: "",
    gsm: "",
    width: "",
    color: "",
    qty: "0",
    rate: "0",
    gst: "0",
    image: ""
  });

  useEffect(() => {
    if (poItems.length > 0) setShowAddress(false);
    else setShowAddress(true);
  }, [poItems.length]);

  useEffect(() => {
    if (selectedBuyerId) {
      setViewMode("so-table");
    } else {
      setViewMode("address");
    }
  }, [selectedBuyerId]);

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
    setManualFormData({
      type: item.material || "",
      description: item.description || "",
      gsm: item.gsm || "",
      width: item.width || "",
      color: item.colorShade || "",
      qty: item.qty ? item.qty.toString() : "",
      rate: item.rate ? item.rate.toString() : "",
      gst: item.gst ? item.gst.toString() : "5",
      image: item.fabricImage || ""
    });
    setIsManualEntryOpen(true);
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
        const materialCategory = soItem.fabricBom?.type || selectedTrimItem || "Cotton Fabric";
        const gsm = soItem.fabricBom?.gsm || "180";
        const width = soItem.fabricBom?.width || "44";
        const color = soItem.fabricBom?.color || "White";
        
        newItems.push({
          id: "item-" + Math.random().toString(36).substr(2, 9),
          soItemId: soItem.id,
          material: materialCategory,
          code: undefined,
          gsmContent: `${gsm}gsm`,
          width: `${width}"`,
          colorShade: color,
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
        const trimItems = [];
        if (selectedTrimItem === "Button" || !selectedTrimItem) {
          if (soItem.trims?.buttons?.code) trimItems.push({ material: "Button", code: soItem.trims.buttons.code, color: soItem.trims.buttons.color });
          else if (selectedTrimItem === "Button") trimItems.push({ material: "Button", code: "TRM-001", color: "Black" });
        }
        if (selectedTrimItem === "Label" || !selectedTrimItem) {
          if (soItem.trims?.label?.code) trimItems.push({ material: "Label", code: soItem.trims.label.code, color: soItem.trims.label.color });
          else if (selectedTrimItem === "Label") trimItems.push({ material: "Label", code: "TRM-002", color: "Black" });
        }
        if (selectedTrimItem === "Hangtag" || !selectedTrimItem) {
          if (soItem.trims?.hangTag?.code) trimItems.push({ material: "Hangtag", code: soItem.trims.hangTag.code, color: soItem.trims.hangTag.color });
          else if (selectedTrimItem === "Hangtag") trimItems.push({ material: "Hangtag", code: "TRM-003", color: "Black" });
        }
        
        if (trimItems.length === 0) {
           trimItems.push({ material: selectedTrimItem || "Button", code: "TRM-001", color: "Black" });
        }

        trimItems.forEach(trim => {
          const multiplier = trim.material === "Button" ? 7 : 1;
          const reqQty = baseQty * multiplier;
          newItems.push({
            id: "item-" + Math.random().toString(36).substr(2, 9),
            soItemId: soItem.id,
            material: trim.material,
            code: trim.code,
            gsmContent: "Standard",
            width: undefined,
            colorShade: trim.color,
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

  const filteredPoItems = poItems.filter(item => {
    if (type === "Fabric") {
      if (!selectedTrimItem || selectedTrimItem === "All Fabrics") return true;
      const mat = (item.material || "").toLowerCase();
      const filter = selectedTrimItem.toLowerCase().replace(" fabric", "");
      return mat.includes(filter);
    }
    return !selectedTrimItem || item.material === selectedTrimItem;
  });

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
                
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-5 mb-6`}>
                  {/* Supplier */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600">Supplier <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Select 
                        value={methods.watch("supplier") || ""}
                        onValueChange={(val) => methods.setValue("supplier", val)}
                        disabled={isViewMode}
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
                    <Label className="text-xs font-bold text-slate-600">Buyer <span className="text-slate-400 font-normal">(Optional)</span></Label>
                    <div className="relative">
                      <Select
                        value={selectedBuyerId || ""}
                        disabled={isViewMode}
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
                    {methods.watch("buyerId") && (
                      <span className="text-[11px] font-bold text-emerald-600 tracking-tight px-0.5">Payment Terms: 30 days credit</span>
                    )}
                  </div>

                  {/* Agent / Broker */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600 uppercase">Agent / Broker</Label>
                    <Input defaultValue="Nitin Bhai" className="h-10 text-sm bg-white" disabled={isViewMode} />
                  </div>
                </div>

                <div className="mt-4 overflow-hidden relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-800">
                      {viewMode === "address" ? "Supplier Address" : `Available Sales Orders for ${selectedBuyerId}`}
                    </h3>
                    <div className="flex gap-2">
                      {selectedBuyerId && !isViewMode && (
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm" 
                          onClick={() => setViewMode(viewMode === "address" ? "so-table" : "address")}
                          className="h-8 text-xs font-medium border-slate-200"
                        >
                          {viewMode === "address" ? "Show Sales Orders" : "Show Address"}
                        </Button>
                      )}
                      {viewMode === "address" && (
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setShowAddress(!showAddress)}
                          className="text-[#0453B8] font-bold h-8 text-xs hover:bg-blue-50"
                        >
                          {showAddress ? "Hide Address" : "Unhide Address"}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="relative">
                    {/* Address View */}
                    <div className={`transition-all duration-500 ease-in-out ${viewMode === 'address' ? 'opacity-100 translate-y-0 relative z-10' : 'opacity-0 -translate-y-4 absolute inset-0 pointer-events-none'}`}>
                      <div className={`grid transition-all duration-300 ease-in-out ${showAddress ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                          <div className="flex flex-col md:flex-row gap-5 items-stretch pt-1 pb-1">
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
                        </div>
                      </div>
                    </div>

                    {/* Sales Order Table View */}
                    <div className={`transition-all duration-500 ease-in-out ${!isViewMode && viewMode === 'so-table' ? 'opacity-100 translate-y-0 relative z-10' : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none hidden'}`}>
                      <div className="border border-slate-200 rounded-lg overflow-y-auto custom-scrollbar bg-white shadow-sm max-h-[240px]">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-[#F8FAFC] border-b border-slate-200 sticky top-0 z-10">
                            <tr>
                              <th className="px-4 py-3 font-bold text-slate-700">SO No.</th>
                              <th className="px-4 py-3 font-bold text-slate-700">SO Date</th>
                              <th className="px-4 py-3 font-bold text-slate-700">Total Styles</th>
                              <th className="px-4 py-3 font-bold text-slate-700 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {MOCK_SALES_ORDERS_LIST.filter(so => so.buyer === selectedBuyerId).map((so) => (
                              <tr key={so.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3 font-bold text-[#0453B8]">{so.soNo}</td>
                                <td className="px-4 py-3 text-slate-600">{so.orderDate}</td>
                                <td className="px-4 py-3 text-slate-600">
                                  {(() => {
                                    const totalSoItems = ALL_SO_ITEMS.filter(i => i.soId === so.id && i.trackingStatus !== "CLOSED").length || 5;
                                    const soItemsInPo = poItems.filter(i => i.soNo === so.soNo).length;
                                    return soItemsInPo > 0 
                                      ? <span className="font-bold text-[#0453B8]">{soItemsInPo} / {totalSoItems} Styles Selected</span>
                                      : <span>{totalSoItems} Styles</span>;
                                  })()}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => {
                                      const initialSelected: Record<string, boolean> = {};
                                      ALL_SO_ITEMS.filter(i => i.soId === so.id).forEach(item => {
                                        const existing = poItems.find(p => p.soItemId === item.id);
                                        if (existing) {
                                          initialSelected[item.id] = true;
                                        }
                                      });
                                      setSelectedLines(initialSelected);
                                      setActiveSoForLines(so);
                                    }}
                                    className="h-7 text-xs border-[#0453B8] text-[#0453B8] hover:bg-blue-50"
                                  >
                                    Select
                                  </Button>
                                </td>
                              </tr>
                            ))}
                            {MOCK_SALES_ORDERS_LIST.filter(so => so.buyer === selectedBuyerId).length === 0 && (
                              <tr>
                                <td colSpan={4} className="px-4 py-6 text-center text-slate-500">No available sales orders found for this buyer.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Items Table (REUSED COMPONENT) */}
              <POItemsTable
                items={filteredPoItems}
                isReadOnly={isViewMode}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteItem}
                onOpenAddDialog={handleOpenAddDialog}
                onOpenManualEntry={() => setIsManualEntryOpen(true)}
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
              />
            </div>

            {/* Right Column (Sidebar) */}
            <div className="w-full xl:w-[320px] flex flex-col gap-5 flex-shrink-0">
              {/* PO Number/Date Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col bg-white border border-blue-200/60 rounded-xl p-3 shadow-sm text-center justify-center">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">PO NUMBER</span>
                  <span className="text-base font-black text-[#0453B8] tracking-wide">
                    {initialPo?.id || (type === "Fabric" ? "FPO-1453" : "TPO-8006")}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5 invisible">
                    SPACER
                  </span>
                </div>
                <div className="flex flex-col bg-white border border-blue-200/60 rounded-xl p-3 shadow-sm text-center justify-center">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">PO DATE</span>
                  <span className="text-base font-black text-[#0453B8] tracking-wide">
                    {isEditMode ? initialPo?.date || "06-JUN-2026" : "06-JUN-2026"}
                  </span>
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">
                    SATURDAY
                  </span>
                </div>
                {isEditMode && (
                  <div className="flex flex-col bg-white border border-blue-200/60 rounded-xl p-3 shadow-sm text-center justify-center col-span-2">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">STATUS</span>
                    <span className="text-base font-black text-[#0453B8] tracking-wide">
                      {initialPo?.status || "Draft"}
                    </span>
                  </div>
                )}
              </div>

              <NotesPanel isReadOnly={isViewMode} />
              
              <AttachmentsModal isReadOnly={isViewMode} />

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
          {isViewMode ? (
            <>
              <Button onClick={() => router.push(backHref)} variant="outline" className="font-medium h-10 px-6">
                Back to POs
              </Button>
              <Link href={`${backHref}/${initialPo?.id || (type === "Fabric" ? "FPO-1453" : "TPO-8006")}/edit`}>
                <Button className="h-10 px-6 bg-[#0453B8] hover:bg-blue-700 text-white font-medium shadow-sm">
                  Edit PO
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button onClick={handleSave} variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium h-10 px-6">
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!selectedSupplier} variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium h-10 px-6 disabled:opacity-50 disabled:cursor-not-allowed">
                <FileText className="w-4 h-4 mr-2 opacity-70" /> {isEditMode ? "Update Draft" : "Save Draft"}
              </Button>
              <Button onClick={handleSave} disabled={!selectedSupplier} className="h-10 px-6 bg-[#0453B8] hover:bg-blue-700 text-white font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                {isEditMode ? "Save PO Changes" : "Send to Supplier"}
              </Button>
            </>
          )}
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
        
        {/* Select SO Items Modal */}
        {activeSoForLines && (
          <SelectSalesOrderItemsDialog
            open={!!activeSoForLines}
            onOpenChange={(open) => {
              if (!open) setActiveSoForLines(null);
            }}
            buyerId={activeSoForLines.id}
            existingPoItems={poItems}
            onNext={(selectedSoItems) => {
              handleSoItemNext(selectedSoItems);
              setActiveSoForLines(null);
            }}
            type={type}
            supplierName={selectedBuyerId ?? undefined}
          />
        )}
        {/* Floating Panel for Add Manual Fabric */}
        {isManualEntryOpen && (
          <div className="fixed top-24 right-4 w-[650px] z-50 bg-white shadow-2xl rounded-xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-300">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">
                {editingItem ? "Edit Fabric" : "Add Manual Fabric"}
                {editingItem?.soItemId && (
                  <span className="text-slate-500 font-medium ml-2">
                    - {editingItem.soNo} - L{ALL_SO_ITEMS.filter(i => i.soId === ALL_SO_ITEMS.find(soi => soi.id === editingItem.soItemId)?.soId).findIndex(i => i.id === editingItem.soItemId) + 1}
                  </span>
                )}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setIsManualEntryOpen(false)} className="h-8 w-8 p-0 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-200">
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Content</Label>
                  <Input 
                    value={manualFormData.type}
                    onChange={(e) => setManualFormData({...manualFormData, type: e.target.value})}
                    placeholder="e.g. Cotton Fabric" 
                    className="h-10 text-sm bg-white" 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Color / Shade</Label>
                  <Input 
                    value={manualFormData.color}
                    onChange={(e) => setManualFormData({...manualFormData, color: e.target.value})}
                    placeholder="Beige" 
                    className="h-10 text-sm bg-white" 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Width</Label>
                  <Select value={manualFormData.width} onValueChange={(val) => setManualFormData({...manualFormData, width: val})}>
                    <SelectTrigger className="w-full h-10 border-slate-200 focus:ring-[#0453B8] bg-white font-medium">
                      <SelectValue placeholder="Select width" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="44&quot;">44"</SelectItem>
                      <SelectItem value="54&quot;">54"</SelectItem>
                      <SelectItem value="58&quot;">58"</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">GSM</Label>
                  <Input 
                    value={manualFormData.gsm}
                    onChange={(e) => setManualFormData({...manualFormData, gsm: e.target.value})}
                    placeholder="e.g. 150 GSM" 
                    className="h-10 text-sm bg-white" 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Qty (Mtrs)</Label>
                  <Input 
                    type="number"
                    value={manualFormData.qty}
                    onChange={(e) => setManualFormData({...manualFormData, qty: e.target.value})}
                    placeholder="200.00" 
                    className="h-10 text-sm bg-white" 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Rate (₹)</Label>
                  <Input 
                    type="number"
                    value={manualFormData.rate}
                    onChange={(e) => setManualFormData({...manualFormData, rate: e.target.value})}
                    placeholder="130.00" 
                    className="h-10 text-sm bg-white" 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">GST %</Label>
                  <Select value={manualFormData.gst} onValueChange={(val) => setManualFormData({...manualFormData, gst: val})}>
                    <SelectTrigger className="w-full h-10 border-slate-200 focus:ring-[#0453B8] bg-white font-medium">
                      <SelectValue placeholder="Select GST" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="12">12%</SelectItem>
                      <SelectItem value="18">18%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Amount (₹)</Label>
                  <Input 
                    disabled 
                    value={((Number(manualFormData.rate) || 0) * (Number(manualFormData.qty) || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    className="h-10 text-sm bg-slate-50 font-semibold" 
                  />
                </div>
                
                <div className="flex flex-col gap-2 col-span-2">
                  <Label className="text-xs font-bold text-slate-600">Fabric Image (Optional)</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-md border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
                      {manualFormData.image ? (
                        <img src={manualFormData.image} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">No Image</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input 
                        disabled={!!editingItem?.soItemId}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            setManualFormData({...manualFormData, image: url});
                          }
                        }}
                        className="h-10 text-sm bg-white cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#F1F5F9] file:text-slate-700 hover:file:bg-slate-200" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => { setIsManualEntryOpen(false); setEditingItem(null); }} className="font-bold">Cancel</Button>
              <Button type="button" onClick={() => {
                if (editingItem) {
                  setPoItems(prev => prev.map(item => {
                    if (item.id === editingItem.id) {
                      return {
                        ...item,
                        material: manualFormData.type,
                        gsmContent: manualFormData.gsm || item.gsmContent,
                        width: manualFormData.width || item.width,
                        colorShade: manualFormData.color || item.colorShade,
                        qty: Number(manualFormData.qty) || item.qty,
                        rate: Number(manualFormData.rate) || item.rate,
                        gst: Number(manualFormData.gst) || item.gst,
                        amount: (Number(manualFormData.rate) || item.rate) * (Number(manualFormData.qty) || item.qty),
                        productName: manualFormData.type || item.productName,
                        fabricImage: manualFormData.image || item.fabricImage,
                      };
                    }
                    return item;
                  }));
                } else {
                  const newItem = {
                    id: Math.random().toString(36).substr(2, 9),
                    material: manualFormData.type,
                    gsmContent: manualFormData.gsm || "150 GSM",
                    width: manualFormData.width || "54\"",
                    colorShade: manualFormData.color || "Beige",
                    qty: Number(manualFormData.qty) || 200,
                    buffer: 0,
                    uom: "mtr",
                    rate: Number(manualFormData.rate) || 130,
                    gst: Number(manualFormData.gst) || 5,
                    amount: (Number(manualFormData.rate) || 130) * (Number(manualFormData.qty) || 200),
                    deliveryDate: "",
                    images: [],
                    productName: manualFormData.type,
                    soNo: "",
                    fabricImage: manualFormData.image || "/Cotton_-_Fabric_Types_-_Brightside_1_480x480.jpg",
                  };
                  setPoItems(prev => [...prev, newItem]);
                }
                
                setIsManualEntryOpen(false);
                setEditingItem(null);
                setManualFormData({
                  type: "", description: "", gsm: "", width: "", color: "", qty: "0", rate: "0", gst: "0", image: ""
                });
              }} className="bg-[#0453B8] hover:bg-blue-700 text-white font-bold">
                <Check className="w-4 h-4 mr-2" /> {editingItem ? "Save Changes" : "Add to PO"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </FormProvider>
  );
}
