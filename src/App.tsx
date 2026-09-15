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
} from 'lucide-react';

export default function App() {
  // Primary view mode: 'challenge' (Excel Business Dashboard Challenge) or 'generator' (Dynamic Practice Data Generator)
  const [viewMode, setViewMode] = useState<'challenge' | 'generator'>('challenge');

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

  // Copy individual formula to clipboard
  const handleCopyFormula = (formulaCode: string, label: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(formulaCode);
      addToast('info', `Copied ${label}`, formulaCode);
    }
  };

  const currentTutorial = TOPIC_TUTORIALS[topic];

  if (viewMode === 'challenge') {
    return (
      <ExcelDashboardChallengePage
        onSwitchToGenerator={() => setViewMode('generator')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col antialiased">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Top Navigation */}
      <Navbar
        currentTopic={topic}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenImportGuide={() => setIsImportGuideOpen(true)}
        onSwitchToChallenge={() => setViewMode('challenge')}
      />

      {/* Switch to Challenge Banner */}
      <div className="bg-[#107C41] text-white px-4 py-2.5 text-xs shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <span className="flex items-center gap-2 font-medium">
            <Trophy className="w-4 h-4 text-emerald-200" />
            <span>Looking for the hands-on project? Build the interactive HR &amp; Sales Dashboard.</span>
          </span>
          <button
            onClick={() => setViewMode('challenge')}
            className="font-bold underline hover:text-emerald-100 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Open Excel Business Dashboard Challenge →</span>
          </button>
        </div>
      </div>

      {/* Hero / Context Sub-Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Interactive Practice Engine
              </span>
              <span className="text-slate-400 text-xs hidden sm:inline">
                • Built for Microsoft Excel 365, 2021, 2019 & Google Sheets
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Excel Practice Data Generator & Guide
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Generate dynamic, realistic business datasets on demand. Download clean CSVs or copy directly into Excel to practice formulas, pivot tables, data prep, and reporting challenges.
            </p>
          </div>

          {/* Quick Stat Pill */}
          <div className="flex items-center gap-3 bg-slate-800/90 border border-slate-700/80 rounded-xl p-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
                <span>Current Random Batch</span>
                <span className="font-mono text-emerald-400 text-[10px] bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700">
                  #{seed.toString(36).toUpperCase()}
                </span>
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
                <span>{primarySheet ? primarySheet.rows.length : 0} Rows</span>
                <span className="text-xs text-slate-400 font-normal">
                  • {tasks.length} Tasks
                </span>
                <span
                  className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${
                    difficulty === 'easy'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : difficulty === 'hard'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {difficulty}
                </span>
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="ml-1 p-2 bg-slate-700 hover:bg-slate-600 active:scale-95 text-emerald-400 hover:text-emerald-300 rounded-lg transition-all cursor-pointer disabled:opacity-50"
              title="Generate new randomized data and practice tasks"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
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

        {/* 3. Section Tabs: Tasks vs Tutorial Guide vs. Interactive Challenges */}
        <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-600'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Practice Tasks & Missions ({tasks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tutorial')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'tutorial'
                  ? 'bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-600'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Step-by-Step Procedure & Formulas</span>
            </button>

            <button
              onClick={() => setActiveTab('challenges')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'challenges'
                  ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-500'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Practice Challenges ({challenges.length})</span>
            </button>
          </div>

          <span className="text-xs text-slate-500 hidden sm:inline">
            Follow the guide, solve in Excel, and test your solution!
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

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-200">Excel Practice Data Generator & Guide</span>
              <p className="text-[11px] text-slate-500">
                Created for data analysts, financial modelers, accountants, and spreadsheet learners.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsImportGuideOpen(true)}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Import Guide
            </button>
            <span>•</span>
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Shortcuts Cheat Sheet
            </button>
            <span>•</span>
            <span className="text-slate-400">
              Made by <strong className="text-slate-200 font-semibold">Rezaul Karim Sagor</strong>, Email:{' '}
              <a
                href="mailto:r.k.s.khan88@gmail.com"
                className="text-emerald-400 hover:text-emerald-300 transition-colors underline"
              >
                r.k.s.khan88@gmail.com
              </a>
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
