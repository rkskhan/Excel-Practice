import React, { useState } from 'react';
import {
  Grid3X3,
  Lock,
  FileCheck2,
  AlertOctagon,
  Sparkles,
  Users,
  Lightbulb,
  CheckCircle,
  Copy,
  Check,
} from 'lucide-react';

interface HRTalentMatrixSectionProps {
  onCopyFormula?: (formula: string, label: string) => void;
}

interface NineBoxCategory {
  boxNumber: number;
  title: string;
  category: string;
  perf: 'Low' | 'Medium' | 'High';
  pot: 'Low' | 'Medium' | 'High';
  targetShare: string;
  action: string;
  accentBg: string;
  badgeBg: string;
}

const NINE_BOX_CELLS: NineBoxCategory[] = [
  // Top row (High Potential)
  {
    boxNumber: 3,
    title: 'Enigmas / Rough Diamonds',
    category: 'High Potential, Low Performance',
    perf: 'Low',
    pot: 'High',
    targetShare: '~3-5%',
    action: 'Investigate root cause; new team or manager required.',
    accentBg: 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/70 text-amber-900 dark:text-amber-200',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200',
  },
  {
    boxNumber: 2,
    title: 'High Growth Potentials',
    category: 'High Potential, Medium Performance',
    perf: 'Medium',
    pot: 'High',
    targetShare: '~8-12%',
    action: 'Accelerate coaching and provide high-visibility stretch projects.',
    accentBg: 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/70 text-emerald-900 dark:text-emerald-200',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200',
  },
  {
    boxNumber: 1,
    title: 'Future Stars & Leaders',
    category: 'High Potential, High Performance',
    perf: 'High',
    pot: 'High',
    targetShare: '~5-10%',
    action: 'Executive succession candidate; fast-track promotion and retention grants.',
    accentBg: 'bg-emerald-100/80 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100 font-bold',
    badgeBg: 'bg-emerald-700 dark:bg-emerald-600 text-white',
  },
  // Middle row (Medium Potential)
  {
    boxNumber: 6,
    title: 'Dilemmas / Inconsistent',
    category: 'Medium Potential, Low Performance',
    perf: 'Low',
    pot: 'Medium',
    targetShare: '~5-8%',
    action: 'Specific 60-day performance goals or reassignment.',
    accentBg: 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/70 text-rose-900 dark:text-rose-200',
    badgeBg: 'bg-rose-100 dark:bg-rose-900/80 text-rose-800 dark:text-rose-200',
  },
  {
    boxNumber: 5,
    title: 'Core Contributors',
    category: 'Medium Potential, Medium Performance',
    perf: 'Medium',
    pot: 'Medium',
    targetShare: '~40-50%',
    action: 'Workforce backbone; recognize consistency and retain with merit increases.',
    accentBg: 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200',
    badgeBg: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
  },
  {
    boxNumber: 4,
    title: 'High Impact Performers',
    category: 'Medium Potential, High Performance',
    perf: 'High',
    pot: 'Medium',
    targetShare: '~15-20%',
    action: 'Reward with merit bonuses, mentor junior colleagues.',
    accentBg: 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/70 text-emerald-900 dark:text-emerald-200',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200',
  },
  // Bottom row (Low Potential)
  {
    boxNumber: 9,
    title: 'Risk / Action Required',
    category: 'Low Potential, Low Performance',
    perf: 'Low',
    pot: 'Low',
    targetShare: '~3-5%',
    action: 'Formal PIP (Performance Improvement Plan) or transition out.',
    accentBg: 'bg-rose-100/80 dark:bg-rose-950/50 border-rose-300 dark:border-rose-700 text-rose-950 dark:text-rose-100 font-bold',
    badgeBg: 'bg-rose-700 dark:bg-rose-600 text-white',
  },
  {
    boxNumber: 8,
    title: 'Effective Specialists',
    category: 'Low Potential, Medium Performance',
    perf: 'Medium',
    pot: 'Low',
    targetShare: '~10-15%',
    action: 'Valued in current role; do not force managerial promotions.',
    accentBg: 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200',
    badgeBg: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
  },
  {
    boxNumber: 7,
    title: 'Trusted Workhorses',
    category: 'Low Potential, High Performance',
    perf: 'High',
    pot: 'Low',
    targetShare: '~8-12%',
    action: 'Retain domain knowledge; keep happy and well-compensated.',
    accentBg: 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/70 text-amber-900 dark:text-amber-200',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200',
  },
];

