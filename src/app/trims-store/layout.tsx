import { Sidebar } from "@/components/layout/sidebar";

export default function TrimsStoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 overflow-hidden bg-white/50 relative">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50/20 to-transparent"></div>
        <div className="relative z-10 h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
