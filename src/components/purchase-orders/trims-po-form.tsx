"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Trash2, Edit2, FileText, ArrowRight, Save, Plus, MapPin, Link2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LinkSoLinesDialog, LinkedLine } from "./link-so-lines-dialog";
import { INITIAL_MASTER_SUPPLIERS } from "@/data/mock-masters";
import { MOCK_SALES_ORDERS_LIST } from "@/data/mock-sales-order";
import { AttachmentsModal } from "@/components/sales-order/attachments-modal";
import { useForm, FormProvider } from "react-hook-form";

export type TrimItemRow = {
  id: string;
  itemType: string;
  description: string;
  linkedLines: LinkedLine[];
  manualTotalQty?: string | number;
  rate?: string | number;
  gst?: string;
};

export function TrimsPurchaseOrderForm({ initialPo, isEditMode = false, isViewMode = false, backHref = "/trims-purchases" }: any) {
  const router = useRouter();
  const methods = useForm();

  const [trimItems, setTrimItems] = useState<TrimItemRow[]>(initialPo?.trimItems || [
    {
      id: `trim-${Date.now()}`,
      itemType: "",
      description: "",
      linkedLines: [],
      manualTotalQty: "",
      rate: "",
      gst: "5"
    }
  ]);

  const [activeTrimIdForLinking, setActiveTrimIdForLinking] = useState<string | null>(null);
  const [showAddress, setShowAddress] = useState(true);

  const [selectedBuyerId, setSelectedBuyerId] = useState<string>(initialPo?.buyer || "");
  const [selectedSupplier, setSelectedSupplier] = useState<string>(initialPo?.supplier || "");

  const SUPPLIER_ADDRESSES: Record<string, { line1: string, line2: string, gstin: string }> = {
    "ABC Buttons Ltd.": { line1: "15, Mangaldas Road, Lohar Chawl", line2: "Mumbai, Maharashtra - 400002, India", gstin: "27AABCL1234F1Z5" },
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
  const supplierAddressInfo = selectedSupplier ? (SUPPLIER_ADDRESSES[selectedSupplier] || SUPPLIER_ADDRESSES["ABC Buttons Ltd."]) : null;

  const handleAddTrim = () => {
    setTrimItems(prev => [
      ...prev,
      {
        id: `trim-${Date.now()}`,
        itemType: "",
        description: "",
        linkedLines: [],
        manualTotalQty: "",
        rate: "",
        gst: "5"
      }
    ]);
  };

  const handleUpdateTrim = (id: string, field: keyof TrimItemRow, value: any) => {
    setTrimItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleDeleteTrim = (id: string) => {
    setTrimItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveLinkedLines = (linkedLines: LinkedLine[]) => {
    if (activeTrimIdForLinking) {
      handleUpdateTrim(activeTrimIdForLinking, 'linkedLines', linkedLines);
      if (linkedLines.length > 0) {
        setShowAddress(false);
      }
    }
  };

  const activeTrimDetails = trimItems.find(t => t.id === activeTrimIdForLinking);

  const totalPoItemsCount = trimItems.length;
  const totalPoQty = trimItems.reduce((sum, item) => {
    if (item.manualTotalQty !== undefined && item.manualTotalQty !== "") {
      return sum + Number(item.manualTotalQty);
    }
    return sum + item.linkedLines.reduce((lineSum, line) => lineSum + Math.max(0, line.requiredQty - line.alreadyOrdered), 0);
  }, 0);

  const subTotal = trimItems.reduce((sum, item) => {
    const qty = item.manualTotalQty !== undefined && item.manualTotalQty !== "" ? Number(item.manualTotalQty) : item.linkedLines.reduce((s, l) => s + Math.max(0, l.requiredQty - l.alreadyOrdered), 0);
    const rate = Number(item.rate) || 0;
    return sum + (qty * rate);
  }, 0);

  const totalGst = trimItems.reduce((sum, item) => {
    const qty = item.manualTotalQty !== undefined && item.manualTotalQty !== "" ? Number(item.manualTotalQty) : item.linkedLines.reduce((s, l) => s + Math.max(0, l.requiredQty - l.alreadyOrdered), 0);
    const rate = Number(item.rate) || 0;
    const gstPct = Number(item.gst) || 5;
    return sum + (qty * rate * gstPct / 100);
  }, 0);

  const grandTotal = subTotal + totalGst;

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col h-full overflow-hidden bg-slate-50/50">
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-4 hide-scrollbar">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href={backHref} className="p-2 bg-white hover:bg-slate-50 rounded-full border border-slate-200 text-slate-500 hover:text-[#0453B8] transition-colors shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{isEditMode ? "Edit Trims Purchase Order" : "New Trims Purchase Order"}</h1>
          </div>

          <div className="flex flex-col xl:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">

              {/* 1. Select Customer, Buyer & Supplier */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 bg-[#F8FAFC]">
                  <div className="w-6 h-6 rounded-full bg-[#0453B8] text-white flex items-center justify-center font-bold text-xs shadow-sm">1</div>
                  <h3 className="font-bold text-[#0453B8] text-[15px]">Select Supplier, Buyer & Agent</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="flex flex-col gap-2">
                      <Label className="text-xs font-bold text-slate-700">Supplier <span className="text-red-500">*</span></Label>
                      <Select value={selectedSupplier} onValueChange={setSelectedSupplier} disabled={isViewMode}>
                        <SelectTrigger className="w-full h-10 text-sm font-medium focus:ring-[#0453B8] bg-white border-slate-200 shadow-sm truncate">
                          <SelectValue placeholder="Select Supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          {INITIAL_MASTER_SUPPLIERS
                            .filter(s => ["Trims", "Both"].includes(s.category))
                            .map(supplier => (
                              <SelectItem key={supplier.name} value={supplier.name}>{supplier.name}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className="text-xs font-bold text-slate-700">Buyer</Label>
                      <Select value={selectedBuyerId} onValueChange={setSelectedBuyerId} disabled={isViewMode}>
                        <SelectTrigger className="w-full h-10 text-sm font-medium focus:ring-[#0453B8] bg-white border-slate-200 shadow-sm truncate">
                          <SelectValue placeholder="Select Buyer" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(new Set(MOCK_SALES_ORDERS_LIST.map(so => so.buyer))).map(buyer => (
                            <SelectItem key={buyer} value={buyer}>{buyer}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className="text-xs font-bold text-slate-600 uppercase">Agent / Broker</Label>
                      <Input defaultValue="Nitin Bhai" className="h-10 text-sm bg-white border-slate-200 shadow-sm font-medium" disabled={isViewMode} />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className="text-xs font-bold text-slate-700">PO Date</Label>
                      <Input type="date" defaultValue="2026-06-13" className="h-10 text-sm bg-white border-slate-200 shadow-sm font-medium" disabled={isViewMode} />
                    </div>
                  </div>

                  <div className="mt-4 overflow-hidden relative">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-800">
                        Supplier Address
                      </h3>
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
                            {selectedSupplier && supplierAddressInfo ? (
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

                </div>
              </div>

              {/* 2. Add Trim Items */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-[#F8FAFC]">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#0453B8] text-white flex items-center justify-center font-bold text-xs shadow-sm">2</div>
                    <h3 className="font-bold text-[#0453B8] text-[15px]">Add Trim Items</h3>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  {!isViewMode && (
                    <div className="mb-4">
                      <Button onClick={handleAddTrim} variant="outline" className="text-[#0453B8] border-blue-200 hover:bg-blue-50 font-bold bg-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Trim Item
                      </Button>
                    </div>
                  )}

                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex-1">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 font-bold text-slate-600 text-center w-12">#</th>
                          <th className="px-4 py-3 font-bold text-slate-600 text-center w-16">Image</th>
                          <th className="px-4 py-3 font-bold text-slate-600">Item Type</th>
                          <th className="px-4 py-3 font-bold text-slate-600">Description</th>
                          <th className="px-4 py-3 font-bold text-slate-600 text-center w-[120px]">Total Qty (Pcs)</th>
                          <th className="px-4 py-3 font-bold text-slate-600 text-center w-[100px]">Rate (₹)</th>
                          <th className="px-4 py-3 font-bold text-slate-600 text-center w-[100px]">GST %</th>
                          <th className="px-4 py-3 font-bold text-slate-600 text-center w-[100px]">Amount (₹)</th>
                          {!isViewMode && <th className="px-4 py-3 font-bold text-slate-600 text-center w-[80px]">Action</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {trimItems.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="px-4 py-12 text-center text-slate-500 font-medium">
                              No trim items added yet. Click "+ Add Trim Item" to begin.
                            </td>
                          </tr>
                        ) : (
                          trimItems.map((item, idx) => {
                            const totalQty = item.linkedLines.reduce((sum, l) => sum + Math.max(0, l.requiredQty - l.alreadyOrdered), 0);
                            const uniqueSOs = Array.from(new Set(item.linkedLines.map(l => l.soNo)));
                            const soCount = uniqueSOs.length;

                            return (
                              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3 text-center font-bold text-slate-700">{idx + 1}</td>
                                <td className="px-4 py-3">
                                  <div className="w-10 h-10 rounded bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                                    {(item as any).image ? (
                                      <img src={(item as any).image} alt="trim" className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <Plus className="w-4 h-4" />
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <Select value={item.itemType} onValueChange={(v) => handleUpdateTrim(item.id, 'itemType', v)} disabled={isViewMode}>
                                    <SelectTrigger className="h-9 border-slate-200 bg-white focus:ring-[#0453B8] shadow-sm">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Button">Button</SelectItem>
                                      <SelectItem value="Main Label">Main Label</SelectItem>
                                      <SelectItem value="Care Label">Care Label</SelectItem>
                                      <SelectItem value="Hang Tag">Hang Tag</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="px-4 py-3">
                                  <Input
                                    disabled={isViewMode}
                                    value={item.description}
                                    onChange={(e) => handleUpdateTrim(item.id, 'description', e.target.value)}
                                    placeholder="e.g. 5# Nylon Coil, Black"
                                    className="h-9 border-slate-200 bg-white focus:ring-[#0453B8] shadow-sm"
                                  />
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <Input
                                    disabled={isViewMode}
                                    type="number"
                                    value={item.manualTotalQty !== undefined && item.manualTotalQty !== "" ? item.manualTotalQty : (totalQty > 0 ? totalQty : "")}
                                    onChange={(e) => handleUpdateTrim(item.id, 'manualTotalQty', e.target.value)}
                                    placeholder={totalQty > 0 ? totalQty.toString() : "-"}
                                    className="w-24 h-9 mx-auto text-center font-bold text-slate-900 border-slate-200 focus:ring-[#0453B8] shadow-sm"
                                  />
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <Input
                                    disabled={isViewMode}
                                    type="number"
                                    value={item.rate || ""}
                                    onChange={(e) => handleUpdateTrim(item.id, 'rate', e.target.value)}
                                    placeholder="0.00"
                                    className="w-20 h-9 mx-auto text-center font-bold text-slate-900 border-slate-200 focus:ring-[#0453B8] shadow-sm"
                                  />
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <Select value={item.gst || "5"} onValueChange={(v) => handleUpdateTrim(item.id, 'gst', v)} disabled={isViewMode}>
                                    <SelectTrigger className="h-9 w-20 mx-auto border-slate-200 bg-white focus:ring-[#0453B8] shadow-sm">
                                      <SelectValue placeholder="5%" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="0">0%</SelectItem>
                                      <SelectItem value="5">5%</SelectItem>
                                      <SelectItem value="12">12%</SelectItem>
                                      <SelectItem value="18">18%</SelectItem>
                                      <SelectItem value="28">28%</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <div className="font-bold text-slate-800">
                                    {(() => {
                                      const qty = item.manualTotalQty !== undefined && item.manualTotalQty !== "" ? Number(item.manualTotalQty) : totalQty;
                                      const rate = Number(item.rate) || 0;
                                      return (qty * rate).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                    })()}
                                  </div>
                                </td>
                                {!isViewMode && (
                                  <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setActiveTrimIdForLinking(item.id)}
                                        className="h-8 px-3 text-[#0453B8] hover:bg-blue-50 border-blue-200 font-bold"
                                        title="Link SO Lines"
                                      >
                                        <Link2 className="w-3.5 h-3.5 mr-1.5" />
                                        Link SO
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteTrim(item.id)}
                                        className="w-8 h-8 p-0 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200"
                                        title="Delete Trim"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </td>
                                )}
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>

                    {!isViewMode && trimItems.length > 0 && (
                      <div className="bg-slate-50 border-t border-slate-200 py-3 px-4 flex justify-center">
                        <Button onClick={handleAddTrim} variant="ghost" className="text-[#0453B8] hover:bg-blue-100 font-bold text-sm h-8">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Trim Item
                        </Button>
                      </div>
                    )}
                  </div>

                </div>
              </div>

            </div>

            {/* Right Sidebar */}
            <div className="w-full xl:w-[340px] flex flex-col gap-5 flex-shrink-0">

              {/* PO Number/Date Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col bg-white border border-blue-200/60 rounded-xl p-3 shadow-sm text-center justify-center">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">PO NUMBER</span>
                  <span className="text-base font-black text-[#0453B8] tracking-wide">
                    {initialPo?.id || "TPO-8006"}
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
              </div>

              {/* Notes */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <h3 className="font-semibold text-slate-800 text-sm">Notes</h3>
                </div>
                <div className="p-4">
                  <textarea
                    disabled={isViewMode}
                    className="w-full min-h-[120px] p-3 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-[#0453B8] outline-none resize-none placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="Add any internal notes or special instructions for this order..."
                  />
                </div>
              </div>

              {/* Attach Documents */}
              <AttachmentsModal isReadOnly={isViewMode} />

              {/* Summary */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-slate-900 text-[15px] mb-5">PO Summary</h3>
                <div className="space-y-4 text-sm">

                  <div className="flex justify-between items-center text-slate-600">
                    <span>Total Items</span>
                    <span className="font-semibold text-slate-900">{totalPoItemsCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 mt-1">
                    <span>Total Qty</span>
                    <span className="font-bold text-[#0453B8]">{totalPoQty} Pcs</span>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
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
        </div>

        {/* Sticky Footer */}
        <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3 shrink-0 relative z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {isViewMode ? (
            <>
              <Button onClick={() => router.push(backHref)} variant="outline" className="font-medium h-10 px-6">
                Back to POs
              </Button>
              <Link href={`${backHref}/${initialPo?.id || "TPO-8006"}/edit`}>
                <Button className="h-10 px-6 bg-[#0453B8] hover:bg-blue-700 text-white font-medium shadow-sm">
                  Edit PO
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => router.push(backHref)} className="text-slate-600 font-bold hover:bg-slate-100">
                Cancel
              </Button>
              <Button variant="outline" className="border-slate-200 text-slate-500 font-bold hover:bg-slate-50 hover:text-slate-700 bg-white shadow-sm h-10">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button className="bg-[#89a8de] hover:bg-blue-500 text-white font-bold px-6 shadow-sm h-10">
                Send to Supplier
              </Button>
            </>
          )}
        </div>

        {activeTrimDetails && (
          <LinkSoLinesDialog
            open={true}
            onOpenChange={(open) => {
              if (!open) setActiveTrimIdForLinking(null);
            }}
            buyerName={selectedBuyerId}
            trimItemDetails={{
              itemType: activeTrimDetails.itemType,
              description: activeTrimDetails.description,
            }}
            initialLinkedLines={activeTrimDetails.linkedLines}
            onSave={handleSaveLinkedLines}
          />
        )}
      </div>
    </FormProvider>
  );
}
