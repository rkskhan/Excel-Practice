import React, { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  Eye,
  Copy,
  Check,
  Table,
  Sparkles,
  Database,
  FileCheck,
  Dices,
  RotateCw,
  Layers,
  ShieldCheck
} from 'lucide-react';
import {
  HRSalesRecord,
  DatasetStats,
  ChallengeScenario,
  downloadDatasetAsXlsx,
  downloadDatasetAsCsv
} from '../../data/dashboardChallengeData';

interface DatasetDownloadCardProps {
  data: HRSalesRecord[];
  stats: DatasetStats;
  scenario: ChallengeScenario;
  onRandomize: () => void;
  isRandomizing?: boolean;
  onOpenPreview: () => void;
  onToast: (type: 'success' | 'info' | 'error', title: string, desc?: string) => void;
}

export const DatasetDownloadCard: React.FC<DatasetDownloadCardProps> = ({
  data,
  stats,
  scenario,
  onRandomize,
  isRandomizing = false,
  onOpenPreview,
  onToast
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadXlsx = () => {
    setIsDownloading(true);
    try {
      downloadDatasetAsXlsx(data, `HR_Sales_Dataset_${scenario.id}`);
      onToast(
        'success',
        'Excel Workbook (.xlsx) Downloaded',
        `HR_Sales_Dataset_${scenario.id}.xlsx has been saved to your downloads.`
      );
    } catch (err) {
      console.error(err);
      onToast('error', 'Download Failed', 'Could not generate .xlsx file.');
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  const handleDownloadCsv = () => {
    downloadDatasetAsCsv(data, `HR_Sales_Dataset_${scenario.id}`);
    onToast(
      'success',
      'CSV File Downloaded',
      `HR_Sales_Dataset_${scenario.id}.csv saved to downloads.`
    );
  };

  const handleCopyClipboard = () => {
    const headers = Object.keys(data[0]).join('\t');
    const rows = data.slice(0, 50).map((r) => Object.values(r).join('\t')).join('\n');
    navigator.clipboard.writeText(`${headers}\n${rows}`);
    setCopied(true);
    onToast(
      'info',
      'Copied First 50 Rows (TSV)',
      'You can paste directly into an empty Excel sheet with Ctrl + V.'
    );
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="dataset-card"
      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* Excel Green Accent Banner */}
      <div className="h-2 bg-gradient-to-r from-[#107C41] via-emerald-600 to-[#107C41]" />

      <div className="p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#107C41]/10 text-[#107C41] border border-[#107C41]/20 flex items-center justify-center shrink-0 shadow-2xs">
              <FileSpreadsheet className="w-7 h-7 text-[#107C41]" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#107C41]/15 text-[#107C41]">
                  Official Challenge Dataset
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  100% Unique • No Repeated Records
                </span>
                <span className="text-xs text-slate-400 font-mono font-medium">
                  ID: {scenario.id}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                HR &amp; Sales Raw Practice Dataset
              </h2>

              <p className="text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
                A rich, multi-department enterprise dataset containing <strong>{stats.totalRows.toLocaleString()} non-repeating employee profiles</strong>, regional performance numbers, sales revenues, base compensations, and hire dates across 2021-2024.
              </p>
            </div>
          </div>

          {/* Quick Stats Pill Group */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap lg:flex-nowrap shrink-0">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-center min-w-[80px]">
              <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Rows
              </div>
              <div className="text-base font-bold text-slate-900 font-mono">
                {stats.totalRows.toLocaleString()}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-center min-w-[80px]">
              <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Est. Revenue
              </div>
              <div className="text-base font-bold text-emerald-700 font-mono">
                ${(stats.totalRevenue / 1000000).toFixed(1)}M
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-center min-w-[80px]">
              <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Avg Salary
              </div>
              <div className="text-base font-bold text-slate-800 font-mono">
                ${stats.averageSalary.toLocaleString()}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-center min-w-[76px]">
              <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Format
              </div>
              <div className="text-base font-bold text-[#107C41] font-mono">.XLSX</div>
            </div>
          </div>
        </div>

        {/* Dataset Schema / Columns Breakdown */}
        <div className="py-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>Included Columns in tbl_HRSales (11 Non-Repeating Fields)</span>
            </div>
            <span className="text-slate-400 normal-case font-normal text-[11px]">
              Top Region: <strong className="text-slate-700 font-semibold">{stats.topRegion}</strong> (${(stats.topRegionRevenue / 1000000).toFixed(1)}M)
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { name: 'EmployeeID', type: 'Unique Key' },
              { name: 'FullName', type: 'Unique Name' },
              { name: 'Department', type: '6 Depts' },
              { name: 'JobTitle', type: 'Role Title' },
              { name: 'Region', type: '4 Regions' },
              { name: 'HireDate', type: '2021-2024' },
              { name: 'BaseSalary', type: 'Currency ($)' },
              { name: 'SalesRevenue', type: 'Currency ($)' },
              { name: 'Commission', type: 'Currency ($)' },
              { name: 'PerformanceRating', type: 'Exceeds / Meets' },
              { name: 'Education', type: 'Degree Level' }
            ].map((col) => (
              <span
                key={col.name}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-100/90 text-slate-700 border border-slate-200 font-mono"
                title={`${col.name}: ${col.type}`}
              >
                <span className="font-semibold text-slate-800">{col.name}</span>
                <span className="text-[10px] text-slate-400 font-sans">({col.type})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Primary Action Buttons Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-slate-100">
          <div className="flex items-center gap-3 flex-wrap">
            {/* LARGE INVITING DOWNLOAD BUTTON */}
            <button
              id="btn-download-challenge-xlsx"
              onClick={handleDownloadXlsx}
              disabled={isDownloading}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#107C41] hover:bg-[#0d6535] active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-[#107C41]/25 hover:shadow-lg hover:shadow-[#107C41]/35 transition-all duration-200 cursor-pointer disabled:opacity-75"
            >
              <Download className={`w-5 h-5 ${isDownloading ? 'animate-bounce' : ''}`} />
              <span>Download Raw Dataset (.xlsx)</span>
            </button>

            {/* PREVIEW BUTTON */}
            <button
              id="btn-preview-challenge-data"
              onClick={onOpenPreview}
              className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm border border-slate-300 hover:border-slate-400 shadow-2xs transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Preview Data Table</span>
            </button>

            {/* RANDOMIZE DATASET & SCENARIO BUTTON */}
            <button
              id="btn-randomize-dataset-scenario"
              onClick={onRandomize}
              disabled={isRandomizing}
              className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs sm:text-sm border border-amber-300/80 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
              title="Generate a completely new randomized scenario and non-repeating dataset"
            >
              <Dices className={`w-4 h-4 text-amber-700 ${isRandomizing ? 'animate-spin' : ''}`} />
              <span>Randomize Dataset &amp; Scenario</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Download as standard comma-separated values"
            >
              <FileCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Download .CSV</span>
            </button>

            <button
              onClick={handleCopyClipboard}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Copy sample rows to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied' : 'Copy TSV'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Micro Info Bar */}
      <div className="px-6 sm:px-8 py-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#107C41]" />
          <span>Includes clean column headers pre-formatted for Excel Table conversion (Ctrl + T)</span>
        </span>
        <span className="text-[11px] text-slate-400">
          Current Scenario: <strong className="text-slate-600">{scenario.themeTitle}</strong>
        </span>
      </div>
    </div>
  );
};
