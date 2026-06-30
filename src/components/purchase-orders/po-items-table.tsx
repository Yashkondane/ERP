"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { POItem } from "@/types/purchase-order";

interface POItemsTableProps {
  items: POItem[];
  onEditClick: (item: POItem) => void;
  onDeleteClick: (id: string) => void;
  onOpenAddDialog: () => void;
  onOpenManualEntry?: () => void;
  onQtyChange?: (id: string, newQty: number) => void;
  onRateChange?: (id: string, newRate: number) => void;
  onDateChange?: (id: string, newDate: string) => void;
  onColorChange?: (id: string, newColor: string) => void;
  onGsmChange?: (id: string, newGsm: string) => void;
  onWidthChange?: (id: string, newWidth: string) => void;
  onImageChange?: (id: string, imageUrl: string) => void;
  totalQtyDisplay: string;
  isReadOnly?: boolean;
  itemLabel: string; // e.g. "Material" or "Trim Item"
  specLabel?: string; // e.g. "GSM / Content" or "Specifications"
  type?: "Fabric" | "Trims";
  headerContent?: React.ReactNode;
}

export function POItemsTable({
  items,
  onEditClick,
  onDeleteClick,
  onOpenAddDialog,
  onOpenManualEntry,
  onQtyChange,
  onRateChange,
  onDateChange,
  onColorChange,
  onGsmChange,
  onWidthChange,
  onImageChange,
  totalQtyDisplay,
  isReadOnly = false,
  itemLabel,
  specLabel = "GSM / Content",
  type,
  headerContent
}: POItemsTableProps) {
  const [viewingItem, setViewingItem] = useState<POItem | null>(null);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0453B8] text-white text-xs font-bold">2</div>
          <h2 className="text-sm font-bold text-slate-900">{itemLabel}s</h2>
          {headerContent}
        </div>
        {!isReadOnly && (
          <div className="flex items-center gap-2">
            <Button onClick={() => onOpenManualEntry && onOpenManualEntry()} size="sm" className="bg-[#10B981] hover:bg-emerald-600 text-white font-bold h-8 text-xs border-0">
              <Plus className="w-4 h-4 mr-1.5" /> Manual Fabric
            </Button>
          </div>
        )}
      </div>

      <div className="border border-slate-200 rounded-lg">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-slate-700 text-[11px] font-bold text-center py-2.5 px-2 w-[5%]">Sr</TableHead>
              <TableHead className="text-slate-700 text-[11px] font-bold text-center py-2.5 px-2 w-[5%]">Line</TableHead>
              <TableHead className="text-slate-700 text-[11px] font-bold text-center py-2.5 px-2 w-[8%]">Image</TableHead>
              <TableHead className="text-slate-700 text-[11px] font-bold py-2.5 px-2">Fabric Details</TableHead>

              <TableHead className="text-slate-700 text-[11px] font-bold text-center py-2.5 px-2 leading-tight w-[12%]">PO Qty<br/><span className="font-normal text-[9px] text-red-500">*</span></TableHead>
              <TableHead className="text-slate-700 text-[11px] font-bold text-center py-2.5 px-2 w-[10%]">Rate (₹)</TableHead>
              <TableHead className="text-slate-700 text-[11px] font-bold text-center py-2.5 px-2 w-[8%]">GST %</TableHead>
              <TableHead className="text-slate-700 text-[11px] font-bold text-right py-2.5 px-2 w-[12%]">Amount (₹)</TableHead>
              {!isReadOnly && <TableHead className="text-slate-700 text-[11px] font-bold text-center py-2.5 px-2 w-[8%]">Action</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm">
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isReadOnly ? 8 : 9} className="py-8 text-center text-slate-500">
                  No {itemLabel.toLowerCase()}s added yet. {!isReadOnly && `Click "Add Sales Order" or "Manual Fabric" to start.`}
                </TableCell>
              </TableRow>
            ) : (
              (() => {
                let globalIndex = 1;
                
                // Group items
                const groupedItems = items.reduce((acc, item) => {
                  const key = item.soNo || "MANUAL";
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(item);
                  return acc;
                }, {} as Record<string, POItem[]>);

                const soGroups = Object.keys(groupedItems).filter(key => key !== "MANUAL");
                const manualGroup = groupedItems["MANUAL"] || [];

                return (
                  <>
                    {soGroups.map(soNo => {
                      const groupItems = groupedItems[soNo];
                      // Use the first item's product name as the group header if available
                      const soName = groupItems[0]?.productName || "Product";
                      
                      return (
                        <React.Fragment key={`group-${soNo}`}>
                          {/* Group Header */}
                          <TableRow className="bg-[#f8fafd]">
                            <TableCell colSpan={9} className="py-2.5 px-4 text-xs font-bold text-[#0453B8]">
                              {soNo} - {soName}
                            </TableCell>
                          </TableRow>
                          
                          {/* Group Items */}
                          {groupItems.map((item, lineIndex) => {
                            const reqQty = item.requiredQty || 0;
                            const alreadyOrdered = Math.floor(reqQty * 0.4); // Mock data logic
                            const balance = reqQty - alreadyOrdered;
                            
                            return (
                              <TableRow key={item.id} className="hover:bg-slate-50/50">
                                <TableCell className="text-center text-slate-600 py-2.5 px-2 text-xs font-semibold">{globalIndex++}</TableCell>
                                <TableCell className="text-center text-slate-600 py-2.5 px-2 text-xs">L{lineIndex + 1}</TableCell>
                                
                                <TableCell className="py-2.5 px-2">
                                  <div className="w-9 h-9 rounded border border-slate-200 overflow-hidden bg-slate-50 mx-auto">
                                    <img src={item.fabricImage || "/Cotton_-_Fabric_Types_-_Brightside_1_480x480.jpg"} alt="Fabric" className="w-full h-full object-cover" />
                                  </div>
                                </TableCell>
                                <TableCell className="py-2.5 px-2">
                                  <div className="inline-flex flex-col min-w-[150px]">
                                    <span className="font-bold text-[#0453B8] text-[12px] leading-tight mb-0.5">{item.material || "Fabrics"}</span>
                                    <span className="text-[11px] font-bold text-slate-700 leading-tight">{(item.gsm || item.gsmContent || "180gsm").replace(" GSM", "gsm")} &nbsp; {item.width || '44"'}</span>
                                  </div>
                                </TableCell>



                                <TableCell className="text-center py-2.5 px-2">
                                  <button 
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); onEditClick(item); }}
                                    className="px-3 py-1 bg-blue-50 text-[#0453B8] font-bold border border-blue-200 rounded-md hover:bg-blue-100 transition-colors mx-auto block text-xs"
                                  >
                                    {item.qty || 0}
                                  </button>
                                </TableCell>

                                <TableCell className="text-center py-2.5 px-2 text-xs font-bold text-slate-800">
                                  {item.rate || 0}
                                </TableCell>

                                <TableCell className="text-center py-2.5 px-2 text-xs font-bold text-slate-800">
                                  {item.gst || 5}%
                                </TableCell>

                                <TableCell className="text-right py-2.5 px-2 text-[11px] font-bold text-slate-800">
                                  {(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </TableCell>

                                {!isReadOnly && (
                                  <TableCell className="text-center py-2.5 px-2">
                                    <button onClick={(e) => { e.stopPropagation(); onDeleteClick(item.id); }} type="button" className="p-1.5 text-red-500 hover:bg-red-50 rounded border border-red-200 transition-colors mx-auto block">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </TableCell>
                                )}
                              </TableRow>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}

                    {manualGroup.length > 0 && (
                      <React.Fragment key="group-MANUAL">
                        <TableRow className="bg-[#f0fdf4]">
                          <TableCell colSpan={9} className="py-2.5 px-4 text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
                            Manual Entry
                          </TableCell>
                        </TableRow>
                        {manualGroup.map((item) => (
                          <TableRow key={item.id} className="hover:bg-slate-50/50">
                            <TableCell className="text-center text-slate-600 py-2.5 px-2 text-xs font-semibold">{globalIndex++}</TableCell>
                            <TableCell className="text-center text-slate-400 py-2.5 px-2 text-xs">-</TableCell>
                            
                            <TableCell className="py-2.5 px-2">
                              <div className="w-9 h-9 rounded border border-slate-200 overflow-hidden bg-slate-50 mx-auto">
                                <img src={item.fabricImage || "/Cotton_-_Fabric_Types_-_Brightside_1_480x480.jpg"} alt="Fabric" className="w-full h-full object-cover" />
                              </div>
                            </TableCell>

                            <TableCell className="py-2.5 px-2">
                                  <div className="inline-flex flex-col min-w-[150px]">
                                    <span className="font-bold text-[#0453B8] text-[12px] leading-tight mb-0.5">{item.material || "Fabrics"}</span>
                                    <span className="text-[11px] font-bold text-slate-700 leading-tight">{(item.gsm || item.gsmContent || "150gsm").replace(" GSM", "gsm")} &nbsp; {item.width || '54"'}</span>
                                  </div>
                                </TableCell>



                            <TableCell className="text-center py-2.5 px-2">
                                <button 
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); onEditClick(item); }}
                                  className="px-3 py-1 bg-blue-50 text-[#0453B8] font-bold border border-blue-200 rounded-md hover:bg-blue-100 transition-colors mx-auto block text-xs"
                                >
                                  {item.qty || 0}
                                </button>
                              </TableCell>

                            <TableCell className="text-center py-2.5 px-2 text-xs font-bold text-slate-800">
                                {item.rate || 0}
                              </TableCell>

                            <TableCell className="text-center py-2.5 px-2 text-xs font-bold text-slate-800">
                                {item.gst || 5}%
                              </TableCell>

                            <TableCell className="text-right py-2.5 px-2 text-[11px] font-bold text-slate-800">
                              {(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </TableCell>

                            {!isReadOnly && (
                              <TableCell className="text-center py-2.5 px-2">
                                <button onClick={(e) => { e.stopPropagation(); onDeleteClick(item.id); }} type="button" className="p-1.5 text-red-500 hover:bg-red-50 rounded border border-red-200 transition-colors mx-auto block">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </React.Fragment>
                    )}
                  </>
                );
              })()
            )}
          </TableBody>
        </Table>
      </div>
      <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
        <span className="text-sm text-slate-600 font-medium">Total Items: {items.length}</span>
        <div className="flex items-center gap-4 text-sm font-bold">
          <span className="text-slate-600">Total Qty</span>
          <span className="text-slate-900">{totalQtyDisplay}</span>
        </div>
      </div>

      {viewingItem && (
        <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
          <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-white shadow-2xl border-0 [&>button]:hidden">
            <DialogHeader className="px-6 py-4 border-b border-slate-200 flex flex-row items-center justify-between bg-white shadow-sm z-10">
              <DialogTitle className="text-xl font-bold text-[#0F172A]">Item Details</DialogTitle>
              <button onClick={() => setViewingItem(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-0 max-h-[80vh] overflow-y-auto">
              <div className="bg-slate-100 flex items-center justify-center p-6 border-r border-slate-200">
                {viewingItem.images && viewingItem.images.length > 0 ? (
                  <img src={viewingItem.images[0].url} alt="Item Image" className="max-w-full max-h-[400px] object-contain drop-shadow-md rounded" />
                ) : (
                  <div className="w-full h-[300px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-300">
                    <ImageIcon className="w-16 h-16 opacity-50" strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 mb-1">{itemLabel}</h3>
                    <p className="text-lg font-bold text-slate-900">{viewingItem.material}</p>
                  </div>
                  {type === "Trims" && (
                    <div>
                      <h3 className="text-xs font-bold text-slate-500 mb-1">Item Code</h3>
                      <p className="text-md font-mono font-semibold text-slate-700">{viewingItem.code || '-'}</p>
                    </div>
                  )}
                  {type !== "Trims" && (
                    <>
                      <div>
                        <h3 className="text-xs font-bold text-slate-500 mb-1">{specLabel}</h3>
                        <p className="text-md font-semibold text-slate-700">{viewingItem.gsm || viewingItem.gsmContent || '-'}</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-500 mb-1">Width</h3>
                        <p className="text-md font-semibold text-slate-700">{viewingItem.width || '-'}</p>
                      </div>
                    </>
                  )}
                  <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-500 mb-1">Color / Shade</h3>
                    <div className="flex items-center gap-2">
                      {viewingItem.colorShade && viewingItem.colorShade !== '-' && (
                        <div className="w-4 h-4 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: viewingItem.colorShade.toLowerCase() === 'navy' ? '#000080' : viewingItem.colorShade.toLowerCase() === 'white' ? '#ffffff' : viewingItem.colorShade.toLowerCase() === 'black' ? '#000000' : viewingItem.colorShade.toLowerCase() === 'red' ? '#ef4444' : viewingItem.colorShade.toLowerCase() === 'grey' ? '#555555' : viewingItem.colorShade.toLowerCase() === 'natural' ? '#f5f5dc' : '#cccccc' }} />
                      )}
                      <p className="text-md font-semibold text-slate-700">{viewingItem.colorShade || '-'}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 mb-1">Required Qty</h3>
                    <p className="text-md font-semibold text-slate-700">{viewingItem.requiredQty ? viewingItem.requiredQty.toLocaleString('en-IN') : '-'} {viewingItem.uom}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 mb-1">Delivery Date</h3>
                    <p className="text-md font-semibold text-slate-700">{viewingItem.deliveryDate || '—'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 mb-1">Order Qty</h3>
                    <p className="text-md font-bold text-[#0453B8]">{viewingItem.qty ? viewingItem.qty.toLocaleString('en-IN') : '-'} {viewingItem.uom}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 mb-1">Buffer</h3>
                    <p className="text-md font-semibold text-slate-700">{viewingItem.buffer ? viewingItem.buffer.toLocaleString('en-IN') : '0'} {viewingItem.uom}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 mb-1">Rate</h3>
                    <p className="text-md font-bold text-slate-900">₹ {(viewingItem.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 mb-1">Amount</h3>
                    <p className="text-md font-bold text-[#0453B8]">₹ {(viewingItem.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
