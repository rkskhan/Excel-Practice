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
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm">
              <Keyboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Essential Excel Keyboard Shortcuts</h2>
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
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* OS Switcher */}
          <div className="flex items-center p-1 bg-slate-200/80 rounded-lg w-full sm:w-auto">
            <button
              onClick={() => setPlatform('windows')}
              className={`flex-1 sm:flex-initial flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                platform === 'windows'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Windows</span>
            </button>
            <button
              onClick={() => setPlatform('mac')}
              className={`flex-1 sm:flex-initial flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                platform === 'mac'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>macOS</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shortcut or action..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
            />
          </div>
        </div>

        {/* Shortcuts list */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 p-2">
          {filteredShortcuts.map((item, idx) => {
            const keyCombo = platform === 'windows' ? item.windows : item.mac;
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3 hover:bg-slate-50/80 rounded-lg transition-colors gap-3"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-800">{item.action}</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">{item.category}</div>
                </div>

                <kbd className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-300 rounded-md shadow-2xs whitespace-nowrap">
                  {keyCombo}
                </kbd>
              </div>
            );
          })}

          {filteredShortcuts.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400">
              No shortcuts found matching "{search}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Tip: Press F4 in Excel to lock references ($) in formulas.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
