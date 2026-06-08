import { useState, useMemo, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, ChevronDown, ChevronUp, Plus, ArrowLeft } from "lucide-react";
import { MOCK_CATALOG_PRODUCTS } from "@/data/mock-sales-order";
import { INITIAL_MASTER_PATTERNS } from "@/data/mock-masters";
import { CatalogProduct } from "@/types/sales-order";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProduct: (product: any) => void;
  editProduct?: any;
}

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL"] as const;
const EXTENDED_SIZES = ["XXL", "3XL", "4XL", "5XL", "6XL"] as const;
const AUDIENCE_FILTERS = ["Men's Shirt", "Men's T-Shirt", "Women's Shirt", "Women's T-Shirt", "Kids' Wear"] as const;
type AudienceFilter = typeof AUDIENCE_FILTERS[number];
const BRAND_BADGES = ["Zara", "H&M", "Uniqlo", "Levi's"] as const;

// Hardcoded Master Values
const MASTER_CATEGORIES = ["Men's Shirt", "Men's T-Shirt", "Women's Shirt", "Women's T-Shirt", "Kids' Wear"];
const MASTER_SUBCATEGORIES = ["T-Shirt", "Shirt", "Hoodie", "Dress", "Trouser", "Skirt", "Top", "Shorts", "Jacket"];
const MASTER_TYPES = ["Half Sleeves", "Full Sleeves", "Sleeveless", "Full Length", "Knee Length"];
const MASTER_TYPE2S = ["Regular Collar", "Casual Collar", "Round Neck", "V-Neck", "Polo"];

