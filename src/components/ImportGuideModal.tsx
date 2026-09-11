import React from 'react';
import { HelpCircle, X, Copy, Download, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface ImportGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportGuideModal: React.FC<ImportGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">How to Use This Practice Data in Excel</h2>
              <p className="text-xs text-slate-400">Two fast, hassle-free ways to get the mock data into your spreadsheet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 max-h-[440px] overflow-y-auto">
          {/* Method A: Direct Clipboard Copy (Fastest) */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                <Copy className="w-4 h-4 text-emerald-700" />
                <span>Method A: One-Click Clipboard Paste (Fastest)</span>
              </h3>
            </div>
            <ol className="text-xs text-slate-700 space-y-1.5 pl-8 list-decimal">
              <li>Click the <strong>"Copy Table to Clipboard"</strong> button on this page.</li>
              <li>Open a blank workbook in <strong>Microsoft Excel</strong> (or Google Sheets).</li>
              <li>Select cell <strong>A1</strong> and press <strong>Ctrl + V</strong> (or <strong>Cmd + V</strong> on Mac).</li>
              <li>
                Because our generator copies in standard <em>Tab-Separated Values (TSV)</em>, Excel instantly splits every column and row into clean grid cells!
              </li>
            </ol>
          </div>

          {/* Method B: Download as CSV */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-slate-700" />
                <span>Method B: Download as Working CSV File</span>
              </h3>
            </div>
            <ol className="text-xs text-slate-700 space-y-1.5 pl-8 list-decimal">
              <li>Click the green <strong>"Download as CSV"</strong> button.</li>
              <li>Double-click the downloaded <code>.csv</code> file to open it automatically in Excel.</li>
              <li>
                For multi-sheet exercises (e.g. XLOOKUP or Power Query merge), download the companion catalog sheet as well and paste it into Sheet 2.
              </li>
            </ol>
          </div>

          {/* Golden Practice Tip */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 flex items-start gap-3 text-amber-950">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                The #1 Pro-Tip for Practicing: Press Ctrl + T!
              </h4>
              <p className="text-xs text-amber-900/90 leading-relaxed">
                As soon as you paste or open the data in Excel, click inside the data and press <strong>Ctrl + T</strong> (Cmd + T on Mac) to convert it into an official <strong>Excel Table</strong>. This gives you striped rows, automatic formula auto-fill down entire columns, and structured table names like <code>=XLOOKUP([@Product ID], Catalog[ID], Catalog[Price])</code>!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm"
          >
            Got It, Let's Practice
          </button>
        </div>
      </div>
    </div>
  );
};
