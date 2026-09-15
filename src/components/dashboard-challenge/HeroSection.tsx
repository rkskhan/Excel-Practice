import React from 'react';
import {
  FileSpreadsheet,
  Clock,
  BarChart3,
  Award,
  Layers,
  Sparkles,
  ArrowDown,
  CheckCircle2,
  ChevronRight,
  Dices,
  ShieldCheck
} from 'lucide-react';
import { ChallengeScenario } from '../../data/dashboardChallengeData';

interface HeroSectionProps {
  completedStepsCount: number;
  totalSteps: number;
  scenario?: ChallengeScenario;
  onRandomize?: () => void;
  isRandomizing?: boolean;
  onScrollToDownload: () => void;
  onScrollToSteps: () => void;
  onScrollToPreview: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  completedStepsCount,
  totalSteps,
  scenario,
  onRandomize,
  isRandomizing = false,
  onScrollToDownload,
  onScrollToSteps,
  onScrollToPreview
}) => {
  const progressPercent = Math.round((completedStepsCount / totalSteps) * 100);

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200/80 pt-8 pb-12 sm:pt-12 sm:pb-16">
      {/* Subtle grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#107C41 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Modern SaaS Breadcrumb & Badges */}
        <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 font-medium">
            <span className="text-slate-400 hover:text-slate-600 transition-colors">Courses</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-400 hover:text-slate-600 transition-colors">
              Business Intelligence &amp; Analytics
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="px-2 py-0.5 rounded-md bg-[#107C41]/10 text-[#107C41] font-semibold">
              Hands-on Project
            </span>
            {scenario && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100/70 text-amber-900 border border-amber-200/80 font-mono text-[11px] font-semibold">
                Scenario: {scenario.id}
              </span>
            )}
          </div>

          {onRandomize && (
            <button
              onClick={onRandomize}
              disabled={isRandomizing}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer disabled:opacity-50"
              title="Generate a new randomized scenario and non-repeating dataset"
            >
              <Dices className={`w-3.5 h-3.5 text-amber-700 ${isRandomizing ? 'animate-spin' : ''}`} />
              <span>{isRandomizing ? 'Randomizing...' : 'New Random Scenario'}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold mb-4 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#107C41] animate-pulse" />
              <span>Real-World Business Project Challenge</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Zero Duplicate Records
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Master Business Dashboards in{' '}
              <span className="text-[#107C41] inline-block relative">
                Excel
                <span className="absolute bottom-1 left-0 w-full h-1 bg-[#107C41]/20 rounded-full" />
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              Build a fully interactive <strong className="text-slate-900 font-semibold">HR &amp; Sales dashboard</strong> from raw data.
              Convert 1,500+ unformatted records into executive KPI cards, 5 synchronized PivotTables, dynamic charts, and master slicers using real-world business intelligence techniques.
            </p>

            {/* Micro Skill Badges */}
            <div className="mt-6 flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100/80 text-slate-700 border border-slate-200">
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#107C41]" />
                tbl_HRSales (Tables)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100/80 text-slate-700 border border-slate-200">
                <Layers className="w-3.5 h-3.5 text-[#107C41]" />
                5 Linked PivotTables
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100/80 text-slate-700 border border-slate-200">
                <BarChart3 className="w-3.5 h-3.5 text-[#107C41]" />
                Pie, Column &amp; Line Charts
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100/80 text-slate-700 border border-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-[#107C41]" />
                Report Connections
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex items-center gap-3 flex-wrap">
              <button
                onClick={onScrollToDownload}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#107C41] hover:bg-[#0d6535] active:scale-[0.98] text-white text-sm font-bold shadow-sm shadow-[#107C41]/25 transition-all cursor-pointer"
              >
                <span>Download Raw Dataset</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={onScrollToSteps}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-300 shadow-2xs hover:border-slate-400 transition-all cursor-pointer"
              >
                <span>Step-by-Step Instructions</span>
              </button>

              <button
                onClick={onScrollToPreview}
                className="inline-flex items-center gap-1.5 px-4 py-3 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors cursor-pointer"
              >
                <span>See What You'll Build</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* SaaS Learning Meta Card */}
          <div className="lg:col-span-4">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                    Challenge Progress
                  </span>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">
                    {completedStepsCount} of {totalSteps} Steps Complete
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#107C41]/10 text-[#107C41] flex items-center justify-center font-extrabold text-sm">
                  {progressPercent}%
                </div>
              </div>

              {/* Progress Track */}
              <div className="mt-4">
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#107C41] to-emerald-500 transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Course Meta Specs */}
              <div className="mt-5 space-y-3 text-xs text-slate-600">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-200/60">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Clock className="w-4 h-4 text-slate-400" />
                    Estimated Duration
                  </span>
                  <span className="font-semibold text-slate-800">45 - 60 Minutes</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-200/60">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Award className="w-4 h-4 text-slate-400" />
                    Level
                  </span>
                  <span className="font-semibold px-2 py-0.5 rounded bg-emerald-100 text-[#107C41]">
                    Intermediate
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-200/60">
                  <span className="flex items-center gap-2 text-slate-500">
                    <FileSpreadsheet className="w-4 h-4 text-slate-400" />
                    Dataset Size
                  </span>
                  <span className="font-semibold text-slate-800">1,520 Rows • 11 Cols</span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="flex items-center gap-2 text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-slate-400" />
                    Target Compatibility
                  </span>
                  <span className="font-semibold text-slate-800">Excel 365, 2021, 2019</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
