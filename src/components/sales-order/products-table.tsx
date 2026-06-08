import { useFormContext, useFieldArray } from "react-hook-form";
import { SalesOrder } from "@/types/sales-order";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { SizeBreakdownRow } from "./size-breakdown-row";
import { AddProductDialog } from "./add-product-dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function ProductsTable({ isReadOnly = false }: { isReadOnly?: boolean }) {
  const { control, register, watch } = useFormContext<SalesOrder>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "products",
  });
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const products = watch("products");

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setIsAddProductOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">2</div>
          <h2 className="text-base font-semibold text-slate-800">Products</h2>
        </div>
        {!isReadOnly && (
          <Button variant="primary" className="h-10 px-4" onClick={(e) => { e.preventDefault(); setIsAddProductOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-10 text-center px-2">#</TableHead>
              <TableHead className="px-2">Product</TableHead>
              <TableHead className="w-[140px] pl-6 pr-2">Brand &bull; SKU</TableHead>
              <TableHead className="w-[110px] pl-6 pr-2">Color</TableHead>
              <TableHead className="w-[110px] px-2">Fabric</TableHead>
              <TableHead className="w-[130px] px-2">Fit</TableHead>
              <TableHead className="w-[280px] text-center px-2">Size Breakup (Qty)</TableHead>
              <TableHead className="w-[80px] text-center px-2">Total Qty</TableHead>
              <TableHead className="w-[100px] text-center px-2">Rate (₹)</TableHead>
              <TableHead className="w-[130px] text-right pr-6 pl-2">Amount (₹)</TableHead>
              {!isReadOnly && <TableHead className="w-[80px] text-center px-2">Action</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => {
              const product = products[index];
              const sizeBreakdown = product.sizeBreakdown;
              const totalQty = (sizeBreakdown.XS || 0) + (sizeBreakdown.S || 0) + (sizeBreakdown.M || 0) + (sizeBreakdown.L || 0) + (sizeBreakdown.XL || 0) + (sizeBreakdown.XXL || 0) + (sizeBreakdown["3XL"] || 0) + (sizeBreakdown["4XL"] || 0) + (sizeBreakdown["5XL"] || 0) + (sizeBreakdown["6XL"] || 0);
              const amount = totalQty * product.rate;

              return (
                <TableRow key={field.id}>
                  <TableCell className="text-center text-sm font-medium text-slate-600 px-2 py-2">{index + 1}</TableCell>
                  <TableCell className="px-2 py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                        {/* Placeholder for product image */}
                        <ImageIcon className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-slate-800">{product.name}</span>
                        <span className="text-[11px] text-slate-500">
                          {product.type || "Unknown"} {product.subcategory === "T-Shirt" || product.name.toLowerCase().includes("t-shirt") ? "Round Neck" : "Regular Collar"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="pl-6 pr-2 py-2">
                    <div className="flex flex-col gap-0.5">
                      {isReadOnly ? (
                        <span className="text-sm font-medium text-slate-700">{product.brandName || "No Brand"}</span>
                      ) : (
                        <Input
                          {...register(`products.${index}.brandName`)}
                          placeholder="No Brand"
                          className="h-8 w-[112px] rounded-none border-0 bg-transparent px-0 text-sm font-medium shadow-none focus-visible:border-0 focus-visible:ring-0"
                        />
                      )}
                      {product.sqNumber && (
                        <span className="text-[11px] font-semibold text-slate-500">
                          {product.sqNumber}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="pl-6 pr-2 py-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full border border-slate-300"
                        style={{ backgroundColor: product.color.toLowerCase() === 'navy' ? '#000080' : product.color.toLowerCase() }}
                      />
                      <span className="text-sm text-slate-700">{product.color}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-2 py-2">
                    <span className="text-sm font-medium text-slate-700">{product.fabric || "Cotton Poplin"}</span>
                  </TableCell>
                  <TableCell className="px-2 py-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-slate-700">{product.fit || "Regular"}</span>
                      {product.pattern && (
                        <div className="text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-800">{product.pattern.code}</span> {product.pattern.brand} - {product.pattern.fit}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="flex justify-center px-2 py-2">
                    <SizeBreakdownRow index={index} />
                  </TableCell>
                  <TableCell className="text-center font-semibold text-slate-800 px-2 py-2">
                    {isReadOnly ? (
                      <div 
                        className="mx-auto flex h-[30px] w-[64px] items-center justify-center rounded-md border border-blue-100 bg-blue-50 text-sm font-semibold text-slate-900 cursor-pointer hover:bg-blue-100 transition-colors"
                        onClick={() => handleEdit(index)}
                      >
                        {totalQty}
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="mx-auto flex h-[30px] w-[64px] items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-sm font-semibold text-slate-900 transition-colors hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0453B8]/30"
                        onClick={(e) => {
                          e.preventDefault();
                          handleEdit(index);
                        }}
                      >
                        {totalQty}
                      </button>
                    )}
                  </TableCell>
                  <TableCell className="text-center px-2 py-2">
                    <span className="text-sm font-medium text-slate-800">{product.rate}</span>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-slate-800 pr-6 pl-2 py-2">
                    {amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  {!isReadOnly && (
                    <TableCell className="px-2 py-2">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-100" onClick={() => remove(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Table Footer / Summary Row inside Table (optional, but requested in layout) */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Total Items: <span className="font-semibold">{products.length}</span>
          </div>
          <div className={`flex items-center gap-8 ${isReadOnly ? 'mr-[260px]' : 'mr-[340px]'}`}>
            <span className="text-sm text-slate-600">Total Qty</span>
            <span className="text-base font-bold text-slate-900">
              {products.reduce((acc, p) => acc + (p.sizeBreakdown.XS || 0) + (p.sizeBreakdown.S || 0) + (p.sizeBreakdown.M || 0) + (p.sizeBreakdown.L || 0) + (p.sizeBreakdown.XL || 0) + (p.sizeBreakdown.XXL || 0) + (p.sizeBreakdown["3XL"] || 0) + (p.sizeBreakdown["4XL"] || 0) + (p.sizeBreakdown["5XL"] || 0) + (p.sizeBreakdown["6XL"] || 0), 0)}
            </span>
          </div>
        </div>
      </div>

      <AddProductDialog
        open={isAddProductOpen}
        onOpenChange={(open) => {
          setIsAddProductOpen(open);
          if (!open) setEditingIndex(null);
        }}
        onAddProduct={(product) => {
          if (editingIndex !== null) {
            update(editingIndex, product);
            setEditingIndex(null);
          } else {
            append(product);
          }
        }}
        editProduct={editingIndex !== null ? products[editingIndex] : undefined}
      />
    </div>
  );
}
