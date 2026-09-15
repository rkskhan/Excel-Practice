import React from 'react';
import {
  PracticeTopic,
  DatasetSize,
  TableSheet,
  DifficultyLevel,
} from '../types/excel';
import {
  Search,
  Table as TableIcon,
  SlidersHorizontal,
  Sparkles,
  RefreshCw,
  Download,
  Copy,
  Check,
  FileDown,
  Info,
  Dices,
  Gauge,
  CheckCircle2,
} from 'lucide-react';

interface ControlPanelProps {
  topic: PracticeTopic;
  onSelectTopic: (topic: PracticeTopic) => void;
  size: DatasetSize;
  onSelectSize: (size: DatasetSize) => void;
  difficulty: DifficultyLevel;
  onSelectDifficulty: (difficulty: DifficultyLevel) => void;
  includeBlanks: boolean;
  onToggleBlanks: (val: boolean) => void;
  clearLookupTarget: boolean;
  onToggleClearLookup: (val: boolean) => void;
  onGenerateNewData: () => void;
  onDownloadCsv: () => void;
  onDownloadAllCsvs: () => void;
  onCopyClipboard: () => void;
  isCopied: boolean;
  isGenerating: boolean;
  activeSheet: TableSheet;
  secondarySheets: TableSheet[];
  totalRows: number;
  seed?: number;
}

