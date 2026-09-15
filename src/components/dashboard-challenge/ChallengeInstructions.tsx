import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Keyboard,
  CheckSquare,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  Target,
  Briefcase,
  Compass,
  FileSpreadsheet
} from 'lucide-react';
import { ChallengeStep, ChallengeScenario } from '../../data/dashboardChallengeData';

interface ChallengeInstructionsProps {
  steps: ChallengeStep[];
  scenario?: ChallengeScenario;
  completedStepIds: number[];
  completedTaskIds: string[];
  onToggleStep: (stepId: number) => void;
  onToggleTask: (taskId: string) => void;
  onToast: (type: 'success' | 'info' | 'error', title: string, desc?: string) => void;
}

export const ChallengeInstructions: React.FC<ChallengeInstructionsProps> = ({
  steps,
  scenario,
  completedStepIds,
  completedTaskIds,
  onToggleStep,
  onToggleTask,
  onToast
}) => {
  const [expandedStepIds, setExpandedStepIds] = useState<number[]>([1, 2, 3, 4, 5]);
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  const toggleExpand = (stepId: number) => {
    setExpandedStepIds((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  const handleExpandAll = () => {
    setExpandedStepIds(steps.map((s) => s.id));
  };

  const handleCollapseAll = () => {
    setExpandedStepIds([]);
  };

  const handleCopyFormula = (formula: string, label: string) => {
    navigator.clipboard.writeText(formula);
    setCopiedFormula(formula);
    onToast('success', 'Formula Copied!', `${label}: ${formula}`);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  return (
    <section id="challenge-steps" className="py-6">
      {/* Dynamic Executive Mission Brief Card */}
      {scenario && (
        <div className="mb-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#107C41]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#107C41] text-white">
                  Active Mission Brief
                </span>
                <span className="font-mono text-xs text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
                  {scenario.id}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Randomized Targets for Current Run
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
              {scenario.themeTitle}
            </h3>

            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed mb-5">
              {scenario.objective}
            </p>

            {/* Strategic Focus Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-700/80 text-xs">
              <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700">
                <div className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider">
                  Strategic Focus Region
                </div>
                <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#107C41]" />
                  <span>{scenario.focusRegion}</span>
                </div>
              </div>

              <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700">
                <div className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider">
                  Audit Department
                </div>
                <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{scenario.focusDepartment}</span>
                </div>
              </div>

              <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700">
                <div className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider">
                  Target Filter Verification
                </div>
                <div className="text-sm font-bold text-amber-400 mt-0.5">
                  {scenario.focusTargetHeadcount} Staff • ${(scenario.focusTargetRevenue / 1000).toLocaleString()}k Rev
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#107C41]/15 text-[#107C41]">
              Curriculum Roadmap
            </span>
            <span className="text-xs text-slate-400 font-medium">• 5 Guided Milestones</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Step-by-Step Challenge Instructions
          </h2>

          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Follow this chronological blueprint to transform your raw data into an executive-ready business dashboard. The numbers in the instructions below match the exact figures in your downloaded dataset!
          </p>
        </div>

        {/* Global Expand/Collapse Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            onClick={handleExpandAll}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Expand All
          </button>
          <button
            onClick={handleCollapseAll}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Step Cards Vertical Sequence */}
      <div className="space-y-6">
        {steps.map((step) => {
          const isStepComplete = completedStepIds.includes(step.id);
          const isExpanded = expandedStepIds.includes(step.id);
          const stepTaskIds = step.tasks.map((t) => t.id);
          const completedTasksInStep = stepTaskIds.filter((id) =>
            completedTaskIds.includes(id)
          ).length;

          return (
            <div
              key={step.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                isStepComplete
                  ? 'border-emerald-200 shadow-2xs bg-emerald-50/10'
                  : 'border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              {/* Step Card Header / Banner */}
              <div
                className={`p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none transition-colors ${
                  isStepComplete ? 'bg-emerald-50/30' : 'bg-white hover:bg-slate-50/70'
                }`}
                onClick={() => toggleExpand(step.id)}
              >
                <div className="flex items-start sm:items-center gap-4">
                  {/* Step Number Circle / Toggle Complete */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStep(step.id);
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-transform active:scale-95 cursor-pointer ${
                      isStepComplete
                        ? 'bg-[#107C41] text-white shadow-sm shadow-[#107C41]/30'
                        : 'bg-slate-100 text-slate-700 border border-slate-300 hover:border-[#107C41] hover:text-[#107C41]'
                    }`}
                    title={isStepComplete ? 'Mark step as incomplete' : 'Mark step as complete'}
                  >
                    {isStepComplete ? (
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <span>0{step.id}</span>
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#107C41]">
                        Step {step.id}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {step.timeEstimate}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                          step.difficulty === 'Beginner'
                            ? 'bg-slate-100 text-slate-700'
                            : step.difficulty === 'Intermediate'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        }`}
                      >
                        {step.difficulty}
                      </span>
                    </div>

                    <h3
                      className={`text-lg sm:text-xl font-bold tracking-tight mt-0.5 ${
                        isStepComplete ? 'text-slate-800 line-through decoration-emerald-500/50' : 'text-slate-900'
                      }`}
                    >
                      {step.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      {step.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Micro Task Progress Pill */}
                  <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80">
                    {completedTasksInStep}/{step.tasks.length} sub-tasks
                  </span>

                  {/* Expand / Collapse Icon */}
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Step Expanded Content */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100">
                  {/* Overview description */}
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">
                    {step.description}
                  </p>

                  {/* Formula Snippets (Step 3 or specialized formula steps) */}
                  {step.formulaSnippets && step.formulaSnippets.length > 0 && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800">
                      <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Recommended Excel Formulas</span>
                      </div>

                      <div className="space-y-2">
                        {step.formulaSnippets.map((item) => (
                          <div
                            key={item.label}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60"
                          >
                            <div>
                              <div className="text-[11px] font-medium text-slate-400">
                                {item.label}
                              </div>
                              <code className="text-xs sm:text-sm font-mono text-emerald-300 font-semibold">
                                {item.formula}
                              </code>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleCopyFormula(item.formula, item.label)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors self-start sm:self-auto cursor-pointer"
                            >
                              {copiedFormula === item.formula ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actionable Sub-Tasks Checklist */}
                  <div className="mt-5">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-[#107C41]" />
                        <span>Action Checklist &amp; Implementation Details</span>
                      </span>
                      <span className="text-[11px] font-normal text-slate-400">
                        Click tasks to check off
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {step.tasks.map((task) => {
                        const isTaskDone = completedTaskIds.includes(task.id);
                        return (
                          <div
                            key={task.id}
                            onClick={() => onToggleTask(task.id)}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                              isTaskDone
                                ? 'bg-emerald-50/40 border-emerald-200/80 text-slate-700'
                                : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {isTaskDone ? (
                                <CheckCircle2 className="w-4 h-4 text-[#107C41]" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-400" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-xs sm:text-sm font-semibold ${
                                  isTaskDone ? 'text-slate-600 line-through decoration-emerald-600/40' : 'text-slate-900'
                                }`}
                              >
                                {task.text}
                              </p>
                              {task.detail && (
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                  {task.detail}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pro Tip & Keyboard Shortcuts Row */}
                  <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Pro Tip Box */}
                    <div className="md:col-span-8 p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#107C41] uppercase tracking-wider mb-1">
                        <Lightbulb className="w-4 h-4 text-[#107C41]" />
                        <span>Executive Pro Tip</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {step.proTip}
                      </p>
                    </div>

                    {/* Keyboard Shortcuts Box */}
                    <div className="md:col-span-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        <Keyboard className="w-3.5 h-3.5 text-slate-500" />
                        <span>Key Shortcuts</span>
                      </div>
                      <div className="space-y-1.5">
                        {step.excelShortcuts.map((sc) => (
                          <div
                            key={sc.key}
                            className="flex items-center justify-between text-xs gap-2"
                          >
                            <kbd className="px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-800 font-mono font-bold text-[10px] shadow-2xs">
                              {sc.key}
                            </kbd>
                            <span className="text-[11px] text-slate-500 truncate text-right">
                              {sc.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Expected Result Box */}
                  <div className="mt-4 p-3 rounded-lg bg-slate-100/70 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-600">
                    <Target className="w-4 h-4 text-[#107C41] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800 font-semibold">Verification Criteria: </strong>
                      <span>{step.expectedResult}</span>
                    </div>
                  </div>

                  {/* Step Completion Toggle Footer */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleStep(step.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isStepComplete
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                          : 'bg-[#107C41] hover:bg-[#0d6535] text-white shadow-sm shadow-[#107C41]/20'
                      }`}
                    >
                      {isStepComplete ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Step {step.id} Completed (Click to Undo)</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark Step {step.id} as Complete</span>
                        </>
                      )}
                    </button>

                    <span className="text-xs text-slate-400">
                      {isStepComplete
                        ? 'All requirements satisfied.'
                        : 'Complete all sub-tasks to finish this phase.'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