export const HRTalentMatrixSection: React.FC<HRTalentMatrixSectionProps> = ({
  onCopyFormula,
}) => {
  const [selectedBox, setSelectedBox] = useState<NineBoxCategory>(NINE_BOX_CELLS[2]); // Default Box 1
  const [copiedFormula, setCopiedFormula] = useState(false);

  const nineBoxFormula =
    '=IFS(AND(Rating>=4, Potential="High"), "1. Star", AND(Rating=3, Potential="High"), "2. High Growth", AND(Rating<=2, Potential="High"), "3. Rough Diamond", AND(Rating>=4, Potential="Medium"), "4. High Impact", AND(Rating=3, Potential="Medium"), "5. Core Player", AND(Rating<=2, Potential="Medium"), "6. Dilemma", AND(Rating>=4, Potential="Low"), "7. Workhorse", AND(Rating=3, Potential="Low"), "8. Specialist", TRUE, "9. Action Required")';

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(nineBoxFormula);
      setCopiedFormula(true);
      setTimeout(() => setCopiedFormula(false), 2200);
      if (onCopyFormula) onCopyFormula(nineBoxFormula, '9-Box Talent Classification Formula');
    }
  };

  return (
    <div className="space-y-6">
      {/* 9-Box Grid Interactive Layout */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden p-6 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                <Grid3X3 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                9-Box Talent Review &amp; Calibration Grid
              </h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Executive Succession
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Click any quadrant below to view corporate calibration guidelines, headcount targets, and executive development strategies.
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border dark:border-slate-700 text-white rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
          >
            {copiedFormula ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied 9-Box Formula!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy 9-Box Excel Formula</span>
              </>
            )}
          </button>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="relative">
              {/* Y Axis Label */}
              <div className="text-center font-bold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Potential ↑ (High / Medium / Low)
              </div>

              {/* 3x3 Matrix Container */}
              <div className="grid grid-cols-3 gap-3">
                {NINE_BOX_CELLS.map((cell) => {
                  const isSelected = selectedBox.boxNumber === cell.boxNumber;
                  return (
                    <button
                      key={cell.boxNumber}
                      onClick={() => setSelectedBox(cell)}
                      className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer min-h-[110px] flex flex-col justify-between ${
                        isSelected
                          ? 'ring-2 ring-emerald-600 shadow-md scale-[1.02]'
                          : 'hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-xs'
                      } ${cell.accentBg}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold">Box {cell.boxNumber}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${cell.badgeBg}`}
                        >
                          {cell.targetShare}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-bold block leading-tight">{cell.title}</span>
                        <span className="text-[10px] opacity-80 block mt-0.5">{cell.category}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* X Axis Label */}
              <div className="text-center font-bold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-3">
                Performance → (Low / Medium / High)
              </div>
            </div>
          </div>

          {/* Quadrant Detail Panel */}
          <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Box {selectedBox.boxNumber} Profile
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${selectedBox.badgeBg}`}>
                  {selectedBox.targetShare} of Headcount
                </span>
              </div>

              <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mb-1">
                {selectedBox.title}
              </h4>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-3">
                {selectedBox.category}
              </span>

              <div className="space-y-3 text-xs">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">HR Action Plan:</span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    {selectedBox.action}
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Performance Rating:</span>
                    <strong className="text-slate-900 dark:text-slate-100">{selectedBox.perf}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Leadership Potential:</span>
                    <strong className="text-slate-900 dark:text-slate-100">{selectedBox.pot}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-[11px] text-emerald-900 dark:text-emerald-200">
              💡 <strong>Calibration Rule:</strong> During talent review sessions, ensure no more than 15% of the total department is placed into Box 1 &amp; 2 to prevent title/bonus inflation.
            </div>
          </div>
        </div>
      </div>

      {/* HR Data Best Practices & Security */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 transition-colors">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>HR Data Governance, PII Security &amp; Excel Traps</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 space-y-2">
            <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              1. PII &amp; Salary Masking
            </span>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Never circulate raw census sheets with full SSNs or executive salaries. Hide sensitive columns, apply password protection (`Review → Protect Sheet`), or use a masked ID column:
            </p>
            <code className="block bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-800 dark:text-slate-200">
              ="XXX-XX-" &amp; RIGHT(SSN, 4)
            </code>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 space-y-2">
            <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              2. Data Validation Lists
            </span>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Prevent typo fragmentation (e.g. "Eng", "eng", "Engineering") which destroys PivotTable aggregations. Apply Excel Data Validation (`Data → Data Validation → List`) to Department, Job Level, and Status columns.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 space-y-2">
            <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              3. HRIS Date Conversion
            </span>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              HRIS exports (Workday, BambooHR, ADP) frequently export dates as non-numeric text strings. Use Text-to-Columns or `=DATEVALUE(TRIM(A2))` to force them into true Excel serial dates before calculating tenure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
