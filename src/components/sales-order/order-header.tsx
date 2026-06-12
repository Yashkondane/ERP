import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Menu, CalendarDays, ChevronDown, FileText } from "lucide-react";

interface OrderHeaderProps {
  salesOrderNo: string;
  orderDate: Date;
  status: string;
  isReadOnly?: boolean;
}

export function OrderHeader({ salesOrderNo, orderDate, status, isReadOnly = false }: OrderHeaderProps) {
  return (
    <div className="flex flex-col mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Menu className="w-5 h-5 text-slate-500 cursor-pointer lg:hidden" />
          <div className="p-2 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center w-10 h-10 text-blue-600">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-semibold text-slate-900">{isReadOnly ? "View Sales Order" : "New Sales Order"}</h1>
            <div className="flex items-stretch gap-4">
              {/* SO Number Badge */}
              <div className="flex flex-col bg-blue-50/80 border border-blue-100 rounded-lg px-5 py-3 shadow-sm min-w-[140px]">
                <span className="text-[11px] font-bold text-[#0453B8]/80 uppercase tracking-wider mb-1.5">SO NUMBER</span>
                <span className="text-lg font-black text-[#0453B8] tracking-wide leading-none">
                  {salesOrderNo}
                </span>
              </div>

              {/* SO Date Badge */}
              <div className="flex flex-col bg-slate-50 border border-slate-200 rounded-lg px-5 py-3 shadow-sm min-w-[140px]">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  SO DATE
                </span>
                <div className="flex flex-col">
                  <span className="text-lg font-black text-slate-700 tracking-wide leading-none mb-1.5">
                    {format(orderDate, "dd-MMM-yyyy").toUpperCase()}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider leading-none">
                    {format(orderDate, "EEEE")}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              {isReadOnly && (
                <div className="flex flex-col bg-emerald-50 border border-emerald-100 rounded-lg px-5 py-3 shadow-sm min-w-[140px]">
                  <span className="text-[11px] font-bold text-emerald-600/80 uppercase tracking-wider mb-1.5">
                    STATUS
                  </span>
                  <span className="text-lg font-black text-emerald-700 tracking-wide leading-none">
                    {status}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
