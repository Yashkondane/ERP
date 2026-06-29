"use client";

import React, { useState } from "react";
import { ListPageHeader } from "@/components/ui/list-page-header";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, ArrowRight, Package, Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useProduction } from "@/components/production/production-context";

// Mock data for readiness
const MOCK_ORDERS = {
  "SO-2026-008": {
    id: "SO-2026-008",
    style: "Winter Parka - Olive",
    targetQty: 850,
    fabricData: [
      { id: 1, material: "NYLON-TASLAN-04", required: 1700, received: 1800, unit: "Mtr" },
      { id: 2, material: "POLY-LINING-99", required: 1200, received: 1200, unit: "Mtr" },
    ],
    trimsData: [
      { id: 1, item: "Heavy Duty Front Zipper", required: 850, received: 900, unit: "Pcs" },
      { id: 2, item: "Metal Snap Buttons", required: 4250, received: 5000, unit: "Pcs" },
      { id: 3, item: "Drawcord toggle", required: 1700, received: 1700, unit: "Pcs" },
    ]
  },
  "SO-2026-009": {
    id: "SO-2026-009",
    style: "Basic Cotton Hoodie",
    targetQty: 1200,
    fabricData: [
      { id: 1, material: "FRENCH-TERRY-280", required: 2400, received: 2400, unit: "Mtr" },
      { id: 2, material: "RIB-KNIT-MATCHING", required: 400, received: 150, unit: "Mtr" }, // SHORTAGE
    ],
    trimsData: [
      { id: 1, item: "Cotton Drawstring", required: 1200, received: 2000, unit: "Pcs" },
      { id: 2, item: "Metal Eyelets", required: 2400, received: 2400, unit: "Pcs" },
    ]
  },
  "SO-2026-010": {
    id: "SO-2026-010",
    style: "Summer Chino Shorts",
    targetQty: 600,
    fabricData: [
      { id: 1, material: "COTTON-TWILL-150", required: 700, received: 800, unit: "Mtr" },
    ],
    trimsData: [
      { id: 1, item: "Tortoise Shell Button", required: 600, received: 600, unit: "Pcs" },
      { id: 2, item: "YKK Brass Zipper 4 inch", required: 600, received: 600, unit: "Pcs" },
    ]
  }
};

