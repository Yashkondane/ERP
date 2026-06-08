import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { FileText, ArrowRight } from "lucide-react";

export default function MastersPage() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Master Data Management</h1>
                <p className="text-sm text-slate-500 mt-1">Manage global values, settings, and defaults used across the ERP.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/masters/patterns" className="group block">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-[#0453B8] hover:shadow-md transition-all flex flex-col h-full relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0453B8] flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#0453B8] transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Patterns</h3>
                  <p className="text-sm text-slate-500 mt-2 flex-1">
                    Manage pattern codes, brand names, and fit descriptions used for adding products.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
