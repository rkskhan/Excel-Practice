import React, { useState } from 'react';
import {
  CheckCircle,
  Award,
  Sparkles,
  RotateCcw,
  Share2,
  Check,
  FileCheck2,
  Trophy,
  ArrowUp
} from 'lucide-react';

interface CompletionSectionProps {
  isCompleted: boolean;
  onToggleComplete: () => void;
  completedStepsCount: number;
  totalSteps: number;
  onResetAll: () => void;
  onScrollToTop: () => void;
  onToast: (type: 'success' | 'info' | 'error', title: string, desc?: string) => void;
}

export const CompletionSection: React.FC<CompletionSectionProps> = ({
  isCompleted,
  onToggleComplete,
  completedStepsCount,
  totalSteps,
  onResetAll,
  onScrollToTop,
  onToast
}) => {
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = () => {
    const text = `🏆 I just completed the Excel Business Dashboard Challenge! Built a 3-KPI Executive Dashboard with 5 PivotTables and synchronized Slicers using 1,500+ raw HR & Sales records.`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    onToast('success', 'Completion Summary Copied!', 'Ready to paste on LinkedIn or resume notes.');
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <section className="py-12 border-t border-slate-200">
      <div className="max-w-4xl mx-auto">
        <div
          className={`rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm ${
            isCompleted
              ? 'bg-gradient-to-b from-emerald-50/80 to-white border-emerald-300 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="p-6 sm:p-10 text-center flex flex-col items-center">
            {/* Icon Avatar */}
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 ${
                isCompleted
                  ? 'bg-[#107C41] text-white shadow-lg shadow-[#107C41]/30 scale-110'
                  : 'bg-slate-100 text-slate-400 border border-slate-200'
              }`}
            >
              {isCompleted ? (
                <Trophy className="w-8 h-8 text-white animate-in zoom-in-50" />
              ) : (
                <Award className="w-8 h-8" />
              )}
            </div>

            {/* Header Text */}
            <div className="mt-4 max-w-lg">
              <span className="text-xs font-bold uppercase tracking-wider text-[#107C41]">
                {isCompleted ? 'Challenge Accomplished!' : 'Milestone Verification'}
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                {isCompleted
                  ? 'Congratulations! You Mastered the Dashboard'
                  : 'Ready to Wrap Up Your Dashboard?'}
              </h3>

              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {isCompleted
                  ? 'You successfully built a dynamic, executive-ready HR & Sales dashboard with 5 PivotTables, KPI metric cards, and interconnected slicers in Microsoft Excel.'
                  : `You've checked off ${completedStepsCount} of ${totalSteps} milestone steps. Mark the project as complete once your Excel dashboard is assembled and fully interactive.`}
              </p>
            </div>

            {/* Completed Skills Breakdown Pills */}
            {isCompleted && (
              <div className="mt-6 flex items-center justify-center gap-2 flex-wrap max-w-xl">
                {[
                  'Excel Tables (tbl_HRSales)',
                  '5 Synchronized PivotTables',
                  'Dynamic KPI Formulas (=COUNTA, =SUM, =AVERAGE)',
                  'Donut, Column & Line Charts',
                  'Slicers & Report Connections',
                  'Gridlines Removal & SaaS Layout'
                ].map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-800 border border-emerald-200"
                  >
                    <Check className="w-3.5 h-3.5 text-[#107C41]" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Actions Bar */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
              {/* PRIMARY 'MARK AS COMPLETE' TOGGLE BUTTON */}
              <button
                type="button"
                onClick={onToggleComplete}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all duration-200 cursor-pointer active:scale-95 ${
                  isCompleted
                    ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'
                    : 'bg-[#107C41] hover:bg-[#0d6535] text-white shadow-[#107C41]/30 hover:shadow-lg hover:shadow-[#107C41]/40'
                }`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span>Completed! (Click to Mark Incomplete)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Mark as Complete</span>
                  </>
                )}
              </button>

              {isCompleted && (
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-2xs hover:border-slate-400 transition-colors cursor-pointer"
                >
                  {copiedShare ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copied Summary!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-slate-500" />
                      <span>Share Achievement</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={onScrollToTop}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Back to Top</span>
              </button>
            </div>

            {/* Micro Reset option */}
            <div className="mt-6 pt-4 border-t border-slate-100 w-full flex items-center justify-center text-xs text-slate-400">
              <button
                onClick={onResetAll}
                className="inline-flex items-center gap-1 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Challenge Progress</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
