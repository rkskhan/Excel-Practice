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

  const handleCopy = (code: string) => {
    onCopyFormula(code, 'Challenge Solution Formula');
    setCopiedFormula(code);
    setTimeout(() => setCopiedFormula(null), 2500);
  };

  // Calculate completion count
  const completedCount = Object.values(results).filter((r) => r === true).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900">
              <Trophy className="w-3.5 h-3.5 text-amber-700" />
              Hands-On Challenges
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-500">
              Computed directly from your current randomized data
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Solve These in Excel & Test Your Results
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Copy or download your dataset, write the formula or configure the tool in Excel, and verify your answer here.
          </p>
        </div>

        {/* Score indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500 font-medium">Progress:</span>
          <span className="text-xs font-bold text-emerald-700">
            {completedCount} of {challenges.length} solved
          </span>
          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden ml-1">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
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

          return (
            <div
              key={q.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all ${
                isSolved
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50/70'
              }`}
            >
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    Q{idx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                      {q.question}
                    </h3>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full self-start shrink-0 ${
                    q.difficulty === 'Beginner'
                      ? 'bg-emerald-100 text-emerald-800'
                      : q.difficulty === 'Intermediate'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {q.difficulty}
                </span>
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
                    className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-none transition-all ${
                      isSolved
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 font-medium'
                        : isFailed
                        ? 'border-rose-400 ring-2 ring-rose-400/20 text-rose-950'
                        : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-800'
                    }`}
                  />
                  {isSolved && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                  {isFailed && (
                    <XCircle className="w-4 h-4 text-rose-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>

                <button
                  onClick={() => checkAnswer(q)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
                >
                  Check Answer
                </button>

                <button
                  onClick={() => toggleReveal(q.id)}
                  className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-medium rounded-lg border border-slate-300 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                  title="Reveal the correct solution and formula"
                >
                  {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{isRevealed ? 'Hide Solution' : 'Reveal Solution'}</span>
                </button>
              </div>

              {/* Feedback messages */}
              {isSolved && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Correct! You mastered this challenge.</span>
                </div>
              )}

              {isFailed && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium mb-2">
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span>Not quite matched. Check your formula or cell references, or click "Reveal Solution" below.</span>
                </div>
              )}

              {/* Revealed Solution & Formula Box */}
              {isRevealed && (
                <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Expected Output:</span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {q.displayAnswer}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(q.excelFormula)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                    >
                      {copiedFormula === q.excelFormula ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Copied Formula</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Formula</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="font-mono text-xs text-slate-900 bg-slate-100 p-2.5 rounded-lg border border-slate-200 overflow-x-auto">
                    {q.excelFormula}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{q.explanation}</p>

                  {q.hint && (
                    <div className="text-[11px] text-slate-500 flex items-start gap-1.5 pt-1">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
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
