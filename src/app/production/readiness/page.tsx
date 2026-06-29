"use client";

import React, { useState } from "react";
import { ListPageHeader } from "@/components/ui/list-page-header";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle2, AlertCircle, ArrowRight, Package } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { useRouter } from "next/navigation";

export default function OrderReadinessPage() {
  const router = useRouter();
  const [selectedSO, setSelectedSO] = useState("SO-2026-001");
  const [isIssued, setIsIssued] = useState(false);

  // Mock data for readiness
  const fabricData = [
    { id: 1, material: "ASTROFILL-016 (Black)", required: 500, received: 600, unit: "Mtr" },
    { id: 2, material: "SHADOWMESH-220 (Navy)", required: 100, received: 85, unit: "Mtr" },
  ];

  const trimsData = [
    { id: 1, item: "4 Hole Plastic Button 18L", required: 2000, received: 5000, unit: "Pcs" },
    { id: 2, item: "Woven Main Label", required: 500, received: 800, unit: "Pcs" },
    { id: 3, item: "5# Nylon Coil Zipper", required: 500, received: 500, unit: "Pcs" },
  ];

  const isFabricReady = fabricData.every(f => f.received >= f.required);
  const isTrimsReady = trimsData.every(t => t.received >= t.required);

  const handleIssueToProduction = () => {
    setIsIssued(true);
    setTimeout(() => {
      router.push("/production/cutting");
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <ListPageHeader 
          title="Order Readiness Report" 
          description="Verify material availability before issuing to production cutting." 
        />
        <Button variant="outline" onClick={() => router.push("/production")} className="h-9">
          Back to Dashboard
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Select Sales Order / Style</label>
            <Select value={selectedSO} onValueChange={setSelectedSO}>
              <SelectTrigger className="h-11 border-slate-200 focus:ring-[#0453B8] font-semibold text-slate-800">
                <SelectValue placeholder="Select an order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SO-2026-001">SO-2026-001 (Men's Track Jacket - Navy)</SelectItem>
                <SelectItem value="SO-2026-002">SO-2026-002 (Sports Shorts - Black)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="ml-auto flex gap-4 items-end h-full">
            <div className={`px-4 py-2.5 rounded-lg border flex items-center gap-2 ${isFabricReady && isTrimsReady ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
              {isFabricReady && isTrimsReady ? (
                <><CheckCircle2 className="w-5 h-5" /><span className="font-bold text-sm">Ready for Production</span></>
              ) : (
                <><AlertCircle className="w-5 h-5" /><span className="font-bold text-sm">Material Shortage</span></>
              )}
            </div>
            
            <Button 
              onClick={handleIssueToProduction}
              disabled={isIssued}
              className={`h-11 px-6 font-bold shadow-sm transition-all ${isIssued ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-[#0453B8] hover:bg-blue-700 text-white'}`}
            >
              {isIssued ? (
                <><CheckCircle2 className="w-4 h-4 mr-2" /> Job Card Issued</>
              ) : (
                <>Issue to Cutting <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
        {/* Fabric Readiness */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              Fabric Requirements
            </h3>
            {!isFabricReady && <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md border border-red-100">Shortage Detected</span>}
          </div>
          <div className="overflow-auto flex-1">
            <Table>
              <TableHeader>
                <TableRow className="bg-white hover:bg-white">
                  <TableHead className="text-xs font-bold text-slate-500">Material</TableHead>
                  <TableHead className="text-xs font-bold text-slate-500 text-right">Required</TableHead>
                  <TableHead className="text-xs font-bold text-slate-500 text-right">In Stock</TableHead>
                  <TableHead className="text-xs font-bold text-slate-500 text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fabricData.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold text-slate-800 text-sm">{item.material}</TableCell>
                    <TableCell className="text-right font-medium text-slate-600 text-sm">{item.required} {item.unit}</TableCell>
                    <TableCell className={`text-right font-bold text-sm ${item.received >= item.required ? 'text-emerald-600' : 'text-red-500'}`}>
                      {item.received} {item.unit}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.received >= item.required ? (
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">READY</span>
                      ) : (
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded text-[10px] font-bold bg-red-100 text-red-700">SHORTAGE</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Trims Readiness */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              Trims Requirements
            </h3>
            {!isTrimsReady && <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md border border-red-100">Shortage Detected</span>}
          </div>
          <div className="overflow-auto flex-1">
            <Table>
              <TableHeader>
                <TableRow className="bg-white hover:bg-white">
                  <TableHead className="text-xs font-bold text-slate-500">Trim Item</TableHead>
                  <TableHead className="text-xs font-bold text-slate-500 text-right">Required</TableHead>
                  <TableHead className="text-xs font-bold text-slate-500 text-right">In Stock</TableHead>
                  <TableHead className="text-xs font-bold text-slate-500 text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trimsData.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold text-slate-800 text-sm">{item.item}</TableCell>
                    <TableCell className="text-right font-medium text-slate-600 text-sm">{item.required} {item.unit}</TableCell>
                    <TableCell className={`text-right font-bold text-sm ${item.received >= item.required ? 'text-emerald-600' : 'text-red-500'}`}>
                      {item.received} {item.unit}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.received >= item.required ? (
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">READY</span>
                      ) : (
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded text-[10px] font-bold bg-red-100 text-red-700">SHORTAGE</span>
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
