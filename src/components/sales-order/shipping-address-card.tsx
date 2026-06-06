import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { SalesOrder } from "@/types/sales-order";
import { MOCK_BUYERS } from "@/data/mock-sales-order";
import { Truck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ShippingAddressCard() {
  const { watch } = useFormContext<SalesOrder>();
  const buyerId = watch("buyerId");
  const selectedBuyer = MOCK_BUYERS.find(b => b.id === buyerId);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedBuyer?.shippingAddresses?.length) {
      setSelectedAddressId(selectedBuyer.shippingAddresses[0].id || "0");
    } else {
      setSelectedAddressId(null);
    }
  }, [buyerId, selectedBuyer]);

  if (!selectedBuyer) return null;

  let address = selectedBuyer.shippingAddress || selectedBuyer.billingAddress;
  if (selectedBuyer.shippingAddresses?.length && selectedAddressId) {
    const found = selectedBuyer.shippingAddresses.find((a, i) => (a.id || String(i)) === selectedAddressId);
    if (found) address = found;
  }

  return (
    <div className="border border-slate-200 rounded-lg p-5 flex-1 flex flex-col justify-center items-center text-center bg-white w-full">
      {!isAdded ? (
        <div className="w-full h-full flex flex-col">
          <div className="flex items-center gap-3 mb-auto">
            <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
              <Truck className="w-4 h-4 text-slate-500" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1">
              Shipping Address <span className="text-slate-400 font-normal">(Optional)</span>
            </h3>
          </div>
          <div className="flex-1 flex items-center justify-center py-6">
            <Button 
              variant="outline" 
              className="text-blue-600 border-slate-200 bg-white hover:bg-slate-50 font-medium"
              onClick={(e) => { e.preventDefault(); setIsAdded(true); }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Shipping Address
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col text-left">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4 text-slate-500" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                Shipping Address <span className="text-slate-400 font-normal">(Optional)</span>
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {selectedBuyer.shippingAddresses && selectedBuyer.shippingAddresses.length > 1 && (
                <Select value={selectedAddressId || ""} onValueChange={setSelectedAddressId}>
                  <SelectTrigger className="h-8 text-xs bg-white w-[140px]">
                    <SelectValue placeholder="Select address" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedBuyer.shippingAddresses.map((addr, i) => (
                      <SelectItem key={addr.id || i} value={addr.id || String(i)}>
                        {addr.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2 text-xs shrink-0"
                onClick={(e) => { e.preventDefault(); setIsAdded(false); }}
              >
                Remove
              </Button>
            </div>
          </div>
          <div className="text-sm text-slate-600 space-y-1 pl-11">
            <p className="font-medium text-slate-900">{address.companyName}</p>
            <p>{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ""}</p>
            <p>{address.city}, {address.state} - {address.pincode}, {address.country}</p>
            {address.gstin && <p className="text-slate-500 mt-2">GSTIN: {address.gstin}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
