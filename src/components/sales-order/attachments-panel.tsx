import { useFormContext } from "react-hook-form";
import { SalesOrder } from "@/types/sales-order";
import { FileText, Image as ImageIcon, X, ChevronUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AttachmentsPanel() {
  const { watch } = useFormContext<SalesOrder>();
  const attachments = watch("attachments");

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <h3 className="font-semibold text-slate-800 text-sm">Attachments ({attachments.length})</h3>
        <ChevronUp className="w-4 h-4 text-slate-500" />
      </div>
      
      <div className="p-4 flex flex-col gap-3">
        {attachments.map((file) => (
          <div key={file.id} className="flex items-center justify-between p-2 border border-slate-100 rounded bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${file.type === 'pdf' ? 'bg-red-100 text-red-600' : file.type === 'xlsx' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                {file.type === 'pdf' ? <FileText className="w-4 h-4" /> : file.type === 'xlsx' ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-slate-700 truncate">{file.name}</span>
                <span className="text-xs text-slate-400">{Math.round(file.size / 1024)} KB</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0">
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
        
        <Button variant="outline" className="w-full mt-2 border-dashed border-slate-300 text-blue-600 bg-blue-50/50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300">
          <Plus className="w-4 h-4 mr-2" />
          Add More Files
        </Button>
      </div>
    </div>
  );
}
