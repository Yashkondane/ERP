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
    <div className="flex items-center gap-1 flex-wrap justify-center">
      {activeSizes.map(({ size, qty }) => (
        <div key={size} className="flex flex-col items-center border border-slate-200 rounded-md overflow-hidden min-w-[34px]">
          <div className="text-[10px] bg-slate-50 w-full text-center py-1 font-medium text-slate-600 border-b border-slate-200 px-1">
            {size}
          </div>
          <div className="w-full h-[34px] flex items-center justify-center text-sm font-medium text-slate-800 bg-white px-1">
            {qty}
          </div>
        </div>
      ))}
    </div>
  );
}
