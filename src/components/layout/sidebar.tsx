import { LayoutDashboard, FileText, Users, Box, ShoppingCart, BarChart3, Settings, ChevronDown, PlusSquare } from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  return (
    <div className="w-64 bg-[#0453B8] h-screen flex flex-col hide-scrollbar overflow-y-auto">
      {/* Logo Area */}
      <div className="p-6 pb-2">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white">
          <path d="M4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H7C7.55228 21 8 20.5523 8 20V4C8 3.44772 7.55228 3 7 3H4Z" fill="currentColor"/>
          <path d="M9 12.5L19 4.5C19.5 4.1 20.2 4.4 20.2 5V8.5L13 12.5L20.2 16.5V20C20.2 20.6 19.5 20.9 19 20.5L9 12.5Z" fill="currentColor"/>
        </svg>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/80 rounded-md hover:text-white hover:bg-white/10 transition-colors">
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>

        {/* Sales (Active Dropdown) */}
        <div className="relative pt-2 pb-1">
          {/* Active Glowing Highlight */}
          <div className="absolute left-[-16px] top-4 w-1 h-8 bg-blue-300 rounded-r-md shadow-[0_0_12px_rgba(147,197,253,0.8)]" />
          
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white bg-transparent rounded-md">
            <PlusSquare className="w-5 h-5" />
            Sales
            <ChevronDown className="w-4 h-4 ml-auto opacity-70" />
          </Link>
          
          <div className="pl-11 pr-2 py-1 space-y-1">
            <Link href="#" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#1a66c4] rounded-md">
              Orders
            </Link>
            <Link href="#" className="flex items-center px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-md transition-colors">
              Quotations
            </Link>
            <Link href="#" className="flex items-center px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-md transition-colors">
              Invoices
            </Link>
          </div>
        </div>

        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/80 rounded-md hover:text-white hover:bg-white/10 transition-colors">
          <Users className="w-5 h-5" />
          Customers
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/80 rounded-md hover:text-white hover:bg-white/10 transition-colors">
          <Box className="w-5 h-5" />
          Products
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/80 rounded-md hover:text-white hover:bg-white/10 transition-colors">
          <ShoppingCart className="w-5 h-5" />
          Inventory
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/80 rounded-md hover:text-white hover:bg-white/10 transition-colors">
          <FileText className="w-5 h-5" />
          Reports
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/80 rounded-md hover:text-white hover:bg-white/10 transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </Link>
      </nav>

      {/* User Profile */}
      <div className="p-6 mt-auto">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 bg-white text-[#0453B8] rounded-md flex items-center justify-center font-bold text-sm">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">Jayesh D.</span>
            <span className="text-xs text-blue-200/80">Admin</span>
          </div>
          <ChevronDown className="w-4 h-4 text-white/70 ml-auto" />
        </div>
      </div>
    </div>
  );
}
