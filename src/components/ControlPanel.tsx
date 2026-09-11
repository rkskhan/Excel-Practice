import React from 'react';
import {
  PracticeTopic,
  DatasetSize,
  TableSheet,
} from '../types/excel';
import {
  Search,
  Table as TableIcon,
  SlidersHorizontal,
  Sparkles,
  RefreshCw,
  Download,
  Copy,
  Layers,
  Check,
  CheckCircle2,
  FileDown,
  Info,
} from 'lucide-react';

interface ControlPanelProps {
  topic: PracticeTopic;
  onSelectTopic: (topic: PracticeTopic) => void;
  size: DatasetSize;
  onSelectSize: (size: DatasetSize) => void;
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
    description: 'Relational data with separate Product Master and Sales Rep tiers for mastering exact & 2-way lookups.',
    icon: Search,
  },
  {
    id: 'pivot',
    title: 'Pivot Tables',
    badge: 'Multi-Dimension',
    description: 'Hierarchical sales transactions with regions, categories, quarters, discounts, and margins for pivot analysis.',
    icon: TableIcon,
  },
  {
    id: 'power_query',
    title: 'Power Query',
    badge: 'ETL & Unpivot',
    description: 'Wide cross-tab quarterly store reports designed for practicing "Unpivot Other Columns" and merging tables.',
    icon: SlidersHorizontal,
  },
  {
    id: 'conditional_formulas',
    title: 'Conditional Formatting & Formulas',
    badge: 'Visual KPIs',
    description: 'Sales rep quotas, attainment ratios, CSAT scores, and task counts engineered for dynamic custom formula rules.',
    icon: Sparkles,
  },
];

const SIZES: { id: DatasetSize; label: string; rows: string; detail: string }[] = [
  { id: 'small', label: 'Small', rows: '~50 rows', detail: 'Instant preview & formula debug' },
  { id: 'medium', label: 'Medium', rows: '~500 rows', detail: 'Realistic department report' },
  { id: 'large', label: 'Large', rows: '~2,000 rows', detail: 'Stress test & deep pivot slicing' },
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  topic,
  onSelectTopic,
  size,
  onSelectSize,
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
}) => {
  const hasMultipleSheets = secondarySheets.length > 0;

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 mb-6">
      {/* 1. Feature / Topic Selection */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>1. Choose Excel Skill to Practice</span>
              <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                4 Specialized Datasets
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an area to tailor data structure, columns, challenges, and step-by-step guidance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TOPICS.map((item) => {
            const Icon = item.icon;
            const isSelected = topic === item.id;
            return (
              <button
                key={item.id}
                id={`topic-select-${item.id}`}
                onClick={() => onSelectTopic(item.id)}
                className={`relative p-3.5 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-emerald-200/70 text-emerald-900'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <h3
                    className={`text-sm font-bold leading-snug mb-1 ${
                      isSelected ? 'text-emerald-950' : 'text-slate-800'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {isSelected && (
                  <div className="mt-3 pt-2 border-t border-emerald-200/60 flex items-center gap-1.5 text-[11px] font-medium text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Active practice environment</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Dataset Size & Scenario Customization */}
      <div className="pt-4 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Dataset Size Picker */}
        <div className="flex-1">
          <label className="text-xs font-semibold text-slate-700 block mb-2">
            2. Dataset Size
          </label>
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80 w-full sm:w-auto">
            {SIZES.map((s) => {
              const isSelected = size === s.id;
              return (
                <button
                  key={s.id}
                  id={`size-select-${s.id}`}
                  onClick={() => onSelectSize(s.id)}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-emerald-900 font-semibold shadow-sm border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{s.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                      isSelected ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'bg-slate-200/80 text-slate-500'
                    }`}
                  >
                    {s.rows}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Practice Options Toggles */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {topic === 'xlookup' && (
            <>
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer select-none bg-slate-50 hover:bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200">
                <input
                  type="checkbox"
                  checked={clearLookupTarget}
                  onChange={(e) => onToggleClearLookup(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                />
                <span className="font-medium text-slate-800">Leave Unit Price Blank</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">Recommended</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer select-none bg-slate-50 hover:bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200">
                <input
                  type="checkbox"
                  checked={includeBlanks}
                  onChange={(e) => onToggleBlanks(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                />
                <span>Include Unmatched IDs (Practice IFERROR)</span>
              </label>
            </>
          )}

          {topic === 'power_query' && (
            <label className="flex items-center gap-2 text-slate-700 cursor-pointer select-none bg-slate-50 hover:bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                checked={includeBlanks}
                onChange={(e) => onToggleBlanks(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
              />
              <span>Include Messy Whitespace (Practice Trim/Clean)</span>
            </label>
          )}

          {topic === 'conditional_formulas' && (
            <div className="flex items-center gap-1.5 text-slate-500 text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Includes calculated quota attainment %, CSAT ratings & overdue tasks.</span>
            </div>
          )}

          {topic === 'pivot' && (
            <div className="flex items-center gap-1.5 text-slate-500 text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Full 2-year calendar dates, quarters, product hierarchy & profit calculations.</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Primary Action Buttons */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Generate New Data Button */}
        <div className="flex items-center gap-2">
          <button
            id="btn-generate-new-data"
            onClick={onGenerateNewData}
            disabled={isGenerating}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-70"
            title="Randomize and regenerate realistic new data values"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Generate New Data</span>
          </button>

          <span className="text-xs text-slate-400 hidden sm:inline">
            Randomized on every click
          </span>
        </div>

        {/* Export / Download Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Copy Table Button */}
          <button
            id="btn-copy-clipboard"
            onClick={onCopyClipboard}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 shadow-sm transition-all cursor-pointer"
            title="Copy as Tab-Separated Values for direct pasting into Microsoft Excel"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Table to Clipboard</span>
              </>
            )}
          </button>

          {/* Prominent Download as CSV Button */}
          <button
            id="btn-download-csv"
            onClick={onDownloadCsv}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 active:scale-[0.98] text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
            title={`Download ${activeSheet.name} as a real, working CSV file`}
          >
            <Download className="w-4 h-4 text-white" />
            <span>Download as CSV</span>
            <span className="text-[11px] bg-emerald-700/70 px-1.5 py-0.5 rounded text-emerald-100 font-normal">
              {totalRows} rows
            </span>
          </button>

          {/* Download All CSVs if multi-sheet topic */}
          {hasMultipleSheets && (
            <button
              id="btn-download-all-csvs"
              onClick={onDownloadAllCsvs}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl border border-slate-200 transition-colors cursor-pointer"
              title="Download all master and secondary dimension tables as separate CSVs"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Download All Sheets ({secondarySheets.length + 1})</span>
              <span className="md:hidden">All ({secondarySheets.length + 1})</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
