import React, { useState, useMemo } from 'react';
import { TableSheet, ColumnDef } from '../types/excel';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileSpreadsheet,
  Layers,
  TableProperties,
} from 'lucide-react';

interface DataTableProps {
  primarySheet: TableSheet;
  secondarySheets: TableSheet[];
  activeSheetId: string;
  onSelectSheet: (id: string) => void;
  onDownloadActiveSheet: () => void;
  onCopyActiveSheet: () => void;
  isCopied: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({
  primarySheet,
  secondarySheets,
  activeSheetId,
  onSelectSheet,
  onDownloadActiveSheet,
  onCopyActiveSheet,
  isCopied,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Combine sheets to find active one
  const allSheets = useMemo(() => {
    return [primarySheet, ...secondarySheets];
  }, [primarySheet, secondarySheets]);

  const currentSheet = useMemo(() => {
    return allSheets.find((s) => s.id === activeSheetId) || primarySheet;
  }, [allSheets, activeSheetId, primarySheet]);

  // Reset page when sheet changes
  React.useEffect(() => {
    setCurrentPage(1);
    setSearchQuery('');
    setSortKey(null);
  }, [activeSheetId]);

  // Handle sort toggle
  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Filter and sort rows
  const processedRows = useMemo(() => {
    let rows = [...currentSheet.rows];

    // Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter((r) => {
        return Object.values(r).some((val) => {
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(q);
        });
      });
    }

    // Sort
    if (sortKey) {
      rows.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        if (valA === valB) return 0;
        if (valA === '' || valA === null || valA === undefined) return 1;
        if (valB === '' || valB === null || valB === undefined) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
        if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return rows;
  }, [currentSheet.rows, searchQuery, sortKey, sortDirection]);

  // Pagination calculations
  const totalRows = processedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const pageIndex = Math.min(currentPage, totalPages);
  const startIndex = (pageIndex - 1) * pageSize;
  const paginatedRows = processedRows.slice(startIndex, startIndex + pageSize);

  // Column summary calculations for numerical columns
  const numericSummaries = useMemo(() => {
    const sums: Record<string, { sum: number; count: number; avg: number }> = {};
    currentSheet.columns.forEach((col) => {
      if (col.type === 'currency' || col.type === 'number') {
        let sum = 0;
        let count = 0;
        currentSheet.rows.forEach((r) => {
          const v = r[col.key];
          if (typeof v === 'number' && !isNaN(v)) {
            sum += v;
            count++;
          }
        });
        if (count > 0) {
          sums[col.key] = {
            sum,
            count,
            avg: sum / count,
          };
        }
      }
    });
    return sums;
  }, [currentSheet]);

