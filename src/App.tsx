import React, { useState, useEffect, useCallback } from 'react';
import {
  PracticeTopic,
  DatasetSize,
  TableSheet,
  ChallengeQuestion,
  PracticeTask,
  DifficultyLevel,
} from './types/excel';
import {
  generateDataset,
  exportToCsv,
  copyToClipboardAsTsv,
  generateChallengeQuestions,
} from './data/generators';
import { generatePracticeTasks } from './data/tasks';
import { TOPIC_TUTORIALS } from './data/tutorials';
import { Navbar } from './components/Navbar';
import { ControlPanel } from './components/ControlPanel';
import { DataTable } from './components/DataTable';
import { TutorialCard } from './components/TutorialCard';
import { ChallengeSection } from './components/ChallengeSection';
import { TaskSection } from './components/TaskSection';
import { ShortcutsModal } from './components/ShortcutsModal';
import { ImportGuideModal } from './components/ImportGuideModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { ExcelDashboardChallengePage } from './components/dashboard-challenge/ExcelDashboardChallengePage';
import { HRExcelHubPage } from './components/hr-excel/HRExcelHubPage';
import {
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Trophy,
  TableProperties,
  ArrowRight,
  CheckSquare,
  ListTodo,
  RefreshCw,
  Dices,
  Users,
} from 'lucide-react';

