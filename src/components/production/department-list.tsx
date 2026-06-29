"use client";

import React, { useState } from "react";
import { ListPageHeader } from "@/components/ui/list-page-header";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Filter, Download, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProduction } from "./production-context";

export type Phase = "Cutting" | "Stitching" | "Washing" | "Finishing" | "Warehouse";
export type HandoverStatus = "None" | "Pending_Acceptance" | "Accepted";

export interface JobCard {
  id: string;
  soId: string;
  style: string;
  currentPhase: Phase;
  totalReceived: number;
  goodQty: number;
  badQty: number;
  handoverStatus: HandoverStatus;
  pendingReplacementCount: number;
}

interface DepartmentListProps {
  department: Phase;
  description: string;
}

export function DepartmentList({ department, description }: DepartmentListProps) {
  const router = useRouter();
  const { jobCards } = useProduction();
  const [searchQuery, setSearchQuery] = useState("");

  const phaseOrder: Record<Phase, number> = {
    "Cutting": 0,
    "Stitching": 1,
    "Washing": 2,
    "Finishing": 3,
    "Warehouse": 4
  };

  const getRelativeStatus = (card: JobCard, viewDept: Phase) => {
    const currentIdx = phaseOrder[card.currentPhase];
    const viewIdx = phaseOrder[viewDept];

    if (currentIdx === viewIdx + 1 && card.pendingReplacementCount > 0) return "Replacements Requested";
    if (currentIdx > viewIdx) return "Completed";
    return card.handoverStatus === "Pending_Acceptance" ? "Pending Acceptance" : "In Progress";
  };

  const handleRowClick = (id: string, relativeStatus: string) => {
    // Only allow clicking into detail view if it's actually at this department or needs replacement
    if (relativeStatus === "Pending Acceptance" || relativeStatus === "In Progress" || relativeStatus === "Replacements Requested") {
      router.push(`/production/${department.toLowerCase()}/${id}/view`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6">
      <ListPageHeader 
        title={`${department} Department`} 
        description={description}
      />

      <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col flex-1 overflow-hidden mt-6">
        <DataTableToolbar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search Job Card or Style..."
          filters={
            <Button variant="outline" className="h-9 bg-white shadow-sm font-semibold text-slate-700 border-slate-300 text-[13px]">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </Button>
          }
          actions={
            <Button className="h-9 px-4 font-semibold shadow-md text-[13px] bg-[#0453B8] hover:bg-blue-700 text-white">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          }
        />

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
              <TableRow className="border-b border-slate-200">
                <TableHead className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Job Card</TableHead>
                <TableHead className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Sales Order</TableHead>
                <TableHead className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Style</TableHead>
                <TableHead className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Total Received</TableHead>
                <TableHead className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Status</TableHead>
                <TableHead className="w-12 px-4 py-3"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobCards.map((card) => {
                const relativeStatus = getRelativeStatus(card, department);
                const isClickable = relativeStatus === "Pending Acceptance" || relativeStatus === "In Progress";
                
                return (
                  <TableRow 
                    key={card.id} 
                    className={`${isClickable ? 'cursor-pointer hover:bg-blue-50/50' : 'opacity-70 bg-slate-50/30'} transition-colors`}
                    onClick={() => handleRowClick(card.id, relativeStatus)}
                  >
                    <TableCell className="px-4 py-4">
                      <span className={`text-[13px] font-black ${isClickable ? 'text-[#0453B8]' : 'text-slate-500'}`}>{card.id}</span>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <span className="text-[13px] font-bold text-slate-700">{card.soId}</span>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <span className="text-[13px] font-bold text-slate-800">{card.style}</span>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-center">
                      <span className="text-[13px] font-black text-slate-700">{card.totalReceived}</span>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-center">
                      {relativeStatus === "Incoming" && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
                          Incoming (At {card.currentPhase})
                        </span>
                      )}
                      {relativeStatus === "Completed" && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-400">
                          Completed
                        </span>
                      )}
                      {relativeStatus === "Pending Acceptance" && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
                          Pending Accept
                        </span>
                      )}
                      {relativeStatus === "In Progress" && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                          In Progress
                        </span>
                      )}
                      {relativeStatus === "Replacements Requested" && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
                          Send Replacements ({card.pendingReplacementCount})
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-right">
                      {isClickable && <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0453B8]" />}
                    </TableCell>
                  </TableRow>
                );
              })}
              {jobCards.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-500 font-medium">
                    No active job cards found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
