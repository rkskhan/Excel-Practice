import React from 'react';
import { FileSpreadsheet, Keyboard, HelpCircle, Sparkles, ExternalLink } from 'lucide-react';
import { PracticeTopic } from '../types/excel';

interface NavbarProps {
  currentTopic: PracticeTopic;
  onOpenShortcuts: () => void;
  onOpenImportGuide: () => void;
}

const TOPIC_LABELS: Record<PracticeTopic, string> = {
  xlookup: 'XLOOKUP / VLOOKUP',
  pivot: 'Pivot Tables & Slicers',
  power_query: 'Power Query & ETL',
  conditional_formulas: 'Conditional Formatting & Rules',
};

export const Navbar: React.FC<NavbarProps> = ({
  currentTopic,
  onOpenShortcuts,
  onOpenImportGuide,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-900/30 ring-1 ring-emerald-400/30">
            <FileSpreadsheet className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-100 tracking-tight">ExcelPractice<span className="text-emerald-400">Lab</span></span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Dynamic Mock Data
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Interactive Practice Datasets & Step-by-Step Excel Tutorials
            </p>
          </div>
        </div>

        {/* Right action items */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Active Topic Chip on larger screens */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400 font-medium">Topic:</span>
            <span className="font-semibold text-slate-200">{TOPIC_LABELS[currentTopic]}</span>
          </div>

          {/* Quick Guide: How to paste into Excel */}
          <button
            id="btn-nav-import-guide"
            onClick={onOpenImportGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors shadow-sm cursor-pointer"
            title="How to paste or import data in Microsoft Excel"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Excel Import Guide</span>
            <span className="sm:hidden">Guide</span>
          </button>

          {/* Keyboard Shortcuts button */}
          <button
            id="btn-nav-shortcuts"
            onClick={onOpenShortcuts}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors shadow-sm cursor-pointer"
            title="View Excel Keyboard Shortcuts"
          >
            <Keyboard className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Shortcuts</span>
          </button>
        </div>
      </div>
    </header>
  );
};
