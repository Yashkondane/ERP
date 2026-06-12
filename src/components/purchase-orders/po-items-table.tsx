"use client";

import { useState } from "react";
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
          <Button onClick={onOpenAddDialog} size="sm" className="bg-[#0453B8] hover:bg-blue-700 text-white font-medium h-8">
            <Plus className="w-4 h-4 mr-2" /> Add {itemLabel}
          </Button>
        )}
      </div>

      <div className="border border-slate-200 rounded-lg">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">#</TableHead>
              <TableHead className="text-slate-700 text-xs font-bold py-2.5">Image</TableHead>
              <TableHead className="text-slate-700 text-xs font-bold text-left py-2.5 min-w-[200px]">Product Details</TableHead>
              {type === "Trims" && (
                <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">Item Code</TableHead>
              )}
              {type !== "Trims" && (
                <>
                  <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">{specLabel}</TableHead>
                  <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">Width</TableHead>
                </>
              )}
              <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">Color / Shade</TableHead>
              <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">Delivery Date</TableHead>
              <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">Required Qty</TableHead>
              <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">Your Quantity</TableHead>
              <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">Rate (₹)</TableHead>
              <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">GST %</TableHead>
              <TableHead className="text-slate-700 text-xs font-bold text-right py-2.5">Amount (₹)</TableHead>
              {!isReadOnly && <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">Action</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm">
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isReadOnly ? 11 : 12} className="py-8 text-center text-slate-500">
                  No {itemLabel.toLowerCase()}s added yet. {!isReadOnly && `Click "Add ${itemLabel}" to start.`}
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50">
                  <TableCell className="text-center text-slate-500 py-3">{index + 1}</TableCell>
                  <TableCell className="py-3">
                    <div className="flex justify-center">
                      {type === "Fabric" && !isReadOnly ? (
                        <label className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#0453B8] transition-colors relative group">
                          {item.fabricImage ? (
                            <img src={item.fabricImage} alt="Fabric" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-400 group-hover:text-[#0453B8] transition-colors" />
                          )}
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file && onImageChange) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  onImageChange(item.id, event.target?.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
                          {item.fabricImage ? (
                            <img src={item.fabricImage} alt="Fabric" className="w-full h-full object-cover" />
                          ) : (item.material || "").toLowerCase().includes("button") ? (
                            <img src="/buttons .jpeg" alt="Button" className="w-full h-full object-cover" />
                          ) : (item.material || "").toLowerCase().includes("label") ? (
                            <img src="/label.png" alt="Label" className="w-full h-full object-cover" />
                          ) : (item.material || "").toLowerCase().includes("tag") ? (
                            <img src="/hangtag.jpeg" alt="Hangtag" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-left py-3 relative">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 group relative">
                        <span className="font-bold text-slate-900 text-sm truncate max-w-[180px]">{item.productName || "Product"}</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="cursor-help w-5 h-5 flex items-center justify-center text-slate-400 hover:text-[#0453B8] focus:outline-none focus:ring-2 focus:ring-[#0453B8] rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                            </button>
                          </PopoverTrigger>
                          
                          <PopoverContent side="top" className="w-[280px] p-3 bg-white border border-slate-200 shadow-xl rounded-xl z-50">
                            <div className="flex items-start gap-3 w-full">
                              {item.productImage && (
                                <div className="w-12 h-12 rounded bg-slate-50 border border-slate-100 flex-shrink-0 overflow-hidden">
                                  <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover mix-blend-multiply" />
                                </div>
                              )}
                              <div className="flex flex-col text-left">
                                <span className="text-xs font-bold text-slate-900 whitespace-normal">{item.productName}</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1">SO Details</span>
                                <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1.5">
                                  <span className="text-[10px] font-medium text-slate-500">SO No.</span>
                                  <span className="text-xs font-semibold text-slate-800">{item.soNo || "-"}</span>
                                  <span className="text-[10px] font-medium text-slate-500">Code</span>
                                  <span className="text-xs font-semibold text-slate-800">{item.productCode || "-"}</span>
                                  <span className="text-[10px] font-medium text-slate-500">Fit/Pattern</span>
                                  <span className="text-xs font-semibold text-slate-800">{item.productFit || "-"}</span>
                                  <span className="text-[10px] font-medium text-slate-500">Color</span>
                                  <span className="text-xs font-semibold text-slate-800">{item.colorShade || "-"}</span>
                                </div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <span className="text-xs font-bold text-[#0453B8] uppercase tracking-wide mt-0.5">{item.material}</span>
                    </div>
                  </TableCell>
                  {type === "Trims" && (
                    <TableCell className="text-center py-3">
                      <span className="font-mono font-semibold text-slate-700 text-xs tracking-wide bg-slate-50 px-2 py-1 rounded border border-slate-200">
                        {item.code || '-'}
                      </span>
                    </TableCell>
                  )}
                  {type !== "Trims" && (
                    <>
                      <TableCell className="text-center py-3">
                        {isReadOnly || !onGsmChange ? (
                          <span className="font-semibold text-slate-700">{item.gsm || item.gsmContent || '-'}</span>
                        ) : (
                          <input 
                            type="text"
                            value={item.gsmContent || item.gsm || ""}
                            onChange={(e) => onGsmChange(item.id, e.target.value)}
                            className="w-[120px] px-2 py-1 text-left border border-slate-200 rounded-md text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0453B8] focus:border-transparent transition-all"
                            placeholder="GSM"
                          />
                        )}
                      </TableCell>
                      <TableCell className="text-center py-3">
                        {isReadOnly || !onWidthChange ? (
                          <span className="font-semibold text-slate-700">{item.width || '-'}</span>
                        ) : (
                          <input 
                            type="text"
                            value={item.width || ""}
                            onChange={(e) => onWidthChange(item.id, e.target.value)}
                            className="w-[70px] px-2 py-1 text-center border border-slate-200 rounded-md text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0453B8] focus:border-transparent transition-all"
                            placeholder='44"'
                          />
                        )}
                      </TableCell>
                    </>
                  )}
                  <TableCell className="text-center py-3">
                    {isReadOnly || !onColorChange ? (
                      <div className="flex items-center justify-center gap-2">
                        {item.colorShade && item.colorShade !== '-' && (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: item.colorShade.toLowerCase() === 'navy' ? '#000080' : item.colorShade.toLowerCase() === 'white' ? '#ffffff' : item.colorShade.toLowerCase() === 'black' ? '#000000' : item.colorShade.toLowerCase() === 'red' ? '#ef4444' : item.colorShade.toLowerCase() === 'grey' ? '#555555' : item.colorShade.toLowerCase() === 'natural' ? '#f5f5dc' : '#cccccc' }} />
                        )}
                        <span className="font-semibold text-slate-700">{item.colorShade || '-'}</span>
                      </div>
                    ) : (
                      <Select 
                        value={item.colorShade || ""}
                        onValueChange={(val) => onColorChange(item.id, val)}
                      >
                        <SelectTrigger className="w-[100px] h-8 text-xs font-semibold focus:ring-2 focus:ring-[#0453B8] focus:ring-offset-0">
                          <div className="flex items-center gap-2">
                            {item.colorShade && (
                              <div className="w-2.5 h-2.5 rounded-full border border-slate-300 shadow-sm shrink-0" style={{ backgroundColor: item.colorShade.toLowerCase() === 'navy' ? '#000080' : item.colorShade.toLowerCase() === 'white' ? '#ffffff' : item.colorShade.toLowerCase() === 'black' ? '#000000' : item.colorShade.toLowerCase() === 'red' ? '#ef4444' : item.colorShade.toLowerCase() === 'grey' ? '#555555' : item.colorShade.toLowerCase() === 'natural' ? '#f5f5dc' : '#cccccc' }} />
                            )}
                            <SelectValue placeholder="Color" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="z-[60]">
                          <SelectItem value="White">White</SelectItem>
                          <SelectItem value="Black">Black</SelectItem>
                          <SelectItem value="Navy">Navy</SelectItem>
                          <SelectItem value="Red">Red</SelectItem>
                          <SelectItem value="Grey">Grey</SelectItem>
                          <SelectItem value="Natural">Natural</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell className="text-center py-3">
                    {isReadOnly ? (
                      <span className="font-semibold text-slate-700">{item.deliveryDate || '—'}</span>
                    ) : (
                      <input 
                        type="date"
                        value={item.deliveryDate || ""}
                        onChange={(e) => onDateChange && onDateChange(item.id, e.target.value)}
                        className="w-[125px] px-2 py-1 border border-slate-200 rounded-md text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0453B8] focus:border-transparent transition-all"
                      />
                    )}
                  </TableCell>
                  <TableCell className="text-center font-medium text-slate-600 py-3">
                    {item.requiredQty ? `${item.requiredQty.toLocaleString('en-IN')} ${item.uom || 'mtr'}` : '-'}
                  </TableCell>
                  <TableCell className="text-center py-3">
                    {isReadOnly ? (
                      <span className="font-bold text-[#0453B8]">{item.qty} {item.uom || 'mtr'}</span>
                    ) : (
                      <div className="flex items-center justify-center gap-0.5 mx-auto w-fit border border-[#cbe1fc] bg-[#f0f6ff] rounded-md px-1.5 focus-within:ring-2 focus-within:ring-[#0453B8] focus-within:border-transparent transition-all">
                        <input
                          type="number"
                          value={item.qty === 0 ? "" : item.qty}
                          onChange={(e) => onQtyChange && onQtyChange(item.id, Number(e.target.value))}
                          placeholder="0"
                          className="w-10 h-[26px] bg-transparent text-sm font-bold text-[#0453B8] text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-xs font-bold text-[#0453B8] opacity-70 select-none">{item.uom || 'mtr'}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center font-medium text-slate-900 py-3">
                    {isReadOnly ? (
                      <span>{(item.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    ) : (
                      <div className="flex items-center justify-center gap-0.5 mx-auto w-fit border border-slate-200 bg-white rounded-md px-1.5 focus-within:ring-2 focus-within:ring-[#0453B8] focus-within:border-transparent transition-all">
                        <span className="text-xs font-medium text-slate-500">₹</span>
                        <input
                          type="number"
                          value={item.rate || ""}
                          onChange={(e) => onRateChange && onRateChange(item.id, Number(e.target.value))}
                          placeholder="0.00"
                          className="w-12 h-[26px] bg-transparent text-sm font-medium text-slate-900 text-left focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center font-medium text-slate-900 py-3">
                    {item.gst || 0}%
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-900 py-3">
                    {(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </TableCell>
                  {!isReadOnly && (
                    <TableCell className="text-center py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); onDeleteClick(item.id); }} type="button" className="p-1.5 text-red-500 hover:bg-red-50 rounded border border-red-200 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
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