export default function OrderReadinessPage() {
  const router = useRouter();
  const { addJobCard } = useProduction();
  
  const [selectedSO, setSelectedSO] = useState("SO-2026-008");
  const [isIssued, setIsIssued] = useState(false);

  const orderData = MOCK_ORDERS[selectedSO as keyof typeof MOCK_ORDERS];
  
  const isFabricReady = orderData.fabricData.every(f => f.received >= f.required);
  const isTrimsReady = orderData.trimsData.every(t => t.received >= t.required);
  const isAllReady = isFabricReady && isTrimsReady;

  const handleIssueToProduction = () => {
    setIsIssued(true);
    
    // Dynamically create the new Job Card in global context!
    const newId = `JC-${Math.floor(Math.random() * 900) + 100}`;
    addJobCard({
      id: newId,
      soId: orderData.id,
      style: orderData.style,
      currentPhase: "Cutting",
      totalReceived: orderData.targetQty,
      goodQty: orderData.targetQty, // Assumes perfect receipt by cutting to start
      badQty: 0,
      handoverStatus: "Pending_Acceptance",
      pendingReplacementCount: 0
    });

    setTimeout(() => {
      router.push("/production/cutting");
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <ListPageHeader 
          title="Production PPC" 
          description="Verify material availability before issuing Job Cards to production." 
        />
      </div>

      {/* Main Control Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6 flex flex-col md:flex-row md:items-end gap-6">
        
        <div className="flex-1 max-w-md">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Select Pending Sales Order</label>
          <Select 
            value={selectedSO} 
            onValueChange={(val) => {
              setSelectedSO(val);
              setIsIssued(false); // Reset state when switching orders
            }}
          >
            <SelectTrigger className="h-12 border-slate-200 focus:ring-[#0453B8] font-bold text-slate-800 text-base shadow-sm">
              <SelectValue placeholder="Select an order" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(MOCK_ORDERS).map(order => (
                <SelectItem key={order.id} value={order.id} className="font-semibold">
                  {order.id} - {order.style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Quick Summary Box */}
        <div className="hidden md:flex flex-col justify-center px-6 py-2 bg-slate-50 border border-slate-200 rounded-lg h-12">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Target Quantity</span>
          <span className="text-sm font-black text-slate-800">{orderData.targetQty} Units</span>
        </div>
        
        <div className="ml-auto flex gap-4 items-end h-12">
          <div className={`px-4 h-full rounded-lg border flex items-center gap-2 shadow-sm ${isAllReady ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
            {isAllReady ? (
              <><CheckCircle2 className="w-5 h-5" /><span className="font-bold text-sm">Ready for Production</span></>
            ) : (
              <><AlertCircle className="w-5 h-5" /><span className="font-bold text-sm">Material Shortage</span></>
            )}
          </div>
          
          <Button 
            onClick={handleIssueToProduction}
            disabled={!isAllReady || isIssued}
            className={`h-full px-8 font-bold shadow-sm transition-all ${isIssued ? 'bg-emerald-600 text-white' : !isAllReady ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#0453B8] hover:bg-blue-700 text-white hover:shadow-md'}`}
          >
            {isIssued ? (
              <><CheckCircle2 className="w-4 h-4 mr-2" /> Job Card Issued</>
            ) : (
              <>Issue to Cutting <ArrowRight className="w-4 h-4 ml-2" /></>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
        {/* Fabric Readiness */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden transition-all duration-300">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#0453B8]" />
              Fabric Requirements
            </h3>
            {!isFabricReady && <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-200 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Shortage Detected</span>}
          </div>
          <div className="overflow-auto flex-1 p-2">
            <Table>
              <TableHeader>
                <TableRow className="bg-transparent hover:bg-transparent border-b-slate-100">
                  <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider">Material</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Required</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right">In Stock</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData.fabricData.map(item => (
                  <TableRow key={item.id} className="border-b-slate-50 hover:bg-slate-50/50">
                    <TableCell className="font-semibold text-slate-800">{item.material}</TableCell>
                    <TableCell className="text-right font-medium text-slate-500">{item.required} <span className="text-xs">{item.unit}</span></TableCell>
                    <TableCell className={`text-right font-black ${item.received >= item.required ? 'text-emerald-600' : 'text-red-600'}`}>
                      {item.received} <span className="text-xs font-semibold">{item.unit}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.received >= item.required ? (
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">Ready</span>
                      ) : (
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-wider">Shortage</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Trims Readiness */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden transition-all duration-300">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              Trims Requirements
            </h3>
            {!isTrimsReady && <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-200 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Shortage Detected</span>}
          </div>
          <div className="overflow-auto flex-1 p-2">
            <Table>
              <TableHeader>
                <TableRow className="bg-transparent hover:bg-transparent border-b-slate-100">
                  <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trim Item</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Required</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right">In Stock</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData.trimsData.map(item => (
                  <TableRow key={item.id} className="border-b-slate-50 hover:bg-slate-50/50">
                    <TableCell className="font-semibold text-slate-800">{item.item}</TableCell>
                    <TableCell className="text-right font-medium text-slate-500">{item.required} <span className="text-xs">{item.unit}</span></TableCell>
                    <TableCell className={`text-right font-black ${item.received >= item.required ? 'text-emerald-600' : 'text-red-600'}`}>
                      {item.received} <span className="text-xs font-semibold">{item.unit}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.received >= item.required ? (
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">Ready</span>
                      ) : (
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-wider">Shortage</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
