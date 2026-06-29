"use client";

import React, { createContext, useContext, useState } from "react";
import { Phase, HandoverStatus, JobCard } from "./department-list";

interface ProductionContextType {
  jobCards: JobCard[];
  updateJobCard: (id: string, updates: Partial<JobCard>) => void;
  addJobCard: (card: JobCard) => void;
}

const initialMockCards: JobCard[] = [
  { id: "JC-001", soId: "SO-2026-001", style: "Men's Track Jacket", currentPhase: "Cutting", totalReceived: 500, goodQty: 500, badQty: 0, handoverStatus: "Accepted", pendingReplacementCount: 0 },
  { id: "JC-006", soId: "SO-2026-006", style: "Running Tights", currentPhase: "Cutting", totalReceived: 200, goodQty: 200, badQty: 0, handoverStatus: "Pending_Acceptance", pendingReplacementCount: 0 },
  { id: "JC-002", soId: "SO-2026-002", style: "Sports Shorts", currentPhase: "Stitching", totalReceived: 300, goodQty: 298, badQty: 2, handoverStatus: "Accepted", pendingReplacementCount: 0 },
  { id: "JC-003", soId: "SO-2026-003", style: "Basic Tee", currentPhase: "Stitching", totalReceived: 150, goodQty: 150, badQty: 0, handoverStatus: "Pending_Acceptance", pendingReplacementCount: 0 },
  { id: "JC-004", soId: "SO-2026-004", style: "Polo Shirt", currentPhase: "Washing", totalReceived: 400, goodQty: 400, badQty: 0, handoverStatus: "Accepted", pendingReplacementCount: 0 },
  { id: "JC-005", soId: "SO-2026-005", style: "Denim Jeans", currentPhase: "Finishing", totalReceived: 250, goodQty: 250, badQty: 0, handoverStatus: "Pending_Acceptance", pendingReplacementCount: 0 },
  { id: "JC-007", soId: "SO-2026-007", style: "Windbreaker Jacket", currentPhase: "Stitching", totalReceived: 250, goodQty: 247, badQty: 0, handoverStatus: "Accepted", pendingReplacementCount: 3 },
];

const ProductionContext = createContext<ProductionContextType | undefined>(undefined);

export function ProductionProvider({ children }: { children: React.ReactNode }) {
  const [jobCards, setJobCards] = useState<JobCard[]>(initialMockCards);

  const updateJobCard = (id: string, updates: Partial<JobCard>) => {
    setJobCards(prev => prev.map(card => card.id === id ? { ...card, ...updates } : card));
  };

  const addJobCard = (card: JobCard) => {
    setJobCards(prev => [card, ...prev]);
  };

  return (
    <ProductionContext.Provider value={{ jobCards, updateJobCard, addJobCard }}>
      {children}
    </ProductionContext.Provider>
  );
}

export function useProduction() {
  const context = useContext(ProductionContext);
  if (!context) {
    throw new Error("useProduction must be used within a ProductionProvider");
  }
  return context;
}
