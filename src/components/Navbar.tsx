import React from 'react';
import { FileSpreadsheet, Keyboard, HelpCircle, Users, Trophy, Sparkles, Database, Sun, Moon } from 'lucide-react';
import { PracticeTopic } from '../types/excel';
import { useTheme } from '../context/ThemeContext';

export type AppViewMode = 'generator' | 'hr' | 'challenge';

interface NavbarProps {
  currentTopic?: PracticeTopic;
  activeView?: AppViewMode;
  onSelectView?: (view: AppViewMode) => void;
  onOpenShortcuts: () => void;
  onOpenImportGuide: () => void;
  onSwitchToChallenge?: () => void;
  onSwitchToHR?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView = 'generator',
  onSelectView,
  onOpenShortcuts,
  onOpenImportGuide,
  onSwitchToChallenge,
  onSwitchToHR,
}) => {
  const { isDark, toggleTheme } = useTheme();

  const handleViewChange = (view: AppViewMode) => {
    if (onSelectView) {
      onSelectView(view);
    } else {
      if (view === 'challenge' && onSwitchToChallenge) onSwitchToChallenge();
      if (view === 'hr' && onSwitchToHR) onSwitchToHR();
    }
  };

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#107C41] flex items-center justify-center shadow-xs">
            <FileSpreadsheet className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
              <span>ExcelPractice</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Lab</span>
            </span>
          </div>
        </div>

        {/* Minimalist Segmented View Switcher */}
        <nav className="hidden md:flex items-center bg-slate-100/90 dark:bg-slate-800/90 p-0.5 rounded-lg border border-slate-200/70 dark:border-slate-700/70 text-xs">
          <button
            id="nav-tab-generator"
            onClick={() => handleViewChange('generator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              activeView === 'generator'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Practice Generator</span>
          </button>

          <button
            id="nav-tab-hr"
            onClick={() => handleViewChange('hr')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              activeView === 'hr'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Real HR Excel Hub</span>
          </button>

          <button
            id="nav-tab-challenge"
            onClick={() => handleViewChange('challenge')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              activeView === 'challenge'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Dashboard Challenge</span>
          </button>
        </nav>

        {/* Right utility action items */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile view dropdown / switch */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={() => handleViewChange('generator')}
              className={`p-1.5 rounded-md text-xs border ${
                activeView === 'generator'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-semibold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title="Practice Generator"
            >
              <Database className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleViewChange('hr')}
              className={`p-1.5 rounded-md text-xs border ${
                activeView === 'hr'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-semibold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title="HR Excel Hub"
            >
              <Users className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleViewChange('challenge')}
              className={`p-1.5 rounded-md text-xs border ${
                activeView === 'challenge'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-semibold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title="Dashboard Challenge"
            >
              <Trophy className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Guide: How to paste into Excel */}
          <button
            id="btn-nav-import-guide"
            onClick={onOpenImportGuide}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs cursor-pointer"
            title="How to paste or import data in Microsoft Excel"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Import Guide</span>
          </button>

          {/* Keyboard Shortcuts button */}
          <button
            id="btn-nav-shortcuts"
            onClick={onOpenShortcuts}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs cursor-pointer"
            title="View Excel Keyboard Shortcuts"
          >
            <Keyboard className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Shortcuts</span>
          </button>

          {/* Dark Mode Toggle Button */}
          <button
            id="btn-nav-theme-toggle"
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:text-slate-900 dark:hover:text-amber-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-200" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 animate-in spin-in-90 duration-200" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
