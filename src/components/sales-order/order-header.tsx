import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Menu, CalendarDays, ChevronDown, FileText } from "lucide-react";

interface OrderHeaderProps {
  salesOrderNo: string;
  orderDate: Date;
  status: string;
}

export function OrderHeader({ salesOrderNo, orderDate, status }: OrderHeaderProps) {
  return (
    <div className="flex flex-col mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Menu className="w-5 h-5 text-slate-500 cursor-pointer lg:hidden" />
          <div className="p-2 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center w-10 h-10 text-blue-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">New Sales Order</h1>
            <p className="text-xs text-slate-500">Create a new sales order in simple steps</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex border border-slate-200 rounded-md bg-white overflow-hidden shadow-sm h-10">
            <div className="flex flex-col justify-center px-4 border-r border-slate-200 bg-white">
              <span className="text-[9px] text-[#0453B8] font-bold">SO No.</span>
              <div className="flex items-center">
                <span className="text-[13px] font-semibold text-slate-800">{salesOrderNo}</span>
              </div>
            </div>

            <div className="flex flex-col justify-center px-4 bg-white">
              <span className="text-[9px] text-[#0453B8] font-bold">Order Date</span>
              <div className="flex items-center justify-between min-w-[110px]">
                <span className="text-[13px] font-semibold text-slate-800">{format(orderDate, "dd-MMM-yyyy")}</span>
                <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 border border-slate-200 rounded-md bg-white px-3 h-10 shadow-sm mr-2">
            <span className="text-xs font-medium text-slate-500 mr-2">Status</span>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">{status}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-white border-slate-200 text-blue-600 hover:bg-slate-50 font-medium h-10">
              Save Draft
            </Button>
            <Button variant="outline" className="bg-white border-slate-200 text-blue-600 hover:bg-slate-50 font-medium h-10">
              Save & New
            </Button>
            <Button variant="primary" className="h-10 px-4">
              Save & Confirm
              <ChevronDown className="w-4 h-4 ml-1 opacity-80" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
