import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { POItem } from "@/types/purchase-order";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_TRIM_CATALOG } from "@/data/mock-sales-order";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (item: POItem) => void;
  editItem?: POItem | null;
  itemOptions: string[];
  itemLabel: string;
  specLabel?: string;
  initialValues?: Partial<POItem>;
  type?: "Fabric" | "Trims";
  trimItem?: string; // "Button" | "Label" | "Hangtag"
  soItemTotalPcs?: number; // total garment pcs from selected SO item
}

export function AddItemDialog({
  open,
  onOpenChange,
  onAddItem,
  editItem,
  itemOptions,
  itemLabel,
  specLabel = "GSM / Content",
  initialValues,
  type,
  trimItem: propTrimItem = "",
  soItemTotalPcs = 0,
}: AddItemDialogProps) {
  const trimItem = editItem && type === "Trims" ? editItem.material : propTrimItem;

  const [formData, setFormData] = useState({
    material: "",
    gsmContent: "",
    gsm: "",
    width: "",
    colorShade: "",
    requiredQty: "",
    qty: "",
    uom: "mtr",
    rate: "",
    gst: "5",
  });

  const [images, setImages] = useState<{ name: string; url: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Track which catalog variant is selected (by code)
  const [selectedVariantCode, setSelectedVariantCode] = useState<string>("");

  useEffect(() => {
    if (open && editItem) {
      setFormData({
        material: editItem.material || "",
        gsmContent: editItem.gsmContent || "",
        gsm: editItem.gsm || "",
        width: editItem.width || "",
        colorShade: editItem.colorShade || "",
        requiredQty: editItem.requiredQty?.toString() || editItem.qty?.toString() || "",
        qty: editItem.qty?.toString() || "",
        uom: editItem.uom || "mtr",
        rate: editItem.rate?.toString() || "",
        gst: editItem.gst?.toString() || "5",
      });
      setImages(editItem.images || []);
      // Pre-select the variant that matches the saved code
      if (editItem.code) setSelectedVariantCode(editItem.code);
      else if (editItem.material) {
        const firstVariant = MOCK_TRIM_CATALOG[editItem.material]?.[0];
        if (firstVariant) setSelectedVariantCode(firstVariant.code);
      }
    } else if (open) {
      setFormData({
        material: initialValues?.material || "",
        gsmContent: initialValues?.gsmContent || "",
        gsm: initialValues?.gsm || "",
        width: initialValues?.width || "",
        colorShade: initialValues?.colorShade || "",
        requiredQty: initialValues?.requiredQty?.toString() || initialValues?.qty?.toString() || "",
        qty: initialValues?.qty?.toString() || "",
        uom: initialValues?.uom || "mtr",
        rate: initialValues?.rate?.toString() || "",
        gst: initialValues?.gst?.toString() || "5", 
      });
      setImages(initialValues?.images || []);
      // Default to first variant of the selected trim type
      if (trimItem) {
        const firstVariant = MOCK_TRIM_CATALOG[trimItem]?.[0];
        if (firstVariant) setSelectedVariantCode(firstVariant.code);
      } else {
        setSelectedVariantCode("");
      }
    }
  }, [open, editItem, initialValues, trimItem]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map(file => ({
        name: file.name,
        url: URL.createObjectURL(file) 
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const qtyNum = parseFloat(formData.qty) || 0;
  const rateNum = parseFloat(formData.rate) || 0;

  const handleSubmit = () => {
    const gstNum = parseFloat(formData.gst) || 0;
    
    if (!formData.material || !formData.colorShade || qtyNum <= 0 || rateNum <= 0) {
      alert(`Please fill in all required fields (${itemLabel}, Color/Shade, valid QTY and RATE)`);
      return;
    }

    const trimVariants = type === "Trims" && trimItem ? MOCK_TRIM_CATALOG[trimItem] : undefined;
    const trimData = trimVariants?.find(v => v.code === selectedVariantCode) || trimVariants?.[0];

    const newItem: POItem = {
      id: editItem ? editItem.id : `item-${Date.now()}`,
      material: formData.material,
      code: trimData?.code,
      gsmContent: type === "Fabric" || itemLabel === "Material" ? `${formData.gsm} / ${formData.width}` : formData.gsmContent,
      gsm: formData.gsm,
      width: formData.width,
      colorShade: formData.colorShade,
      requiredQty: parseFloat(formData.requiredQty) || 0,
      qty: qtyNum,
      buffer: qtyNum - (parseFloat(formData.requiredQty) || 0),
      uom: formData.uom,
      rate: rateNum,
      gst: gstNum,
      amount: qtyNum * rateNum,
      images: images,
    };

    onAddItem(newItem);
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'SELECT') {
        e.preventDefault();
        const container = e.currentTarget;
        const inputs = Array.from(container.querySelectorAll('input:not([type="file"]), select, textarea, button')) as HTMLElement[];
        const index = inputs.indexOf(target);
        if (index > -1 && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[1000px] h-[90vh] sm:h-[750px] bg-slate-50 p-0 overflow-hidden flex flex-col shadow-2xl border-0">
        <DialogHeader className="px-6 py-4 border-b border-slate-200 flex flex-row items-center justify-between bg-white shadow-sm z-10 flex-shrink-0">
          <DialogTitle className="text-xl font-bold text-[#0F172A]">
            {editItem ? `Edit ${itemLabel}` : `Add ${itemLabel}`}
          </DialogTitle>
          <button onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar relative" onKeyDown={handleKeyDown}>
          <div className="flex flex-col gap-4">
            {type === "Fabric" || itemLabel === "Material" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">{itemLabel} <span className="text-red-500">*</span></Label>
                  <Select value={formData.material} onValueChange={(val) => handleInputChange("material", val)}>
                    <SelectTrigger className="w-full bg-white h-12 border-slate-200 focus:ring-[#0453B8]">
                      <SelectValue placeholder={`Select ${itemLabel}`} className="w-full truncate" />
                    </SelectTrigger>
                    <SelectContent>
                      {itemOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">GSM</Label>
                  <Input 
                    value={formData.gsm}
                    onChange={(e) => handleInputChange("gsm", e.target.value)}
                    placeholder="e.g. 180" 
                    className="w-full bg-white h-12"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Color / Shade <span className="text-red-500">*</span></Label>
                  <Select value={formData.colorShade} onValueChange={(val) => handleInputChange("colorShade", val)}>
                    <SelectTrigger className="w-full bg-white h-12 border-slate-200 focus:ring-[#0453B8]">
                      <SelectValue placeholder="Select Color" className="w-full truncate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="White">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: 'white' }} />
                          <span>White</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Black">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: 'black' }} />
                          <span>Black</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Navy">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: '#000080' }} />
                          <span>Navy</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Red">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: '#ef4444' }} />
                          <span>Red</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Grey">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: '#555555' }} />
                          <span>Grey</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Natural">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: '#f5f5dc' }} />
                          <span>Natural</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600">Width</Label>
                  <Input 
                    value={formData.width}
                    onChange={(e) => handleInputChange("width", e.target.value)}
                    placeholder='e.g. 44"' 
                    className="w-full bg-white h-12"
                  />
                </div>
              </div>
            ) : (
              (() => {
                const trimVariants = MOCK_TRIM_CATALOG[trimItem] || [];
                const trimData = trimVariants.find(v => v.code === selectedVariantCode) || trimVariants[0];
                // Per-garment counts from product catalog (system values)
                const PER_GARMENT: Record<string, number> = {
                  "Button": 7,
                  "Label": 1,
                  "Hangtag": 1,
                };
                const perGarment = PER_GARMENT[trimItem] ?? 1;
                // Calculate garments based on requiredQty instead of assuming 0 when no SO is selected
                const computedGarments = Math.round((parseFloat(formData.requiredQty) || 0) / perGarment);
                const autoQty = computedGarments * perGarment;

                if (!trimItem) {
                  return (
                    <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-xl p-10 text-center shadow-inner">
                      <ImageIcon className="w-12 h-12 text-slate-300 mb-3" />
                      <h3 className="text-sm font-bold text-slate-700">No Trim Item Selected</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                        Please go back and select a Trim Item (e.g., Button, Label, Hangtag) from the dropdown on the PO Form first.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="flex flex-col gap-5">
                    {/* Trim Image + Info */}
                    <div className="flex gap-5 items-start bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                      <div className="w-36 h-36 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0 shadow-sm">
                        {trimData?.image ? (
                          <img src={trimData.image} alt={trimItem} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-10 h-10 text-slate-300" />
                        )}
                      </div>
                      <div className="flex flex-col gap-3 flex-1">
                        <div>
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Trim Type</span>
                          <p className="text-xl font-bold text-slate-900 mt-0.5">{trimItem || "—"}</p>
                          {trimData?.description && <p className="text-xs text-slate-500 mt-0.5">{trimData.description}</p>}
                          {/* Variant Picker — all variants from system */}
                          <div className="mt-3">
                            <div className="flex items-center gap-1.5 mb-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Select Variant</span>
                              <span className="text-[10px] bg-slate-200 text-slate-500 rounded px-1.5 py-0.5 font-bold">From System</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {trimVariants.map((variant) => {
                                const isSelected = (selectedVariantCode || trimVariants[0]?.code) === variant.code;
                                return (
                                  <button
                                    key={variant.code}
                                    type="button"
                                    onClick={() => setSelectedVariantCode(variant.code)}
                                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer
                                      ${isSelected
                                        ? "bg-[#0453B8] border-[#0453B8] text-white shadow-md ring-2 ring-blue-300"
                                        : "bg-white border-slate-200 text-slate-700 hover:border-[#0453B8] hover:bg-blue-50"
                                      }`}
                                  >
                                    <div
                                      className="w-3 h-3 rounded-full border border-white/40 shrink-0"
                                      style={{ backgroundColor: variant.color.split(' / ')[0].toLowerCase() }}
                                    />
                                    <span className="font-mono">{variant.code}</span>
                                    <span className={isSelected ? "text-blue-100" : "text-slate-400"}>·</span>
                                    <span>{variant.color}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Garments (Pcs)</span>
                            <p className="text-lg font-bold text-slate-800 mt-0.5">{computedGarments.toLocaleString('en-IN')}</p>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-xs font-semibold text-[#0453B8] uppercase tracking-wide">
                                × {perGarment} per garment
                              </span>
                              <span className="text-[10px] bg-[#0453B8] text-white rounded px-1 py-0.5 font-bold leading-none">From System</span>
                            </div>
                            <p className="text-lg font-bold text-[#0453B8]">{autoQty.toLocaleString('en-IN')} pcs</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-100">
                          <span className="text-sm font-semibold">System Qty: {autoQty.toLocaleString('en-IN')} pcs</span>
                          <span className="text-xs text-emerald-600">({computedGarments} garments × {perGarment} {trimItem?.toLowerCase()}s/garment)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
            
            {/* Form fields below */}
            {(!type || type === "Fabric" || (type === "Trims" && trimItem)) && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600 whitespace-nowrap text-ellipsis overflow-hidden">Quantity Required</Label>
                    <Input 
                      readOnly 
                      value={formData.requiredQty || "0"} 
                      className="bg-slate-50 text-slate-700 font-semibold h-10 border-slate-200 cursor-default focus-visible:ring-0" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600">Your Order <span className="text-red-500">*</span></Label>
                    <div className="flex gap-2">
                      <Input 
                        type="number"
                        value={formData.qty}
                        onChange={(e) => handleInputChange("qty", e.target.value)}
                        placeholder="0.00" 
                        className="bg-white flex-1 h-10"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-slate-600">Buffer</Label>
                    <div className="flex gap-2">
                      <Input 
                        readOnly 
                        value={((parseFloat(formData.qty) || 0) - (parseFloat(formData.requiredQty) || 0)).toFixed(2)} 
                        className="bg-slate-50 text-slate-700 font-semibold h-10 border-slate-200 cursor-default focus-visible:ring-0" 
                      />
                      <div className="w-12 h-10 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center text-sm font-medium text-slate-600 flex-shrink-0">
                        {formData.uom}
                      </div>
                    </div>
                  </div>
                </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Rate (₹) <span className="text-red-500">*</span></Label>
                <Input 
                  type="number"
                  value={formData.rate}
                  onChange={(e) => handleInputChange("rate", e.target.value)}
                  placeholder="0.00" 
                  className="bg-white h-10"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">GST %</Label>
                <Input 
                  type="number"
                  value={formData.gst}
                  onChange={(e) => handleInputChange("gst", e.target.value)}
                  className="bg-white h-10"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Amount</Label>
                <Input 
                  readOnly 
                  value={`₹ ${(qtyNum * rateNum).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                  className="bg-slate-50 text-slate-700 font-bold h-10 border-slate-200 cursor-default focus-visible:ring-0" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Total (With GST)</Label>
                <Input 
                  readOnly 
                  value={`₹ ${((qtyNum * rateNum) * (1 + (parseFloat(formData.gst) || 0) / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                  className="bg-slate-50 text-[#0453B8] font-bold h-10 border-slate-200 cursor-default focus-visible:ring-0" 
                />
              </div>
            </div>
            </>
            )}
          </div>

          {type !== "Trims" && (
          <div className="bg-white p-3 rounded-lg border border-slate-200 mt-4">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-xs font-bold text-slate-600 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-slate-400" />
                Images / Swatches
              </Label>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs font-medium bg-slate-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                Upload Image
              </Button>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </div>
            
            <div className="min-h-[100px] border-2 border-dashed border-slate-200 rounded-md flex items-center justify-center p-4 bg-slate-50/50">
              {images.length > 0 ? (
                <div className="flex flex-wrap gap-4 w-full">
                  {images.map((img, index) => (
                    <div key={index} className="relative group rounded-md overflow-hidden border border-slate-200 bg-white">
                      <img src={img.url} alt={`Upload ${index + 1}`} className="h-20 w-20 object-cover" />
                      <button 
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center flex flex-col items-center text-slate-400">
                  <ImageIcon className="h-6 w-6 mb-2 opacity-50" />
                  <p className="text-xs font-medium">No images uploaded</p>
                </div>
              )}
            </div>
          </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t border-slate-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 flex-shrink-0 flex items-center justify-end gap-3 sm:space-x-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-10 px-5 font-medium border-slate-200 text-slate-600">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="h-10 px-6 font-medium bg-[#0453B8] hover:bg-[#034294] text-white">
            {editItem ? "Save Changes" : "Add to Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
