import { useFormContext } from "react-hook-form";
import { SalesOrder } from "@/types/sales-order";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function OrderSummaryPanel() {
  const { watch, register, setValue } = useFormContext<SalesOrder>();
  const products = watch("products");
  const discountPercentage = watch("discountPercentage");
  const cgstRate = watch("cgstRate");
  const sgstRate = watch("sgstRate");

  const calculateProductQty = (p: any) => {
    return (p.sizeBreakdown.XS || 0) + (p.sizeBreakdown.S || 0) + (p.sizeBreakdown.M || 0) + 
           (p.sizeBreakdown.L || 0) + (p.sizeBreakdown.XL || 0) + (p.sizeBreakdown.XXL || 0) + 
           (p.sizeBreakdown["3XL"] || 0) + (p.sizeBreakdown["4XL"] || 0) + 
           (p.sizeBreakdown["5XL"] || 0) + (p.sizeBreakdown["6XL"] || 0);
  };

  const totalQty = products.reduce((acc, p) => acc + calculateProductQty(p), 0);

  const subTotal = products.reduce((acc, p) => {
    return acc + (calculateProductQty(p) * p.rate);
  }, 0);

  const discountAmount = (subTotal * (discountPercentage || 0)) / 100;
  const taxableAmount = subTotal - discountAmount;
  const cgstAmount = (taxableAmount * (cgstRate || 0)) / 100;
  const sgstAmount = (taxableAmount * (sgstRate || 0)) / 100;
  const grandTotal = taxableAmount + cgstAmount + sgstAmount;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col gap-4">
      <h3 className="font-semibold text-slate-800 text-base mb-2">Order Summary</h3>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Total Qty</span>
        <span className="font-semibold text-slate-800">{totalQty}</span>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Sub Total</span>
        <span className="font-semibold text-slate-800">₹ {formatCurrency(subTotal)}</span>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span>Discount</span>
          <div className="flex items-center">
            <Select defaultValue="%">
              <SelectTrigger className="h-8 w-[60px] rounded-r-none border-r-0 text-xs px-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="%">%</SelectItem>
                <SelectItem value="₹">₹</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              className="h-8 w-[60px] rounded-l-none text-xs px-2"
              {...register("discountPercentage", { valueAsNumber: true })}
            />
          </div>
        </div>
        <span className="font-semibold text-red-500">- ₹ {formatCurrency(discountAmount)}</span>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600 pt-2 border-t border-slate-100">
        <span>Taxable Amount</span>
        <span className="font-semibold text-slate-800">₹ {formatCurrency(taxableAmount)}</span>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>CGST ({cgstRate || 0}%)</span>
        <span className="font-semibold text-slate-800">₹ {formatCurrency(cgstAmount)}</span>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>SGST ({sgstRate || 0}%)</span>
        <span className="font-semibold text-slate-800">₹ {formatCurrency(sgstAmount)}</span>
      </div>

      <div className="flex items-center justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-200 mt-1">
        <span>Grand Total</span>
        <span className="text-blue-700">₹ {formatCurrency(grandTotal)}</span>
      </div>

      {discountAmount > 0 && (
        <div className="mt-2 bg-green-50 text-green-700 text-xs font-medium px-3 py-2 rounded flex items-center gap-2 border border-green-100">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
          You Save ₹ {formatCurrency(discountAmount)} on this order
        </div>
      )}
    </div>
  );
}
