import React, { useState } from 'react';
import {
  Users,
  BadgeDollarSign,
  CalendarDays,
  UserCheck,
  LineChart,
  ShieldCheck,
  Copy,
  Check,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { HR_USE_CATEGORIES, HRUseCategory } from '../../data/hrExcelData';

interface HRFormulaExplorerProps {
  onCopyFormula: (formula: string, label: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Users,
  BadgeDollarSign,
  CalendarDays,
  UserCheck,
  LineChart,
  ShieldCheck,
};

export const HRFormulaExplorer: React.FC<HRFormulaExplorerProps> = ({ onCopyFormula }) => {
  const [selectedCatId, setSelectedCatId] = useState<string>('headcount-turnover');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedCategory =
    HR_USE_CATEGORIES.find((c) => c.id === selectedCatId) || HR_USE_CATEGORIES[0];

  const handleCopy = (formula: string, id: string, name: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(formula);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2200);
      onCopyFormula(formula, name);
    }
  };

  return (
    <div className="space-y-6">
      {/* Pillar Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {HR_USE_CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.iconName] || Users;
          const isSelected = cat.id === selectedCatId;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-900/90 dark:bg-emerald-800 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected
                      ? 'bg-emerald-700/80 text-emerald-200'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                )}
              </div>
              <div>
                <span className="text-xs font-bold block leading-snug">{cat.title.split('&')[0]}</span>
                <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-slate-500 dark:text-slate-400'}`}>
                  {cat.keyFormulas.length} Formulas
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Category Detail Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        {/* Category Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-transparent dark:border-emerald-800">
                  Real-World HR Domain
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {selectedCategory.importance}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {selectedCategory.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed max-w-3xl">
                {selectedCategory.shortDesc}
              </p>
            </div>

            <div className="shrink-0 bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs max-w-sm text-xs">
              <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mb-1">
                <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                Executive Case Study
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                {selectedCategory.caseStudyScenario}
              </p>
            </div>
          </div>
        </div>

        {/* Formulas Breakdown */}
        <div className="p-6 space-y-6">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Essential Production Excel Formulas</span>
          </h4>

          <div className="space-y-5">
            {selectedCategory.keyFormulas.map((kf, idx) => (
              <div
                key={idx}
                className="bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                {/* Formula Header & Copy */}
                <div className="p-4 bg-white dark:bg-slate-800/90 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800 mr-2">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{kf.name}</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{kf.description}</p>
                  </div>

                  <button
                    onClick={() => handleCopy(kf.excelFormula, `f-${selectedCategory.id}-${idx}`, kf.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer shrink-0"
                  >
                    {copiedId === `f-${selectedCategory.id}-${idx}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Copied Formula!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Formula</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Formula Code Snippet */}
                <div className="p-4 space-y-4">
                  <div className="bg-slate-950 rounded-xl p-3.5 font-mono text-xs text-slate-100 overflow-x-auto border border-slate-800">
                    <span className="text-emerald-400 font-bold">{kf.excelFormula}</span>
                  </div>

                  {/* Syntax Breakdown Chips */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                      How Excel Evaluates This:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                      {kf.syntaxBreakdown.map((syn, sIdx) => (
                        <div
                          key={sIdx}
                          className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs"
                        >
                          <code className="font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded text-[11px] block truncate mb-1">
                            {syn.param}
                          </code>
                          <span className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed block">
                            {syn.meaning}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Example & Trap Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 rounded-lg p-3 text-emerald-950 dark:text-emerald-200">
                      <span className="font-bold flex items-center gap-1.5 mb-1 text-emerald-800 dark:text-emerald-300">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        Live Business Example
                      </span>
                      <p className="text-[11px] leading-relaxed text-emerald-900 dark:text-emerald-200/90">
                        {kf.realWorldExample}
                      </p>
                    </div>

                    <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-lg p-3 text-amber-950 dark:text-amber-200">
                      <span className="font-bold flex items-center gap-1.5 mb-1 text-amber-800 dark:text-amber-300">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        Common HR Audit Trap
                      </span>
                      <p className="text-[11px] leading-relaxed text-amber-900 dark:text-amber-200/90">
                        {kf.gotcha}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Best Practices Checkbox list */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2.5">
              HR Operations Standard Operating Procedures (SOPs)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {selectedCategory.bestPractices.map((bp, bIdx) => (
                <div
                  key={bIdx}
                  className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="leading-relaxed text-[11px]">{bp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