interface TopicOption {
  id: PracticeTopic;
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TOPICS: TopicOption[] = [
  {
    id: 'xlookup',
    title: 'XLOOKUP / VLOOKUP',
    badge: 'Lookups & Joins',
    description: 'Relational data with separate Product Master and Sales Rep tiers for exact & 2-way lookups.',
    icon: Search,
  },
  {
    id: 'pivot',
    title: 'Pivot Tables & Slicers',
    badge: 'Multi-Dimension',
    description: 'Hierarchical sales transactions with regions, categories, quarters, discounts, and margins.',
    icon: TableIcon,
  },
  {
    id: 'power_query',
    title: 'Power Query & ETL',
    badge: 'Unpivot & Clean',
    description: 'Wide cross-tab quarterly reports designed for practicing unpivot, merge, and clean transforms.',
    icon: SlidersHorizontal,
  },
  {
    id: 'conditional_formulas',
    title: 'Conditional Formatting',
    badge: 'Visual Rules',
    description: 'Quotas, attainment ratios, CSAT scores, and task counts for dynamic custom formula rules.',
    icon: Sparkles,
  },
];

const SIZES: { id: DatasetSize; label: string; rows: string }[] = [
  { id: 'small', label: 'Small', rows: '50 rows' },
  { id: 'medium', label: 'Medium', rows: '500 rows' },
  { id: 'large', label: 'Large', rows: '2,000 rows' },
];

const DIFFICULTIES: {
  id: DifficultyLevel;
  label: string;
  detail: string;
}[] = [
  {
    id: 'easy',
    label: 'Easy',
    detail: 'Clean round numbers & beginner formula challenges',
  },
  {
    id: 'medium',
    label: 'Medium',
    detail: 'Balanced variance & real corporate edge cases',
  },
  {
    id: 'hard',
    label: 'Hard',
    detail: 'Outliers, missing values & multi-step formula nesting',
  },
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  topic,
  onSelectTopic,
  size,
  onSelectSize,
  difficulty,
  onSelectDifficulty,
  includeBlanks,
  onToggleBlanks,
  clearLookupTarget,
  onToggleClearLookup,
  onGenerateNewData,
  onDownloadCsv,
  onDownloadAllCsvs,
  onCopyClipboard,
  isCopied,
  isGenerating,
  activeSheet,
  secondarySheets,
  totalRows,
  seed,
}) => {
  const hasMultipleSheets = secondarySheets.length > 0;

  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl shadow-2xs border border-slate-200/80 dark:border-slate-800 p-5 mb-6 transition-colors">
      {/* 1. Skill / Topic Selection */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            1. Select Practice Skill
          </h2>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Tailors schema, formulas &amp; assignments
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {TOPICS.map((item) => {
            const Icon = item.icon;
            const isSelected = topic === item.id;
            return (
              <button
                key={item.id}
                id={`topic-select-${item.id}`}
                onClick={() => onSelectTopic(item.id)}
                className={`relative p-3 rounded-lg text-left transition-all border cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#107C41] dark:border-emerald-600 bg-emerald-50/30 dark:bg-emerald-950/30 ring-1 ring-[#107C41]/30 dark:ring-emerald-500/40 shadow-2xs'
                    : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/60 bg-white dark:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-2">
                    <span
                      className={`w-6 h-6 rounded flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#107C41] dark:bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-emerald-100/80 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <h3
                    className={`text-xs font-semibold mb-1 ${
                      isSelected ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {isSelected && (
                  <div className="mt-2.5 pt-2 border-t border-emerald-100 dark:border-emerald-900/60 flex items-center gap-1 text-[10px] font-medium text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-[#107C41] dark:text-emerald-400" />
                    <span>Active Topic</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Dataset Customization Controls */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3.5">
          {/* Dataset Size Picker */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                2. Dataset Size
              </label>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">Row volume</span>
            </div>
            <div className="inline-flex p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-lg border border-slate-200/70 dark:border-slate-700 w-full">
              {SIZES.map((s) => {
                const isSelected = size === s.id;
                return (
                  <button
                    key={s.id}
                    id={`size-select-${s.id}`}
                    onClick={() => onSelectSize(s.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold shadow-2xs border border-slate-200/60 dark:border-slate-700'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <span>{s.label}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                      ({s.rows})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Level Picker */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Gauge className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                <span>3. Challenge Difficulty</span>
              </label>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">Complexity</span>
            </div>
            <div className="inline-flex p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-lg border border-slate-200/70 dark:border-slate-700 w-full">
              {DIFFICULTIES.map((d) => {
                const isSelected = difficulty === d.id;
                return (
                  <button
                    key={d.id}
                    id={`difficulty-select-${d.id}`}
                    onClick={() => onSelectDifficulty(d.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold shadow-2xs border border-slate-200/60 dark:border-slate-700'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                    title={d.detail}
                  >
                    <span>{d.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Practice Options Toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {topic === 'xlookup' && (
              <>
                <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer select-none bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-700 px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-slate-700">
                  <input
                    type="checkbox"
                    checked={clearLookupTarget}
                    onChange={(e) => onToggleClearLookup(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                  />
                  <span>Blank Unit Price column</span>
                </label>

                <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer select-none bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-700 px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-slate-700">
                  <input
                    type="checkbox"
                    checked={includeBlanks}
                    onChange={(e) => onToggleBlanks(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                  />
                  <span>Include Unmatched IDs (IFERROR)</span>
                </label>
              </>
            )}

            {topic === 'power_query' && (
              <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer select-none bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-700 px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-slate-700">
                <input
                  type="checkbox"
                  checked={includeBlanks}
                  onChange={(e) => onToggleBlanks(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                />
                <span>Include Messy Whitespace (TRIM / CLEAN)</span>
              </label>
            )}

            {topic === 'conditional_formulas' && (
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>Calculated quotas, CSAT ratings &amp; overdue indicators included.</span>
              </div>
            )}

            {topic === 'pivot' && (
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>2-year calendar dates, quarters, product hierarchy &amp; profit margins.</span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
            {difficulty === 'easy' && 'Clean ranges, low variance.'}
            {difficulty === 'medium' && 'Corporate standard distribution.'}
            {difficulty === 'hard' && 'Outliers & nested formulas.'}
          </div>
        </div>
      </div>

      {/* 3. Primary Action Buttons */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Generate New Data Button */}
        <div className="flex items-center gap-2">
          <button
            id="btn-generate-new-data"
            onClick={onGenerateNewData}
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 text-white text-xs font-medium rounded-lg shadow-2xs border border-transparent dark:border-slate-700 transition-all cursor-pointer disabled:opacity-60"
            title="Randomize data and assignments"
          >
            <RefreshCw className={`w-3 h-3 text-emerald-400 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Generate New Data</span>
          </button>

          {seed !== undefined && (
            <span
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-md"
              title="Seed number"
            >
              <Dices className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              <span>#{seed.toString(36).toUpperCase()}</span>
            </span>
          )}
        </div>

        {/* Export / Download Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Copy Table Button */}
          <button
            id="btn-copy-clipboard"
            onClick={onCopyClipboard}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
            title="Copy as TSV for pasting into Excel"
          >
            {isCopied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                <span>Copy for Excel</span>
              </>
            )}
          </button>

          {/* Download as CSV Button */}
          <button
            id="btn-download-csv"
            onClick={onDownloadCsv}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#107C41] hover:bg-[#0d6535] active:scale-95 text-white text-xs font-medium rounded-lg shadow-2xs transition-all cursor-pointer"
            title={`Download ${activeSheet.name} as CSV`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
            <span className="text-[10px] text-emerald-100 font-normal opacity-90">
              ({totalRows} rows)
            </span>
          </button>

          {/* Download All CSVs if multi-sheet topic */}
          {hasMultipleSheets && (
            <button
              id="btn-download-all-csvs"
              onClick={onDownloadAllCsvs}
              className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Download all sheets as separate CSVs"
            >
              <FileDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              <span>All ({secondarySheets.length + 1})</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
