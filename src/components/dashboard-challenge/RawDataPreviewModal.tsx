import React, { useState } from 'react';
import { HRSalesRecord, downloadDatasetAsXlsx, downloadDatasetAsCsv } from '../../data/dashboardChallengeData';
import { X, Download, Search, FileSpreadsheet, Copy, Check } from 'lucide-react';

interface RawDataPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: HRSalesRecord[];
}

export const RawDataPreviewModal: React.FC<RawDataPreviewModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const rowsPerPage = 12;

  if (!isOpen) return null;

  const filtered = data.filter(
    (row) =>
      row.FullName.toLowerCase().includes(search.toLowerCase()) ||
      row.Department.toLowerCase().includes(search.toLowerCase()) ||
      row.JobTitle.toLowerCase().includes(search.toLowerCase()) ||
      row.Region.toLowerCase().includes(search.toLowerCase()) ||
      row.EmployeeID.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleCopyTop10 = () => {
    const sample = data.slice(0, 20);
    const headers = Object.keys(sample[0]).join('\t');
    const rows = sample.map((r) => Object.values(r).join('\t')).join('\n');
    navigator.clipboard.writeText(`${headers}\n${rows}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#107C41]/10 text-[#107C41] flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                Raw HR &amp; Sales Dataset Preview
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#107C41]/15 text-[#107C41]">
                  {data.length.toLocaleString()} Total Rows
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                11 normalized columns ready for tbl_HRSales conversion
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-6 py-3 border-b border-slate-200 bg-white">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, role, department..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#107C41] focus:bg-white text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyTop10}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied Sample!' : 'Copy Sample TSV'}</span>
            </button>

            <button
              onClick={() => downloadDatasetAsCsv(data)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Download .CSV</span>
            </button>

            <button
              onClick={() => downloadDatasetAsXlsx(data)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#107C41] hover:bg-[#0d6535] rounded-lg shadow-sm shadow-[#107C41]/20 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .xlsx</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto border-b border-slate-200">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead className="bg-slate-100 sticky top-0 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">EmployeeID</th>
                <th className="py-2.5 px-3">FullName</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">JobTitle</th>
                <th className="py-2.5 px-3">Region</th>
                <th className="py-2.5 px-3">HireDate</th>
                <th className="py-2.5 px-3 text-right">BaseSalary</th>
                <th className="py-2.5 px-3 text-right">SalesRevenue</th>
                <th className="py-2.5 px-3">Rating</th>
                <th className="py-2.5 px-3">Education</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-mono text-[11px]">
              {paginated.map((row, idx) => (
                <tr key={row.EmployeeID} className="hover:bg-slate-50/90 transition-colors">
                  <td className="py-2 px-3 text-slate-400 font-sans">
                    {(currentPage - 1) * rowsPerPage + idx + 1}
                  </td>
                  <td className="py-2 px-3 font-semibold text-slate-800">{row.EmployeeID}</td>
                  <td className="py-2 px-3 font-sans text-slate-900 font-medium whitespace-nowrap">
                    {row.FullName}
                  </td>
                  <td className="py-2 px-3 font-sans">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {row.Department}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-sans whitespace-nowrap text-slate-700">
                    {row.JobTitle}
                  </td>
                  <td className="py-2 px-3 font-sans whitespace-nowrap text-slate-700">
                    {row.Region}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">{row.HireDate}</td>
                  <td className="py-2 px-3 text-right font-medium text-slate-800">
                    ${row.BaseSalary.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right font-medium text-[#107C41]">
                    {row.SalesRevenue > 0 ? `$${row.SalesRevenue.toLocaleString()}` : '-'}
                  </td>
                  <td className="py-2 px-3 font-sans whitespace-nowrap">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        row.PerformanceRating === 'Exceeds'
                          ? 'bg-emerald-100 text-emerald-800'
                          : row.PerformanceRating === 'Meets'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {row.PerformanceRating}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-sans whitespace-nowrap text-slate-500">
                    {row.Education}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Pagination Footer */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-50 text-xs text-slate-500">
          <div>
            Showing {(currentPage - 1) * rowsPerPage + 1} to{' '}
            {Math.min(currentPage * rowsPerPage, filtered.length)} of{' '}
            {filtered.length.toLocaleString()} records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
            >
              Previous
            </button>
            <span className="font-semibold text-slate-700">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
