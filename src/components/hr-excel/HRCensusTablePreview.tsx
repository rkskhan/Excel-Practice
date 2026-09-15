import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  Search,
  Filter,
  Users,
  BadgeDollarSign,
  ShieldAlert,
  ArrowUpDown,
  Building,
  Calendar,
} from 'lucide-react';
import {
  HREmployeeRecord,
  generateSampleHRCensus,
  downloadHRExcelWorkbook,
} from '../../data/hrExcelData';

interface HRCensusTablePreviewProps {
  onNotify?: (type: 'success' | 'info' | 'error', title: string, message: string) => void;
}

export const HRCensusTablePreview: React.FC<HRCensusTablePreviewProps> = ({ onNotify }) => {
  const [employees] = useState<HREmployeeRecord[]>(() => generateSampleHRCensus());
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isCopied, setIsCopied] = useState(false);

  // Departments list for dropdown
  const departments = useMemo(() => {
    const set = new Set(employees.map((e) => e.Department));
    return ['ALL', ...Array.from(set).sort()];
  }, [employees]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        searchTerm === '' ||
        emp.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.JobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.EmployeeID.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDept = departmentFilter === 'ALL' || emp.Department === departmentFilter;
      const matchStatus = statusFilter === 'ALL' || emp.EmploymentStatus === statusFilter;

      return matchSearch && matchDept && matchStatus;
    });
  }, [employees, searchTerm, departmentFilter, statusFilter]);

  // Metrics summary
  const totalCount = employees.length;
  const activeCount = employees.filter((e) => e.EmploymentStatus === 'Active').length;
  const terminatedCount = employees.filter((e) => e.EmploymentStatus === 'Terminated').length;
  const totalPayroll = employees
    .filter((e) => e.EmploymentStatus === 'Active')
    .reduce((acc, e) => acc + e.BaseSalary, 0);
  const avgCompa = +(
    employees
      .filter((e) => e.EmploymentStatus === 'Active')
      .reduce((acc, e) => acc + e.CompaRatio, 0) / (activeCount || 1)
  ).toFixed(2);
  const expiredCount = employees.filter((e) => e.ComplianceStatus === 'Expired').length;

  // Copy as TSV for Excel
  const handleCopyTsv = () => {
    if (!navigator.clipboard) return;

    const headers = [
      'Employee ID',
      'Full Name',
      'Department',
      'Job Title',
      'Grade Level',
      'Location',
      'Hire Date',
      'Employment Status',
      'Separation Date',
      'Separation Type',
      'Base Salary',
      'Grade Midpoint',
      'Compa-Ratio',
      'Performance Rating',
      'PTO Balance (Hrs)',
      'Compliance Status',
    ];

    const rows = filteredEmployees.map((e) => [
      e.EmployeeID,
      e.FullName,
      e.Department,
      e.JobTitle,
      e.GradeLevel,
      e.Location,
      e.HireDate,
      e.EmploymentStatus,
      e.TerminationDate || '',
      e.TerminationType || '',
      e.BaseSalary,
      e.SalaryMid,
      e.CompaRatio,
      e.PerformanceRating,
      e.PTOBalanceHours,
      e.ComplianceStatus,
    ]);

    const tsvContent = [headers.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n');

    navigator.clipboard.writeText(tsvContent).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
      if (onNotify) {
        onNotify(
          'success',
          `Copied ${filteredEmployees.length} HR Records!`,
          'Open Microsoft Excel and press Ctrl+V to paste directly into cells with headers.'
        );
      }
    });
  };

  const handleDownload = () => {
    downloadHRExcelWorkbook(employees);
    if (onNotify) {
      onNotify(
        'success',
        'Workbook Downloaded Successfully',
        'Exported Real_World_HR_Analytics_Workbook.xlsx with 4 pre-built tabs (Census, Salary Structure, Merit Grid, Formulas).'
      );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      {/* Header with Stats & Export Actions */}
      <div className="p-6 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                <Users className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                HR Master Census &amp; Payroll Practice Dataset
              </h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Production Schema
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Realistic employee master records featuring active and separated staff, salary grades, compa-ratios, PTO accruals, and compliance expiry dates.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleCopyTsv}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl border border-slate-300 dark:border-slate-700 shadow-2xs transition-all cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-300">Copied for Excel!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  <span>Copy for Excel (TSV)</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#107C41] hover:bg-[#0d6535] rounded-xl shadow-xs shadow-[#107C41]/30 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Multi-Tab Workbook (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Total Headcount</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{totalCount} Employees</span>
          </div>

          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Active Roster</span>
            <span className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">{activeCount} Active</span>
          </div>

          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Total Separations</span>
            <span className="text-lg font-extrabold text-amber-700 dark:text-amber-400">{terminatedCount} Exits</span>
          </div>

          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Avg Compa-Ratio</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{avgCompa} (Target: 1.0)</span>
          </div>

          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Active Base Payroll</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              ${(totalPayroll / 1000000).toFixed(2)}M
            </span>
          </div>

          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Audit Flag (Certs)</span>
            <span className={`text-lg font-extrabold ${expiredCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
              {expiredCount} Expired
            </span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search employee, ID, or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg w-56 focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'ALL' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Terminated">Terminated Only</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Showing <strong>{filteredEmployees.length}</strong> of {employees.length} records
        </span>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-2.5 px-3">Emp ID</th>
              <th className="py-2.5 px-3">Full Name</th>
              <th className="py-2.5 px-3">Department</th>
              <th className="py-2.5 px-3">Job Title</th>
              <th className="py-2.5 px-3">Grade</th>
              <th className="py-2.5 px-3">Hire Date</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Base Salary</th>
              <th className="py-2.5 px-3 text-right">Compa-Ratio</th>
              <th className="py-2.5 px-3 text-center">Rating</th>
              <th className="py-2.5 px-3 text-right">PTO Bal</th>
              <th className="py-2.5 px-3">Compliance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
            {filteredEmployees.map((emp) => {
              const isTerminated = emp.EmploymentStatus === 'Terminated';
              return (
                <tr
                  key={emp.EmployeeID}
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors ${
                    isTerminated ? 'bg-slate-50/40 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <td className="py-2 px-3 font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    {emp.EmployeeID}
                  </td>
                  <td className="py-2 px-3 font-medium text-slate-900 dark:text-slate-100">
                    {emp.FullName}
                  </td>
                  <td className="py-2 px-3">{emp.Department}</td>
                  <td className="py-2 px-3">{emp.JobTitle}</td>
                  <td className="py-2 px-3">
                    <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {emp.GradeLevel}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">{emp.HireDate}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        emp.EmploymentStatus === 'Active'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {emp.EmploymentStatus}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-medium">
                    ${emp.BaseSalary.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <span
                      className={`font-mono text-[11px] px-1.5 py-0.5 rounded font-semibold ${
                        emp.CompaRatio < 0.85
                          ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300'
                          : emp.CompaRatio > 1.15
                          ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                      }`}
                    >
                      {emp.CompaRatio.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center font-bold">{emp.PerformanceRating}/5</td>
                  <td className="py-2 px-3 text-right font-mono text-[11px]">
                    {emp.PTOBalanceHours} hrs
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        emp.ComplianceStatus === 'Compliant'
                          ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                          : emp.ComplianceStatus === 'Expiring Soon'
                          ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                          : 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {emp.ComplianceStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info bar */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span>
          Tip: Export to Excel to practice creating PivotTables on Tenure cohorts, Department Salary Midpoints, and Compa-Ratio distributions.
        </span>
        <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
          Workbook schema verified for Office 365, Excel 2019/2021 &amp; Google Sheets.
        </span>
      </div>
    </div>
  );
};
