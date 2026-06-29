"use client";

import React, { useState } from "react";
import { Package, Search, Download, Filter, TrendingUp, AlertCircle, ChevronDown, ChevronRight, CheckCircle2, ChevronRight as ChevronRightIcon, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import { ListPageHeader } from "@/components/ui/list-page-header";
import { MetricCard } from "@/components/ui/metric-card";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";

// --- MOCK DATA ---
const fabricInventory = [
  {
    id: "f1",
    material: "ASTROFILL-016",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=100&q=80",
    width: "58",
    gsm: "250",
    color: "BLACK",
    fabricType: "POLYESTER",
    totalRolls: 5,
    availableMtrs: 600,
    avgCost: 175.00,
    status: "In Stock",
    rollsDetails: [
      { id: "r1", rollNo: "R-01", mtrs: 120, grnRef: "GRN-F-1001", receivedDate: "10 Jun 2026" },
      { id: "r2", rollNo: "R-02", mtrs: 120, grnRef: "GRN-F-1001", receivedDate: "10 Jun 2026" },
      { id: "r3", rollNo: "R-03", mtrs: 120, grnRef: "GRN-F-1001", receivedDate: "10 Jun 2026" },
      { id: "r4", rollNo: "R-04", mtrs: 120, grnRef: "GRN-F-1001", receivedDate: "10 Jun 2026" },
      { id: "r5", rollNo: "R-05", mtrs: 120, grnRef: "GRN-F-1001", receivedDate: "10 Jun 2026" },
    ]
  },
  {
    id: "f2",
    material: "SHADOWMESH-220",
    image: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=100&q=80",
    width: "60",
    gsm: "220",
    color: "NAVY",
    fabricType: "MESH",
    totalRolls: 2,
    availableMtrs: 85,
    avgCost: 120.00,
    status: "Low Stock",
    rollsDetails: [
      { id: "r6", rollNo: "R-08", mtrs: 50, grnRef: "GRN-F-0982", receivedDate: "22 May 2026" },
      { id: "r7", rollNo: "R-09", mtrs: 35, grnRef: "GRN-F-0982", receivedDate: "22 May 2026" },
    ]
  },
  {
    id: "f3",
    material: "VELVOTEX-330",
    image: "https://images.unsplash.com/photo-1542157585-ef20bbcce178?w=100&q=80",
    width: "62",
    gsm: "330",
    color: "GREY",
    fabricType: "VELVET",
    totalRolls: 8,
    availableMtrs: 800,
    avgCost: 150.00,
    status: "In Stock",
    rollsDetails: [
      { id: "r8", rollNo: "V-01", mtrs: 100, grnRef: "GRN-F-1012", receivedDate: "14 Jun 2026" },
      { id: "r9", rollNo: "V-02", mtrs: 100, grnRef: "GRN-F-1012", receivedDate: "14 Jun 2026" },
      { id: "r10", rollNo: "V-03", mtrs: 100, grnRef: "GRN-F-1012", receivedDate: "14 Jun 2026" },
      { id: "r11", rollNo: "V-04", mtrs: 100, grnRef: "GRN-F-1012", receivedDate: "14 Jun 2026" },
      { id: "r12", rollNo: "V-05", mtrs: 100, grnRef: "GRN-F-1012", receivedDate: "14 Jun 2026" },
      { id: "r13", rollNo: "V-06", mtrs: 100, grnRef: "GRN-F-1012", receivedDate: "14 Jun 2026" },
      { id: "r14", rollNo: "V-07", mtrs: 100, grnRef: "GRN-F-1012", receivedDate: "14 Jun 2026" },
      { id: "r15", rollNo: "V-08", mtrs: 100, grnRef: "GRN-F-1012", receivedDate: "14 Jun 2026" },
    ]
  }
];

const trimsInventory = [
  {
    id: "t1",
    itemType: "Button",
    image: "https://images.unsplash.com/photo-1596708761408-543e06f15f02?w=100&q=80",
    description: "4 Hole Plastic Button 18L - Black",
    availableQty: 5000,
    avgCost: 0.50,
    status: "In Stock",
    receiptHistory: [
      { id: "rh1", grnRef: "GRN-T-2001", receivedDate: "15 Jun 2026", qty: 2500, supplier: "Salasar Trims" },
      { id: "rh2", grnRef: "GRN-T-1090", receivedDate: "01 May 2026", qty: 2500, supplier: "Salasar Trims" },
    ]
  },
  {
    id: "t2",
    itemType: "Main Label",
    image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=100&q=80",
    description: "Woven Label 5x3cm - Logo",
    availableQty: 800,
    avgCost: 1.20,
    status: "Low Stock",
    receiptHistory: [
      { id: "rh3", grnRef: "GRN-T-1802", receivedDate: "20 Apr 2026", qty: 3000, supplier: "Perfect Labels" },
    ]
  },
  {
    id: "t3",
    itemType: "Zipper",
    image: "https://images.unsplash.com/photo-1578330752156-3c2fca5d09b2?w=100&q=80",
    description: "5# Nylon Coil Zipper 15cm - Navy",
    availableQty: 1000,
    avgCost: 5.50,
    status: "In Stock",
    receiptHistory: [
      { id: "rh4", grnRef: "GRN-T-2115", receivedDate: "18 Jun 2026", qty: 1000, supplier: "ZipCo Fasteners" },
    ]
  }
];

export function InventoryDashboard() {
  const [activeTab, setActiveTab] = useState("fabric");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFabricRows, setExpandedFabricRows] = useState<Record<string, boolean>>({});
  const [expandedTrimRows, setExpandedTrimRows] = useState<Record<string, boolean>>({});

  const toggleFabricRow = (id: string) => {
    setExpandedFabricRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTrimRow = (id: string) => {
    setExpandedTrimRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Calculate totals
  const totalFabricValue = fabricInventory.reduce((acc, item) => acc + (item.availableMtrs * item.avgCost), 0);
  const totalTrimsValue = trimsInventory.reduce((acc, item) => acc + (item.availableQty * item.avgCost), 0);
  const totalInventoryValue = totalFabricValue + totalTrimsValue;
  
  const lowStockCount = 
    fabricInventory.filter(f => f.status === "Low Stock").length + 
    trimsInventory.filter(t => t.status === "Low Stock").length;

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6">
      <ListPageHeader 
        title="Unified Stock Inventory" 
        description="Real-time overview of fabric rolls and trim quantities" 
      />

        {/* Global Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard 
          title="Total Inventory Value"
          value={`₹ ${totalInventoryValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          subtitle="All items combined"
          icon={Database}
          colorScheme="blue"
        />
        <MetricCard 
          title="Fabric Value"
          value={`₹ ${totalFabricValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          subtitle="Total rolls in stock"
          icon={TrendingUp}
          colorScheme="emerald"
        />
        <MetricCard 
          title="Trims Value"
          value={`₹ ${totalTrimsValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          subtitle="Total pieces in stock"
          icon={Package}
          colorScheme="purple"
        />
        <MetricCard 
          title="Low Stock Alerts"
          value={lowStockCount}
          subtitle="Items requiring attention"
          icon={AlertCircle}
          colorScheme="rose"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col flex-1 overflow-hidden">
        <DataTableToolbar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search SKU, Description, GRN..."
          filters={
            <Button variant="outline" className="h-9 bg-white shadow-sm font-semibold text-slate-700 border-slate-300 text-[13px]">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          }
          actions={
            <Button className="h-9 px-4 font-semibold shadow-md text-[13px] bg-[#0453B8] hover:bg-blue-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          }
        />

        <div className="flex-1 overflow-hidden relative">
        <Tabs defaultValue="fabric" className="w-full h-full flex flex-col" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4 px-6 mt-6">
            <TabsList className="bg-white border border-slate-200 p-1 rounded-lg shadow-sm h-11">
              <TabsTrigger 
                value="fabric" 
                className="text-sm font-bold px-6 data-[state=active]:bg-[#0453B8] data-[state=active]:text-white rounded-md transition-all h-full"
              >
                Fabric Stock
              </TabsTrigger>
              <TabsTrigger 
                value="trims" 
                className="text-sm font-bold px-6 data-[state=active]:bg-[#0453B8] data-[state=active]:text-white rounded-md transition-all h-full"
              >
                Trims Stock
              </TabsTrigger>
            </TabsList>
            
            <div className="text-sm font-medium text-slate-500">
              Showing {activeTab === "fabric" ? fabricInventory.length : trimsInventory.length} Master Items
            </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar px-6 pb-6">

          {/* FABRIC TAB CONTENT */}
          <TabsContent value="fabric" className="flex-1 mt-0 border border-slate-200 rounded-xl bg-white shadow-sm relative overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/80 sticky top-0 z-20 backdrop-blur-sm">
                <TableRow className="border-b border-slate-200">
                  <TableHead className="w-12 px-4 py-3"></TableHead>
                  <TableHead className="px-4 py-3">Material Image</TableHead>
                  <TableHead className="px-4 py-3">SKU / Description</TableHead>
                  <TableHead className="px-4 py-3 text-center">Total Rolls</TableHead>
                  <TableHead className="px-4 py-3 text-center">Available (Mtr)</TableHead>
                  <TableHead className="px-4 py-3 text-right">Avg Rate (₹)</TableHead>
                  <TableHead className="px-4 py-3 text-right">Total Value (₹)</TableHead>
                  <TableHead className="px-4 py-3 text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fabricInventory.map((item) => {
                  const isExpanded = expandedFabricRows[item.id];
                  const totalValue = item.availableMtrs * item.avgCost;
                  
                  return (
                    <React.Fragment key={item.id}>
                      {/* Master Row */}
                      <TableRow 
                        className={`cursor-pointer transition-colors hover:bg-blue-50/50 ${isExpanded ? 'bg-blue-50/30' : ''}`}
                        onClick={() => toggleFabricRow(item.id)}
                      >
                        <TableCell className="text-center px-4 py-3">
                          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-slate-200/50">
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRightIcon className="w-4 h-4 text-slate-400" />}
                          </Button>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shadow-sm">
                            <img src={item.image} alt={item.material} className="w-full h-full object-cover" />
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="text-[13px] font-bold text-slate-800">{item.material}</div>
                          <div className="text-[13px] text-slate-600 font-medium mt-0.5">
                            {item.width}" • {item.gsm} GSM • {item.color} • {item.fabricType}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-center">
                          <span className="text-[13px] text-slate-800 font-bold text-center">
                            {item.totalRolls}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-center">
                          <div className="text-[13px] font-bold text-[#0453B8]">{item.availableMtrs} Mtr</div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right">
                          <div className="text-[13px] text-slate-600 font-medium text-right">₹ {item.avgCost.toFixed(2)}</div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right">
                          <div className="text-[13px] font-bold text-slate-800 text-right">₹ {totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-center">
                          {item.status === "In Stock" ? (
                            <StatusBadge status="Received" />
                          ) : (
                            <StatusBadge status="Pending QC" />
                          )}
                        </TableCell>
                      </TableRow>

                      {/* Detail Sub-table (Drill-down) */}
                      {isExpanded && (
                        <TableRow className="bg-slate-50/50">
                          <TableCell colSpan={8} className="p-0 border-b border-slate-200">
                            <div className="px-16 py-4 animate-in slide-in-from-top-2 duration-200">
                              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
                                  <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    Roll Breakdown ({item.totalRolls} Rolls)
                                  </h3>
                                </div>
                                <Table>
                                  <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-b border-slate-100">
                                      <TableHead className="h-9 text-[11px] font-bold text-slate-500 py-0">Roll No</TableHead>
                                      <TableHead className="h-9 text-[11px] font-bold text-slate-500 py-0">GRN Ref</TableHead>
                                      <TableHead className="h-9 text-[11px] font-bold text-slate-500 py-0">Received Date</TableHead>
                                      <TableHead className="h-9 text-[11px] font-bold text-slate-500 py-0 text-right">Available Qty</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {item.rollsDetails.map((roll) => (
                                      <TableRow key={roll.id} className="hover:bg-slate-50/80 border-b border-slate-100 last:border-0">
                                        <TableCell className="py-2 text-xs font-bold text-slate-900">{roll.rollNo}</TableCell>
                                        <TableCell className="py-2 text-xs font-medium text-blue-600 hover:underline cursor-pointer">{roll.grnRef}</TableCell>
                                        <TableCell className="py-2 text-xs text-slate-500">{roll.receivedDate}</TableCell>
                                        <TableCell className="py-2 text-xs font-bold text-right text-slate-900">{roll.mtrs} Mtr</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>

          {/* TRIMS TAB CONTENT */}
          <TabsContent value="trims" className="flex-1 mt-0 border border-slate-200 rounded-xl bg-white shadow-sm relative overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/80 sticky top-0 z-20 backdrop-blur-sm">
                <TableRow className="border-b border-slate-200">
                  <TableHead className="w-12 px-4 py-3"></TableHead>
                  <TableHead className="px-4 py-3">Item Image</TableHead>
                  <TableHead className="px-4 py-3">Item Type & Description</TableHead>
                  <TableHead className="px-4 py-3 text-center">Available Qty (Pcs)</TableHead>
                  <TableHead className="px-4 py-3 text-right">Avg Rate (₹)</TableHead>
                  <TableHead className="px-4 py-3 text-right">Total Value (₹)</TableHead>
                  <TableHead className="px-4 py-3 text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trimsInventory.map((item) => {
                  const isExpanded = expandedTrimRows[item.id];
                  const totalValue = item.availableQty * item.avgCost;
                  
                  return (
                    <React.Fragment key={item.id}>
                      {/* Master Row */}
                      <TableRow 
                        className={`cursor-pointer transition-colors hover:bg-blue-50/50 ${isExpanded ? 'bg-blue-50/30' : ''}`}
                        onClick={() => toggleTrimRow(item.id)}
                      >
                        <TableCell className="text-center px-4 py-3">
                          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-slate-200/50">
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRightIcon className="w-4 h-4 text-slate-400" />}
                          </Button>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shadow-sm">
                            <img src={item.image} alt={item.itemType} className="w-full h-full object-cover" />
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="text-[13px] font-bold text-slate-800">{item.description}</div>
                          <div className="text-[13px] text-slate-600 font-medium mt-0.5">
                            {item.itemType}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-center">
                          <div className="text-[13px] font-bold text-[#0453B8]">{item.availableQty.toLocaleString()} Pcs</div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right">
                          <div className="text-[13px] text-slate-600 font-medium">₹ {item.avgCost.toFixed(2)}</div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right">
                          <div className="text-[13px] font-bold text-slate-800">₹ {totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-center">
                          {item.status === "In Stock" ? (
                            <StatusBadge status="Received" />
                          ) : (
                            <StatusBadge status="Pending QC" />
                          )}
                        </TableCell>
                      </TableRow>

                      {/* Detail Sub-table (Drill-down) */}
                      {isExpanded && (
                        <TableRow className="bg-slate-50/50">
                          <TableCell colSpan={7} className="p-0 border-b border-slate-200">
                            <div className="px-16 py-4 animate-in slide-in-from-top-2 duration-200">
                              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
                                  <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                    Receipt History
                                  </h3>
                                </div>
                                <Table>
                                  <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-b border-slate-100">
                                      <TableHead className="h-9 text-[11px] font-bold text-slate-500 py-0">GRN Ref</TableHead>
                                      <TableHead className="h-9 text-[11px] font-bold text-slate-500 py-0">Supplier</TableHead>
                                      <TableHead className="h-9 text-[11px] font-bold text-slate-500 py-0">Received Date</TableHead>
                                      <TableHead className="h-9 text-[11px] font-bold text-slate-500 py-0 text-right">Received Qty</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {item.receiptHistory.map((receipt) => (
                                      <TableRow key={receipt.id} className="hover:bg-slate-50/80 border-b border-slate-100 last:border-0">
                                        <TableCell className="py-2 text-xs font-medium text-blue-600 hover:underline cursor-pointer">{receipt.grnRef}</TableCell>
                                        <TableCell className="py-2 text-xs font-bold text-slate-900">{receipt.supplier}</TableCell>
                                        <TableCell className="py-2 text-xs text-slate-500">{receipt.receivedDate}</TableCell>
                                        <TableCell className="py-2 text-xs font-bold text-right text-slate-900">+{receipt.qty} Pcs</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>
          
          </div>
        </Tabs>
      </div>
    </div>
    </div>
  );
}
