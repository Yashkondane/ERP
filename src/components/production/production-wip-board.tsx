"use client";

import React, { useState } from "react";
import { ListPageHeader } from "@/components/ui/list-page-header";
import { Button } from "@/components/ui/button";
import { Search, Scissors, UserCheck, AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, CornerDownRight, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

type Phase = "Cutting" | "Stitching" | "Washing" | "Finishing" | "Warehouse";
type HandoverStatus = "None" | "Pending_Acceptance" | "Accepted";

interface JobCard {
  id: string;
  soId: string;
  style: string;
  currentPhase: Phase;
  
  // Tracking math for current phase
  totalReceived: number;
  goodQty: number;
  badQty: number;
  
  handoverStatus: HandoverStatus;
  pendingReplacementCount: number;
}

const initialCards: JobCard[] = [
  {
    id: "JC-001",
    soId: "SO-2026-001",
    style: "Men's Track Jacket",
    currentPhase: "Cutting",
    totalReceived: 500,
    goodQty: 500,
    badQty: 0,
    handoverStatus: "Accepted",
    pendingReplacementCount: 0
  },
  {
    id: "JC-002",
    soId: "SO-2026-002",
    style: "Sports Shorts",
    currentPhase: "Stitching",
    totalReceived: 300,
    goodQty: 298,
    badQty: 2,
    handoverStatus: "Accepted",
    pendingReplacementCount: 0
  },
  {
    id: "JC-003",
    soId: "SO-2026-003",
    style: "Basic Tee",
    currentPhase: "Stitching",
    totalReceived: 150,
    goodQty: 150,
    badQty: 0,
    handoverStatus: "Pending_Acceptance", // Needs verification by Stitching
    pendingReplacementCount: 0
  }
];

export function ProductionWipBoard() {
  const [cards, setCards] = useState<JobCard[]>(initialCards);
  const [searchQuery, setSearchQuery] = useState("");

  const phases: Phase[] = ["Cutting", "Stitching", "Washing", "Finishing", "Warehouse"];

  // --- Actions ---

  // 1. Accept Handover (Verification)
  const acceptHandover = (id: string) => {
    setCards(prev => prev.map(c => 
      c.id === id ? { ...c, handoverStatus: "Accepted" } : c
    ));
  };

  // 2. Mark Defect
  const markDefect = (id: string) => {
    setCards(prev => prev.map(c => {
      if (c.id === id && c.goodQty > 0) {
        return { ...c, goodQty: c.goodQty - 1, badQty: c.badQty + 1 };
      }
      return c;
    }));
  };

  // 3. Request Replacement for Defects
  const requestReplacement = (id: string) => {
    setCards(prev => prev.map(c => {
      if (c.id === id && c.badQty > 0) {
        return { 
          ...c, 
          pendingReplacementCount: c.pendingReplacementCount + c.badQty,
          badQty: 0 // We've logged them and requested replacements
        };
      }
      return c;
    }));
  };

  // 4. Receive Replacement from previous phase
  const receiveReplacement = (id: string) => {
    setCards(prev => prev.map(c => {
      if (c.id === id && c.pendingReplacementCount > 0) {
        return {
          ...c,
          totalReceived: c.totalReceived + c.pendingReplacementCount,
          goodQty: c.goodQty + c.pendingReplacementCount,
          pendingReplacementCount: 0
        };
      }
      return c;
    }));
  };

  // 5. Move to Next Phase (Standard or Conditional)
  const moveToPhase = (id: string, nextPhase: Phase) => {
    setCards(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          currentPhase: nextPhase,
          handoverStatus: "Pending_Acceptance", // Must be verified by next phase
          // Reset tracking for the new phase
          totalReceived: c.goodQty,
          goodQty: c.goodQty,
          badQty: 0,
          pendingReplacementCount: 0
        };
      }
      return c;
    }));
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6">
      <ListPageHeader 
        title="WIP Tracking Board" 
        description="Monitor Job Cards across production phases, manage handovers, and track yields." 
      />

      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search Job Card or Style..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-[300px] h-9 text-sm bg-white border-slate-200 shadow-sm"
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 flex-1 overflow-x-auto custom-scrollbar pb-4">
        {phases.map(phase => {
          const phaseCards = cards.filter(c => c.currentPhase === phase);
          
          return (
            <div key={phase} className="w-[380px] shrink-0 flex flex-col bg-slate-100/50 border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 tracking-tight">{phase}</h3>
                <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  {phaseCards.length} Cards
                </span>
              </div>
              
              <div className="p-3 flex-1 overflow-y-auto space-y-3">
                {phaseCards.map(card => (
                  <div key={card.id} className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow relative overflow-hidden">
                    {/* Status Indicator Bar */}
                    <div className={`absolute top-0 left-0 w-1 h-full ${card.handoverStatus === 'Pending_Acceptance' ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                    
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-black text-[#0453B8] tracking-wider">{card.id}</span>
                      <span className="text-xs font-bold text-slate-500">{card.soId}</span>
                    </div>
                    
                    <h4 className="font-bold text-slate-800 text-sm mb-4">{card.style}</h4>
                    
                    {/* Handover Verification */}
                    {card.handoverStatus === "Pending_Acceptance" ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Pending Acceptance</span>
                        </div>
                        <p className="text-xs text-amber-700 font-medium mb-3">
                          Verify receipt of <span className="font-bold">{card.totalReceived}</span> pieces before starting work.
                        </p>
                        <Button 
                          onClick={() => acceptHandover(card.id)}
                          size="sm" 
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white h-8 text-xs font-bold shadow-sm"
                        >
                          <UserCheck className="w-3.5 h-3.5 mr-1.5" /> Accept Handover
                        </Button>
                      </div>
                    ) : (
                      <>
                        {/* Defect Math Tracking */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="bg-slate-50 border border-slate-100 rounded-md p-2 flex flex-col items-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Received</span>
                            <span className="text-lg font-black text-slate-700">{card.totalReceived}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="bg-emerald-50 border border-emerald-100 rounded-md p-1.5 flex justify-between items-center flex-1">
                              <span className="text-[10px] font-bold text-emerald-700 uppercase">Good</span>
                              <span className="text-sm font-black text-emerald-700">{card.goodQty}</span>
                            </div>
                            <div className="bg-red-50 border border-red-100 rounded-md p-1.5 flex justify-between items-center flex-1 group relative">
                              <span className="text-[10px] font-bold text-red-700 uppercase">Defects</span>
                              <span className="text-sm font-black text-red-700">{card.badQty}</span>
                              
                              {/* Mark Defect Button */}
                              {phase !== "Warehouse" && (
                                <button 
                                  onClick={() => markDefect(card.id)}
                                  className="absolute inset-0 bg-red-100 text-red-700 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md font-bold text-[10px]"
                                >
                                  +1 Defect
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Replacements Logic */}
                        {card.badQty > 0 && phase !== "Warehouse" && (
                          <div className="mb-4">
                            <Button 
                              onClick={() => requestReplacement(card.id)}
                              variant="outline" 
                              size="sm" 
                              className="w-full border-red-200 text-red-600 hover:bg-red-50 h-7 text-[11px] font-bold"
                            >
                              <AlertTriangle className="w-3 h-3 mr-1" /> Request {card.badQty} Replacements
                            </Button>
                          </div>
                        )}

                        {card.pendingReplacementCount > 0 && phase !== "Warehouse" && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-4 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-blue-800">
                              Waiting on {card.pendingReplacementCount} replacements
                            </span>
                            <Button 
                              onClick={() => receiveReplacement(card.id)}
                              size="sm" 
                              className="h-6 px-2 text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-bold"
                            >
                              Receive
                            </Button>
                          </div>
                        )}

                        {/* Routing Actions */}
                        {phase !== "Warehouse" && (
                          <div className="pt-3 border-t border-slate-100 mt-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Send to Next Phase</label>
                            
                            {phase === "Stitching" ? (
                              // Conditional Routing for Stitching
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => moveToPhase(card.id, "Washing")}
                                  className="flex-1 bg-slate-800 hover:bg-slate-900 text-white h-8 text-xs font-bold shadow-sm"
                                >
                                  Washing <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                                <Button 
                                  onClick={() => moveToPhase(card.id, "Finishing")}
                                  variant="outline"
                                  className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 h-8 text-xs font-bold shadow-sm bg-white"
                                >
                                  Skip to Finish <CornerDownRight className="w-3 h-3 ml-1" />
                                </Button>
                              </div>
                            ) : (
                              // Standard Routing for others
                              <Button 
                                onClick={() => moveToPhase(card.id, phases[phases.indexOf(phase) + 1])}
                                className="w-full bg-[#0453B8] hover:bg-blue-700 text-white h-8 text-xs font-bold shadow-sm"
                              >
                                {phases[phases.indexOf(phase) + 1]} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                              </Button>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
                
                {phaseCards.length === 0 && (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg">
                    <span className="text-xs font-medium text-slate-400">No active job cards</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
