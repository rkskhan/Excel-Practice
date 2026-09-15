import React, { useState } from 'react';
import {
  Calculator,
  BadgeDollarSign,
  Users,
  CalendarDays,
  Grid3X3,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';
import { HR_SALARY_GRADES, HR_MERIT_MATRIX } from '../../data/hrExcelData';

interface HRInteractiveCalculatorsProps {
  onCopyFormula?: (formula: string, label: string) => void;
}

export const HRInteractiveCalculators: React.FC<HRInteractiveCalculatorsProps> = ({
  onCopyFormula,
}) => {
  const [activeCalc, setActiveCalc] = useState<'compa' | 'turnover' | 'pto' | 'merit'>('compa');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string, id: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      if (onCopyFormula) onCopyFormula(code, label);
    }
  };

  // 1. Compa-Ratio State
  const [selectedGrade, setSelectedGrade] = useState('GR-12');
  const gradeObj = HR_SALARY_GRADES.find((g) => g.grade === selectedGrade) || HR_SALARY_GRADES[2];
  const [customSalary, setCustomSalary] = useState<number>(gradeObj.mid);

  const compaRatio = +(customSalary / gradeObj.mid).toFixed(3);
  const compaPercent = +(compaRatio * 100).toFixed(1);
  const rangePenetration = +(
    ((customSalary - gradeObj.min) / (gradeObj.max - gradeObj.min)) * 100
  ).toFixed(1);

  let compaStatus = {
    label: 'Market Competitive',
    color: 'text-emerald-700 bg-emerald-100 border-emerald-300',
    desc: 'Between 85% and 115% of market midpoint. Standard target range for proficient employees.',
  };
  if (compaRatio < 0.85) {
    compaStatus = {
      label: 'Under Market / Flight Risk',
      color: 'text-rose-700 bg-rose-100 border-rose-300',
      desc: 'Below 85% of midpoint. Employee is likely underpaid relative to current market rates.',
    };
  } else if (compaRatio > 1.15) {
    compaStatus = {
      label: 'Top of Grade / Over Midpoint',
      color: 'text-amber-800 bg-amber-100 border-amber-300',
      desc: 'Exceeds 115% of midpoint. Consider promotion to next grade level or lump-sum incentive rather than base increase.',
    };
  }

  // 2. Turnover Modeler State
  const [startHC, setStartHC] = useState<number>(250);
  const [newHires, setNewHires] = useState<number>(35);
  const [volTerms, setVolTerms] = useState<number>(20);
  const [involTerms, setInvolTerms] = useState<number>(8);

  const totalTerms = volTerms + involTerms;
  const endHC = Math.max(1, startHC + newHires - totalTerms);
  const avgHC = (startHC + endHC) / 2;
  const turnoverRate = +((totalTerms / avgHC) * 100).toFixed(1);
  const volTurnoverRate = +((volTerms / avgHC) * 100).toFixed(1);
  const retentionRate = +(100 - turnoverRate).toFixed(1);

  // 3. PTO Accrual State
  const [tenureYears, setTenureYears] = useState<number>(3);
  const [requestedDays, setRequestedDays] = useState<number>(8);
  const [holidaysInWindow, setHolidaysInWindow] = useState<number>(1);
  const [currentPtoBank, setCurrentPtoBank] = useState<number>(45);

  let annualDaysGranted = 10;
  if (tenureYears >= 10) annualDaysGranted = 25;
  else if (tenureYears >= 5) annualDaysGranted = 20;
  else if (tenureYears >= 2) annualDaysGranted = 15;

  const monthlyAccrualHrs = +((annualDaysGranted / 12) * 8).toFixed(2);
  const netDeductedHrs = Math.max(0, (requestedDays - holidaysInWindow) * 8);
  const newPtoBank = currentPtoBank - netDeductedHrs;

  // 4. Merit Matrix State
  const [selectedPerfRating, setSelectedPerfRating] = useState<number>(4);
  const [selectedQuartile, setSelectedQuartile] = useState<'q1' | 'q2' | 'q3' | 'q4'>('q2');
  const [meritBaseSalary, setMeritBaseSalary] = useState<number>(95000);

  const meritRow = HR_MERIT_MATRIX.find((m) => m.rating === selectedPerfRating) || HR_MERIT_MATRIX[1];
  const meritPercent =
    selectedQuartile === 'q1'
      ? meritRow.q1Increase
      : selectedQuartile === 'q2'
      ? meritRow.q2Increase
      : selectedQuartile === 'q3'
      ? meritRow.q3Increase
      : meritRow.q4Increase;

  const meritDollarIncrease = +(meritBaseSalary * (meritPercent / 100)).toFixed(0);
  const newMeritSalary = meritBaseSalary + meritDollarIncrease;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      {/* Header bar */}
      <div className="p-5 bg-slate-900 dark:bg-slate-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Calculator className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">
              Interactive HR Formula Simulators
            </h2>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
              Real-Time Math
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Test and visualize how HR formulas calculate numbers before writing them in your corporate Excel workbooks.
          </p>
        </div>

        {/* Calc Switcher Pills */}
        <div className="inline-flex p-1 bg-slate-800/90 dark:bg-slate-900 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveCalc('compa')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCalc === 'compa'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BadgeDollarSign className="w-3.5 h-3.5" />
            <span>Compa-Ratio</span>
          </button>
          <button
            onClick={() => setActiveCalc('turnover')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCalc === 'turnover'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Turnover &amp; Retention</span>
          </button>
          <button
            onClick={() => setActiveCalc('pto')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCalc === 'pto'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>PTO Accrual</span>
          </button>
          <button
            onClick={() => setActiveCalc('merit')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCalc === 'merit'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>Merit Matrix</span>
          </button>
        </div>
      </div>

      {/* Calculator Body */}
      <div className="p-6">
        {/* 1. Compa-Ratio & Range Penetration */}
        {activeCalc === 'compa' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Controls */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <BadgeDollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Salary Grade &amp; Base Pay Inputs</span>
                </h3>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Select Corporate Salary Grade
                  </label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => {
                      setSelectedGrade(e.target.value);
                      const g = HR_SALARY_GRADES.find((item) => item.grade === e.target.value);
                      if (g) setCustomSalary(g.mid);
                    }}
                    className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {HR_SALARY_GRADES.map((g) => (
                      <option key={g.grade} value={g.grade}>
                        {g.grade} — {g.levelTitle} (Midpoint: ${g.mid.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Grade Min</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">${gradeObj.min.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold block text-[11px]">Market Mid</span>
                    <span className="font-extrabold text-emerald-800 dark:text-emerald-300">${gradeObj.mid.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Grade Max</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">${gradeObj.max.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Current Employee Base Salary ($)
                    </label>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      ${customSalary.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={Math.round(gradeObj.min * 0.75)}
                    max={Math.round(gradeObj.max * 1.25)}
                    step={1000}
                    value={customSalary}
                    onChange={(e) => setCustomSalary(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                    <span>${Math.round(gradeObj.min * 0.75).toLocaleString()}</span>
                    <span>Mid: ${gradeObj.mid.toLocaleString()}</span>
                    <span>${Math.round(gradeObj.max * 1.25).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Output & Interpretation */}
              <div className="lg:col-span-6 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Compensation Metrics
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${compaStatus.color}`}>
                      {compaStatus.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Compa-Ratio</span>
                      <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                        {compaRatio} <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">({compaPercent}%)</span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                        Base ÷ Midpoint (${gradeObj.mid.toLocaleString()})
                      </span>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Range Penetration</span>
                      <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                        {rangePenetration}%
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                        Position between Min &amp; Max
                      </span>
                    </div>
                  </div>

                  {/* Range Bar */}
                  <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-3">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                      <span>Min (0%)</span>
                      <span className="text-emerald-700 dark:text-emerald-400">Mid (50%)</span>
                      <span>Max (100%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 relative overflow-hidden border border-slate-200 dark:border-slate-600">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          rangePenetration < 25
                            ? 'bg-rose-500'
                            : rangePenetration > 75
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(Math.max(rangePenetration, 0), 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {compaStatus.desc}
                    </p>
                  </div>
                </div>

                {/* Copyable Formula */}
                <div className="bg-slate-900 text-slate-100 p-3 rounded-lg flex items-center justify-between text-xs font-mono border border-slate-800">
                  <div className="truncate mr-2">
                    <span className="text-emerald-400 font-bold">=BaseSalary / </span>
                    <span className="text-slate-300">XLOOKUP(Grade, SalaryGrades!A:A, SalaryGrades!C:C)</span>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(
                        '=BaseSalary / XLOOKUP(Grade, SalaryGrades!A:A, SalaryGrades!C:C)',
                        'compa-calc-formula',
                        'Compa-Ratio Formula'
                      )
                    }
                    className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Copy Excel Formula"
                  >
                    {copiedId === 'compa-calc-formula' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Turnover & Retention Modeler */}
        {activeCalc === 'turnover' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Inputs */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Headcount &amp; Separation Census Numbers</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Start Headcount (Jan 1)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={startHC}
                      onChange={(e) => setStartHC(Math.max(1, Number(e.target.value)))}
                      className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      New Hires Added
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={newHires}
                      onChange={(e) => setNewHires(Math.max(0, Number(e.target.value)))}
                      className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Voluntary Exits (Resignations)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={volTerms}
                      onChange={(e) => setVolTerms(Math.max(0, Number(e.target.value)))}
                      className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Involuntary Exits (Layoffs/Dismissals)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={involTerms}
                      onChange={(e) => setInvolTerms(Math.max(0, Number(e.target.value)))}
                      className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>HR Rule of Thumb:</strong> Always divide total separations by{' '}
                    <em>Average Headcount</em> ({avgHC.toFixed(1)}), never by Starting ({startHC}) or Ending ({endHC}) alone!
                  </p>
                </div>
              </div>

              {/* Outputs */}
              <div className="lg:col-span-6 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Workforce Health Ratios
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full">
                      Ending HC: {endHC}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Total Turnover</span>
                      <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{turnoverRate}%</div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">{totalTerms} exits</span>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Voluntary Rate</span>
                      <div className="text-xl font-extrabold text-amber-700 dark:text-amber-400">{volTurnoverRate}%</div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">{volTerms} resignations</span>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Retention Rate</span>
                      <div className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400">{retentionRate}%</div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">Retained base</span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 text-slate-600 dark:text-slate-300 mb-3">
                    <div className="flex justify-between">
                      <span>Calculated Average Headcount:</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{avgHC.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Voluntary Share of Exits:</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {totalTerms > 0 ? ((volTerms / totalTerms) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 text-slate-100 p-3 rounded-lg flex items-center justify-between text-xs font-mono border border-slate-800">
                  <div className="truncate mr-2">
                    <span className="text-emerald-400 font-bold">=(TotalExits / </span>
                    <span className="text-slate-300">AVERAGE(StartHC, EndHC)) * 100</span>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(
                        '=(TotalExits / AVERAGE(StartHC, EndHC)) * 100',
                        'turnover-calc-formula',
                        'Turnover Rate Formula'
                      )
                    }
                    className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Copy Excel Formula"
                  >
                    {copiedId === 'turnover-calc-formula' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. PTO Accrual Simulator */}
        {activeCalc === 'pto' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Inputs */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Tenure Tier &amp; Leave Request Inputs</span>
                </h3>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Years of Completed Service</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">{tenureYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    step={1}
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                    <span>0 yrs (10 days)</span>
                    <span>2-4 yrs (15 days)</span>
                    <span>5-9 yrs (20 days)</span>
                    <span>10+ yrs (25 days)</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Current Bank (Hrs)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={currentPtoBank}
                      onChange={(e) => setCurrentPtoBank(Number(e.target.value))}
                      className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Leave Days
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={requestedDays}
                      onChange={(e) => setRequestedDays(Number(e.target.value))}
                      className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Holidays in Leave
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={requestedDays}
                      value={holidaysInWindow}
                      onChange={(e) => setHolidaysInWindow(Number(e.target.value))}
                      className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  Using <code>=NETWORKDAYS.INTL(Start, End, 1, Holidays)</code> automatically subtracts weekends and the {holidaysInWindow} statutory holiday(s), so the employee is not unfairly charged vacation hours for non-working days.
                </p>
              </div>

              {/* Outputs */}
              <div className="lg:col-span-6 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      PTO Balance Outcomes
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-full border border-emerald-300 dark:border-emerald-800">
                      Tier: {annualDaysGranted} Days / Year
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Monthly Accrual</span>
                      <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                        {monthlyAccrualHrs} <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">hrs/mo</span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                        ({annualDaysGranted} days ÷ 12) × 8 hrs
                      </span>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Net Balance After Leave</span>
                      <div className={`text-2xl font-extrabold ${newPtoBank < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                        {newPtoBank} <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">hrs</span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                        Deducted: {netDeductedHrs} hrs ({requestedDays - holidaysInWindow} work days)
                      </span>
                    </div>
                  </div>

                  {newPtoBank < 0 && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                      <span>Employee has exceeded their accrued balance! Requires supervisor approval or unpaid leave flag.</span>
                    </div>
                  )}
                </div>

                <div className="bg-slate-900 text-slate-100 p-3 rounded-lg flex items-center justify-between text-xs font-mono border border-slate-800">
                  <div className="truncate mr-2">
                    <span className="text-emerald-400 font-bold">=NETWORKDAYS.INTL(</span>
                    <span className="text-slate-300">StartDate, EndDate, 1, HolidaysRange) * 8</span>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(
                        '=NETWORKDAYS.INTL(StartDate, EndDate, 1, HolidaysRange) * 8',
                        'pto-calc-formula',
                        'Working Days Formula'
                      )
                    }
                    className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Copy Excel Formula"
                  >
                    {copiedId === 'pto-calc-formula' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Merit Matrix Simulator */}
        {activeCalc === 'merit' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Inputs */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Merit Review Parameters</span>
                </h3>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Employee Annual Appraisal Rating
                  </label>
                  <select
                    value={selectedPerfRating}
                    onChange={(e) => setSelectedPerfRating(Number(e.target.value))}
                    className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={5}>5 - Role Model / Top Performer</option>
                    <option value={4}>4 - Exceeds Expectations</option>
                    <option value={3}>3 - Solid Contributor / Meets</option>
                    <option value={2}>2 - Partially Meets / Needs Work</option>
                    <option value={1}>1 - Unsatisfactory / PIP</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Salary Range Quartile (Compa-Ratio Band)
                  </label>
                  <select
                    value={selectedQuartile}
                    onChange={(e) => setSelectedQuartile(e.target.value as any)}
                    className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="q1">Quartile 1: Under 85% of Midpoint (Underpaid)</option>
                    <option value="q2">Quartile 2: 85% - 100% of Midpoint (Standard Mid)</option>
                    <option value="q3">Quartile 3: 100% - 115% of Midpoint (Mature)</option>
                    <option value="q4">Quartile 4: Over 115% of Midpoint (Top of Band)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Current Base Salary ($)
                  </label>
                  <input
                    type="number"
                    step={1000}
                    value={meritBaseSalary}
                    onChange={(e) => setMeritBaseSalary(Number(e.target.value))}
                    className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Matrix visualization */}
              <div className="lg:col-span-7 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                    Corporate Merit Increase Grid (Recommended % Increases)
                  </span>

                  {/* 5x4 Grid */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-center border-collapse">
                      <thead>
                        <tr className="bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                          <th className="p-1.5 text-left text-[11px]">Rating</th>
                          <th className="p-1.5 text-[11px]">Q1 (&lt;85%)</th>
                          <th className="p-1.5 text-[11px]">Q2 (85-100%)</th>
                          <th className="p-1.5 text-[11px]">Q3 (100-115%)</th>
                          <th className="p-1.5 text-[11px]">Q4 (&gt;115%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {HR_MERIT_MATRIX.map((m) => {
                          const isRatingSelected = m.rating === selectedPerfRating;
                          return (
                            <tr key={m.rating} className="border-t border-slate-200 dark:border-slate-700">
                              <td className="p-1.5 text-left font-semibold text-slate-800 dark:text-slate-200">
                                {m.rating} — {m.ratingLabel.split(' - ')[1]}
                              </td>
                              <td
                                className={`p-1.5 ${
                                  isRatingSelected && selectedQuartile === 'q1'
                                    ? 'bg-emerald-600 text-white font-extrabold rounded'
                                    : 'text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {m.q1Increase}%
                              </td>
                              <td
                                className={`p-1.5 ${
                                  isRatingSelected && selectedQuartile === 'q2'
                                    ? 'bg-emerald-600 text-white font-extrabold rounded'
                                    : 'text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {m.q2Increase}%
                              </td>
                              <td
                                className={`p-1.5 ${
                                  isRatingSelected && selectedQuartile === 'q3'
                                    ? 'bg-emerald-600 text-white font-extrabold rounded'
                                    : 'text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {m.q3Increase}%
                              </td>
                              <td
                                className={`p-1.5 ${
                                  isRatingSelected && selectedQuartile === 'q4'
                                    ? 'bg-emerald-600 text-white font-extrabold rounded'
                                    : 'text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {m.q4Increase}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Recommended Increase</span>
                      <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400">
                        +{meritPercent}% (${meritDollarIncrease.toLocaleString()})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">New Annualized Salary</span>
                      <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                        ${newMeritSalary.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-slate-900 text-slate-100 p-3 rounded-lg flex items-center justify-between text-xs font-mono border border-slate-800">
                  <div className="truncate mr-2">
                    <span className="text-emerald-400 font-bold">=INDEX(MeritGrid, </span>
                    <span className="text-slate-300">MATCH(Rating, RatingsCol, 0), MATCH(Quartile, QuartilesRow, 0))</span>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(
                        '=INDEX(MeritGrid, MATCH(Rating, RatingsCol, 0), MATCH(Quartile, QuartilesRow, 0))',
                        'merit-calc-formula',
                        'Merit Matrix Lookup Formula'
                      )
                    }
                    className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Copy Excel Formula"
                  >
                    {copiedId === 'merit-calc-formula' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
