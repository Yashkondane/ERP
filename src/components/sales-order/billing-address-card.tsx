import { useFormContext } from "react-hook-form";
import { SalesOrder } from "@/types/sales-order";
import { MOCK_BUYERS } from "@/data/mock-sales-order";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function BillingAddressCard() {
  const { watch } = useFormContext<SalesOrder>();
  const buyerId = watch("buyerId");
  const selectedBuyer = MOCK_BUYERS.find(b => b.id === buyerId);

  if (!selectedBuyer || !selectedBuyer.billingAddress) return null;
  const address = selectedBuyer.billingAddress;

  return (
    <div className="border border-slate-200 rounded-lg p-5 flex-1 flex flex-col bg-white w-full h-full text-left">
      <div className="flex items-center justify-between mb-4 h-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-[#0453B8]" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1">
            Billing Address <span className="text-red-500">*</span>
            {address.isDefault && (
              <Badge variant="secondary" className="ml-2 bg-green-50 text-green-700 hover:bg-green-100 border-none h-5 px-2 text-[10px] font-bold uppercase tracking-wider">Default</Badge>
            )}
          </h3>
        </div>
      </div>
      <div className="text-sm text-slate-600 space-y-1 pl-11 flex-1">
        <p className="font-medium text-slate-900">{address.companyName}</p>
        <p>{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ""}</p>
        <p>{address.city}, {address.state} - {address.pincode}, {address.country}</p>
        {address.gstin && <p className="text-slate-500 mt-2">GSTIN: {address.gstin}</p>}
      </div>
    </div>
  );
}
