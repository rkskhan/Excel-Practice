import React, { useState, useEffect, useMemo } from 'react';
import {
  generateHRSalesData,
  calculateDatasetStats,
  generateRandomScenario,
  generateChallengeSteps,
  HRSalesRecord,
  DatasetStats,
  ChallengeScenario,
  ChallengeStep,
  downloadDatasetAsXlsx,
  downloadDatasetAsCsv
} from '../../data/dashboardChallengeData';
import { HeroSection } from './HeroSection';
import { DatasetDownloadCard } from './DatasetDownloadCard';
import { ChallengeInstructions } from './ChallengeInstructions';
import { TargetOutputSection } from './TargetOutputSection';
import { CompletionSection } from './CompletionSection';
import { RawDataPreviewModal } from './RawDataPreviewModal';
import { ToastContainer, ToastMessage } from '../Toast';
import { Navbar } from '../Navbar';
import {
  FileSpreadsheet,
  Award,
  BookOpen,
  Keyboard,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Layers,
  HelpCircle,
  X,
  Dices
} from 'lucide-react';

interface ExcelDashboardChallengePageProps {
  onSwitchToGenerator?: () => void;
  onSwitchToHR?: () => void;
}

export const ExcelDashboardChallengePage: React.FC<ExcelDashboardChallengePageProps> = ({
  onSwitchToGenerator,
  onSwitchToHR,
}) => {
  // Fresh random seed generated every time the page loads
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 2147483640) + 1);
  const [isRandomizing, setIsRandomizing] = useState(false);

  // Generate the 1,520 rows dataset with strict non-repetition (unique IDs and full names)
  const rawData: HRSalesRecord[] = useMemo(() => generateHRSalesData(1520, seed), [seed]);

  // Compute dynamic stats from the generated data
  const stats: DatasetStats = useMemo(() => calculateDatasetStats(rawData), [rawData]);

  // Generate dynamic business scenario
  const scenario: ChallengeScenario = useMemo(
    () => generateRandomScenario(rawData, seed),
    [rawData, seed]
  );

  // Dynamic 5 challenge steps containing exact ground-truth values for this dataset
  const steps: ChallengeStep[] = useMemo(
    () => generateChallengeSteps(rawData, scenario),
    [rawData, scenario]
  );

  // Completion states with local persistence
  const [completedStepIds, setCompletedStepIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('excel_dashboard_completed_steps');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('excel_dashboard_completed_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isChallengeCompleted, setIsChallengeCompleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('excel_dashboard_is_completed') === 'true';
    } catch {
      return false;
    }
  });

  // UI Modals
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('excel_dashboard_completed_steps', JSON.stringify(completedStepIds));
    } catch (e) {
      console.error(e);
    }
  }, [completedStepIds]);

  useEffect(() => {
    try {
      localStorage.setItem('excel_dashboard_completed_tasks', JSON.stringify(completedTaskIds));
    } catch (e) {
      console.error(e);
    }
  }, [completedTaskIds]);

  useEffect(() => {
    try {
      localStorage.setItem('excel_dashboard_is_completed', isChallengeCompleted ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  }, [isChallengeCompleted]);

  // Toast notification helper
  const addToast = (type: 'success' | 'info' | 'error', title: string, description?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, description }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Randomize dataset and challenges handler
  const handleRandomize = () => {
    setIsRandomizing(true);
    const newSeed = Math.floor(Math.random() * 2147483640) + 1;
    setSeed(newSeed);

    // Reset task checkboxes for the new challenge targets
    setCompletedStepIds([]);
    setCompletedTaskIds([]);
    setIsChallengeCompleted(false);

    setTimeout(() => {
      setIsRandomizing(false);
      addToast(
        'success',
        'New Randomized Challenge Ready!',
        'Generated 1,520 unique employee records and updated all challenge target calculations.'
      );
    }, 350);
  };

  // Toggle Step Completion
  const handleToggleStep = (stepId: number) => {
    setCompletedStepIds((prev) => {
      const isCurrentlyComplete = prev.includes(stepId);
      const next = isCurrentlyComplete ? prev.filter((id) => id !== stepId) : [...prev, stepId];

      // If marking step as complete, also check off all its sub-tasks
      const targetStep = steps.find((s) => s.id === stepId);
      if (targetStep) {
        const stepTaskIds = targetStep.tasks.map((t) => t.id);
        if (!isCurrentlyComplete) {
          setCompletedTaskIds((taskPrev) => Array.from(new Set([...taskPrev, ...stepTaskIds])));
          addToast('success', `Step ${stepId} Completed!`, targetStep.title);
        } else {
          setCompletedTaskIds((taskPrev) => taskPrev.filter((id) => !stepTaskIds.includes(id)));
        }
      }

      // Check if all steps are done
      if (next.length === steps.length) {
        setIsChallengeCompleted(true);
      }

      return next;
    });
  };

  // Toggle Individual Task
  const handleToggleTask = (taskId: string) => {
    setCompletedTaskIds((prev) => {
      const next = prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId];

      // Check if all tasks in any step are complete to auto-mark that step
      steps.forEach((step) => {
        const stepTaskIds = step.tasks.map((t) => t.id);
        const allTasksDone = stepTaskIds.every((id) => next.includes(id));
        if (allTasksDone && !completedStepIds.includes(step.id)) {
          setCompletedStepIds((sPrev) => [...sPrev, step.id]);
          addToast('success', `Milestone ${step.id} Complete!`, step.title);
        }
      });

      return next;
    });
  };

  // Toggle Overall Completion
  const handleToggleComplete = () => {
    const nextState = !isChallengeCompleted;
    setIsChallengeCompleted(nextState);
    if (nextState) {
      setCompletedStepIds(steps.map((s) => s.id));
      const allTasks = steps.flatMap((s) => s.tasks.map((t) => t.id));
      setCompletedTaskIds(allTasks);
      addToast(
        'success',
        '🏆 Challenge Mastered!',
        'You have marked the Excel Business Dashboard Challenge as complete!'
      );
    } else {
      addToast('info', 'Challenge Reopened', 'You can continue editing and refining your tasks.');
    }
  };

  // Reset Progress
  const handleResetAll = () => {
    if (window.confirm('Reset all step checkmarks and completion status for this challenge?')) {
      setCompletedStepIds([]);
      setCompletedTaskIds([]);
      setIsChallengeCompleted(false);
      addToast('info', 'Progress Reset', 'All milestone checkboxes have been cleared.');
    }
  };

  // Smooth scroll helpers
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-[#107C41]/20 selection:text-[#107C41] transition-colors">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Minimalist Top Navbar */}
      <Navbar
        activeView="challenge"
        onSelectView={(v) => {
          if (v === 'generator' && onSwitchToGenerator) onSwitchToGenerator();
          if (v === 'hr' && onSwitchToHR) onSwitchToHR();
        }}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenImportGuide={() => setIsPreviewOpen(true)}
      />

      {/* Minimalist Context Sub-bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-2.5 transition-colors">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              Excel Track
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Challenge: {scenario.themeTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="header-btn-randomize"
              onClick={handleRandomize}
              disabled={isRandomizing}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-md transition-colors cursor-pointer disabled:opacity-50"
              title="Generate fresh challenge targets"
            >
              <Dices className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ${isRandomizing ? 'animate-spin' : ''}`} />
              <span>Randomize Targets</span>
            </button>

            <button
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-md transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Inspect Data</span>
            </button>

            <button
              onClick={() => downloadDatasetAsXlsx(rawData, `HR_Sales_Dataset_${scenario.id}`)}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-[#107C41] hover:bg-[#0d6535] rounded-md transition-colors cursor-pointer shadow-2xs"
            >
              <span>Download .xlsx</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <HeroSection
          completedStepsCount={completedStepIds.length}
          totalSteps={steps.length}
          scenario={scenario}
          onRandomize={handleRandomize}
          isRandomizing={isRandomizing}
          onScrollToDownload={() => scrollTo('dataset-card')}
          onScrollToSteps={() => scrollTo('challenge-steps')}
          onScrollToPreview={() => scrollTo('what-you-will-build')}
        />

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          {/* 2. DATASET DOWNLOAD CARD */}
          <DatasetDownloadCard
            data={rawData}
            stats={stats}
            scenario={scenario}
            onRandomize={handleRandomize}
            isRandomizing={isRandomizing}
            onOpenPreview={() => setIsPreviewOpen(true)}
            onToast={addToast}
          />

          {/* 3. STEP-BY-STEP CHALLENGE INSTRUCTIONS */}
          <ChallengeInstructions
            steps={steps}
            scenario={scenario}
            completedStepIds={completedStepIds}
            completedTaskIds={completedTaskIds}
            onToggleStep={handleToggleStep}
            onToggleTask={handleToggleTask}
            onToast={addToast}
          />

          {/* 4. WHAT YOU'LL BUILD (TARGET OUTPUT SECTION) */}
          <TargetOutputSection rawData={rawData} />

          {/* 5. INTERACTIVITY & COMPLETION SECTION */}
          <CompletionSection
            isCompleted={isChallengeCompleted}
            onToggleComplete={handleToggleComplete}
            completedStepsCount={completedStepIds.length}
            totalSteps={steps.length}
            onResetAll={handleResetAll}
            onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            onToast={addToast}
          />
        </div>
      </main>

      {/* Modern SaaS Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#107C41]" />
            <span className="font-semibold text-slate-800">
              Excel Business Dashboard Challenge
            </span>
            <span className="text-slate-400">•</span>
            <span>Scenario {scenario.id} • 100% Unique Dataset</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-slate-500 flex-wrap justify-center sm:justify-end">
            <span>
              Made by <strong className="text-slate-800 font-semibold">Rezaul Karim Sagor</strong>, Email:{' '}
              <a
                href="mailto:r.k.s.khan88@gmail.com"
                className="text-[#107C41] hover:underline font-medium"
              >
                r.k.s.khan88@gmail.com
              </a>
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>

      {/* Raw Data Preview Modal */}
      <RawDataPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        data={rawData}
      />

      {/* Quick Shortcuts Modal */}
      {isShortcutsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-[#107C41]" />
                <h3 className="text-base font-bold text-slate-900">
                  Essential Excel Keyboard Shortcuts
                </h3>
              </div>
              <button
                onClick={() => setIsShortcutsOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { key: 'Ctrl + T', label: 'Convert selected range to official Excel Table' },
                { key: 'Alt + N + V', label: 'Insert new PivotTable dialog' },
                { key: 'Alt + W + V + G', label: 'Remove / Toggle worksheet gridlines' },
                { key: 'Ctrl + Shift + $', label: 'Format cells as Currency ($)' },
                { key: 'Ctrl + Shift + #', label: 'Format cells as Short Date (YYYY-MM-DD)' },
                { key: 'Alt + F5', label: 'Refresh active PivotTable or chart' },
                { key: 'Ctrl + Alt + F5', label: 'Refresh ALL PivotTables in entire workbook' },
                { key: 'Alt + Drag', label: 'Snap chart or shape borders to cell gridlines' },
                { key: 'Ctrl + Click', label: 'Multi-select multiple slicer items' },
                { key: 'Alt + C', label: 'Clear active slicer filter selection' }
              ].map((sc) => (
                <div
                  key={sc.key}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/70"
                >
                  <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-slate-800 shadow-2xs">
                    {sc.key}
                  </kbd>
                  <span className="text-slate-600 font-medium">{sc.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200 text-right">
              <button
                onClick={() => setIsShortcutsOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
