"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MasterBuyer } from "@/data/mock-masters";
import { ImagePlus } from "lucide-react";

interface BuyerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: MasterBuyer | null;
  onSave: (data: MasterBuyer) => void;
}

export function BuyerDialog({ open, onOpenChange, initialData, onSave }: BuyerDialogProps) {
  const [formData, setFormData] = useState<Partial<MasterBuyer>>({});

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          companyName: "",
          gstNumber: "",
          accountDeptNo: "",
          warehouseDeptNo: "",
          transport: "",
          creditTerms: "",
          defaultAgent: "",
          defaultBrand: "",
          billingAddress: "",
          shippingAddress: "",
          logo: "",
          notes: ""
        });
      }
    }
  }, [open, initialData]);

  const handleChange = (field: keyof MasterBuyer, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.companyName || !formData.gstNumber) {
      alert("Company Name and GST Number are required.");
      return;
    }
    onSave(formData as MasterBuyer);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] bg-slate-50 p-0 overflow-hidden flex flex-col shadow-2xl border-0 rounded-xl">
        <DialogHeader className="px-6 py-4 border-b border-slate-200 bg-white shadow-sm z-10 flex-shrink-0">
          <DialogTitle className="text-lg font-bold text-slate-900">
            {initialData ? "Edit Buyer" : "Add New Buyer"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar relative">
          <div className="flex flex-col gap-5 mb-4">
            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Company Name <span className="text-red-500">*</span></Label>
                <Input 
                  value={formData.companyName || ""} 
                  onChange={(e) => handleChange("companyName", e.target.value)} 
                  className="h-10 text-sm font-medium border-slate-200 focus-visible:ring-[#0453B8] text-slate-900 bg-white" 
                  placeholder="Enter full company name"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">GST Number <span className="text-red-500">*</span></Label>
                <Input 
                  value={formData.gstNumber || ""} 
                  onChange={(e) => handleChange("gstNumber", e.target.value)} 
                  className="h-10 text-sm font-medium border-slate-200 focus-visible:ring-[#0453B8] text-slate-900 bg-white" 
                  placeholder="e.g. 22AAAAA0000A1Z5"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-600">Buyer Logo</Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center bg-white cursor-pointer hover:bg-slate-50 transition-colors h-28">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0453B8] flex items-center justify-center mb-2">
                  <ImagePlus className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-[#0453B8]">Click to upload logo</span>
                <span className="text-[11px] text-slate-500 mt-1">PNG, JPG or SVG up to 2MB</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Account Dept Number</Label>
                <Input 
                  value={formData.accountDeptNo || ""} 
                  onChange={(e) => handleChange("accountDeptNo", e.target.value)} 
                  className="h-10 text-sm font-medium border-slate-200 focus-visible:ring-[#0453B8] text-slate-900 bg-white" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Warehouse Dept Number</Label>
                <Input 
                  value={formData.warehouseDeptNo || ""} 
                  onChange={(e) => handleChange("warehouseDeptNo", e.target.value)} 
                  className="h-10 text-sm font-medium border-slate-200 focus-visible:ring-[#0453B8] text-slate-900 bg-white" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Transport</Label>
                <Input 
                  value={formData.transport || ""} 
                  onChange={(e) => handleChange("transport", e.target.value)} 
                  className="h-10 text-sm font-medium border-slate-200 focus-visible:ring-[#0453B8] text-slate-900 bg-white" 
                  placeholder="Preferred transport service"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Credit Terms</Label>
                <Input 
                  value={formData.creditTerms || ""} 
                  onChange={(e) => handleChange("creditTerms", e.target.value)} 
                  className="h-10 text-sm font-medium border-slate-200 focus-visible:ring-[#0453B8] text-slate-900 bg-white" 
                  placeholder="e.g. 30 Days, 60 Days"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Agent by Default</Label>
                <Input 
                  value={formData.defaultAgent || ""} 
                  onChange={(e) => handleChange("defaultAgent", e.target.value)} 
                  className="h-10 text-sm font-medium border-slate-200 focus-visible:ring-[#0453B8] text-slate-900 bg-white" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Default Brand</Label>
                <Input 
                  value={formData.defaultBrand || ""} 
                  onChange={(e) => handleChange("defaultBrand", e.target.value)} 
                  className="h-10 text-sm font-medium border-slate-200 focus-visible:ring-[#0453B8] text-slate-900 bg-white" 
                  placeholder="e.g. Zara"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Billing Address</Label>
                <Textarea 
                  value={formData.billingAddress || ""} 
                  onChange={(e) => handleChange("billingAddress", e.target.value)} 
                  className="min-h-[100px] text-sm font-medium border-slate-200 focus-visible:ring-[#0453B8] text-slate-900 bg-white resize-none" 
                  placeholder="Street, City, State PIN"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600">Shipping Address</Label>
                <Textarea 
                  value={formData.shippingAddress || ""} 
                  onChange={(e) => handleChange("shippingAddress", e.target.value)} 
                  className="min-h-[100px] text-sm font-medium border-slate-200 focus-visible:ring-[#0453B8] text-slate-900 bg-white resize-none" 
                  placeholder="Street, City, State PIN"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-600">Notes</Label>
              <Textarea 
                value={formData.notes || ""} 
                onChange={(e) => handleChange("notes", e.target.value)} 
                className="min-h-[80px] text-sm font-medium border-slate-200 focus-visible:ring-[#0453B8] text-slate-900 bg-white resize-none" 
                placeholder="Additional notes"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t border-slate-200 bg-white px-6 py-5 sm:justify-end gap-3 rounded-b-xl z-10">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="min-w-[110px] h-10 px-5 font-semibold text-sm rounded-lg border-slate-300 text-slate-700">
            Cancel
          </Button>
          <Button onClick={handleSave} className="min-w-[150px] h-10 px-5 font-semibold text-sm rounded-lg shadow-md bg-[#0453B8] hover:bg-blue-700 text-white">
            {initialData ? "Update Buyer" : "Save Buyer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
