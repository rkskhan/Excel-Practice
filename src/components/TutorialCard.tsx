import React, { useState } from 'react';
import { TopicTutorial, TutorialStep } from '../types/excel';
import {
  BookOpen,
  Check,
  Copy,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Terminal,
  FileCode2,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface TutorialCardProps {
  tutorial: TopicTutorial;
  onCopyFormula: (formula: string, label: string) => void;
}

export const TutorialCard: React.FC<TutorialCardProps> = ({ tutorial, onCopyFormula }) => {
  const [expandedStep, setExpandedStep] = useState<number>(2); // Default open step 2 (formula step)
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  const handleCopy = (code: string, label: string) => {
    onCopyFormula(code, label);
    setCopiedFormula(code);
    setTimeout(() => setCopiedFormula(null), 2500);
  };

  const toggleStep = (stepNumber: number) => {
    setExpandedStep((prev) => (prev === stepNumber ? -1 : stepNumber));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 mb-8 transition-colors">
      {/* Tutorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <BookOpen className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              {tutorial.badge}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-600">•</span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Step-by-Step Procedure</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{tutorial.title}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{tutorial.subtitle}</p>
        </div>

        {/* Objective Pill */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 sm:max-w-md">
          <div className="text-[11px] uppercase tracking-wider font-bold text-emerald-800 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Practice Objective</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {tutorial.objective}
          </p>
        </div>
      </div>

      {/* Accordion Steps */}
      <div className="space-y-3">
        {tutorial.steps.map((step) => {
          const isExpanded = expandedStep === step.stepNumber;

          return (
            <div
              key={step.stepNumber}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? 'border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40'
              }`}
            >
              {/* Step Header Accordion Toggle */}
              <button
                onClick={() => toggleStep(step.stepNumber)}
                className="w-full text-left p-4 flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isExpanded
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {step.stepNumber}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{step.title}</h3>
                    {step.excelAction && !isExpanded && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xl mt-0.5 font-mono">
                        {step.excelAction}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-slate-400 dark:text-slate-500 p-1">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Step Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-700 dark:text-slate-300 space-y-3.5 border-t border-slate-100 dark:border-slate-800 mt-1">
                  <p className="leading-relaxed text-slate-600 dark:text-slate-300 text-sm">{step.description}</p>

                  {/* Excel Action Ribbon / Shortcut */}
                  {step.excelAction && (
                    <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 rounded-lg p-2.5 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div className="font-mono text-xs text-slate-800 dark:text-slate-200 font-medium">
                        {step.excelAction}
                      </div>
                    </div>
                  )}

                  {/* Detailed Formula Block if present */}
                  {step.formula && (
                    <div className="bg-slate-900 dark:bg-slate-950 text-slate-100 rounded-xl p-3.5 border border-slate-800 shadow-sm">
                      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
                        <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                          <FileCode2 className="w-3.5 h-3.5" />
                          Formula Syntax
                        </span>
                        <button
                          onClick={() => handleCopy(step.formula!.code, 'Formula')}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          {copiedFormula === step.formula.code ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-300">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Formula</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="font-mono text-xs text-emerald-300 bg-slate-950/80 dark:bg-slate-900 p-2.5 rounded-lg overflow-x-auto border border-slate-800 mb-2.5 selection:bg-emerald-900">
                        {step.formula.code}
                      </div>

                      <p className="text-xs text-slate-300 mb-2.5">{step.formula.explanation}</p>

                      {/* Formula arguments breakdown */}
                      {step.formula.breakdown && (
                        <div className="space-y-1.5 pt-2 border-t border-slate-800">
                          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            Parameters Breakdown:
                          </div>
                          <div className="grid grid-cols-1 gap-1.5">
                            {step.formula.breakdown.map((item, idx) => (
                              <div
                                key={idx}
                                className="text-[11px] bg-slate-800/60 dark:bg-slate-800/80 p-1.5 rounded flex items-start gap-2"
                              >
                                <span className="font-mono font-semibold text-emerald-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 shrink-0">
                                  {item.part}
                                </span>
                                <span className="text-slate-300 leading-tight mt-0.5">{item.meaning}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pro-Tip Box */}
                  {step.proTip && (
                    <div className="bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl p-3 flex items-start gap-2.5 text-amber-900 dark:text-amber-200">
                      <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-xs leading-relaxed">
                        <strong className="font-semibold text-amber-950 dark:text-amber-100">Pro-Tip: </strong>
                        {step.proTip}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Alternative Formulas & Modern Tricks */}
      {tutorial.alternativeFormulas && tutorial.alternativeFormulas.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Alternative Formulas & Expert Techniques</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tutorial.alternativeFormulas.map((alt, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-800/70 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{alt.name}</span>
                    <button
                      onClick={() => handleCopy(alt.code, alt.name)}
                      className="text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 p-1 transition-colors cursor-pointer"
                      title="Copy formula"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="font-mono text-xs text-slate-800 dark:text-emerald-300 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700 mb-2 overflow-x-auto">
                    {alt.code}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{alt.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
