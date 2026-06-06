import { Sidebar } from "@/components/layout/sidebar";

export default function SalesOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Left Sidebar */}
      <Sidebar />
      
      {/* Main App Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {children}
      </div>
    </div>
  );
}
