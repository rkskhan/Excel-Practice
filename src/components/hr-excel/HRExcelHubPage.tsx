import React, { useState } from 'react';
import {
  Users,
  BadgeDollarSign,
  Calculator,
  Grid3X3,
  FileSpreadsheet,
  Download,
  BookOpen,
  Sparkles,
  ArrowLeft,
  Trophy,
  CheckCircle2,
  Lock,
  Layers,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { HRFormulaExplorer } from './HRFormulaExplorer';
import { HRInteractiveCalculators } from './HRInteractiveCalculators';
import { HRCensusTablePreview } from './HRCensusTablePreview';
import { HRTalentMatrixSection } from './HRTalentMatrixSection';
import { downloadHRExcelWorkbook, generateSampleHRCensus } from '../../data/hrExcelData';
import { Navbar } from '../Navbar';

interface HRExcelHubPageProps {
  onSwitchToGenerator: () => void;
  onSwitchToChallenge: () => void;
  onNotify: (type: 'success' | 'info' | 'error', title: string, message: string) => void;
}

export const HRExcelHubPage: React.FC<HRExcelHubPageProps> = ({
  onSwitchToGenerator,
  onSwitchToChallenge,
  onNotify,
}) => {
  const [activeTab, setActiveTab] = useState<'formulas' | 'calculators' | 'census' | 'ninebox'>('formulas');

  const handleDownloadWorkbook = () => {
    const data = generateSampleHRCensus();
    downloadHRExcelWorkbook(data);
    onNotify(
      'success',
      'HR Analytics Workbook Downloaded',
      'Saved Real_World_HR_Analytics_Workbook.xlsx with Census, Salary Bands, Merit Matrix, and Formula Cheat Sheet.'
    );
  };

  const handleCopyFormula = (code: string, label: string) => {
    onNotify('success', 'Formula Copied to Clipboard!', `${label}: ${code}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans flex flex-col antialiased transition-colors">
      {/* Minimalist Top Navbar */}
      <Navbar
        activeView="hr"
        onSelectView={(v) => {
          if (v === 'generator') onSwitchToGenerator();
          if (v === 'challenge') onSwitchToChallenge();
        }}
        onOpenShortcuts={() => {}}
        onOpenImportGuide={() => {}}
      />

      {/* Clean Minimalist Hero Banner */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 py-5 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800">
                  People Analytics &amp; Compensation
                </span>
                <span className="text-slate-400 dark:text-slate-500">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Real HR Workbook &amp; Formula Guide
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Real-World HR Excel Hub
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Turnover metrics, compa-ratios, merit increment matrices, PTO liabilities with NETWORKDAYS, 9-Box calibrations, and compliance audits.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleDownloadWorkbook}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#107C41] hover:bg-[#0d6535] rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download HR Workbook (.xlsx)</span>
              </button>
            </div>
          </div>

          {/* Sub-navigation tabs */}
          <div className="mt-5 flex items-center gap-1.5 border-b border-slate-200/80 dark:border-slate-800 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('formulas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'formulas'
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white font-semibold shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>HR Use Cases &amp; Formulas</span>
            </button>

            <button
              onClick={() => setActiveTab('calculators')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'calculators'
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white font-semibold shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Interactive Simulators</span>
            </button>

            <button
              onClick={() => setActiveTab('census')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'census'
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white font-semibold shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Employee Census Dataset</span>
            </button>

            <button
              onClick={() => setActiveTab('ninebox')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'ninebox'
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white font-semibold shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>9-Box Talent Matrix</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {activeTab === 'formulas' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  The 6 Essential Real-World HR Excel Domains
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click a pillar below to explore real executive formulas, syntax breakdowns, and common audit traps.
                </p>
              </div>
            </div>
            <HRFormulaExplorer onCopyFormula={handleCopyFormula} />
          </div>
        )}

        {activeTab === 'calculators' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Live Mathematical Simulators for HR Metrics
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Model compa-ratios, annual turnover rates, PTO deductions, and merit salary increases in real-time.
                </p>
              </div>
            </div>
            <HRInteractiveCalculators onCopyFormula={handleCopyFormula} />
          </div>
        )}

        {activeTab === 'census' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Production-Ready HR Census Dataset
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Filter active and separated employees, examine salary grade alignment, and export directly to Excel.
                </p>
              </div>
            </div>
            <HRCensusTablePreview onNotify={onNotify} />
          </div>
        )}

        {activeTab === 'ninebox' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Talent Review Calibration &amp; Data Governance
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Calibrate talent against the executive 9-Box grid and apply standard operating procedures for PII privacy.
                </p>
              </div>
            </div>
            <HRTalentMatrixSection onCopyFormula={handleCopyFormula} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-xs text-slate-500 dark:text-slate-400 text-center transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Excel Practice Lab — Real-World HR Analytics &amp; People Operations Module</span>
          <div className="flex items-center gap-4">
            <button
              onClick={onSwitchToGenerator}
              className="hover:text-emerald-700 dark:hover:text-emerald-400 underline cursor-pointer"
            >
              Practice Data Generator
            </button>
            <button
              onClick={onSwitchToChallenge}
              className="hover:text-emerald-700 dark:hover:text-emerald-400 underline cursor-pointer"
            >
              Dashboard Challenge
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
