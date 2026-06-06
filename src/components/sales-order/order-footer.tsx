import { useFormContext } from "react-hook-form";
import { SalesOrder } from "@/types/sales-order";
import { Button } from "@/components/ui/button";
import { Save, FileCheck, Send, CheckCircle, Plus } from "lucide-react";

export function OrderFooter() {
  const { watch, handleSubmit } = useFormContext<SalesOrder>();
  const products = watch("products");
  const discountPercentage = watch("discountPercentage");
  const cgstRate = watch("cgstRate");
  const sgstRate = watch("sgstRate");

  const subTotal = products.reduce((acc, p) => {
    const qty = (p.sizeBreakdown.S || 0) + (p.sizeBreakdown.M || 0) + (p.sizeBreakdown.L || 0) + (p.sizeBreakdown.XL || 0) + (p.sizeBreakdown.XXL || 0);
    return acc + (qty * p.rate);
  }, 0);

  const discountAmount = (subTotal * (discountPercentage || 0)) / 100;
  const taxableAmount = subTotal - discountAmount;
  const cgstAmount = (taxableAmount * (cgstRate || 0)) / 100;
  const sgstAmount = (taxableAmount * (sgstRate || 0)) / 100;
  const totalGst = cgstAmount + sgstAmount;
  const grandTotal = taxableAmount + totalGst;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const onSubmit = (data: SalesOrder) => {
    console.log("Form Submitted:", data);
    alert("Order Confirmed Successfully!");
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
      <div className="flex flex-col md:flex-row items-center justify-between p-4 max-w-full mx-auto gap-4">

        {/* Totals Section */}
        <div className="flex items-center gap-6 md:gap-10 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">Sub Total</span>
            <span className="text-sm font-semibold text-slate-900">₹ {formatCurrency(subTotal)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">Discount</span>
            <span className="text-sm font-semibold text-slate-900">₹ {formatCurrency(discountAmount)}</span>
            <span className="text-[10px] text-slate-400">{discountPercentage}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">Taxable Amount</span>
            <span className="text-sm font-semibold text-slate-900">₹ {formatCurrency(taxableAmount)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">Total GST</span>
            <span className="text-sm font-semibold text-slate-900">₹ {formatCurrency(totalGst)}</span>
            <span className="text-[10px] text-slate-400">({(cgstRate || 0) + (sgstRate || 0)}%)</span>
          </div>
          <div className="flex flex-col pl-4 md:pl-6 border-l border-slate-200 min-w-max">
            <span className="text-xs text-slate-500 font-medium text-blue-700">Grand Total</span>
            <span className="text-xl font-bold text-blue-700">₹ {formatCurrency(grandTotal)}</span>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <Button variant="outline" className="text-slate-600 bg-white hover:bg-slate-50" onClick={() => console.log("Save Draft")}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button variant="outline" className="text-blue-600 border-blue-200 bg-blue-50/30 hover:bg-blue-50" onClick={() => console.log("Save & New")}>
            <Plus className="w-4 h-4 mr-2" />
            Save & New
          </Button>
          <Button variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50" onClick={() => console.log("Save & Send")}>
            <Send className="w-4 h-4 mr-2" />
            Save & Send
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20" onClick={handleSubmit(onSubmit)}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Confirm Order
          </Button>
        </div>
      </div>
    </div>
  );
}