export default function App() {
  // Primary view mode: 'generator' (Excel Practice Data Generator & Guide), 'challenge', or 'hr' (Real HR Excel Hub)
  const [viewMode, setViewMode] = useState<'generator' | 'challenge' | 'hr'>('generator');

  // Topic and dataset configuration
  const [topic, setTopic] = useState<PracticeTopic>('xlookup');
  const [size, setSize] = useState<DatasetSize>('medium');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [includeBlanks, setIncludeBlanks] = useState(false);
  const [clearLookupTarget, setClearLookupTarget] = useState(true);

  // Generated dataset states
  const [primarySheet, setPrimarySheet] = useState<TableSheet | null>(null);
  const [secondarySheets, setSecondarySheets] = useState<TableSheet[]>([]);
  const [activeSheetId, setActiveSheetId] = useState<string>('');
  const [challenges, setChallenges] = useState<ChallengeQuestion[]>([]);
  const [tasks, setTasks] = useState<PracticeTask[]>([]);
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 2147483640) + 1);

  // UI States
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isImportGuideOpen, setIsImportGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'tutorial' | 'challenges'>('tasks');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Add a toast notification helper
  const addToast = useCallback(
    (type: 'success' | 'info' | 'error', title: string, description?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, description }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Regenerate dataset and practice tasks dynamically with random seed on every refresh/call
  const handleGenerate = useCallback(() => {
    setIsGenerating(true);

    // Subtle async tick to provide smooth visual feedback
    setTimeout(() => {
      const newSeed = Math.floor(Math.random() * 2147483640) + 1;
      setSeed(newSeed);

      const dataset = generateDataset(topic, size, {
        includeBlanks,
        clearLookupTarget: topic === 'xlookup' ? clearLookupTarget : false,
        seed: newSeed,
        difficulty,
      });

      setPrimarySheet(dataset.primarySheet);
      setSecondarySheets(dataset.secondarySheets);
      setActiveSheetId(dataset.primarySheet.id);

      // Generate dynamic questions tailored to the new data and difficulty
      const newChallenges = generateChallengeQuestions(
        topic,
        dataset.primarySheet,
        dataset.secondarySheets,
        difficulty
      );
      setChallenges(newChallenges);

      // Generate fresh randomized tasks tailored to this specific random batch and difficulty
      const newTasks = generatePracticeTasks(
        topic,
        dataset.primarySheet,
        dataset.secondarySheets,
        newSeed,
        difficulty
      );
      setTasks(newTasks);

      setIsGenerating(false);
    }, 150);
  }, [topic, size, includeBlanks, clearLookupTarget, difficulty]);

  // Regenerate tasks only with a new random seed while keeping current dataset
  const handleRandomizeTasksOnly = useCallback(() => {
    if (!primarySheet) return;
    const newSeed = Math.floor(Math.random() * 2147483640) + 1;
    setSeed(newSeed);
    const newTasks = generatePracticeTasks(
      topic,
      primarySheet,
      secondarySheets,
      newSeed,
      difficulty
    );
    setTasks(newTasks);
    addToast(
      'info',
      '🎲 New Practice Tasks Generated',
      'Loaded brand new business goals, target formulas, and verification steps.'
    );
  }, [topic, primarySheet, secondarySheets, difficulty, addToast]);

  // Regenerate on topic/size/option changes
  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  // Topic change handler
  const handleSelectTopic = (newTopic: PracticeTopic) => {
    setTopic(newTopic);
    addToast(
      'info',
      `Switched to ${TOPIC_TUTORIALS[newTopic]?.title || newTopic}`,
      'New mock data and challenges loaded.'
    );
  };

  // Get active sheet object
  const currentSheet =
    activeSheetId === primarySheet?.id
      ? primarySheet
      : secondarySheets.find((s) => s.id === activeSheetId) || primarySheet;

  // Download active sheet as CSV
  const handleDownloadActiveCsv = () => {
    if (!currentSheet) return;
    exportToCsv(currentSheet.rows, currentSheet.columns, currentSheet.fileName);
    addToast(
      'success',
      `Downloaded ${currentSheet.fileName}`,
      `${currentSheet.rows.length} rows exported. Open directly in Excel!`
    );
  };

  // Download all sheets (multi-sheet export)
  const handleDownloadAllCsvs = () => {
    if (!primarySheet) return;
    const all = [primarySheet, ...secondarySheets];
    all.forEach((sheet, idx) => {
      setTimeout(() => {
        exportToCsv(sheet.rows, sheet.columns, sheet.fileName);
      }, idx * 200);
    });
    addToast(
      'success',
      `Exported ${all.length} CSV Files`,
      'All master and reference sheets have been downloaded.'
    );
  };

  // Copy table to clipboard as TSV for immediate Excel pasting
  const handleCopyClipboard = async () => {
    if (!currentSheet) return;
    const success = await copyToClipboardAsTsv(currentSheet.rows, currentSheet.columns);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
      addToast(
        'success',
        `Copied ${currentSheet.rows.length} Rows to Clipboard!`,
        'Switch to Microsoft Excel and press Ctrl+V to paste directly into cells.'
      );
    } else {
      addToast('error', 'Clipboard Copy Failed', 'Please grant clipboard permissions or download as CSV.');
    }
  };

  // Copy individual formula to clipboard with visual confirmation toast
  const handleCopyFormula = (formulaCode: string, label: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(formulaCode);
      addToast('success', `Formula Copied to Clipboard!`, `${label}: ${formulaCode}`);
    }
  };

  const currentTutorial = TOPIC_TUTORIALS[topic];

  if (viewMode === 'challenge') {
    return (
      <ExcelDashboardChallengePage
        onSwitchToGenerator={() => setViewMode('generator')}
        onSwitchToHR={() => setViewMode('hr')}
      />
    );
  }

  if (viewMode === 'hr') {
    return (
      <>
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
        <HRExcelHubPage
          onSwitchToGenerator={() => setViewMode('generator')}
          onSwitchToChallenge={() => setViewMode('challenge')}
          onNotify={addToast}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col antialiased transition-colors">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Top Navigation */}
      <Navbar
        currentTopic={topic}
        activeView={viewMode}
        onSelectView={setViewMode}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenImportGuide={() => setIsImportGuideOpen(true)}
      />

      {/* Clean Minimalist Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 py-6 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800">
                Interactive Practice Engine
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-xs hidden sm:inline">
                Excel 365, 2021, 2019 &amp; Google Sheets
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Excel Practice Data Generator &amp; Guide
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Generate dynamic, realistic business datasets on demand. Export clean CSVs or copy directly into Excel to practice formulas, pivot tables, and reporting.
            </p>
          </div>

          {/* Minimalist Stat Pill */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl px-3.5 py-2.5 shrink-0 self-start md:self-auto">
            <div>
              <div className="text-[10px] text-slate-400 dark:text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
                <span>Batch Seed</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 text-[10px] bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  #{seed.toString(36).toUpperCase()}
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mt-0.5">
                <span>{primarySheet ? primarySheet.rows.length : 0} Rows</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span>{tasks.length} Tasks</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="capitalize text-slate-600 dark:text-slate-400">{difficulty}</span>
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-700 active:scale-95 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all cursor-pointer disabled:opacity-50"
              title="Regenerate random dataset & practice tasks"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 1. Interactive Control Panel */}
        {primarySheet && (
          <ControlPanel
            topic={topic}
            onSelectTopic={handleSelectTopic}
            size={size}
            onSelectSize={setSize}
            difficulty={difficulty}
            onSelectDifficulty={(newDiff) => {
              setDifficulty(newDiff);
              addToast(
                'info',
                `🎯 Difficulty set to ${newDiff.toUpperCase()}`,
                newDiff === 'easy'
                  ? 'Clean, predictable values with beginner-friendly formula challenges.'
                  : newDiff === 'hard'
                  ? 'High entropy data, complex edge cases & advanced formula challenges.'
                  : 'Corporate standard distribution with balanced formula challenges.'
              );
            }}
            includeBlanks={includeBlanks}
            onToggleBlanks={setIncludeBlanks}
            clearLookupTarget={clearLookupTarget}
            onToggleClearLookup={setClearLookupTarget}
            onGenerateNewData={handleGenerate}
            onDownloadCsv={handleDownloadActiveCsv}
            onDownloadAllCsvs={handleDownloadAllCsvs}
            onCopyClipboard={handleCopyClipboard}
            isCopied={isCopied}
            isGenerating={isGenerating}
            activeSheet={currentSheet!}
            secondarySheets={secondarySheets}
            totalRows={currentSheet ? currentSheet.rows.length : 0}
            seed={seed}
          />
        )}

        {/* 2. Instant Preview Data Grid */}
        {primarySheet && (
          <DataTable
            primarySheet={primarySheet}
            secondarySheets={secondarySheets}
            activeSheetId={activeSheetId}
            onSelectSheet={setActiveSheetId}
            onDownloadActiveSheet={handleDownloadActiveCsv}
            onCopyActiveSheet={handleCopyClipboard}
            isCopied={isCopied}
          />
        )}

        {/* 3. Minimalist Section Tabs */}
        <div className="mb-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-2xs font-semibold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Practice Tasks ({tasks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tutorial')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'tutorial'
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-2xs font-semibold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Step-by-Step Procedure</span>
            </button>

            <button
              onClick={() => setActiveTab('challenges')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'challenges'
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-2xs font-semibold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Formula Challenges ({challenges.length})</span>
            </button>
          </div>

          <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline font-normal">
            Solve in Excel and verify your outputs
          </span>
        </div>

        {/* Render Active View: Tasks, Tutorial or Challenges */}
        {activeTab === 'tasks' && (
          <TaskSection
            topic={topic}
            tasks={tasks}
            onTasksChange={setTasks}
            onRandomizeTasks={handleRandomizeTasksOnly}
            onRegenerateAll={handleGenerate}
            onCopyFormula={handleCopyFormula}
            seed={seed}
          />
        )}

        {activeTab === 'tutorial' && currentTutorial && (
          <TutorialCard
            tutorial={currentTutorial}
            onCopyFormula={handleCopyFormula}
          />
        )}

        {activeTab === 'challenges' && (
          <ChallengeSection
            challenges={challenges}
            onCopyFormula={handleCopyFormula}
          />
        )}
      </main>

      {/* Minimalist Footer */}
      <footer className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs border-t border-slate-200/80 dark:border-slate-800 py-6 px-4 sm:px-6 lg:px-8 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#107C41] text-white flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Excel Practice Data Generator &amp; Guide</span>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Data modeling, formulas, pivot tables, and spreadsheet mastery.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <button
              onClick={() => setIsImportGuideOpen(true)}
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
            >
              Import Guide
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
            >
              Shortcuts Cheat Sheet
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-500 dark:text-slate-400">
              Made by <strong className="text-slate-700 dark:text-slate-300 font-medium">Rezaul Karim Sagor</strong> ({' '}
              <a
                href="mailto:r.k.s.khan88@gmail.com"
                className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors underline"
              >
                r.k.s.khan88@gmail.com
              </a>{' '}
              )
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
      <ImportGuideModal
        isOpen={isImportGuideOpen}
        onClose={() => setIsImportGuideOpen(false)}
      />
    </div>
  );
}
