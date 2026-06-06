import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { SalesOrder, Attachment } from "@/types/sales-order";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Paperclip, FileText, Image as ImageIcon, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AttachmentsModal() {
  const { watch, setValue, getValues } = useFormContext<SalesOrder>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const currentAttachments = getValues("attachments") || [];
      const newAttachments: Attachment[] = Array.from(e.target.files).map((file, idx) => {
        let type = "other";
        if (file.type === "application/pdf" || file.name.endsWith(".pdf")) type = "pdf";
        else if (file.type.includes("excel") || file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) type = "xlsx";
        else if (file.type.startsWith("image/")) type = "image";
        
        return {
          id: `new-att-${Date.now()}-${idx}`,
          name: file.name,
          size: file.size,
          type
        };
      });
      setValue("attachments", [...currentAttachments, ...newAttachments], { shouldValidate: true, shouldDirty: true });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    const currentAttachments = getValues("attachments") || [];
    setValue("attachments", currentAttachments.filter(a => a.id !== id), { shouldValidate: true, shouldDirty: true });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-2 h-10 border-slate-200 text-slate-700 hover:bg-slate-50 flex justify-center items-center font-semibold bg-white shadow-sm rounded-lg">
          <Paperclip className="w-4 h-4 mr-2 text-slate-500" />
          Attach Documents ({watch("attachments")?.length || 0})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Attachments</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-2">
          {watch("attachments")?.map((file: any) => (
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
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
                onClick={() => removeAttachment(file.id)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
          
          <input 
            type="file" 
            multiple 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
          />
          <Button 
            variant="outline" 
            className="w-full mt-2 border-dashed border-slate-300 text-blue-600 bg-blue-50/50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
            onClick={() => fileInputRef.current?.click()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add More Files
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
