import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { PatternsCard } from "@/components/masters/patterns-card";

export default function PatternsPage() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 flex flex-col">
          <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col space-y-6">
            <div className="flex items-center gap-4">
              <Link href="/masters" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patterns Master</h1>
                <p className="text-sm text-slate-500 mt-1">Manage pattern codes, brands, and descriptions.</p>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <PatternsCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
