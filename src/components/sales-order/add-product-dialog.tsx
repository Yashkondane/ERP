import { useState, useMemo, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, ChevronDown, ChevronUp, Plus, ArrowLeft } from "lucide-react";
import { MOCK_CATALOG_PRODUCTS } from "@/data/mock-sales-order";
import { CatalogProduct } from "@/types/sales-order";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProduct: (product: any) => void;
  editProduct?: any;
}

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL"] as const;
const EXTENDED_SIZES = ["XXL", "3XL", "4XL", "5XL", "6XL"] as const;

// Hardcoded Master Values
const MASTER_CATEGORIES = ["Mens", "Womens", "Kids", "Winter Wear", "Bottom Wear"];
const MASTER_SUBCATEGORIES = ["Shirt", "Trouser", "Dress", "Half Sleeves", "Full Sleeves", "Slim Fit"];
const MASTER_TYPES = ["Cotton", "Denim", "Fleece", "Linen", "Polyester"];

export function AddProductDialog({ open, onOpenChange, onAddProduct, editProduct }: AddProductDialogProps) {
  const [catalogItems, setCatalogItems] = useState<CatalogProduct[]>(MOCK_CATALOG_PRODUCTS);
  const [viewMode, setViewMode] = useState<'search' | 'create'>('search');

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const [showMoreSizes, setShowMoreSizes] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedColor, setSelectedColor] = useState("White");

  // Create Form State
  const [newProduct, setNewProduct] = useState({
    code: "",
    rate: "",
    category: "",
    subcategory: "",
    name: "",
    type: ""
  });

  useEffect(() => {
    if (open && editProduct) {
      const catProduct = catalogItems.find(p => p.code === editProduct.productId);
      if (catProduct) setSelectedProductId(catProduct.id);
      setSelectedColor(editProduct.color || "White");
      setQuantities(editProduct.sizeBreakdown || {});
      const hasExtendedSizes = Object.keys(editProduct.sizeBreakdown || {}).some(k => EXTENDED_SIZES.includes(k as any) && editProduct.sizeBreakdown[k] > 0);
      setShowMoreSizes(hasExtendedSizes);
      setViewMode('search');
    } else if (open) {
      setSelectedProductId(null);
      setSearchQuery("");
      setQuantities({});
      setSelectedColor("White");
      setShowMoreSizes(false);
      setViewMode('search');
    }
  }, [open, editProduct, catalogItems]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return catalogItems;
    const query = searchQuery.toLowerCase();
    return catalogItems.filter(p =>
      p.code.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.subcategory.toLowerCase().includes(query) ||
      p.name.toLowerCase().includes(query)
    );
  }, [searchQuery, catalogItems]);

  const selectedProduct = useMemo(() => {
    return catalogItems.find(p => p.id === selectedProductId) || null;
  }, [selectedProductId, catalogItems]);

  const handleAdd = () => {
    if (!selectedProduct) return;

    const sizeBreakdown: Record<string, number> = {};
    let totalQty = 0;

    [...DEFAULT_SIZES, ...EXTENDED_SIZES].forEach(size => {
      const qty = quantities[size] || 0;
      if (qty > 0) {
        sizeBreakdown[size] = qty;
        totalQty += qty;
      }
    });

    if (totalQty === 0) {
      alert("Please enter at least one quantity.");
      return;
    }

    const newLineItem = {
      id: editProduct ? editProduct.id : `new-${Date.now()}`,
      productId: selectedProduct.code,
      name: selectedProduct.name,
      category: selectedProduct.category,
      subcategory: selectedProduct.subcategory,
      type: selectedProduct.type,
      color: selectedColor,
      rate: selectedProduct.rate,
      sizeBreakdown: sizeBreakdown,
    };

    onAddProduct(newLineItem);
    handleClose();
  };

  const handleCreateProduct = () => {
    if (!newProduct.code || !newProduct.name || !newProduct.category || !newProduct.rate) {
      alert("Please fill in the required fields (Code, Name, Rate, Category).");
      return;
    }

    const createdProduct: CatalogProduct = {
      id: `cat-${Date.now()}`,
      code: newProduct.code,
      name: newProduct.name,
      category: newProduct.category,
      subcategory: newProduct.subcategory || "-",
      type: newProduct.type || "-",
      color: "N/A", // Color is selected during Add
      rate: parseFloat(newProduct.rate) || 0,
    };

    setCatalogItems([createdProduct, ...catalogItems]);
    setSelectedProductId(createdProduct.id);
    setViewMode('search');
    setSearchQuery("");
  };

  const handleClose = () => {
    setSearchQuery("");
    setSelectedProductId(null);
    setQuantities({});
    setShowMoreSizes(false);
    setSelectedColor("White");
    setViewMode('search');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] h-[750px] bg-slate-50 p-0 overflow-hidden flex flex-col shadow-2xl border-0">
        <DialogHeader className="px-6 py-4 border-b border-slate-200 bg-white shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            {viewMode === 'create' && (
              <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 text-slate-500" onClick={() => setViewMode('search')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                {viewMode === 'search' ? (editProduct ? 'Edit Product' : 'Add Product') : 'Create Catalog Product'}
              </DialogTitle>
              {viewMode === 'create' && (
                <p className="text-xs text-slate-500 mt-0.5">Products feed the cascading Category → Sub-Category → Product dropdowns.</p>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar relative">

          {viewMode === 'search' && (
            <div className="flex flex-col gap-6">

              {/* Search Section - Fixed height container so it doesn't jump */}
              <div className="flex flex-col gap-3 min-h-[70px]">
                <Label className="text-xs font-bold text-[#0453B8] uppercase tracking-wider">Search Catalog</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by code, category, or subcategory..."
                    className="pl-10 h-12 bg-white border-slate-200 shadow-sm focus-visible:ring-[#0453B8] rounded-md text-base"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedProductId(null); // Reset selection when searching
                    }}
                  />
                </div>

                {/* Search Results */}
                {!selectedProduct && searchQuery && (
                  <div className="absolute top-[135px] left-6 right-6 border border-slate-200 rounded-md max-h-[220px] overflow-y-auto bg-white shadow-lg z-20">
                    {filteredProducts.length === 0 ? (
                      <div className="p-4 flex flex-col items-center justify-center text-center gap-3">
                        <span className="text-sm text-slate-500">No products found for "{searchQuery}"</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#0453B8] text-[#0453B8] hover:bg-blue-50"
                          onClick={() => {
                            setNewProduct(prev => ({ ...prev, code: searchQuery.toUpperCase() }));
                            setViewMode('create');
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create "{searchQuery}" in Catalog
                        </Button>
                      </div>
                    ) : (
                      filteredProducts.map(p => (
                        <div
                          key={p.id}
                          className="p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                          onClick={() => {
                            setSelectedProductId(p.id);
                            setSearchQuery(""); // Clear search to hide dropdown
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800">{p.code} - {p.name}</span>
                            <span className="text-xs text-slate-500">{p.category} &gt; {p.subcategory}</span>
                          </div>
                          <span className="text-sm font-semibold text-[#0453B8]">₹{p.rate}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Fixed Placeholder Area for Product Selection */}
              <div className="flex flex-col min-h-[400px] border border-dashed border-slate-300 rounded-xl bg-white p-6 justify-center items-center relative overflow-hidden">
                {!selectedProduct ? (
                  <div className="flex flex-col items-center text-center max-w-[280px]">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-slate-700 font-semibold mb-1">No Product Selected</h3>
                    <p className="text-xs text-slate-500 mb-6">Search the catalog above to select a product and enter quantities.</p>

                    <div className="flex items-center gap-3 w-full">
                      <div className="h-px bg-slate-200 flex-1"></div>
                      <span className="text-xs text-slate-400 font-medium">OR</span>
                      <div className="h-px bg-slate-200 flex-1"></div>
                    </div>

                    <Button
                      variant="ghost"
                      className="mt-4 text-[#0453B8] hover:bg-blue-50 hover:text-blue-700 font-semibold"
                      onClick={() => setViewMode('create')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Product
                    </Button>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-white p-6 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
                    {/* Selected Product Card */}
                    <div className="bg-[#0453B8]/5 border border-[#0453B8]/20 rounded-xl p-4 flex items-start justify-between shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-slate-900">{selectedProduct.code}</span>
                        <span className="text-sm font-medium text-slate-700 mt-1">{selectedProduct.name}</span>
                        <div className="flex items-center gap-2 mt-2 text-xs font-medium text-slate-500">
                          <span className="bg-white px-2 py-0.5 rounded-sm border border-slate-200">{selectedProduct.category}</span>
                          <span className="bg-white px-2 py-0.5 rounded-sm border border-slate-200">{selectedProduct.subcategory}</span>
                          <span className="bg-white px-2 py-0.5 rounded-sm border border-slate-200">{selectedProduct.type}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <span className="text-xl font-bold text-[#0453B8]">₹{selectedProduct.rate}</span>
                        <Select value={selectedColor} onValueChange={setSelectedColor}>
                          <SelectTrigger className="h-8 bg-white border-slate-200 shadow-sm rounded-md w-[100px] text-xs font-bold text-slate-700">
                            <SelectValue placeholder="Color" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="White">White</SelectItem>
                            <SelectItem value="Black">Black</SelectItem>
                            <SelectItem value="Navy">Navy</SelectItem>
                            <SelectItem value="Red">Red</SelectItem>
                            <SelectItem value="Grey">Grey</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Quantities Grid */}
                    <div className="flex flex-col gap-4 flex-1">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <Label className="text-xs font-bold text-[#0453B8] uppercase tracking-wider">Enter Quantities</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-[#0453B8] hover:text-blue-800 hover:bg-blue-50 px-3 rounded-full font-semibold"
                          onClick={() => setShowMoreSizes(!showMoreSizes)}
                        >
                          {showMoreSizes ? <ChevronUp className="w-3.5 h-3.5 mr-1" /> : <ChevronDown className="w-3.5 h-3.5 mr-1" />}
                          {showMoreSizes ? "Hide Extended Sizes" : "More Sizes"}
                        </Button>
                      </div>

                      <div className="grid grid-cols-5 gap-3">
                        {DEFAULT_SIZES.map(size => (
                          <div key={size} className="flex flex-col shadow-sm rounded-md overflow-hidden border border-slate-200">
                            <div className="text-[11px] text-center font-bold text-slate-700 bg-slate-100 py-1.5 border-b border-slate-200">{size}</div>
                            <Input
                              type="number"
                              min="0"
                              className="h-10 text-center rounded-none border-0 shadow-none focus-visible:ring-[#0453B8] font-semibold text-slate-900 bg-white"
                              value={quantities[size] || ""}
                              onChange={(e) => setQuantities({ ...quantities, [size]: parseInt(e.target.value) || 0 })}
                              onFocus={(e) => e.target.select()}
                            />
                          </div>
                        ))}
                      </div>

                      {showMoreSizes && (
                        <div className="grid grid-cols-5 gap-3 mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                          {EXTENDED_SIZES.map(size => (
                            <div key={size} className="flex flex-col shadow-sm rounded-md overflow-hidden border border-slate-200">
                              <div className="text-[11px] text-center font-bold text-slate-700 bg-slate-100 py-1.5 border-b border-slate-200">{size}</div>
                              <Input
                                type="number"
                                min="0"
                                className="h-10 text-center rounded-none border-0 shadow-none focus-visible:ring-[#0453B8] font-semibold text-slate-900 bg-white"
                                value={quantities[size] || ""}
                                onChange={(e) => setQuantities({ ...quantities, [size]: parseInt(e.target.value) || 0 })}
                                onFocus={(e) => e.target.select()}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {viewMode === 'create' && (
            <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-300 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600 uppercase">Code <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="e.g. MSC-019"
                    className="h-11 font-medium bg-slate-50 border-slate-200"
                    value={newProduct.code}
                    onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600 uppercase">Default Rate (₹) <span className="text-red-500">*</span></Label>
                  <Input
                    type="number"
                    placeholder="0"
                    className="h-11 font-medium bg-slate-50 border-slate-200"
                    value={newProduct.rate}
                    onChange={(e) => setNewProduct({ ...newProduct, rate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600 uppercase">Category <span className="text-red-500">*</span></Label>
                  <Select value={newProduct.category} onValueChange={(v) => setNewProduct({ ...newProduct, category: v })}>
                    <SelectTrigger className="h-11 font-medium bg-slate-50 border-slate-200">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {MASTER_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600 uppercase">Sub-Category <span className="text-red-500">*</span></Label>
                  <Select value={newProduct.subcategory} onValueChange={(v) => setNewProduct({ ...newProduct, subcategory: v })}>
                    <SelectTrigger className="h-11 font-medium bg-slate-50 border-slate-200">
                      <SelectValue placeholder="Select Sub-Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {MASTER_SUBCATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-600 uppercase">Product Name <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="e.g. Slim Fit Formal Shirt"
                  className="h-11 font-medium bg-slate-50 border-slate-200"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-slate-600 uppercase">Type</Label>
                  <Select value={newProduct.type} onValueChange={(v) => setNewProduct({ ...newProduct, type: v })}>
                    <SelectTrigger className="h-11 font-medium bg-slate-50 border-slate-200">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {MASTER_TYPES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <Label className="text-xs font-bold text-slate-600 uppercase">Image</Label>
                <div className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 hover:border-[#0453B8] hover:text-[#0453B8] transition-colors">
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-semibold">Add image</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Area - Fixed at bottom */}
        <div className="p-5 border-t border-slate-200 bg-white flex items-center justify-end gap-3 flex-shrink-0 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <Button variant="outline" onClick={handleClose} className="border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold h-11 px-6">Cancel</Button>

          {viewMode === 'search' ? (
            <Button
              variant="primary"
              className="h-11 px-8"
              disabled={!selectedProduct}
              onClick={handleAdd}
            >
              {editProduct ? 'Update Order' : 'Add to Order'}
            </Button>
          ) : (
            <Button
              className="bg-slate-800 hover:bg-slate-900 text-white font-semibold h-11 px-8 shadow-md"
              onClick={handleCreateProduct}
            >
              Create Product
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
