import React, { useState } from 'react';
import { EXCEL_SHORTCUTS } from '../data/tutorials';
import { Keyboard, X, Search, Laptop, Monitor } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  const [platform, setPlatform] = useState<'windows' | 'mac'>('windows');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredShortcuts = EXCEL_SHORTCUTS.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.action.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.windows.toLowerCase().includes(q) ||
      item.mac.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm">
              <Keyboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white">Essential Excel Keyboard Shortcuts</h2>
              <p className="text-xs text-slate-400">Power user shortcuts to speed up practice and data modeling</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls: Platform selector & search */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* OS Switcher */}
          <div className="flex items-center p-1 bg-slate-200/80 dark:bg-slate-800 rounded-lg w-full sm:w-auto border border-transparent dark:border-slate-700">
            <button
              onClick={() => setPlatform('windows')}
              className={`flex-1 sm:flex-initial flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                platform === 'windows'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs border border-transparent dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Windows</span>
            </button>
            <button
              onClick={() => setPlatform('mac')}
              className={`flex-1 sm:flex-initial flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                platform === 'mac'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs border border-transparent dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>macOS</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shortcut or action..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Shortcuts list */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-2">
          {filteredShortcuts.map((item, idx) => {
            const keyCombo = platform === 'windows' ? item.windows : item.mac;
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 rounded-lg transition-colors gap-3"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.action}</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">{item.category}</div>
                </div>

                <kbd className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-emerald-300 border border-slate-300 dark:border-slate-700 rounded-md shadow-2xs whitespace-nowrap">
                  {keyCombo}
                </kbd>
              </div>
            );
          })}

          {filteredShortcuts.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
              No shortcuts found matching "{search}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Tip: Press F4 in Excel to lock references ($) in formulas.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-600 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
