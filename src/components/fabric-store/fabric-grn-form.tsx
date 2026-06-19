"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Trash2, Plus, FileText, CheckCircle2, Paperclip, Edit2 } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NotesPanel } from "@/components/sales-order/notes-panel";
import { AttachmentsModal } from "@/components/sales-order/attachments-modal";
import { useForm, FormProvider } from "react-hook-form";

interface RollEntry {
  id: string;
  srNo: number;
  description: string;
  rollNo: string;
  width: string;
  gsm: string;
  color: string;
  fabricType: string;
  mtrQty: number;
  hsn: string;
  rate: number;
  gst: number;
  amount: number;
  poItemIds?: string[];
}

const INITIAL_SUPPLIERS = ["SALASAR FASHION", "ARVIND MILLS", "VARDHMAN TEXTILES"];
const FABRIC_POS = ["PO-102 (01/06/2026)", "PO-103 (05/06/2026)"];

export function FabricGrnForm() {
  const methods = useForm({
    defaultValues: {
      notes: "",
      remarks: ""
    }
  });

  const [supplier, setSupplier] = useState("");
  const [po, setPo] = useState("");
  const [poLoaded, setPoLoaded] = useState(false);
  
  const [poItems] = useState([
    { id: "1", material: "ASTROFILL-016", width: "58", gsm: "250", color: "BLACK", type: "POLYESTER", hsn: "540752", rate: 175.00, gst: 5, orderedQty: 1000, balanceQty: 600 },
    { id: "2", material: "SHADOWMESH-220", width: "60", gsm: "220", color: "NAVY", type: "MESH", hsn: "540752", rate: 120.00, gst: 5, orderedQty: 500, balanceQty: 300 },
    { id: "3", material: "VELVOTEX-330", width: "62", gsm: "330", color: "GREY", type: "VELVET", hsn: "540752", rate: 150.00, gst: 5, orderedQty: 800, balanceQty: 800 },
  ]);

  const handleLoadPo = (selectedPo: string) => {
    if (selectedPo) {
      setPoLoaded(true);
    }
  };
  
  const [showAddress, setShowAddress] = useState(true);
  const [entries, setEntries] = useState<RollEntry[]>([]);

  // Popup States
  const [isLoadPoItemsOpen, setIsLoadPoItemsOpen] = useState(false);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [manualFormData, setManualFormData] = useState({
    description: "", rollNo: "", width: "", gsm: "", color: "", fabricType: "", mtrQty: "", hsn: "", rate: "", gst: "5"
  });

  const [selectedPoItems, setSelectedPoItems] = useState<Record<string, boolean>>({});
  const [combineLines, setCombineLines] = useState(false);

  const handleOpenManualEntry = () => {
    setEditingEntryId(null);
    setManualFormData({
      description: "", rollNo: "", width: "", gsm: "", color: "", fabricType: "", mtrQty: "", hsn: "", rate: "", gst: "5"
    });
    setIsManualEntryOpen(true);
  };

  const handleEditEntry = (entry: RollEntry) => {
    setEditingEntryId(entry.id);
    setManualFormData({
      description: entry.description,
      rollNo: entry.rollNo,
      width: entry.width,
      gsm: entry.gsm,
      color: entry.color,
      fabricType: entry.fabricType,
      mtrQty: entry.mtrQty.toString(),
      hsn: entry.hsn,
      rate: entry.rate.toString(),
      gst: entry.gst.toString()
    });
    setIsManualEntryOpen(true);
  };

  const handleSaveManualEntry = () => {
    const mtrQty = Number(manualFormData.mtrQty) || 0;
    const rate = Number(manualFormData.rate) || 0;
    const gst = Number(manualFormData.gst) || 5;

    if (editingEntryId) {
      setEntries(entries.map(e => e.id === editingEntryId ? {
        ...e,
        ...manualFormData,
        mtrQty,
        rate,
        gst,
        amount: mtrQty * rate
      } : e));
    } else {
      const row: RollEntry = {
        id: Math.random().toString(),
        srNo: entries.length + 1,
        description: manualFormData.description,
        rollNo: manualFormData.rollNo,
        width: manualFormData.width,
        gsm: manualFormData.gsm,
        color: manualFormData.color,
        fabricType: manualFormData.fabricType,
        mtrQty,
        hsn: manualFormData.hsn,
        rate,
        gst,
        amount: mtrQty * rate,
      };
      setEntries([...entries, row]);
    }
    setIsManualEntryOpen(false);
  };

  const handleAddSelectedPoItems = () => {
    const selectedItemIds = Object.keys(selectedPoItems).filter(id => selectedPoItems[id]);
    const selectedItems = selectedItemIds.map(id => poItems.find(i => i.id === id)).filter(Boolean) as typeof poItems;

    if (selectedItems.length === 0) return;

    if (combineLines && selectedItems.length > 0) {
      const combinedQty = selectedItems.reduce((acc, curr) => acc + (curr.balanceQty || 0), 0);
      const combinedDesc = selectedItems.map(i => i.material).join(" + ");
      const firstItem = selectedItems[0];
      
      const newRow: RollEntry = {
        id: Math.random().toString(),
        srNo: entries.length + 1,
        description: combinedDesc,
        rollNo: "",
        width: firstItem.width,
        gsm: firstItem.gsm,
        color: Array.from(new Set(selectedItems.map(i => i.color))).join("/"),
        fabricType: firstItem.type,
        mtrQty: combinedQty,
        hsn: firstItem.hsn,
        rate: firstItem.rate,
        gst: firstItem.gst,
        amount: combinedQty * firstItem.rate,
        poItemIds: selectedItems.map(i => i.id),
      };
      setEntries([...entries, newRow]);
    } else {
      const newRows = selectedItems.map((item, index) => {
        const qty = item.balanceQty || 0;
        return {
          id: Math.random().toString(),
          srNo: entries.length + index + 1,
          description: item.material,
          rollNo: "",
          width: item.width,
          gsm: item.gsm,
          color: item.color,
          fabricType: item.type,
          mtrQty: qty,
          hsn: item.hsn,
          rate: item.rate,
          gst: item.gst,
          amount: qty * item.rate,
          poItemIds: [item.id],
        };
      });
      setEntries([...entries, ...newRows]);
    }
    
    setIsLoadPoItemsOpen(false);
    setSelectedPoItems({});
  };

  const updateEntry = (id: string, field: keyof RollEntry, value: any) => {
    setEntries(entries.map(entry => {
      if (entry.id === id) {
        const updated = { ...entry, [field]: value };
        if (field === 'mtrQty' || field === 'rate') {
          updated.amount = Number(updated.mtrQty) * Number(updated.rate);
        }
        return updated;
      }
      return entry;
    }));
  };

  const removeEntry = (id: string) => {
    const newEntries = entries.filter(e => e.id !== id).map((e, idx) => ({ ...e, srNo: idx + 1 }));
    setEntries(newEntries);
  };

  const totalMeters = entries.reduce((acc, curr) => acc + (Number(curr.mtrQty) || 0), 0);
  const subTotal = entries.reduce((acc, curr) => acc + curr.amount, 0);
  const totalGstAmount = entries.reduce((acc, curr) => acc + (curr.amount * (Number(curr.gst) || 0) / 100), 0);
  const grandTotal = subTotal + totalGstAmount;

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col h-full overflow-hidden bg-slate-50/50">
        <div className="flex-1 overflow-y-auto px-5 py-5 pb-4 hide-scrollbar">
        {/* Header */}
        <div className="flex flex-col mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/fabric-store" className="p-2 bg-white hover:bg-slate-50 rounded-full border border-slate-200 text-slate-500 hover:text-[#0453B8] transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="p-2 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center w-10 h-10 text-blue-600 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">
                New Fabric GRN
              </h1>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">GRN Date</Label>
                <div className="flex items-center border border-slate-200 rounded-md bg-white px-3 h-9 text-sm font-medium text-slate-700 min-w-[140px]">
                  15-Jun-2026
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">GRN Number</Label>
                <div className="flex items-center border border-slate-200 rounded-md bg-slate-50 px-3 h-9 text-sm font-medium text-slate-400 italic min-w-[140px]">
                  Auto-Generated
                </div>
              </div>
              <div className="flex flex-col gap-1.5 items-center">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</Label>
                <div className="bg-blue-50 text-[#0453B8] font-bold px-4 py-1.5 rounded-md text-sm">
                  Draft
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-5">
          {/* Left Column (Main Content) */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            
            {/* 1. Supplier & Document Details */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-[#0453B8] mb-5">1. Supplier & Document Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Supplier <span className="text-red-500">*</span></Label>
                  <Select value={supplier} onValueChange={setSupplier}>
                    <SelectTrigger className="w-full h-10 border-slate-200 text-sm focus:ring-[#0453B8] bg-white font-medium">
                      <SelectValue placeholder="Select Supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {INITIAL_SUPPLIERS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Fabric PO <span className="text-red-500">*</span></Label>
                  <Select value={po} onValueChange={(val) => { setPo(val); handleLoadPo(val); }}>
                    <SelectTrigger className="w-full h-10 border-slate-200 text-sm focus:ring-[#0453B8] bg-white font-medium">
                      <SelectValue placeholder="Select PO" />
                    </SelectTrigger>
                    <SelectContent>
                      {FABRIC_POS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Delivery Challan No.</Label>
                  <Input placeholder="Enter Challan No." className="h-10 text-sm bg-white border-slate-200" />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Challan Date</Label>
                  <Input type="date" className="h-10 text-sm bg-white border-slate-200" />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Invoice No.</Label>
                  <Input placeholder="Enter Invoice No." className="h-10 text-sm bg-white border-slate-200" />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Invoice Date</Label>
                  <Input type="date" className="h-10 text-sm bg-white border-slate-200" />
                </div>
              </div>

              {/* Address Block */}
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-[#F8FAFC]">
                <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => setShowAddress(!showAddress)}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#0453B8]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-700 uppercase">Address</h3>
                      <p className="text-sm font-semibold text-slate-900 mt-0.5">{supplier || "Select Supplier"}</p>
                    </div>
                  </div>
                  <button type="button" className="text-sm font-bold text-[#0453B8] hover:text-blue-700 flex items-center gap-1">
                    {showAddress ? "Hide Address" : "Show Address"}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${showAddress ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6"/></svg>
                  </button>
                </div>
                
                {showAddress && supplier && (
                  <div className="px-4 pb-4 pl-[3.25rem] text-sm text-slate-600">
                    <p>123, Ring Road, Surat - 395002, Gujarat, India</p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. PO Summary Highlights */}
            {poLoaded && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h2 className="text-sm font-bold text-[#0453B8] mb-5">2. PO Summary (This PO)</h2>
                <div className="grid grid-cols-5 gap-4 text-center divide-x divide-slate-200">
                  <div className="flex flex-col gap-1.5 px-2">
                    <span className="text-[11px] font-bold text-slate-700">Ordered Qty</span>
                    <span className="text-lg font-black text-slate-900">{po ? '1,000.00' : '0.00'} <span className="text-[10px] font-bold text-slate-400">Mtr</span></span>
                  </div>
                  <div className="flex flex-col gap-1.5 px-2">
                    <span className="text-[11px] font-bold text-slate-700">Previously Received</span>
                    <span className="text-lg font-black text-slate-900">{po ? '400.00' : '0.00'} <span className="text-[10px] font-bold text-slate-400">Mtr</span></span>
                  </div>
                  <div className="flex flex-col gap-1.5 px-2">
                    <span className="text-[11px] font-bold text-[#0453B8]">Current Received</span>
                    <span className="text-lg font-black text-[#0453B8]">{totalMeters.toFixed(2)} <span className="text-[10px] font-bold text-slate-400">Mtr</span></span>
                  </div>
                  <div className="flex flex-col gap-1.5 px-2">
                    <span className="text-[11px] font-bold text-emerald-600">Total Received</span>
                    <span className="text-lg font-black text-emerald-600">{po ? (400 + totalMeters).toFixed(2) : totalMeters.toFixed(2)} <span className="text-[10px] font-bold text-slate-400">Mtr</span></span>
                  </div>
                  <div className="flex flex-col gap-1.5 px-2">
                    <span className="text-[11px] font-bold text-red-500">Balance Qty</span>
                    <span className="text-lg font-black text-red-500">{po ? (1000 - (400 + totalMeters)).toFixed(2) : '0.00'} <span className="text-[10px] font-bold text-slate-400">Mtr</span></span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Roll Wise Entry Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden mb-5">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-bold text-[#0453B8]">3. Fabric Receiving Entry</h2>
                </div>
                <div className="flex items-center gap-3">
                  <Button onClick={() => setIsLoadPoItemsOpen(true)} disabled={!poLoaded} variant="outline" className="h-8 px-3 text-[#0453B8] border-blue-200 hover:bg-blue-50 font-semibold text-xs bg-white shadow-sm">
                    <FileText className="w-3.5 h-3.5 mr-1.5" />
                    Load PO Items
                  </Button>
                  <Button onClick={handleOpenManualEntry} disabled={!poLoaded} className="h-8 px-3 text-[#00A86B] border-[#00A86B]/30 hover:bg-[#00A86B]/10 font-semibold text-xs bg-white shadow-sm border">
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Manual Fabric
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto w-full custom-scrollbar">
                <Table className="min-w-[1200px]">
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="text-slate-700 text-[11px] font-bold text-center py-2.5 px-2 w-12">Sr</TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2">Description <span className="text-red-500">*</span> <span className="inline-block w-3.5 h-3.5 rounded-full border border-blue-400 text-blue-500 text-[9px] text-center leading-[12px] font-bold ml-1 cursor-help">i</span></TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2 w-32 text-center">Mtr Qty <span className="text-red-500">*</span></TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2 w-32 text-center">Rate (₹/Mtr) <span className="text-red-500">*</span></TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2 w-32 text-center">GST % <span className="text-red-500">*</span></TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2 w-32 text-right">Amount (₹)</TableHead>
                      <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2 w-16 text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-sm">
                    {!poLoaded ? (
                      <TableRow>
                        <TableCell colSpan={13} className="text-center py-12 text-slate-400 font-medium bg-slate-50/50">
                          Please load a Fabric PO first to enter rolls.
                        </TableCell>
                      </TableRow>
                    ) : entries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={13} className="text-center py-8 text-slate-400 font-medium">
                          No rolls added yet. Use the quick add row below to enter rolls.
                        </TableCell>
                      </TableRow>
                    ) : null}
                    
                    {entries.map((entry) => (
                      <TableRow key={entry.id} className="hover:bg-slate-50/50 group cursor-pointer" onClick={() => handleEditEntry(entry)}>
                        <TableCell className="text-center text-slate-600 py-3 px-2 text-xs font-semibold">{entry.srNo}</TableCell>
                        <TableCell className="py-3 px-2">
                          <div className="font-bold text-slate-800 text-sm uppercase mb-1">{entry.description || "-"}</div>
                          {(entry.width || entry.gsm || entry.color || entry.fabricType) ? (
                            <p className="text-[10px] text-slate-500 font-medium">
                              {[
                                entry.width ? `${entry.width}"` : null,
                                entry.gsm ? `${entry.gsm} GSM` : null,
                                entry.color,
                                entry.fabricType
                              ].filter(Boolean).join(" • ")}
                            </p>
                          ) : (
                            <p className="text-[10px] text-slate-400 font-medium">(Width, GSM, Color, Fabric Type will appear here after save)</p>
                          )}
                        </TableCell>
                        <TableCell className="py-3 px-2 text-center">
                          <div className="text-sm font-bold text-slate-700">{entry.mtrQty} <span className="text-[10px] text-slate-400 ml-0.5">Mtr</span></div>
                        </TableCell>
                        <TableCell className="py-3 px-2 text-center">
                          <div className="text-sm font-bold text-slate-700">₹ {entry.rate}</div>
                        </TableCell>
                        <TableCell className="py-3 px-2 text-center">
                          <div className="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-1 rounded w-fit mx-auto">{entry.gst}%</div>
                        </TableCell>
                        <TableCell className="text-right py-3 px-2 text-sm font-bold text-slate-900">
                          {entry.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-center py-3 px-2">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={(e) => { e.stopPropagation(); handleEditEntry(entry); }} type="button" className="p-1.5 text-blue-500 hover:bg-blue-50 rounded border border-blue-200 transition-colors bg-white shadow-sm">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); removeEntry(entry.id); }} type="button" className="p-1.5 text-red-500 hover:bg-red-50 rounded border border-red-200 transition-colors bg-white shadow-sm">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <div className="text-sm font-bold text-slate-700">
                  Total Items: {entries.length}
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-sm font-bold text-slate-700">Total Qty:</div>
                  <div className="text-sm font-black text-slate-900">{totalMeters.toFixed(2)} Mtr</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Sidebar) */}
          <div className="w-full xl:w-[320px] flex flex-col gap-5 flex-shrink-0">
            {/* Logistics Details */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Logistics Details</h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-[11px] font-bold text-slate-700">Transport Name</Label>
                  <Input placeholder="Enter Transport Name" className="h-9 text-sm bg-white border-slate-200" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-[11px] font-bold text-slate-700">LR Number</Label>
                  <Input placeholder="Enter LR Number" className="h-9 text-sm bg-white border-slate-200" />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-2">
              <Label className="text-[11px] font-bold text-slate-900">Notes</Label>
              <textarea
                placeholder="Add any internal notes or special instructions for this order..."
                className="w-full min-h-[120px] resize-none border border-slate-200 rounded-xl p-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
              />
            </div>

            <Button type="button" variant="outline" className="w-full h-11 border-slate-200 text-slate-700 hover:bg-slate-50 flex justify-center items-center font-bold bg-white shadow-sm rounded-xl">
              <Paperclip className="w-4 h-4 mr-2 text-slate-500" />
              Attachments (0)
            </Button>

            {/* Total Summary */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-5">Total Summary</h3>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-xs">Sub Total</span>
                  <span className="font-bold text-slate-900">₹ {subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="flex justify-between items-center text-slate-600 mt-1">
                  <span className="text-xs">Discount</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-slate-200 rounded bg-slate-50 w-[70px] h-7 overflow-hidden">
                      <select className="bg-transparent text-xs font-medium w-full h-full px-1 focus:outline-none">
                        <option>%</option>
                        <option>₹</option>
                      </select>
                    </div>
                    <div className="flex items-center border border-slate-200 rounded bg-white w-[70px] overflow-hidden px-2 h-7 focus-within:ring-1 focus-within:ring-[#0453B8]">
                      <input type="number" defaultValue="0" className="w-full text-right text-xs focus:outline-none h-full bg-transparent font-medium text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    </div>
                    <span className="font-bold text-slate-900 w-16 text-right">₹ 0.00</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-slate-600 mt-1">
                  <span className="text-xs">Total GST</span>
                  <span className="font-bold text-slate-900">₹ {totalGstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="flex justify-between items-center text-slate-600 mt-1">
                  <span className="text-xs">Freight</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-slate-200 rounded bg-white w-20 overflow-hidden px-2 h-7 focus-within:ring-1 focus-within:ring-[#0453B8]">
                      <span className="text-[10px] text-slate-500 font-medium">₹</span>
                      <input type="number" defaultValue="0.00" className="w-full text-right text-xs focus:outline-none h-full bg-transparent font-medium text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    </div>
                    <span className="font-bold text-slate-900 w-16 text-right">₹ 0.00</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-slate-600 mt-1">
                  <span className="text-xs">Round Off</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-slate-200 rounded bg-white w-20 overflow-hidden px-2 h-7 focus-within:ring-1 focus-within:ring-[#0453B8]">
                      <span className="text-[10px] text-slate-500 font-medium">±₹</span>
                      <input type="number" defaultValue="0.00" className="w-full text-right text-xs focus:outline-none h-full bg-transparent font-medium text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    </div>
                    <span className="font-bold text-slate-900 w-16 text-right">₹ 0.00</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3 border-t border-slate-200 pt-4">
                  <span className="font-bold text-slate-900">Grand Total</span>
                  <span className="font-bold text-[#0453B8] text-xl">₹ {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Action Footer */}
      <div className="flex-shrink-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-10">
        <Link href="/fabric-store">
          <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium h-10 px-6">
            Cancel
          </Button>
        </Link>
        <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium h-10 px-6">
          <FileText className="w-4 h-4 mr-2 opacity-70" /> Save Draft
        </Button>
        <Button className="h-10 px-6 bg-[#0453B8] hover:bg-blue-700 text-white font-medium shadow-sm">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Save & Confirm GRN
        </Button>
      </div>
    </div>
      {/* Load PO Items Dialog */}
      <Dialog open={isLoadPoItemsOpen} onOpenChange={setIsLoadPoItemsOpen}>
        <DialogContent className="sm:max-w-4xl max-w-[95vw] w-full bg-white p-0 overflow-hidden">
          <DialogHeader className="px-5 py-4 border-b border-slate-100 flex flex-row items-center justify-between">
            <DialogTitle className="text-base font-bold text-slate-800">Load PO Items</DialogTitle>
          </DialogHeader>
          <div className="px-5 py-3 overflow-y-auto flex-1">
            <p className="text-sm font-medium text-slate-600 mb-4">Select Items from PO: PO-102 (01/06/2026)</p>
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-12 text-center py-3">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-[#0453B8] focus:ring-[#0453B8] w-4 h-4 cursor-pointer disabled:opacity-50"
                        disabled={poItems.every(item => new Set(entries.flatMap(e => e.poItemIds || [])).has(item.id))}
                        checked={poItems.length > 0 && Object.keys(selectedPoItems).length > 0 && Object.keys(selectedPoItems).every(id => selectedPoItems[id] || new Set(entries.flatMap(e => e.poItemIds || [])).has(id))}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const newSelection: Record<string, boolean> = {};
                          const alreadyAdded = new Set(entries.flatMap(e => e.poItemIds || []));
                          poItems.forEach(item => {
                            if (!alreadyAdded.has(item.id)) {
                              newSelection[item.id] = checked;
                            }
                          });
                          setSelectedPoItems(newSelection);
                        }}
                      />
                    </TableHead>
                    <TableHead className="py-3 font-bold text-slate-700 text-xs">Item Description</TableHead>
                    <TableHead className="py-3 font-bold text-slate-700 text-xs text-center">Width (Inch)</TableHead>
                    <TableHead className="py-3 font-bold text-slate-700 text-xs text-center">GSM</TableHead>
                    <TableHead className="py-3 font-bold text-slate-700 text-xs">Color</TableHead>
                    <TableHead className="py-3 font-bold text-slate-700 text-xs">Fabric Type</TableHead>
                    <TableHead className="py-3 font-bold text-slate-700 text-xs text-right">Ordered (Mtr)</TableHead>
                    <TableHead className="py-3 font-bold text-slate-700 text-xs text-right">Balance (Mtr)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {poItems.map((item) => {
                    const isAdded = new Set(entries.flatMap(e => e.poItemIds || [])).has(item.id);
                    return (
                    <TableRow key={item.id} className={`hover:bg-slate-50/50 ${isAdded ? 'opacity-50 bg-slate-50' : ''}`}>
                      <TableCell className="text-center py-3">
                        <input 
                          type="checkbox" 
                          disabled={isAdded}
                          className="rounded border-slate-300 text-[#0453B8] focus:ring-[#0453B8] w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                          checked={isAdded || selectedPoItems[item.id] || false}
                          onChange={(e) => setSelectedPoItems({...selectedPoItems, [item.id]: e.target.checked})}
                        />
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="font-semibold text-slate-700 text-xs uppercase flex items-center gap-2">
                          {item.material}
                          {isAdded && <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 text-[9px] font-bold">ADDED</span>}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-xs text-slate-600 text-center font-medium">
                        {item.width}
                      </TableCell>
                      <TableCell className="py-3 text-xs text-slate-600 text-center font-medium">
                        {item.gsm}
                      </TableCell>
                      <TableCell className="py-3 text-xs text-slate-600 font-medium uppercase">
                        {item.color}
                      </TableCell>
                      <TableCell className="py-3 text-xs text-slate-600 font-medium uppercase">
                        {item.type}
                      </TableCell>
                      <TableCell className="py-3 text-xs font-semibold text-slate-700 text-right">
                        {item.orderedQty?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="py-3 text-xs font-semibold text-slate-700 text-right">
                        {item.balanceQty?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  )})}
                  {poItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-slate-400">No items available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-6">
                <span className="text-sm font-bold text-slate-800">
                  Selected Items: {Object.values(selectedPoItems).filter(Boolean).length}
                </span>
                
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="combineLines" 
                      className="text-[#0453B8] focus:ring-[#0453B8]"
                      checked={combineLines}
                      onChange={() => setCombineLines(true)}
                    />
                    <span className="text-sm text-slate-600 font-medium">Add both in one line</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="combineLines" 
                      className="text-[#0453B8] focus:ring-[#0453B8]"
                      checked={!combineLines}
                      onChange={() => setCombineLines(false)}
                    />
                    <span className="text-sm text-slate-600 font-medium">Add in different lines</span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setIsLoadPoItemsOpen(false)} className="h-9 px-4 text-slate-700 font-medium border-slate-200">
                  Cancel
                </Button>
                <Button onClick={handleAddSelectedPoItems} className="h-9 px-4 bg-[#0453B8] hover:bg-blue-700 text-white font-medium">
                  Add Selected
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manual / Edit Entry Dialog */}
      <Dialog open={isManualEntryOpen} onOpenChange={setIsManualEntryOpen}>
        <DialogContent className="sm:max-w-2xl max-w-[95vw] w-full max-h-[90vh] overflow-y-auto bg-white p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">
              {editingEntryId ? "Edit Fabric Details" : "Add Manual Fabric"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Description <span className="text-red-500">*</span></Label>
              <Input 
                value={manualFormData.description} 
                onChange={(e) => setManualFormData({...manualFormData, description: e.target.value})} 
                placeholder="Enter fabric description"
                className="h-9 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0453B8]"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Roll/Bale No</Label>
              <Input 
                value={manualFormData.rollNo} 
                onChange={(e) => setManualFormData({...manualFormData, rollNo: e.target.value})} 
                placeholder="Enter roll no"
                className="h-9 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0453B8]"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Fabric Type</Label>
              <Input 
                value={manualFormData.fabricType} 
                onChange={(e) => setManualFormData({...manualFormData, fabricType: e.target.value})} 
                placeholder="e.g. COTTON, POLYESTER"
                className="h-9 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0453B8]"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Width</Label>
              <Input 
                value={manualFormData.width} 
                onChange={(e) => setManualFormData({...manualFormData, width: e.target.value})} 
                placeholder='e.g. 44"'
                className="h-9 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0453B8]"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-700">GSM</Label>
              <Input 
                value={manualFormData.gsm} 
                onChange={(e) => setManualFormData({...manualFormData, gsm: e.target.value})} 
                placeholder="e.g. 180"
                className="h-9 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0453B8]"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Color</Label>
              <Input 
                value={manualFormData.color} 
                onChange={(e) => setManualFormData({...manualFormData, color: e.target.value})} 
                placeholder="e.g. GREY"
                className="h-9 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0453B8]"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-700">HSN Code</Label>
              <Input 
                value={manualFormData.hsn} 
                onChange={(e) => setManualFormData({...manualFormData, hsn: e.target.value})} 
                placeholder="e.g. 5208"
                className="h-9 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0453B8]"
              />
            </div>
            
            <div className="flex flex-col gap-1.5 relative">
              <Label className="text-xs font-bold text-slate-700">Mtr Qty <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input 
                  type="number"
                  value={manualFormData.mtrQty} 
                  onChange={(e) => setManualFormData({...manualFormData, mtrQty: e.target.value})} 
                  placeholder="Enter qty"
                  className="h-9 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0453B8] pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">Mtr</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Rate (₹/Mtr) <span className="text-red-500">*</span></Label>
              <Input 
                type="number"
                value={manualFormData.rate} 
                onChange={(e) => setManualFormData({...manualFormData, rate: e.target.value})} 
                placeholder="Enter rate"
                className="h-9 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0453B8] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-700">GST % <span className="text-red-500">*</span></Label>
              <Select value={manualFormData.gst} onValueChange={(v) => setManualFormData({...manualFormData, gst: v})}>
                <SelectTrigger className="h-9 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0453B8] w-full max-w-[200px]">
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
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setIsManualEntryOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveManualEntry} disabled={!manualFormData.description} className="bg-[#0453B8] hover:bg-blue-700 text-white shadow-sm px-6">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Save Details
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}
