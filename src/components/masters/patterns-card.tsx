"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { INITIAL_MASTER_PATTERNS, MasterPattern } from "@/data/mock-masters";
import { PatternDialog } from "./pattern-dialog";

export function PatternsCard() {
  const [patterns, setPatterns] = useState<MasterPattern[]>(INITIAL_MASTER_PATTERNS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPattern, setEditingPattern] = useState<MasterPattern | null>(null);

  const handleSave = (pattern: MasterPattern) => {
    if (editingPattern) {
      setPatterns(patterns.map(p => p.code === editingPattern.code ? pattern : p));
    } else {
      setPatterns([...patterns, pattern]);
    }
    setIsDialogOpen(false);
    setEditingPattern(null);
  };

  const handleDelete = (code: string) => {
    setPatterns(patterns.filter(p => p.code !== code));
  };

  const openEdit = (pattern: MasterPattern) => {
    setEditingPattern(pattern);
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingPattern(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Patterns Master</h2>
          <p className="text-xs text-slate-500 mt-1">Manage pattern codes, brands, and descriptions used across the application.</p>
        </div>
        <Button onClick={openCreate} className="h-9 px-4 bg-[#0453B8] hover:bg-[#0453B8]/90 text-white font-medium rounded-lg text-sm shadow-sm transition-all flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Pattern
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <TableRow>
              <TableHead className="w-[150px] font-semibold text-slate-600 px-6">Code</TableHead>
              <TableHead className="font-semibold text-slate-600">Brand Name</TableHead>
              <TableHead className="font-semibold text-slate-600">Description (Fit)</TableHead>
              <TableHead className="w-[120px] text-right font-semibold text-slate-600 px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patterns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                  No patterns found. Add your first pattern!
                </TableCell>
              </TableRow>
            ) : (
              patterns.map((pattern) => (
                <TableRow key={pattern.code} className="hover:bg-slate-50/50 group transition-colors">
                  <TableCell className="font-semibold text-slate-900 px-6 py-4">
                    {pattern.code}
                  </TableCell>
                  <TableCell className="font-medium text-slate-700 py-4">
                    {pattern.brand}
                  </TableCell>
                  <TableCell className="text-slate-600 py-4">
                    {pattern.fit}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-[#0453B8] hover:bg-blue-50" onClick={() => openEdit(pattern)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(pattern.code)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PatternDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        initialData={editingPattern} 
        onSave={handleSave} 
      />
    </div>
  );
}
