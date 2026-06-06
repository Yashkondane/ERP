import { useFormContext } from "react-hook-form";
import { SalesOrder } from "@/types/sales-order";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_BUYERS } from "@/data/mock-sales-order";

export function BuyerOrderDetailsCard() {
  const { register, watch, setValue, getValues } = useFormContext<SalesOrder>();
  const buyerId = watch("buyerId");

  const selectedBuyer = MOCK_BUYERS.find(b => b.id === buyerId);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</div>
          <h2 className="text-base font-semibold text-slate-800">Buyer & Order Details</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="flex flex-col gap-2 md:col-span-1">
          <Label htmlFor="buyerId" className="text-xs text-slate-500 font-medium">Buyer <span className="text-red-500">*</span></Label>
          <Select value={buyerId} onValueChange={(val) => setValue("buyerId", val)}>
            <SelectTrigger id="buyerId" className="h-[42px]">
              <SelectValue placeholder="Select Buyer" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_BUYERS.map(buyer => (
                <SelectItem key={buyer.id} value={buyer.id}>{buyer.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedBuyer && (
            <div className="flex items-center gap-4 mt-1 text-xs">
              <span className="text-green-600">Credit Limit: ₹ {(selectedBuyer.creditLimit / 100000).toFixed(2)} L</span>
              <span className="text-green-600">Balance: ₹ {(selectedBuyer.balance / 100000).toFixed(2)} L</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="buyerPoNo" className="text-xs text-slate-500 font-medium">Buyer PO No. <span className="text-red-500">*</span></Label>
          <Input id="buyerPoNo" {...register("buyerPoNo")} className="h-[42px]" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="poDate" className="text-xs text-slate-500 font-medium">PO Date <span className="text-red-500">*</span></Label>
          {/* Note: In a real app we would use a DatePicker. Using a text/date input for mock purposes */}
          <Input id="poDate" type="date" className="h-[42px] text-sm" value={watch("poDate") ? new Date(watch("poDate")).toISOString().split('T')[0] : ''} onChange={(e) => setValue("poDate", new Date(e.target.value))} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="deliveryDate" className="text-xs text-slate-500 font-medium">Delivery Date <span className="text-red-500">*</span></Label>
          <div className="flex items-center gap-2">
            <Select defaultValue="15" onValueChange={(val) => {
              const days = parseInt(val);
              const currentPoDate = getValues("poDate");
              if (currentPoDate) {
                const newDate = new Date(currentPoDate);
                newDate.setDate(newDate.getDate() + days);
                setValue("deliveryDate", newDate, { shouldValidate: true, shouldDirty: true });
              }
            }}>
              <SelectTrigger className="h-[42px] w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="45">45 Days</SelectItem>
              </SelectContent>
            </Select>
            <Input id="deliveryDate" type="date" className="h-[42px] text-sm flex-1" value={watch("deliveryDate") ? new Date(watch("deliveryDate")).toISOString().split('T')[0] : ''} onChange={(e) => setValue("deliveryDate", new Date(e.target.value))} />
          </div>
        </div>
      </div>
    </div>
  );
}
