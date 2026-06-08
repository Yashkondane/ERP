"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { FileText, ChevronDown, PlusSquare, ChevronLeft, ChevronRight, Users, Database } from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();

  const isSalesActive = pathname.startsWith("/sales-orders");
  const isFabricActive = pathname.startsWith("/fabric-purchases");
  const isTrimsActive = pathname.startsWith("/trims-purchases");
  const isSuppliersActive = pathname.startsWith("/suppliers");
  const isMastersActive = pathname.startsWith("/masters");

  return (
    <div className={`relative ${isExpanded ? "w-64" : "w-[72px]"} bg-[#0453B8] h-screen flex flex-col transition-all duration-300 ease-in-out shrink-0 z-50`}>
      <div className="flex-1 flex flex-col hide-scrollbar overflow-y-auto overflow-x-hidden">
        {/* Logo Area */}
        <div className={`p-6 pb-2 flex items-center ${isExpanded ? "justify-start" : "justify-center px-0"}`}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white shrink-0">
            <path d="M4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H7C7.55228 21 8 20.5523 8 20V4C8 3.44772 7.55228 3 7 3H4Z" fill="currentColor"/>
            <path d="M9 12.5L19 4.5C19.5 4.1 20.2 4.4 20.2 5V8.5L13 12.5L20.2 16.5V20C20.2 20.6 19.5 20.9 19 20.5L9 12.5Z" fill="currentColor"/>
          </svg>
        </div>

        <nav className={`flex-1 py-4 space-y-1 ${isExpanded ? "px-4" : "px-2"}`}>
          {/* Sales Link */}
          <div className="relative">
            {isSalesActive && (
              <div className={`absolute ${isExpanded ? "left-[-16px]" : "left-[-8px]"} top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-300 rounded-r-md shadow-[0_0_12px_rgba(147,197,253,0.8)]`} />
            )}
            <Link
              href="/sales-orders"
              className={`flex items-center ${isExpanded ? "gap-3 px-3" : "justify-center px-0"} py-2.5 text-sm font-medium rounded-md transition-colors ${
                isSalesActive
                  ? "text-white bg-white/10"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <PlusSquare className="w-5 h-5 shrink-0" />
              {isExpanded && <span className="truncate">Sales</span>}
            </Link>
          </div>

          {/* Fabric PO Link */}
          <div className="relative">
            {isFabricActive && (
              <div className={`absolute ${isExpanded ? "left-[-16px]" : "left-[-8px]"} top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-300 rounded-r-md shadow-[0_0_12px_rgba(147,197,253,0.8)]`} />
            )}
            <Link
              href="/fabric-purchases"
              className={`flex items-center ${isExpanded ? "gap-3 px-3" : "justify-center px-0"} py-2.5 text-sm font-medium rounded-md transition-colors ${
                isFabricActive
                  ? "text-white bg-white/10"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <FileText className="w-5 h-5 shrink-0" />
              {isExpanded && <span className="truncate">Fabric PO</span>}
            </Link>
          </div>

          {/* Trims PO Link */}
          <div className="relative">
            {isTrimsActive && (
              <div className={`absolute ${isExpanded ? "left-[-16px]" : "left-[-8px]"} top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-300 rounded-r-md shadow-[0_0_12px_rgba(147,197,253,0.8)]`} />
            )}
            <Link
              href="/trims-purchases"
              className={`flex items-center ${isExpanded ? "gap-3 px-3" : "justify-center px-0"} py-2.5 text-sm font-medium rounded-md transition-colors ${
                isTrimsActive
                  ? "text-white bg-white/10"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <FileText className="w-5 h-5 shrink-0" />
              {isExpanded && <span className="truncate">Trims PO</span>}
            </Link>
          </div>

          {/* Suppliers Link */}
          <div className="relative">
            {isSuppliersActive && (
              <div className={`absolute ${isExpanded ? "left-[-16px]" : "left-[-8px]"} top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-300 rounded-r-md shadow-[0_0_12px_rgba(147,197,253,0.8)]`} />
            )}
            <Link
              href="/suppliers"
              className={`flex items-center ${isExpanded ? "gap-3 px-3" : "justify-center px-0"} py-2.5 text-sm font-medium rounded-md transition-colors ${
                isSuppliersActive
                  ? "text-white bg-white/10"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Users className="w-5 h-5 shrink-0" />
              {isExpanded && <span className="truncate">Suppliers</span>}
            </Link>
          </div>

          {/* Masters Link */}
          <div className="relative">
            {isMastersActive && (
              <div className={`absolute ${isExpanded ? "left-[-16px]" : "left-[-8px]"} top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-300 rounded-r-md shadow-[0_0_12px_rgba(147,197,253,0.8)]`} />
            )}
            <Link
              href="/masters"
              className={`flex items-center ${isExpanded ? "gap-3 px-3" : "justify-center px-0"} py-2.5 text-sm font-medium rounded-md transition-colors ${
                isMastersActive
                  ? "text-white bg-white/10"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Database className="w-5 h-5 shrink-0" />
              {isExpanded && <span className="truncate">Masters</span>}
            </Link>
          </div>
        </nav>

        {/* User Profile */}
        <div className={`p-6 mt-auto ${isExpanded ? "" : "px-0 flex justify-center"}`}>
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 shrink-0 bg-white text-[#0453B8] rounded-md flex items-center justify-center font-bold text-sm">
              JD
            </div>
            {isExpanded && (
              <>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-white truncate">Jayesh D.</span>
                  <span className="text-xs text-blue-200/80 truncate">Admin</span>
                </div>
                <ChevronDown className="w-4 h-4 text-white/70 ml-auto shrink-0" />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-white border border-slate-200 rounded-sm shadow-sm flex items-center justify-center z-50 text-slate-500 hover:text-slate-700"
      >
        {isExpanded ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
