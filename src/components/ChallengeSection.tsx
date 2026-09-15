import React, { useState } from 'react';
import { ChallengeQuestion } from '../types/excel';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Eye,
  EyeOff,
  Copy,
  Check,
  Sparkles,
  ChevronRight,
  Calculator,
} from 'lucide-react';

interface ChallengeSectionProps {
  challenges: ChallengeQuestion[];
  onCopyFormula: (formula: string, label: string) => void;
}

export const ChallengeSection: React.FC<ChallengeSectionProps> = ({
  challenges,
  onCopyFormula,
}) => {
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean | null>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  const handleInputChange = (id: string, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [id]: value }));
    // Reset check state on edit
    if (results[id] !== undefined) {
      setResults((prev) => ({ ...prev, [id]: null }));
    }
  };

  const checkAnswer = (challenge: ChallengeQuestion) => {
    const rawInput = (userAnswers[challenge.id] || '').trim().toLowerCase();
    if (!rawInput) return;

    // Clean common symbols for numerical comparison: $, commas, %, spaces
    const cleanInput = rawInput.replace(/[\$,%\s]/g, '');
    const cleanExpected = String(challenge.expectedAnswer).trim().toLowerCase().replace(/[\$,%\s]/g, '');

    const isMatch =
      cleanInput === cleanExpected ||
      cleanInput === challenge.displayAnswer.toLowerCase().replace(/[\$,%\s]/g, '') ||
      rawInput === String(challenge.expectedAnswer).toLowerCase();

    setResults((prev) => ({ ...prev, [challenge.id]: isMatch }));
    if (isMatch) {
      setRevealedSolutions((prev) => ({ ...prev, [challenge.id]: true }));
    }
  };

  const toggleReveal = (id: string) => {
    setRevealedSolutions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (code: string, label: string = 'Challenge Solution Formula') => {
    onCopyFormula(code, label);
    setCopiedFormula(code);
    setTimeout(() => setCopiedFormula(null), 2500);
  };

  // Calculate completion count
  const completedCount = Object.values(results).filter((r) => r === true).length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 mb-8 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <Trophy className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              Hands-On Challenges
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Computed directly from your current randomized data
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Solve These in Excel &amp; Test Your Results
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Copy or download your dataset, write the formula or configure the tool in Excel, and verify your answer here. Click any copy icon to quickly grab the formula solution.
          </p>
        </div>

        {/* Score indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Progress:</span>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
            {completedCount} of {challenges.length} solved
          </span>
          <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ml-1">
            <div
              className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-300"
              style={{ width: `${(completedCount / Math.max(1, challenges.length)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {challenges.map((q, idx) => {
          const isSolved = results[q.id] === true;
          const isFailed = results[q.id] === false;
          const isRevealed = revealedSolutions[q.id];
          const isThisCopied = copiedFormula === q.excelFormula;

          return (
            <div
              key={q.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all ${
                isSolved
                  ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/20 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 hover:bg-slate-50/70 dark:hover:bg-slate-800/60'
              }`}
            >
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    Q{idx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                      {q.question}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start shrink-0">
                  {/* Quick-access clickable copy icon for formula solution */}
                  <button
                    type="button"
                    onClick={() => handleCopy(q.excelFormula, `Q${idx + 1} Solution Formula`)}
                    className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
                    title={`Quick-copy formula solution: ${q.excelFormula}`}
                    aria-label={`Copy formula for question ${idx + 1}`}
                  >
                    {isThisCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                        <span className="hidden sm:inline">Copy Formula</span>
                        <span className="sm:hidden">Copy</span>
                      </>
                    )}
                  </button>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      q.difficulty === 'Beginner'
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : q.difficulty === 'Intermediate'
                        ? 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                </div>
              </div>

              {/* Interactive Input & Check Area */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 mb-3">
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={userAnswers[q.id] || ''}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') checkAnswer(q);
                    }}
                    placeholder="Enter your answer from Excel..."
                    className={`w-full px-3 py-2 text-xs rounded-lg border bg-white dark:bg-slate-800 focus:outline-none transition-all ${
                      isSolved
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 dark:text-emerald-300 font-medium'
                        : isFailed
                        ? 'border-rose-400 dark:border-rose-500 ring-2 ring-rose-400/20 text-rose-950 dark:text-rose-300'
                        : 'border-slate-300 dark:border-slate-700 focus:border-emerald-600 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500'
                    }`}
                  />
                  {isSolved && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                  {isFailed && (
                    <XCircle className="w-4 h-4 text-rose-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>

                <button
                  onClick={() => checkAnswer(q)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
                >
                  Check Answer
                </button>

                <button
                  onClick={() => toggleReveal(q.id)}
                  className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                  title="Reveal the correct solution and formula"
                >
                  {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{isRevealed ? 'Hide Solution' : 'Reveal Solution'}</span>
                </button>
              </div>

              {/* Feedback messages */}
              {isSolved && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Correct! You mastered this challenge.</span>
                </div>
              )}

              {isFailed && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium mb-2">
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span>Not quite matched. Check your formula or cell references, or click "Reveal Solution" below.</span>
                </div>
              )}

              {/* Revealed Solution & Formula Box */}
              {isRevealed && (
                <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-700 space-y-2.5 bg-white dark:bg-slate-800/90 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Expected Output:</span>
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        {q.displayAnswer}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(q.excelFormula, `Q${idx + 1} Solution Formula`)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600 transition-colors cursor-pointer"
                    >
                      {isThisCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Copied Formula</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Formula</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Formula Code Box with Clickable Copy Icon inside */}
                  <div className="relative group font-mono text-xs text-slate-900 dark:text-emerald-300 bg-slate-100 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 overflow-hidden">
                    <span className="overflow-x-auto select-all pr-2 font-semibold">
                      {q.excelFormula}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopy(q.excelFormula, `Q${idx + 1} Formula`)}
                      className="shrink-0 p-1.5 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
                      title="Click to copy formula to clipboard"
                      aria-label="Copy formula"
                    >
                      {isThisCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{q.explanation}</p>

                  {q.hint && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5 pt-1">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                      <span>{q.hint}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
