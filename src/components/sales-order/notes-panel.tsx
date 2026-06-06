import { useFormContext } from "react-hook-form";
import { SalesOrder } from "@/types/sales-order";


export function NotesPanel() {
  const { register } = useFormContext<SalesOrder>();

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h3 className="font-semibold text-slate-800 text-sm">Notes</h3>
      </div>
      
      <div className="p-4">
        <textarea 
          placeholder="Add any internal notes or special instructions for this order..."
          className="w-full min-h-[150px] resize-none border border-slate-200 rounded-md p-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          {...register("internalNotes")}
        />
      </div>
    </div>
  );
}
