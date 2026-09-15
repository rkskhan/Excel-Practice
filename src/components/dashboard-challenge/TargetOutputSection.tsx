import React, { useState, useMemo } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Sparkles,
  Filter,
  RefreshCw,
  Users,
  DollarSign,
  TrendingUp,
  PieChart,
  BarChart,
  Maximize2,
  Minimize2,
  ExternalLink,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { HRSalesRecord } from '../../data/dashboardChallengeData';

interface TargetOutputSectionProps {
  rawData: HRSalesRecord[];
}

export const TargetOutputSection: React.FC<TargetOutputSectionProps> = ({ rawData }) => {
  // Slicer interactive states inside the simulation
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'interactive' | 'customImage'>('interactive');
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter raw data according to active slicers
  const filteredData = useMemo(() => {
    return rawData.filter((item) => {
      const matchRegion = selectedRegion === 'All' || item.Region === selectedRegion;
      const matchDept = selectedDept === 'All' || item.Department === selectedDept;
      return matchRegion && matchDept;
    });
  }, [rawData, selectedRegion, selectedDept]);

  // Derived KPI metrics
  const totalEmployees = filteredData.length;
  const totalRevenue = filteredData.reduce((acc, curr) => acc + curr.SalesRevenue, 0);
  const avgSalary =
    totalEmployees > 0
      ? Math.round(filteredData.reduce((acc, curr) => acc + curr.BaseSalary, 0) / totalEmployees)
      : 0;

  // Regional breakdown for Column chart
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America'];
  const revenueByRegion = useMemo(() => {
    return regions.map((reg) => {
      const rev = filteredData
        .filter((d) => d.Region === reg)
        .reduce((sum, d) => sum + d.SalesRevenue, 0);
      return { region: reg, revenue: rev };
    });
  }, [filteredData]);

  const maxRegionalRev = Math.max(...revenueByRegion.map((r) => r.revenue), 1);

  // Department breakdown for Pie/Donut
  const departments = ['Sales', 'Engineering', 'Marketing', 'Operations', 'Finance', 'Human Resources'];
  const headcountByDept = useMemo(() => {
    return departments.map((dept) => {
      const count = filteredData.filter((d) => d.Department === dept).length;
      return { department: dept, count };
    });
  }, [filteredData]);

  const totalFilteredCount = filteredData.length || 1;

  // Reset Slicers
  const handleResetSlicers = () => {
    setSelectedRegion('All');
    setSelectedDept('All');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCustomImageUrl(reader.result);
          setViewMode('customImage');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id="what-you-will-build" className="py-8 border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#107C41]/15 text-[#107C41]">
                Target Output Specification
              </span>
              <span className="text-xs text-slate-400 font-medium">• Visual Goal &amp; Architecture</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              What You'll Build
            </h2>

            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              An executive-grade Excel dashboard featuring 3 KPI cards, 5 PivotTables, dynamic charts, and master slicers connected via Report Connections.
            </p>
          </div>

          {/* View Switcher: Interactive Simulation vs Screenshot Image Slot */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200">
            <button
              onClick={() => setViewMode('interactive')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'interactive'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#107C41]" />
              <span>Interactive Model</span>
            </button>

            <button
              onClick={() => setViewMode('customImage')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'customImage'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>Screenshot Slot</span>
            </button>
          </div>
        </div>

        {/* Large Image Placeholder Card (with rounded corners & nice drop shadow) */}
        <div
          className={`bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden transition-all duration-300 ${
            isFullscreen ? 'fixed inset-4 z-50 overflow-y-auto' : ''
          }`}
        >
          {/* Mock Excel Application Window Header */}
          <div className="bg-[#107C41] text-white px-4 py-2.5 flex items-center justify-between text-xs select-none">
            <div className="flex items-center gap-3">
              {/* Window Controls */}
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" />
              </div>

              <div className="hidden sm:flex items-center gap-2 text-white/90">
                <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                <span className="font-semibold">Microsoft Excel</span>
                <span className="text-emerald-200/60">•</span>
                <span className="font-mono text-[11px] text-emerald-100">
                  HR_Sales_Executive_Dashboard.xlsx
                </span>
                <span className="px-1.5 py-0.2 rounded bg-white/20 text-[10px] font-bold text-white uppercase">
                  AutoSave ON
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-100 hidden md:inline">
                Slicers Connected: 2 | PivotTables: 5
              </span>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Expand View'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Excel Ribbon Tabs Simulation */}
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-1.5 flex items-center gap-4 text-xs text-slate-600 overflow-x-auto select-none">
            <span className="font-bold text-[#107C41] border-b-2 border-[#107C41] pb-1 px-1">
              Dashboard (View)
            </span>
            <span className="hover:text-slate-900 cursor-pointer">File</span>
            <span className="hover:text-slate-900 cursor-pointer">Home</span>
            <span className="hover:text-slate-900 cursor-pointer">Insert</span>
            <span className="hover:text-slate-900 cursor-pointer">Formulas</span>
            <span className="hover:text-slate-900 cursor-pointer">PivotTable Analyze</span>
            <span className="hover:text-slate-900 cursor-pointer">Slicer Design</span>
          </div>

          {/* Excel Formula Bar Simulation */}
          <div className="bg-white border-b border-slate-200 px-4 py-1.5 flex items-center gap-3 text-xs font-mono text-slate-600 select-none">
            <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
              B4
            </span>
            <span className="text-slate-400 font-sans italic">fx</span>
            <span className="text-[#107C41] font-semibold truncate">
              =Working_Data!C12
            </span>
            <span className="ml-auto text-[10px] text-slate-400 font-sans hidden sm:inline">
              Gridlines Removed: Alt + W + V + G
            </span>
          </div>

          {/* MAIN DASHBOARD CANVAS (Clean White Worksheet without Gridlines) */}
          {viewMode === 'interactive' ? (
            <div className="p-5 sm:p-7 bg-[#FAFBFB] min-h-[500px]">
              {/* Dashboard Title & Active Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 mb-6">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[#107C41]">
                    Executive Business Intelligence
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    HR &amp; Sales Performance Dashboard
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live interactive model • Click slicers below to see synchronized cross-filtering
                  </p>
                </div>

                {/* Slicers Active Indicator & Reset */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-[#107C41]" />
                    <span>
                      {selectedRegion === 'All' && selectedDept === 'All'
                        ? 'All Data'
                        : `${selectedRegion !== 'All' ? selectedRegion : ''} ${
                            selectedDept !== 'All' ? `• ${selectedDept}` : ''
                          }`}
                    </span>
                  </span>

                  {(selectedRegion !== 'All' || selectedDept !== 'All') && (
                    <button
                      onClick={handleResetSlicers}
                      className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded bg-slate-200/80 hover:bg-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Clear Slicer Filters (Alt + C in Excel)"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Clear Slicers</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 1. TOP ROW: 3 EXECUTIVE KPI METRIC CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* KPI 1: Total Employees */}
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-2xs relative overflow-hidden">
                  <div className="h-1 bg-[#107C41] absolute top-0 left-0 right-0" />
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                    <span className="uppercase tracking-wider">Total Headcount</span>
                    <Users className="w-4 h-4 text-[#107C41]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                    {totalEmployees.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                      =COUNTA()
                    </span>
                    <span>from tbl_HRSales</span>
                  </div>
                </div>

                {/* KPI 2: Total Revenue */}
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-2xs relative overflow-hidden">
                  <div className="h-1 bg-[#107C41] absolute top-0 left-0 right-0" />
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                    <span className="uppercase tracking-wider">Total Sales Revenue</span>
                    <DollarSign className="w-4 h-4 text-[#107C41]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight text-[#107C41]">
                    ${(totalRevenue / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <span className="text-slate-700 font-mono">
                      ${totalRevenue.toLocaleString()}
                    </span>
                    <span className="text-slate-400">• =SUM()</span>
                  </div>
                </div>

                {/* KPI 3: Average Salary */}
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-2xs relative overflow-hidden">
                  <div className="h-1 bg-[#107C41] absolute top-0 left-0 right-0" />
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                    <span className="uppercase tracking-wider">Average Base Salary</span>
                    <TrendingUp className="w-4 h-4 text-[#107C41]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                    ${avgSalary.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                      =AVERAGE()
                    </span>
                    <span>across active selection</span>
                  </div>
                </div>
              </div>

              {/* 2. MIDDLE ROW: INTERACTIVE SLICERS + CHARTS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* INTERACTIVE SLICER PANEL (Report Connections) */}
                <div className="lg:col-span-4 space-y-4">
                  {/* Slicer 1: Region Slicer */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-3.5">
                    <div className="bg-[#107C41] text-white px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Slicer: Region</span>
                      <span className="text-[10px] text-emerald-100 font-normal">
                        Report Connected
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['All', ...regions].map((reg) => (
                        <button
                          key={reg}
                          onClick={() => setSelectedRegion(reg)}
                          className={`px-2.5 py-1.5 rounded text-xs font-semibold transition-all text-left truncate cursor-pointer ${
                            selectedRegion === reg
                              ? 'bg-[#107C41] text-white shadow-2xs ring-1 ring-[#107C41]'
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {reg}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Slicer 2: Department Slicer */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-3.5">
                    <div className="bg-[#107C41] text-white px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Slicer: Department</span>
                      <span className="text-[10px] text-emerald-100 font-normal">
                        Report Connected
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['All', ...departments].map((dept) => (
                        <button
                          key={dept}
                          onClick={() => setSelectedDept(dept)}
                          className={`px-2.5 py-1.5 rounded text-xs font-semibold transition-all text-left truncate cursor-pointer ${
                            selectedDept === dept
                              ? 'bg-[#107C41] text-white shadow-2xs ring-1 ring-[#107C41]'
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pro Slicer Note */}
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-[11px] text-slate-700">
                    <strong className="text-[#107C41]">Report Connection Active: </strong>
                    Clicking any button updates all 3 charts and 3 KPI tiles in real time, exactly like Excel!
                  </div>
                </div>

                {/* CHARTS CONTAINER (Column, Donut, and Line) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Chart 1: Revenue by Region (Column Chart) */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Sales Revenue by Geographic Region
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          PivotChart from Pivot 2 (Sum of SalesRevenue)
                        </p>
                      </div>
                      <span className="text-xs font-mono font-semibold text-[#107C41]">
                        Clustered Column
                      </span>
                    </div>

                    <div className="space-y-3">
                      {revenueByRegion.map((item) => {
                        const pct = Math.round((item.revenue / maxRegionalRev) * 100);
                        return (
                          <div key={item.region} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-800">
                                {item.region}
                              </span>
                              <span className="font-mono font-bold text-slate-900">
                                ${(item.revenue / 1000000).toFixed(2)}M
                              </span>
                            </div>
                            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#107C41] to-emerald-500 rounded-full transition-all duration-300"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Two Column Grid for Donut & Line simulation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Donut Chart: Headcount by Department */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-slate-900">
                          Headcount by Department
                        </h4>
                        <PieChart className="w-3.5 h-3.5 text-[#107C41]" />
                      </div>
                      <p className="text-[10px] text-slate-500 mb-3">Pivot 1: Count of EmployeeID</p>

                      <div className="space-y-2">
                        {headcountByDept.slice(0, 5).map((item, idx) => {
                          const pct = Math.round((item.count / totalFilteredCount) * 100);
                          const colors = [
                            'bg-[#107C41]',
                            'bg-emerald-600',
                            'bg-teal-600',
                            'bg-slate-700',
                            'bg-slate-400'
                          ];
                          return (
                            <div key={item.department} className="text-xs flex items-center justify-between">
                              <div className="flex items-center gap-1.5 truncate">
                                <span className={`w-2 h-2 rounded-full ${colors[idx % colors.length]}`} />
                                <span className="text-slate-700 truncate">{item.department}</span>
                              </div>
                              <span className="font-mono font-semibold text-slate-900">
                                {item.count} ({pct}%)
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Mini Line Chart: Monthly Revenue Trajectory */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-slate-900">
                          Monthly Sales Trajectory
                        </h4>
                        <BarChart className="w-3.5 h-3.5 text-[#107C41]" />
                      </div>
                      <p className="text-[10px] text-slate-500 mb-3">Pivot 4: Grouped Date Timeline</p>

                      {/* Sparkline visualization */}
                      <div className="h-24 flex items-end justify-between gap-1 pt-4 pb-2 border-b border-slate-100">
                        {[45, 62, 58, 75, 84, 92, 78, 88, 95, 102, 115, 120].map((val, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                            <div
                              className="w-full bg-[#107C41]/80 hover:bg-[#107C41] rounded-t transition-all"
                              style={{ height: `${(val / 120) * 100}%` }}
                              title={`Month ${idx + 1}: $${val * 32}k`}
                            />
                            <span className="text-[8px] text-slate-400 font-mono">
                              M{idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Q1-Q4 Trajectory</span>
                        <span className="font-bold text-[#107C41]">+28% Growth YoY</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Screenshot Image Placeholder / Custom Upload Slot */
            <div className="p-8 sm:p-12 bg-slate-50 min-h-[480px] flex flex-col items-center justify-center text-center">
              {customImageUrl ? (
                <div className="max-w-4xl w-full">
                  <div className="relative group rounded-xl overflow-hidden shadow-lg border border-slate-200">
                    <img
                      src={customImageUrl}
                      alt="Completed Excel Business Dashboard"
                      className="w-full h-auto object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label className="px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-100">
                        Replace Screenshot
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <button
                        onClick={() => setCustomImageUrl('')}
                        className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-md w-full border-2 border-dashed border-slate-300 rounded-2xl p-8 bg-white shadow-xs hover:border-[#107C41] transition-colors">
                  <div className="w-16 h-16 rounded-2xl bg-[#107C41]/10 text-[#107C41] flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-8 h-8" />
                  </div>

                  <h4 className="text-base font-bold text-slate-900">
                    Insert Screenshot of Your Completed Dashboard
                  </h4>

                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Upload an image or paste a screenshot of your final green Excel dashboard here.
                  </p>

                  <div className="mt-6 flex flex-col gap-3">
                    <label className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#107C41] hover:bg-[#0d6535] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>Upload Screenshot File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      onClick={() => setViewMode('interactive')}
                      className="text-xs text-slate-600 hover:text-slate-900 font-medium underline cursor-pointer"
                    >
                      Return to Interactive Model Preview
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Worksheet Tab Bar (Dashboard, Working_Data, Raw_HR_Sales_Data) */}
          <div className="bg-slate-200 border-t border-slate-300 px-4 py-1.5 flex items-center gap-1 text-xs select-none overflow-x-auto">
            <span className="px-3 py-1 bg-white font-bold text-[#107C41] rounded-t border-t-2 border-[#107C41] shadow-2xs">
              Dashboard
            </span>
            <span className="px-3 py-1 text-slate-500 hover:text-slate-800 font-medium">
              Working_Data (Hidden)
            </span>
            <span className="px-3 py-1 text-slate-500 hover:text-slate-800 font-medium">
              Raw_HR_Sales_Data
            </span>
          </div>
        </div>

        {/* Small Caption Required by the User Prompt */}
        <div className="mt-3.5 text-center">
          <p className="text-xs sm:text-sm text-slate-500 font-medium italic">
            "Your final dashboard should look like this and be fully interactive."
          </p>
        </div>
      </div>
    </section>
  );
};
