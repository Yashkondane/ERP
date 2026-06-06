import { useFormContext, useFieldArray } from "react-hook-form";
import { SalesOrder } from "@/types/sales-order";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, Image as ImageIcon } from "lucide-react";
import { SizeBreakdownRow } from "./size-breakdown-row";
import { AddProductDialog } from "./add-product-dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function ProductsTable() {
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
    <div className="flex flex-col gap-4 mt-5 pt-5 border-t border-slate-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">2</div>
          <h2 className="text-base font-semibold text-slate-800">Products</h2>
        </div>
        <Button variant="primary" className="h-10 px-4" onClick={(e) => { e.preventDefault(); setIsAddProductOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead className="w-[250px]">Product</TableHead>
              <TableHead className="w-[120px]">Color</TableHead>
              <TableHead className="w-[300px] text-center">Size Breakup (Qty)</TableHead>
              <TableHead className="w-[100px] text-center">Total Qty</TableHead>
              <TableHead className="w-[120px] text-right">Rate (₹)</TableHead>
              <TableHead className="w-[150px] text-right">Amount (₹)</TableHead>
              <TableHead className="w-[100px] text-center">Action</TableHead>
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
                  <TableCell className="text-center text-sm font-medium text-slate-600">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                        {/* Placeholder for product image */}
                        <ImageIcon className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-800">{product.name}</span>
                        <span className="text-[11px] text-slate-500 mt-0.5">
                          {product.category || "Unknown"} &bull; {product.subcategory || "Unknown"} &bull; {product.type || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full border border-slate-300"
                        style={{ backgroundColor: product.color.toLowerCase() === 'navy' ? '#000080' : product.color.toLowerCase() }}
                      />
                      <span className="text-sm text-slate-700">{product.color}</span>
                    </div>
                  </TableCell>
                  <TableCell className="flex justify-center py-3">
                    <SizeBreakdownRow index={index} />
                  </TableCell>
                  <TableCell className="text-center font-semibold text-slate-800">
                    {totalQty}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="w-[72px] h-[34px] border border-slate-200 rounded-md flex items-center justify-center text-sm font-medium text-slate-800 ml-auto bg-white">
                      {product.rate}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-slate-800">
                    {amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-100" onClick={(e) => { e.preventDefault(); handleEdit(index); }}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-100" onClick={() => remove(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
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
          <div className="flex items-center gap-8 mr-[380px]">
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
