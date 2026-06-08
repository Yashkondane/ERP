"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MasterPattern } from "@/data/mock-masters";

interface PatternDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: MasterPattern | null;
  onSave: (pattern: MasterPattern) => void;
}

export function PatternDialog({ open, onOpenChange, initialData, onSave }: PatternDialogProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MasterPattern>({
    defaultValues: {
      code: "",
      brand: "",
      fit: "",
    }
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({ code: "", brand: "", fit: "" });
      }
    }
  }, [open, initialData, reset]);

  const onSubmit = (data: MasterPattern) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800">
              {initialData ? "Edit Pattern" : "Add New Pattern"}
            </DialogTitle>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="code" className="text-sm font-semibold text-slate-700">
              Pattern Code <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="code" 
              placeholder="e.g. PAT001" 
              className="h-10 border-slate-200 focus-visible:ring-[#0453B8] shadow-sm rounded-lg"
              disabled={!!initialData} // disable editing code if editing existing
              {...register("code", { required: "Pattern Code is required" })} 
            />
            {errors.code && <span className="text-xs text-red-500">{errors.code.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="brand" className="text-sm font-semibold text-slate-700">
              Brand Name <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="brand" 
              placeholder="e.g. Allen Solly" 
              className="h-10 border-slate-200 focus-visible:ring-[#0453B8] shadow-sm rounded-lg"
              {...register("brand", { required: "Brand Name is required" })} 
            />
            {errors.brand && <span className="text-xs text-red-500">{errors.brand.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="fit" className="text-sm font-semibold text-slate-700">
              Description (Fit) <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="fit" 
              placeholder="e.g. Slim Fit" 
              className="h-10 border-slate-200 focus-visible:ring-[#0453B8] shadow-sm rounded-lg"
              {...register("fit", { required: "Description is required" })} 
            />
            {errors.fit && <span className="text-xs text-red-500">{errors.fit.message}</span>}
          </div>

          <DialogFooter className="mt-4 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-10 px-4 font-semibold text-slate-600 rounded-lg">
              Cancel
            </Button>
            <Button type="submit" className="h-10 px-6 bg-[#0453B8] hover:bg-[#0453B8]/90 text-white font-semibold rounded-lg shadow-sm">
              Save Pattern
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
