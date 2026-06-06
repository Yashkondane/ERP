"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SalesOrderSchema, SalesOrder } from "@/types/sales-order";
import { INITIAL_SALES_ORDER } from "@/data/mock-sales-order";

import { OrderHeader } from "@/components/sales-order/order-header";
import { BuyerOrderDetailsCard } from "@/components/sales-order/buyer-order-details-card";
import { BillingAddressCard } from "@/components/sales-order/billing-address-card";
import { ShippingAddressCard } from "@/components/sales-order/shipping-address-card";
import { ProductsTable } from "@/components/sales-order/products-table";
import { NotesPanel } from "@/components/sales-order/notes-panel";
import { OrderSummaryPanel } from "@/components/sales-order/order-summary-panel";
import { AttachmentsModal } from "@/components/sales-order/attachments-modal";

export default function CreateSalesOrderPage() {
  const methods = useForm<SalesOrder>({
    resolver: zodResolver(SalesOrderSchema),
    defaultValues: INITIAL_SALES_ORDER,
  });

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col h-full overflow-hidden bg-slate-50/50">

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto px-5 py-5 pb-4 hide-scrollbar">
          <OrderHeader
            salesOrderNo={methods.getValues("salesOrderNo")}
            orderDate={methods.getValues("orderDate")}
            status={methods.getValues("status")}
          />

          <div className="flex flex-col xl:flex-row gap-5">

            {/* Left Column (Main Content) */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <BuyerOrderDetailsCard />

                <div className="flex flex-col md:flex-row gap-5 mt-2 items-stretch">
                  <BillingAddressCard />
                  <ShippingAddressCard />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <ProductsTable />
              </div>
            </div>

            {/* Right Column (Information Rail) */}
            <div className="w-full xl:w-[320px] flex flex-col gap-5 flex-shrink-0">
              <NotesPanel />
              <OrderSummaryPanel />
              <AttachmentsModal />
            </div>

          </div>
        </div>
      </form>
    </FormProvider>
  );
}
