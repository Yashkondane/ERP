"use client";

import React, { useState } from "react";
import { ListPageHeader } from "@/components/ui/list-page-header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Phase, HandoverStatus, JobCard } from "./department-list";
import { useProduction } from "./production-context";
import { ArrowLeft, UserCheck, AlertTriangle, ArrowRight, CornerDownRight, CheckCircle2, XCircle, Package } from "lucide-react";
import { Input } from "@/components/ui/input";

interface JobCardDetailProps {
  id: string;
  department: Phase;
}

export function JobCardDetail({ id, department }: JobCardDetailProps) {
  const router = useRouter();
  const { jobCards, updateJobCard } = useProduction();
  
  // Find card from context
  const card = jobCards.find(c => c.id === id) || {
    id, soId: "SO-UNKNOWN", style: "Unknown", currentPhase: department,
    totalReceived: 0, goodQty: 0, badQty: 0, handoverStatus: "Accepted" as HandoverStatus, pendingReplacementCount: 0
  };

  const [receiveGood, setReceiveGood] = useState(card.totalReceived.toString());
  const [receiveBad, setReceiveBad] = useState("0");
  const [rejectionNote, setRejectionNote] = useState("");

  const phases: Phase[] = ["Cutting", "Stitching", "Washing", "Finishing", "Warehouse"];

  const handleBack = () => {
    router.push(`/production/${department.toLowerCase()}`);
  };

  // Logic functions (updates context)
  const acceptHandover = () => {
    const good = parseInt(receiveGood) || 0;
    const bad = parseInt(receiveBad) || 0;
    updateJobCard(id, {
      handoverStatus: "Accepted",
      goodQty: good,
      badQty: bad,
      totalReceived: good + bad
    });
  };

  const rejectHandover = () => {
    if (!rejectionNote.trim()) {
      alert("Please provide a reason for rejection in the notes field.");
      return;
    }
    alert(`Handover Rejected! Reason: ${rejectionNote}\n\nThis batch will be returned to the previous department for correction.`);
    router.push(`/production/${department.toLowerCase()}`);
  };
  
  const markDefect = () => {
    if (card.goodQty > 0) {
      updateJobCard(id, { goodQty: card.goodQty - 1, badQty: card.badQty + 1 });
    }
  };

  const unmarkDefect = () => {
    if (card.badQty > 0) {
      updateJobCard(id, { goodQty: card.goodQty + 1, badQty: card.badQty - 1 });
    }
  };

  const requestReplacement = () => {
    if (card.badQty > 0) {
      updateJobCard(id, {
        pendingReplacementCount: card.pendingReplacementCount + card.badQty,
        badQty: 0
      });
    }
  };

  const receiveReplacement = () => {
    if (card.pendingReplacementCount > 0) {
      updateJobCard(id, {
        totalReceived: card.totalReceived + card.pendingReplacementCount,
        goodQty: card.goodQty + card.pendingReplacementCount,
        pendingReplacementCount: 0
      });
    }
  };

  const moveToPhase = (nextPhase: Phase) => {
    updateJobCard(id, {
      currentPhase: nextPhase,
      handoverStatus: "Pending_Acceptance",
      totalReceived: card.goodQty,
      goodQty: card.goodQty,
      badQty: 0,
      pendingReplacementCount: 0
    });
    router.push(`/production/${department.toLowerCase()}`);
  };

  const phaseOrder: Record<Phase, number> = {
    "Cutting": 0, "Stitching": 1, "Washing": 2, "Finishing": 3, "Warehouse": 4
  };
  const isReplacementView = phaseOrder[department] === phaseOrder[card.currentPhase] - 1 && card.pendingReplacementCount > 0;

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Button variant="ghost" onClick={handleBack} className="mb-2 -ml-3 text-slate-500 hover:text-[#0453B8]">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to {department} Queue
          </Button>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Job Card: <span className="text-[#0453B8]">{card.id}</span>
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage processing for {card.soId} - {card.style}</p>
        </div>
      </div>

      <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Info & Routing */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Job Card Details</h3>
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Sales Order</span>
                <span className="font-semibold text-slate-800">{card.soId}</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Style</span>
                <span className="font-semibold text-slate-800">{card.style}</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Phase</span>
                <span className="inline-flex px-2 py-1 rounded text-xs font-bold bg-[#0453B8]/10 text-[#0453B8]">
                  {card.currentPhase}
                </span>
              </div>
            </div>
          </div>

          {/* Routing Actions */}
          {!isReplacementView && card.handoverStatus === "Accepted" && department !== "Warehouse" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Finalize & Route</h3>
              <p className="text-sm text-slate-500 mb-4">
                Once processing is complete, select the next destination for this batch. 
                Currently routing <span className="font-bold text-emerald-600">{card.goodQty} good pieces</span>.
              </p>

              {department === "Stitching" ? (
                <div className="flex gap-4">
                  <Button onClick={() => moveToPhase("Washing")} className="flex-1 bg-slate-800 hover:bg-slate-900 text-white h-11 font-bold shadow-sm">
                    Send to Washing <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button onClick={() => moveToPhase("Finishing")} variant="outline" className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 h-11 font-bold shadow-sm bg-white">
                    Skip to Finish <CornerDownRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <Button onClick={() => moveToPhase(phases[phases.indexOf(department) + 1])} className="w-full bg-[#0453B8] hover:bg-blue-700 text-white h-11 font-bold shadow-sm">
                  Send to {phases[phases.indexOf(department) + 1]} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          )}

          {/* Warehouse Finalization */}
          {!isReplacementView && card.handoverStatus === "Accepted" && department === "Warehouse" && (
            <div className="bg-white border border-emerald-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Finished Goods
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                This batch has been completely manufactured, verified, and received by the warehouse. It is ready to be added to finished goods inventory.
              </p>
              <Button onClick={() => { 
                alert("Job Card Completed! Added to Finished Goods Inventory."); 
                router.push("/production/warehouse"); 
              }} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11 font-bold shadow-sm">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Mark as Completed & Add to Inventory
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Tracking & Actions */}
        <div className="space-y-6">
          
          {/* Handover State */}
          {card.handoverStatus === "Pending_Acceptance" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col h-full">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-base">Pending Verification</h3>
                <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
                  Action Required
                </span>
              </div>
              
              <p className="text-sm text-slate-600 mb-6">
                Expected batch: <span className="font-bold text-slate-800">{card.totalReceived}</span> pieces. Please verify the physical count and log any immediate defects from the previous phase.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Good Pieces</label>
                  <Input 
                    type="number" 
                    value={receiveGood} 
                    onChange={(e) => setReceiveGood(e.target.value)}
                    className="h-11 text-lg font-black text-emerald-600 focus-visible:ring-[#0453B8]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Defective / Missing</label>
                  <Input 
                    type="number" 
                    value={receiveBad} 
                    onChange={(e) => setReceiveBad(e.target.value)}
                    className="h-11 text-lg font-black text-red-600 focus-visible:ring-[#0453B8]"
                  />
                </div>
              </div>

              {(parseInt(receiveGood) || 0) + (parseInt(receiveBad) || 0) !== card.totalReceived && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 text-xs font-medium text-amber-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <p><strong>Discrepancy Detected:</strong> The sum does not match the Expected batch size ({card.totalReceived}).</p>
                </div>
              )}

              <div className="mb-6">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Rejection Reason / Discrepancy Note</label>
                <textarea 
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  placeholder="Required if rejecting..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-md text-sm p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#0453B8] font-medium text-slate-700 placeholder:text-slate-400 resize-none transition-all"
                />
              </div>

              <div className="flex gap-4 mt-auto">
                <Button onClick={rejectHandover} variant="outline" className="flex-1 bg-white hover:bg-red-50 text-red-600 border-slate-200 hover:border-red-200 h-11 font-bold shadow-sm transition-all">
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
                <Button onClick={acceptHandover} className="flex-1 bg-[#0453B8] hover:bg-blue-700 text-white h-11 font-bold shadow-sm transition-all">
                  <UserCheck className="w-4 h-4 mr-2" /> Accept
                </Button>
              </div>
            </div>
          )}

          {/* Yield Tracking */}
          {!isReplacementView && card.handoverStatus === "Accepted" && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-semibold text-slate-800 text-sm">Yield & Defect Tracking</h3>
              </div>
              <div className="p-5 flex flex-col gap-4">
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Received</span>
                  <span className="text-3xl font-black text-slate-800">{card.totalReceived}</span>
                </div>

                <div className="flex gap-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex flex-col items-center flex-1">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Good</span>
                    <span className="text-2xl font-black text-emerald-700">{card.goodQty}</span>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex flex-col items-center flex-1 relative group">
                    <span className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">Defect</span>
                    <span className="text-2xl font-black text-red-700">{card.badQty}</span>
                    
                    <div className="absolute inset-0 bg-red-100/95 text-red-700 opacity-0 group-hover:opacity-100 transition-opacity flex rounded-lg overflow-hidden backdrop-blur-sm">
                      <button 
                        onClick={unmarkDefect}
                        disabled={card.badQty === 0}
                        className="flex-1 flex flex-col items-center justify-center font-bold hover:bg-red-200 disabled:opacity-30 disabled:cursor-not-allowed border-r border-red-200/50"
                        title="Remove Defect (Mistake)"
                      >
                        <span className="text-xl leading-none">-</span>
                        <span className="text-[10px] uppercase">Undo</span>
                      </button>
                      <button 
                        onClick={markDefect}
                        disabled={card.goodQty === 0}
                        className="flex-1 flex flex-col items-center justify-center font-bold hover:bg-red-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Log New Defect"
                      >
                        <span className="text-xl leading-none">+</span>
                        <span className="text-[10px] uppercase">Defect</span>
                      </button>
                    </div>
                  </div>
                </div>

                {card.badQty > 0 && (
                  <Button 
                    onClick={requestReplacement}
                    variant="outline" 
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 font-bold"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" /> Request {card.badQty} Replacements
                  </Button>
                )}

                {card.pendingReplacementCount > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                    <p className="text-xs font-bold text-blue-800 mb-2">
                      Waiting on {card.pendingReplacementCount} replacements from previous phase.
                    </p>
                    <Button 
                      onClick={receiveReplacement}
                      size="sm" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-8"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Receive Replacements
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Replacement Fulfillment View */}
          {isReplacementView && (
            <div className="bg-white border border-red-200 rounded-xl p-6 shadow-sm flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3 mt-1">
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Replacement Request
                </h3>
                <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
                  Urgent Priority
                </span>
              </div>
              
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-6 text-center">
                <p className="text-sm text-slate-600 mb-2 uppercase tracking-wider font-bold">Requested Quantity</p>
                <p className="text-5xl font-black text-red-600">{card.pendingReplacementCount}</p>
                <p className="text-sm text-slate-500 mt-2 font-medium">Pieces needed by {card.currentPhase} department</p>
              </div>

              <div className="text-sm text-slate-600 mb-6 leading-relaxed">
                The <strong className="text-slate-800">{card.currentPhase}</strong> department has logged {card.pendingReplacementCount} defective pieces for Job Card <strong className="text-slate-800">{card.id}</strong>. They cannot proceed with the full batch until replacements are provided.
              </div>

              <div className="mt-auto">
                <Button 
                  onClick={() => {
                    alert(`Dispatched ${card.pendingReplacementCount} replacements to ${card.currentPhase}!\n\nThis Job Card will remain in your queue until ${card.currentPhase} physically receives them.`);
                    router.push(`/production/${department.toLowerCase()}`);
                  }} 
                  className="w-full bg-red-600 hover:bg-red-700 text-white h-12 font-bold shadow-md text-base"
                >
                  <Package className="w-5 h-5 mr-2" /> Fulfill Replacements & Dispatch
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