  // Cell formatting helper
  const renderCellContent = (value: any, column: ColumnDef) => {
    if (value === '' || value === null || value === undefined) {
      if (column.description?.includes('Formula target') || column.description?.includes('XLOOKUP')) {
        return (
          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono text-emerald-800 bg-emerald-100/90 border border-dashed border-emerald-400">
            [Ready for =XLOOKUP]
          </span>
        );
      }
      return <span className="text-slate-300 italic text-xs">—</span>;
    }

    if (column.type === 'currency') {
      const num = typeof value === 'number' ? value : parseFloat(value);
      if (isNaN(num)) return value;
      return (
        <span className="font-mono text-slate-800">
          ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      );
    }

    if (column.type === 'percent') {
      const num = typeof value === 'number' ? value : parseFloat(value);
      if (isNaN(num)) return value;
      return <span className="font-mono text-slate-800">{(num * 100).toFixed(1)}%</span>;
    }

    if (column.type === 'number') {
      const num = typeof value === 'number' ? value : parseFloat(value);
      if (isNaN(num)) return value;
      return <span className="font-mono text-slate-800">{num.toLocaleString()}</span>;
    }

    if (column.type === 'badge') {
      const str = String(value);
      let color = 'bg-slate-100 text-slate-700 border-slate-200';
      if (str === 'Active' || str === 'Target Met' || str === 'Standard') {
        color = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      } else if (str === 'VIP Partner' || str === 'Star Performer') {
        color = 'bg-amber-50 text-amber-800 border-amber-200 font-semibold';
      } else if (str === 'Needs Attention' || str === 'At Risk') {
        color = 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
      } else if (str === 'Pending Review') {
        color = 'bg-blue-50 text-blue-700 border-blue-200';
      }
      return (
        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] border font-medium whitespace-nowrap ${color}`}>
          {str}
        </span>
      );
    }

    return <span className="text-slate-700 truncate">{String(value)}</span>;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden mb-8">
      {/* 1. Sheet Switcher Tabs (If Multi-sheet) */}
      <div className="bg-slate-900 text-white px-4 pt-3 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-thin">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 mr-2 shrink-0">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sheets:</span>
          </div>

          {allSheets.map((s, idx) => {
            const isActive = s.id === currentSheet.id;
            return (
              <button
                key={s.id}
                id={`sheet-tab-${s.id}`}
                onClick={() => onSelectSheet(s.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-t-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileSpreadsheet
                  className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}
                />
                <span>{s.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {s.rows.length} rows
                </span>
                {idx === 0 && (
                  <span className="text-[9px] uppercase tracking-wider bg-emerald-950 text-emerald-300 px-1 rounded border border-emerald-800">
                    Main
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action icons right on top bar */}
        <div className="flex items-center gap-2 pb-2">
          <button
            onClick={onCopyActiveSheet}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors cursor-pointer"
            title="Copy current sheet data as TSV"
          >
            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="hidden sm:inline">Copy Sheet</span>
          </button>
          <button
            onClick={onDownloadActiveSheet}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-600 rounded-md transition-colors cursor-pointer shadow-sm"
            title="Download current sheet as CSV"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">Download CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Sheet Description Banner */}
      <div className="px-5 py-2.5 bg-emerald-50/60 border-b border-emerald-100 flex items-center justify-between gap-4 flex-wrap text-xs text-emerald-900">
        <div className="flex items-center gap-2">
          <TableProperties className="w-4 h-4 text-emerald-700 shrink-0" />
          <p className="leading-snug">
            <span className="font-semibold text-emerald-950">{currentSheet.name}:</span>{' '}
            {currentSheet.description}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-slate-600 text-[11px]">
          <span>
            Columns: <strong className="text-slate-800">{currentSheet.columns.length}</strong>
          </span>
          <span>•</span>
          <span>
            Total Records: <strong className="text-slate-800">{currentSheet.rows.length}</strong>
          </span>
        </div>
      </div>

      {/* 3. Table Toolbar: Search & Page size */}
      <div className="p-4 border-b border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="table-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search preview data..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-slate-800"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Page size & Record counter */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Rows per page:</span>
            <select
              id="select-page-size"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-300 rounded-md px-2 py-1 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="text-slate-500 font-medium">
            Showing{' '}
            <span className="font-semibold text-slate-800">
              {totalRows === 0 ? 0 : startIndex + 1}
            </span>
            -
            <span className="font-semibold text-slate-800">
              {Math.min(startIndex + pageSize, totalRows)}
            </span>{' '}
            of <span className="font-semibold text-slate-800">{totalRows}</span>
          </div>
        </div>
      </div>

      {/* 4. Excel-like Data Grid with Column Letters & Row Numbers */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            {/* Top row: Excel Column Letters A, B, C, D... */}
            <tr className="bg-slate-100/90 border-b border-slate-200 text-[11px] font-mono text-slate-400 select-none">
              <th className="w-12 px-2 py-1 text-center font-normal border-r border-slate-200/80 bg-slate-200/50">
                #
              </th>
              {currentSheet.columns.map((col, idx) => {
                const letter = col.excelLetter || String.fromCharCode(65 + (idx % 26));
                return (
                  <th
                    key={`letter-${col.key}`}
                    className="px-3 py-1 text-center font-medium border-r border-slate-200/60"
                  >
                    {letter}
                  </th>
                );
              })}
            </tr>

            {/* Header labels */}
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
              {/* Row index header */}
              <th className="w-12 px-2 py-2.5 text-center font-mono text-slate-400 border-r border-slate-200/80 bg-slate-100/50">
                Row
              </th>

              {currentSheet.columns.map((col) => {
                const isSorted = sortKey === col.key;
                const isRightAligned =
                  col.type === 'currency' || col.type === 'number' || col.type === 'percent';

                return (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={`px-3 py-2.5 border-r border-slate-200/60 cursor-pointer hover:bg-slate-100/80 transition-colors select-none ${
                      isRightAligned ? 'text-right' : 'text-left'
                    }`}
                    title={col.description || `Sort by ${col.label}`}
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 ${
                        isRightAligned ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <span className="font-bold text-slate-800">{col.label}</span>
                      {col.description && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title={col.description} />
                      )}
                      <span className="text-slate-400">
                        {isSorted ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-emerald-600" />
                          )
                        ) : (
                          <ArrowUpDown className="w-2.5 h-2.5 opacity-40 hover:opacity-100" />
                        )}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={currentSheet.columns.length + 1}
                  className="px-4 py-12 text-center text-slate-400"
                >
                  <p className="font-medium text-slate-500">No records found matching "{searchQuery}"</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-xs text-emerald-600 hover:underline font-semibold"
                  >
                    Reset search filter
                  </button>
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, rIdx) => {
                const excelRowNum = startIndex + rIdx + 2; // Row 1 is header in Excel
                return (
                  <tr
                    key={row.order_id || row.id || row.store_id || row.employee_id || rIdx}
                    className="hover:bg-emerald-50/30 transition-colors group"
                  >
                    {/* Row Number */}
                    <td className="w-12 px-2 py-2 text-center font-mono text-[11px] text-slate-400 bg-slate-50/50 border-r border-slate-200/60 select-none group-hover:text-emerald-700">
                      {excelRowNum}
                    </td>

                    {currentSheet.columns.map((col) => {
                      const isRightAligned =
                        col.type === 'currency' || col.type === 'number' || col.type === 'percent';
                      return (
                        <td
                          key={col.key}
                          className={`px-3 py-2 border-r border-slate-100 last:border-r-0 ${
                            isRightAligned ? 'text-right' : 'text-left'
                          }`}
                        >
                          {renderCellContent(row[col.key], col)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 5. Pagination Bar */}
      <div className="p-3.5 bg-slate-50/70 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="text-slate-500">
          Page <strong className="text-slate-800">{pageIndex}</strong> of{' '}
          <strong className="text-slate-800">{totalPages}</strong>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={pageIndex <= 1}
            className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="First Page"
          >
            <ChevronsLeft className="w-4 h-4 text-slate-600" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={pageIndex <= 1}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-slate-700 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <span className="px-2 text-slate-400">|</span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={pageIndex >= totalPages}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-slate-700 transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={pageIndex >= totalPages}
            className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Last Page"
          >
            <ChevronsRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