export function AddProductDialog({ open, onOpenChange, onAddProduct, editProduct }: AddProductDialogProps) {
  const [catalogItems, setCatalogItems] = useState<CatalogProduct[]>(MOCK_CATALOG_PRODUCTS);
  const [viewMode, setViewMode] = useState<'search' | 'create'>('search');

  const [searchQuery, setSearchQuery] = useState("");
  const [activeAudience, setActiveAudience] = useState<AudienceFilter>("Men's Shirt");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

  const [showMoreSizes, setShowMoreSizes] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedColor, setSelectedColor] = useState("White");
  const [selectedFabric, setSelectedFabric] = useState("Cotton Poplin");
  const [selectedFit, setSelectedFit] = useState("Regular");
  const [customRate, setCustomRate] = useState<string>("");
  const [sqNumber, setSqNumber] = useState("");
  const [brandName, setBrandName] = useState("");
  const [selectedPattern, setSelectedPattern] = useState("");
  const [patternSearch, setPatternSearch] = useState("");
  const [isPatternOpen, setIsPatternOpen] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);

  const [newProduct, setNewProduct] = useState({
    code: "",
    rate: "",
    category: "",
    subcategory: "",
    name: "",
    type: "",
    type2: ""
  });

  const rateInputRef = useRef<HTMLInputElement>(null);

  const currentTotalQty = useMemo(() => {
    return Object.values(quantities).reduce((acc, qty) => acc + (qty || 0), 0);
  }, [quantities]);

  useEffect(() => {
    if (open && editProduct) {
      const catProduct = catalogItems.find(p => p.code === editProduct.productId);
      if (catProduct) setSelectedProductId(catProduct.id);
      setSelectedColor(editProduct.color || "White");
      setCustomRate(editProduct.rate?.toString() || "");
      setSqNumber(editProduct.sqNumber || "");
      setBrandName(editProduct.brandName || "");
      setQuantities(editProduct.sizeBreakdown || {});
      const hasExtendedSizes = Object.keys(editProduct.sizeBreakdown || {}).some(k => EXTENDED_SIZES.includes(k as any) && editProduct.sizeBreakdown[k] > 0);
      setShowMoreSizes(hasExtendedSizes);
      setViewMode('search');
    } else if (open) {
      setSelectedProductId(null);
      setSearchQuery("");
      setIsProductDropdownOpen(false);
      setQuantities({});
      setSelectedColor("White");
      setCustomRate("");
      setSqNumber("");
      setBrandName("");
      setShowMoreSizes(false);
      setViewMode('search');
      setCustomImage(null);
    }
  }, [open, editProduct, catalogItems]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return catalogItems;
    const query = searchQuery.toLowerCase();
    return catalogItems.filter(p => {
      const isActiveAudience = p.category.toLowerCase().startsWith(activeAudience.toLowerCase());
      const matchesQuery =
        p.code.toLowerCase() === query ||
        p.sqNumber?.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.name.toLowerCase().includes(query) ||
        p.subcategory.toLowerCase().includes(query) ||
        p.type.toLowerCase().includes(query);

      return isActiveAudience && matchesQuery;
    });
  }, [searchQuery, catalogItems, activeAudience]);

  const visibleProducts = useMemo(() => {
    if (searchQuery) return filteredProducts;
    return catalogItems.filter(p => p.category.toLowerCase().startsWith(activeAudience.toLowerCase()));
  }, [activeAudience, catalogItems, filteredProducts, searchQuery]);

  const selectedProduct = useMemo(() => {
    return catalogItems.find(p => p.id === selectedProductId) || null;
  }, [selectedProductId, catalogItems]);

  // Sync custom rate when product changes
  useEffect(() => {
    if (selectedProduct && !editProduct) {
      setCustomRate(selectedProduct.rate.toString());
      setTimeout(() => {
        rateInputRef.current?.focus();
        rateInputRef.current?.select();
      }, 50);
    }
  }, [selectedProduct, editProduct]);

  const currentTotalAmount = useMemo(() => {
    if (!selectedProduct) return 0;
    const rate = parseFloat(customRate) || 0;
    return currentTotalQty * rate;
  }, [currentTotalQty, selectedProduct, customRate]);

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
      brandName,
      sqNumber,
      color: selectedColor,
      fabric: selectedFabric,
      fit: selectedFit,
      pattern: INITIAL_MASTER_PATTERNS.find(p => p.code === selectedPattern) || null,
      rate: parseFloat(customRate) || 0,
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
    setIsProductDropdownOpen(false);
  };

  const handleClose = () => {
    setSearchQuery("");
    setSelectedProductId(null);
    setIsProductDropdownOpen(false);
    setQuantities({});
    setShowMoreSizes(false);
    setSelectedColor("White");
    setSelectedFabric("Cotton Poplin");
    setSelectedFit("Regular");
    setSqNumber("");
    setBrandName("");
    setSelectedPattern("");
    setViewMode('search');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[820px] h-[90vh] bg-slate-50 p-0 overflow-hidden flex flex-col shadow-2xl border-0">
        <DialogHeader className="px-6 py-3 border-b border-slate-200 bg-white shadow-sm z-10 flex-shrink-0">
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
        <div className="flex-1 overflow-y-auto px-6 pt-3 pb-4 custom-scrollbar relative">

          {viewMode === 'search' && (
            <div className="flex flex-col gap-4">

              {/* Search Section - Fixed height container so it doesn't jump */}
              <div className="flex flex-col gap-3 min-h-[70px]">
                <div className="flex items-center gap-2">
                  {AUDIENCE_FILTERS.map(audience => (
                    <button
                      key={audience}
                      type="button"
                      className={`h-8 rounded-md border px-4 text-xs font-bold transition-colors ${activeAudience === audience
                        ? "border-[#0453B8] bg-[#0453B8] text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      onClick={() => {
                        setActiveAudience(audience);
                        setSelectedProductId(null);
                        setIsProductDropdownOpen(true);
                      }}
                    >
                      {audience}
                    </button>
                  ))}
                </div>

                <Label className="text-xs font-bold text-[#0453B8] uppercase tracking-wider">Search Catalog</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by number, product, type, or subcategory..."
                    className="pl-10 h-12 bg-white border-slate-200 shadow-sm focus-visible:ring-[#0453B8] rounded-md text-base"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedProductId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery && filteredProducts.length > 0 && !selectedProduct) {
                        e.preventDefault();
                        setSelectedProductId(filteredProducts[0].id);
                        setSearchQuery("");
                      }
                    }}
                  />
                </div>

              </div>

              {/* Product Selection Area */}
              {!selectedProduct ? (
                <div className="mt-4">
                  {visibleProducts.length === 0 ? (
                    <div className="flex flex-col min-h-[300px] border border-dashed border-slate-300 rounded-xl bg-white p-6 justify-center items-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="text-slate-700 font-semibold mb-1">No products found</h3>
                      <p className="text-xs text-slate-500 mb-6">Try adjusting your search or create a new product.</p>
                      <Button
                        variant="ghost"
                        className="text-[#0453B8] hover:bg-blue-50 hover:text-blue-700 font-semibold"
                        onClick={() => {
                          setNewProduct(prev => ({ ...prev, code: searchQuery.toUpperCase() }));
                          setViewMode('create');
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create "{searchQuery}"
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {visibleProducts.map(p => {
                        let imageSrc = "/men casual half shirt.jpg";
                        const nameLower = p.name.toLowerCase();
                        if (nameLower.includes("formal") || p.code.startsWith("MS")) {
                          imageSrc = p.type.toLowerCase().includes("full") ? "/mens casual full sleeve shirt.jpg" : "/men regualr fit shirt.jpeg";
                        }
                        if (nameLower.includes("t-shirt") || p.code.startsWith("MT")) {
                          imageSrc = "/men casual tshirt.jpeg";
                        }
                        
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setSelectedProductId(p.id)}
                            className="flex flex-col text-left border border-slate-200 rounded-xl bg-white p-3 shadow-sm hover:border-[#0453B8] hover:shadow-md transition-all group"
                          >
                            <div className="w-full aspect-[4/5] bg-[#F5F6F8] rounded-lg overflow-hidden mb-3 p-2 flex items-center justify-center relative">
                              <img src={imageSrc} alt={p.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <span className="text-[13px] font-extrabold text-slate-900 mb-0.5">{p.code}</span>
                            <span className="text-xs font-semibold text-slate-700 mb-1 truncate w-full">{p.name}</span>
                            <span className="text-[10px] text-slate-500">{p.type}</span>
                            <span className="text-[10px] text-slate-500">{p.subcategory === "T-Shirt" ? "Round Neck" : "Regular Collar"}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl bg-white p-4 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
                  {/* Selected Product Card */}
                  <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-5 shadow-sm bg-white">
                    {(() => {
                      let imageSrc = "/men casual half shirt.jpg";
                      const nameLower = selectedProduct.name.toLowerCase();
                      if (nameLower.includes("formal") || selectedProduct.code.startsWith("MS")) {
                        imageSrc = selectedProduct.type.toLowerCase().includes("full") ? "/mens casual full sleeve shirt.jpg" : "/men regualr fit shirt.jpeg";
                      }
                      if (nameLower.includes("t-shirt") || selectedProduct.code.startsWith("MT")) {
                        imageSrc = "/men casual tshirt.jpeg";
                      }

                      return (
                        <>
                          <div className="relative w-[100px] aspect-square bg-[#F5F6F8] rounded-xl overflow-hidden flex items-center justify-center p-2 shrink-0 group cursor-pointer border border-transparent hover:border-[#0453B8] transition-colors">
                            <img src={customImage || imageSrc} alt={selectedProduct.name} className="w-full h-full object-contain mix-blend-multiply group-hover:opacity-30 transition-opacity" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5">
                              <Plus className="w-6 h-6 text-[#0453B8] mb-1" />
                              <span className="text-[10px] font-bold text-[#0453B8] text-center px-1 leading-tight">Change<br/>Image</span>
                            </div>
                            <input 
                              type="file" 
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const url = URL.createObjectURL(e.target.files[0]);
                                  setCustomImage(url);
                                }
                              }}
                            />
                          </div>
                          <div className="flex flex-col gap-2 pt-1">
                            <span className="text-base font-extrabold text-slate-900">{selectedProduct.code}</span>
                            <span className="text-sm font-semibold text-slate-700">{selectedProduct.name} {selectedProduct.type} {selectedProduct.subcategory === "T-Shirt" ? "Round Neck" : "Regular Collar"}</span>
                            
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className="bg-blue-50 text-[#0453B8] font-bold px-3 py-1.5 rounded-md text-xs">{selectedProduct.category.replace("'s", "").replace(" Wear", "")}</span>
                              <span className="bg-blue-50 text-[#0453B8] font-bold px-3 py-1.5 rounded-md text-xs">{selectedProduct.subcategory}</span>
                              <span className="bg-blue-50 text-[#0453B8] font-bold px-3 py-1.5 rounded-md text-xs">{selectedProduct.type}</span>
                              <span className="bg-blue-50 text-[#0453B8] font-bold px-3 py-1.5 rounded-md text-xs">{selectedProduct.subcategory === "T-Shirt" ? "Round Neck" : "Regular Collar"}</span>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Attributes Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mt-2 mb-2">
                    <div className="flex items-center gap-3">
                      <Label className="text-xs font-bold text-slate-700 min-w-[45px]">Color <span className="text-red-500">*</span></Label>
                      <Select value={selectedColor} onValueChange={setSelectedColor}>
                        <SelectTrigger className="h-10 flex-1 bg-white border-slate-200 shadow-sm rounded-lg text-sm font-semibold">
                          <SelectValue placeholder="Select Color" />
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

                    <div className="flex items-center gap-3">
                      <Label className="text-xs font-bold text-slate-700 min-w-[45px]">Fabric <span className="text-red-500">*</span></Label>
                      <Select value={selectedFabric} onValueChange={setSelectedFabric}>
                        <SelectTrigger className="h-10 flex-1 bg-white border-slate-200 shadow-sm rounded-lg text-sm font-semibold">
                          <SelectValue placeholder="Select Fabric" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cotton Poplin">Cotton Poplin</SelectItem>
                          <SelectItem value="Linen">Linen</SelectItem>
                          <SelectItem value="Denim">Denim</SelectItem>
                          <SelectItem value="Polyester">Polyester</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-3">
                      <Label className="text-xs font-bold text-slate-700 min-w-[45px]">Fit <span className="text-red-500">*</span></Label>
                      <Select value={selectedFit} onValueChange={setSelectedFit}>
                        <SelectTrigger className="h-10 flex-1 bg-white border-slate-200 shadow-sm rounded-lg text-sm font-semibold">
                          <SelectValue placeholder="Select Fit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Regular">Regular</SelectItem>
                          <SelectItem value="Slim Fit">Slim Fit</SelectItem>
                          <SelectItem value="Oversized">Oversized</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-3">
                      <Label className="text-xs font-bold text-slate-700 min-w-[45px]">Pattern <span className="text-red-500">*</span></Label>
                      <Popover open={isPatternOpen} onOpenChange={setIsPatternOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" role="combobox" aria-expanded={isPatternOpen} className="h-10 flex-1 justify-between bg-white border-slate-200 shadow-sm rounded-lg text-sm font-semibold text-slate-700 px-3">
                            {selectedPattern ? selectedPattern : "Pattern"}
                            <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0" align="start">
                          <div className="flex flex-col">
                            <div className="flex items-center border-b px-3">
                              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-slate-400" />
                              <Input 
                                placeholder="Search brand or code..." 
                                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none border-0 focus-visible:ring-0 shadow-none placeholder:text-slate-500 font-medium px-0"
                                value={patternSearch}
                                onChange={(e) => setPatternSearch(e.target.value)}
                              />
                            </div>
                            <div className="max-h-[300px] overflow-y-auto py-2">
                              {INITIAL_MASTER_PATTERNS.filter(p => p.brand.toLowerCase().includes(patternSearch.toLowerCase()) || p.code.toLowerCase().includes(patternSearch.toLowerCase())).map(pattern => (
                                <button
                                  key={pattern.code}
                                  className="w-full text-left px-4 py-2 hover:bg-slate-50 focus:bg-slate-50 outline-none flex flex-col transition-colors border-l-2 border-transparent hover:border-[#0453B8]"
                                  onClick={() => {
                                    setSelectedPattern(pattern.code);
                                    setIsPatternOpen(false);
                                  }}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <span className="font-bold text-[13px] text-slate-900">{pattern.code}</span>
                                    <span className="font-semibold text-[11px] text-slate-500">{pattern.fit}</span>
                                  </div>
                                  <span className="text-[11px] font-semibold text-[#0453B8]">{pattern.brand}</span>
                                </button>
                              ))}
                              {INITIAL_MASTER_PATTERNS.filter(p => p.brand.toLowerCase().includes(patternSearch.toLowerCase()) || p.code.toLowerCase().includes(patternSearch.toLowerCase())).length === 0 && (
                                <div className="py-6 text-center text-sm text-slate-500 font-medium">
                                  No pattern found.
                                </div>
                              )}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="flex items-center gap-3">
                      <Label className="text-xs font-bold text-slate-700 min-w-[45px]">SKU No</Label>
                      <Input
                        value={sqNumber}
                        onChange={(e) => setSqNumber(e.target.value)}
                        placeholder="e.g. 10 digit code"
                        className="h-10 flex-1 bg-white border-slate-200 shadow-sm rounded-lg text-sm font-semibold px-3 focus-visible:ring-[#0453B8]"
                      />
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

                      <div className="grid gap-2 transition-all duration-300 grid-cols-5">
                        {(showMoreSizes ? [...DEFAULT_SIZES, ...EXTENDED_SIZES] : DEFAULT_SIZES).map(size => (
                          <div key={size} className="flex flex-col shadow-sm rounded-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                            <div className="text-[11px] text-center font-bold text-slate-700 bg-slate-100 py-1.5 border-b border-slate-200">{size}</div>
                            <Input
                              id={`size-input-${size}`}
                              type="number"
                              min="0"
                              className="h-9 text-center rounded-none border-0 shadow-none focus-visible:ring-[#0453B8] font-semibold text-slate-900 bg-white px-1"
                              value={quantities[size] || ""}
                              onChange={(e) => setQuantities({ ...quantities, [size]: parseInt(e.target.value) || 0 })}
                              onFocus={(e) => e.target.select()}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const allSizes = showMoreSizes ? [...DEFAULT_SIZES, ...EXTENDED_SIZES] : DEFAULT_SIZES;
                                  const currentIndex = allSizes.indexOf(size as any);
                                  if (currentIndex < allSizes.length - 1) {
                                    const nextSize = allSizes[currentIndex + 1];
                                    const nextInput = document.getElementById(`size-input-${nextSize}`);
                                    if (nextInput) {
                                      nextInput.focus();
                                      (nextInput as HTMLInputElement).select();
                                    }
                                  }
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
              )}
            </div>
          )}

          {viewMode === 'create' && (
            <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                
                {/* Row 1 */}
                <div className="flex flex-col gap-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Image</Label>
                  <div className="w-[100px] h-[100px] border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-[#0453B8] cursor-pointer hover:bg-slate-50 transition-colors">
                    <Plus className="w-5 h-5 mb-1 opacity-70" />
                    <span className="text-[10px] font-semibold opacity-70">Add image</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Code <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="0"
                    className="h-[48px] w-full text-sm font-medium bg-white border-slate-200 focus-visible:ring-[#0453B8] shadow-sm rounded-lg"
                    value={newProduct.code}
                    onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
                  />
                </div>

                {/* Row 2 */}
                <div className="flex flex-col gap-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Product Name <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="e.g. Slim Fit Formal Shirt"
                    className="h-[48px] w-full text-sm font-medium bg-white border-slate-200 focus-visible:ring-[#0453B8] shadow-sm rounded-lg"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Default Rate (₹)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    className="h-[48px] w-full text-sm font-medium bg-white border-slate-200 focus-visible:ring-[#0453B8] shadow-sm rounded-lg"
                    value={newProduct.rate}
                    onChange={(e) => setNewProduct({ ...newProduct, rate: e.target.value })}
                  />
                </div>

                {/* Row 3 */}
                <div className="flex flex-col gap-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category <span className="text-red-500">*</span></Label>
                  <Select value={newProduct.category} onValueChange={(v) => setNewProduct({ ...newProduct, category: v })}>
                    <SelectTrigger className="h-[48px] w-full text-sm font-medium bg-white border-slate-200 focus:ring-[#0453B8] shadow-sm rounded-lg">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {MASTER_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sub-Category <span className="text-red-500">*</span></Label>
                  <Select value={newProduct.subcategory} onValueChange={(v) => setNewProduct({ ...newProduct, subcategory: v })}>
                    <SelectTrigger className="h-[48px] w-full text-sm font-medium bg-white border-slate-200 focus:ring-[#0453B8] shadow-sm rounded-lg">
                      <SelectValue placeholder="Select Sub-Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {MASTER_SUBCATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Row 4 */}
                <div className="flex flex-col gap-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Type</Label>
                  <Select value={newProduct.type} onValueChange={(v) => setNewProduct({ ...newProduct, type: v })}>
                    <SelectTrigger className="h-[48px] w-full text-sm font-medium bg-white border-slate-200 focus:ring-[#0453B8] shadow-sm rounded-lg">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {MASTER_TYPES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Type</Label>
                  <Select value={newProduct.type2} onValueChange={(v) => setNewProduct({ ...newProduct, type2: v })}>
                    <SelectTrigger className="h-[48px] w-full text-sm font-medium bg-white border-slate-200 focus:ring-[#0453B8] shadow-sm rounded-lg">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {MASTER_TYPE2S.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer Area - Fixed at bottom */}
        <div className="p-5 border-t border-slate-200 bg-white flex items-center justify-between gap-3 flex-shrink-0 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-6 pl-2">
            {viewMode === 'search' && selectedProduct && currentTotalQty > 0 && (
              <>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Total Qty</span>
                  <span className="text-base font-bold text-slate-900">{currentTotalQty}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Total Amount</span>
                  <span className="text-base font-bold text-[#0453B8]">₹{currentTotalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleClose} className="border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold h-11 px-6">Cancel</Button>

            {viewMode === 'search' ? (
              <Button
                variant="primary"
                className="h-11 px-8"
                disabled={!selectedProduct || currentTotalQty === 0}
                onClick={handleAdd}
              >
                {editProduct ? 'Update Order' : 'Add to Order'}
              </Button>
            ) : (
              <Button
                variant="primary"
                className="h-11 px-8"
                onClick={handleCreateProduct}
              >
                Create Product
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
