import { useFormContext } from "react-hook-form";
import { SalesOrder } from "@/types/sales-order";

interface SizeBreakdownProps {
  index: number;
}

export function SizeBreakdownRow({ index }: SizeBreakdownProps) {
  const { watch } = useFormContext<SalesOrder>();
  
  const sizeBreakdown = watch(`products.${index}.sizeBreakdown`);
  
  if (!sizeBreakdown) return null;

  // Filter only the sizes that have a quantity > 0
  const activeSizes = Object.entries(sizeBreakdown)
    .filter(([_, qty]) => qty !== undefined && (qty as number) > 0)
    .map(([size, qty]) => ({ size, qty: qty as number }));

  if (activeSizes.length === 0) {
    return <span className="text-sm text-slate-400">No sizes specified</span>;
  }

  return (
    <div className="grid grid-cols-5 gap-1 mx-auto w-fit">
      {activeSizes.map(({ size, qty }) => (
        <div key={size} className="flex flex-col items-center border border-slate-200 rounded overflow-hidden min-w-[28px] w-full">
          <div className="text-[10px] bg-slate-50 w-full text-center py-0.5 font-medium text-slate-600 border-b border-slate-200 px-1 leading-tight">
            {size}
          </div>
          <div className="w-full h-6 flex items-center justify-center text-[13px] font-medium text-slate-800 bg-white px-1">
            {qty}
          </div>
        </div>
      ))}
    </div>
  );
}
