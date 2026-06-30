import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SalesOrderSchema, SalesOrder } from "@/types/sales-order";
import { EMPTY_SALES_ORDER, MOCK_SALES_ORDERS_LIST, MOCK_BUYERS } from "@/data/mock-sales-order";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

import { OrderHeader } from "@/components/sales-order/order-header";
import { BuyerOrderDetailsCard } from "@/components/sales-order/buyer-order-details-card";
import { BillingAddressCard } from "@/components/sales-order/billing-address-card";
import { ShippingAddressCard } from "@/components/sales-order/shipping-address-card";
import { ProductsTable } from "@/components/sales-order/products-table";
import { NotesPanel } from "@/components/sales-order/notes-panel";
import { OrderSummaryPanel } from "@/components/sales-order/order-summary-panel";
import { AttachmentsModal } from "@/components/sales-order/attachments-modal";
import { useEffect, useState } from "react";

export interface SalesOrderFormProps {
  initialValues?: Partial<SalesOrder>;
  isReadOnly?: boolean;
  isEditMode?: boolean;
  hideEditDetails?: boolean;
}

export function SalesOrderForm({ initialValues, isReadOnly = false, isEditMode = false, hideEditDetails = false }: SalesOrderFormProps) {
  const methods = useForm<SalesOrder>({
    resolver: zodResolver(SalesOrderSchema),
    defaultValues: initialValues || EMPTY_SALES_ORDER,
  });

  const [isTopSectionEditable, setIsTopSectionEditable] = useState(false);
  const topSectionReadOnly = isReadOnly && !isTopSectionEditable;

  const products = methods.watch("products");
  const [showAddress, setShowAddress] = useState(true);

  useEffect(() => {
    if (products && products.length > 0) {
      setShowAddress(false);
    } else {
      setShowAddress(true);
    }
  }, [products?.length]);

  // Reset form when initialValues change
  useEffect(() => {
    if (initialValues) {
      methods.reset(initialValues);
    }
  }, [initialValues, methods]);

  const router = useRouter();

  const onSubmit = (data: SalesOrder) => {
    if (!isEditMode && !initialValues) {
      const buyerData = MOCK_BUYERS.find(b => b.id === data.buyerId);
      const buyer = buyerData?.name || "Unknown Buyer";
      const location = buyerData?.billingAddress ? `${buyerData.billingAddress.city}, ${buyerData.billingAddress.state}` : "Unknown Location";

      const amount = data.products.reduce((acc, p) => {
        const qty = (p.sizeBreakdown.XS || 0) + (p.sizeBreakdown.S || 0) + (p.sizeBreakdown.M || 0) + 
                    (p.sizeBreakdown.L || 0) + (p.sizeBreakdown.XL || 0) + (p.sizeBreakdown.XXL || 0) + 
                    (p.sizeBreakdown["3XL"] || 0) + (p.sizeBreakdown["4XL"] || 0) + 
                    (p.sizeBreakdown["5XL"] || 0) + (p.sizeBreakdown["6XL"] || 0);
        return acc + (qty * p.rate);
      }, 0);
      
      const taxAmount = amount - (amount * (data.discountPercentage || 0) / 100);
      const grandTotal = taxAmount + (taxAmount * (data.cgstRate || 0) / 100) + (taxAmount * (data.sgstRate || 0) / 100);

      MOCK_SALES_ORDERS_LIST.unshift({
        id: String(Date.now()),
        soNo: data.salesOrderNo,
        orderDate: data.orderDate ? new Date(data.orderDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        buyer,
        location,
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate).toISOString().split('T')[0] : "TBD",
        status: (data.status === "Sent" ? "Confirmed" : data.status) as any,
        amount: grandTotal,
      });
    }

    router.push("/sales-orders");
  };

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col h-full overflow-hidden bg-slate-50/50" onSubmit={methods.handleSubmit(onSubmit)}>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto px-5 py-5 pb-4 hide-scrollbar">
          <OrderHeader
            salesOrderNo={methods.getValues("salesOrderNo")}
            orderDate={methods.getValues("orderDate")}
            status={methods.getValues("status")}
            isReadOnly={isReadOnly}
          />

          <div className="flex flex-col xl:flex-row gap-5">

            {/* Left Column (Main Content) */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <BuyerOrderDetailsCard 
                  isReadOnly={topSectionReadOnly} 
                  isEditMode={isEditMode || isTopSectionEditable}
                  isSectionLocked={isReadOnly && !isTopSectionEditable}
                  onToggleEdit={isReadOnly && !hideEditDetails ? () => setIsTopSectionEditable(!isTopSectionEditable) : undefined}
                />

                <div className="flex items-center justify-between mt-4">
                  <h3 className="text-sm font-bold text-slate-800">Address Details</h3>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAddress(!showAddress)}
                    className="text-[#0453B8] font-bold h-8 text-xs hover:bg-blue-50"
                  >
                    {showAddress ? "Hide Addresses" : "Unhide Addresses"}
                  </Button>
                </div>
                
                {showAddress && (
                  <div className="flex flex-col md:flex-row gap-5 mt-2 items-stretch animate-in fade-in duration-300">
                    <BillingAddressCard isReadOnly={topSectionReadOnly} />
                    <ShippingAddressCard isReadOnly={topSectionReadOnly} />
                  </div>
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <ProductsTable isReadOnly={isReadOnly} hideEditDetails={hideEditDetails} />
              </div>
            </div>

            {/* Right Column (Information Rail) */}
            <div className="w-full xl:w-[320px] flex flex-col gap-5 flex-shrink-0">
              {/* SO Number/Date Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col bg-white border border-blue-200/60 rounded-xl p-3 shadow-sm text-center justify-center h-full min-h-[105px]">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">SO NUMBER</span>
                  {(() => {
                    const soNo = methods.getValues("salesOrderNo") || "";
                    const parts = soNo.split("-");
                    if (parts.length === 3) {
                      return (
                        <div className="flex flex-col items-center mt-1">
                          <span className="text-sm font-extrabold text-[#0453B8] uppercase tracking-widest opacity-90">{parts[0]} {parts[1]}</span>
                          <span className="text-4xl leading-none font-black text-[#0453B8] tracking-tight mt-1.5">{parts[2]}</span>
                        </div>
                      );
                    }
                    return (
                      <span className="text-base font-black text-[#0453B8] tracking-wide">
                        {soNo}
                      </span>
                    );
                  })()}
                </div>
                <div className="flex flex-col bg-white border border-blue-200/60 rounded-xl p-3 shadow-sm text-center justify-center h-full min-h-[105px]">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">SO DATE</span>
                  <span className="text-[17px] font-black text-[#0453B8] tracking-wide mt-1">
                    {methods.getValues("orderDate") ? format(methods.getValues("orderDate"), "dd-MMM-yyyy").toUpperCase() : "N/A"}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mt-1.5">
                    {methods.getValues("orderDate") ? format(methods.getValues("orderDate"), "EEEE").toUpperCase() : ""}
                  </span>
                </div>
                {isReadOnly && (
                  <div className="flex flex-col bg-white border border-blue-200/60 rounded-xl p-3 shadow-sm text-center justify-center col-span-2">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">STATUS</span>
                    <span className="text-base font-black text-[#0453B8] tracking-wide">
                      {methods.getValues("status") || "Draft"}
                    </span>
                  </div>
                )}
              </div>

              <NotesPanel isReadOnly={isReadOnly} />
              <AttachmentsModal isReadOnly={isReadOnly} />
              <OrderSummaryPanel isReadOnly={isReadOnly} />
            </div>

          </div>
        </div>

        {/* Sticky Action Footer */}
        {(!isReadOnly || isTopSectionEditable) && (
          <div className="flex-shrink-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-10">
            {isEditMode && (
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => router.push(`/sales-orders/${methods.getValues('salesOrderNo')?.replace('SO-', '') || '1'}`)}
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium h-10 px-6"
              >
                Cancel
              </Button>
            )}
            <Button type="button" variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium h-10 px-6">
              Save Draft
            </Button>
            <Button type="submit" className="h-10 px-6 bg-[#0453B8] hover:bg-blue-700 text-white font-medium shadow-sm">
              Save
              <ChevronDown className="w-4 h-4 ml-2 opacity-80" />
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
