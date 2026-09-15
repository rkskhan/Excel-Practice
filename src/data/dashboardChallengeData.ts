import * as XLSX from 'xlsx';

export interface HRSalesRecord {
  EmployeeID: string;
  FullName: string;
  Department: string;
  JobTitle: string;
  Region: string;
  HireDate: string;
  BaseSalary: number;
  SalesRevenue: number;
  Commission: number;
  PerformanceRating: 'Exceeds' | 'Meets' | 'Needs Improvement';
  Education: "Bachelor's" | "Master's" | 'PhD' | 'Associate';
}

export interface DatasetStats {
  totalRows: number;
  totalColumns: number;
  totalRevenue: number;
  averageSalary: number;
  totalCommission: number;
  departmentsCount: number;
  regionsCount: number;
  topRegion: string;
  topRegionRevenue: number;
  topDepartment: string;
  topDeptCount: number;
  exceedsRatingCount: number;
  fileSizeApprox: string;
  fileFormat: string;
  fileName: string;
}

export interface ChallengeScenario {
  id: string; // e.g. "SCN-7291"
  themeTitle: string;
  objective: string;
  focusRegion: string;
  focusDepartment: string;
  focusTargetRevenue: number;
  focusTargetHeadcount: number;
  focusAverageSalary: number;
  bonusInvestigationPrompt: string;
  bonusInvestigationAnswer: string;
}

export interface ChallengeStep {
  id: number;
  title: string;
  subtitle: string;
  timeEstimate: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  tasks: {
    id: string;
    text: string;
    detail?: string;
  }[];
  excelShortcuts: {
    key: string;
    description: string;
  }[];
  proTip: string;
  expectedResult: string;
  formulaSnippets?: {
    label: string;
    formula: string;
  }[];
}

// 180+ First Names to guarantee combinations > 32,000
const FIRST_NAMES = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth',
  'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen',
  'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra',
  'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa', 'Edward', 'Deborah',
  'Ronald', 'Stephanie', 'Timothy', 'Rebecca', 'Jason', 'Sharon', 'Jeffrey', 'Laura', 'Ryan', 'Cynthia',
  'Jacob', 'Kathleen', 'Gary', 'Amy', 'Nicholas', 'Shirley', 'Eric', 'Angela', 'Jonathan', 'Helen',
  'Stephen', 'Anna', 'Larry', 'Brenda', 'Justin', 'Pamela', 'Scott', 'Nicole', 'Brandon', 'Emma',
  'Benjamin', 'Samantha', 'Samuel', 'Katherine', 'Gregory', 'Christine', 'Alexander', 'Debra', 'Patrick', 'Rachel',
  'Jack', 'Carolyn', 'Dennis', 'Janet', 'Jerry', 'Catherine', 'Tyler', 'Maria', 'Aaron', 'Heather',
  'Jose', 'Diane', 'Adam', 'Ruth', 'Nathan', 'Julie', 'Henry', 'Olivia', 'Douglas', 'Joyce',
  'Zachary', 'Virginia', 'Peter', 'Victoria', 'Kyle', 'Kelly', 'Walter', 'Lauren', 'Ethan', 'Christina',
  'Jeremy', 'Joan', 'Harold', 'Evelyn', 'Keith', 'Judith', 'Christian', 'Megan', 'Roger', 'Cheryl',
  'Noah', 'Andrea', 'Gerald', 'Hannah', 'Carl', 'Martha', 'Terry', 'Jacqueline', 'Sean', 'Frances',
  'Austin', 'Ann', 'Arthur', 'Gloria', 'Lawrence', 'Jean', 'Jesse', 'Kathryn', 'Dylan', 'Alice',
  'Bryan', 'Teresa', 'Joe', 'Sara', 'Jordan', 'Janice', 'Billy', 'Doris', 'Albert', 'Madison',
  'Bruce', 'Julia', 'Willie', 'Grace', 'Gabriel', 'Judy', 'Logan', 'Abigail', 'Alan', 'Marie',
  'Juan', 'Denise', 'Wayne', 'Beverly', 'Roy', 'Amber', 'Ralph', 'Theresa', 'Randy', 'Marilyn',
  'Eugene', 'Danielle', 'Vincent', 'Diana', 'Russell', 'Brittany', 'Louis', 'Natalie', 'Bobby', 'Sophia'
];

// 180+ Last Names
const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
  'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes',
  'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper',
  'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
  'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
  'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez',
  'Powell', 'Jenkins', 'Perry', 'Russell', 'Sullivan', 'Bell', 'Coleman', 'Butler', 'Henderson', 'Barnes',
  'Gonzales', 'Fisher', 'Vasquez', 'Simmons', 'Romero', 'Jordan', 'Patterson', 'Alexander', 'Hamilton', 'Graham',
  'Reynolds', 'Griffin', 'Wallace', 'Moreno', 'West', 'Cole', 'Hayes', 'Bryant', 'Herrera', 'Gibson',
  'Ellis', 'Tran', 'Medina', 'Aguilar', 'Stevens', 'Murray', 'Ford', 'Castro', 'Marshall', 'Owens',
  'Harrison', 'Fernandez', 'McDonald', 'Woods', 'Washington', 'Kennedy', 'Wells', 'Vargas', 'Henry', 'Chen',
  'Freeman', 'Webb', 'Tucker', 'Guzman', 'Burns', 'Crawford', 'Olson', 'Simpson', 'Porter', 'Hunter',
  'Gordon', 'Mendez', 'Silva', 'Shaw', 'Snyder', 'Mason', 'Dixon', 'Munoz', 'Hunt', 'Hicks',
  'Holmes', 'Palmer', 'Wagner', 'Black', 'Robertson', 'Boyd', 'Rose', 'Stone', 'Salazar', 'Fox'
];

const DEPARTMENTS = [
  { name: 'Sales', weight: 0.35 },
  { name: 'Engineering', weight: 0.22 },
  { name: 'Marketing', weight: 0.16 },
  { name: 'Operations', weight: 0.12 },
  { name: 'Finance', weight: 0.09 },
  { name: 'Human Resources', weight: 0.06 }
];

const TITLES_BY_DEPT: Record<string, string[]> = {
  Sales: ['Account Executive', 'Senior Account Executive', 'Sales Director', 'Business Development Rep', 'Enterprise Sales Lead'],
  Engineering: ['Software Engineer', 'Senior DevOps Engineer', 'QA Specialist', 'Data Engineer', 'Engineering Manager'],
  Marketing: ['Growth Marketing Manager', 'Content Strategist', 'SEO Analyst', 'Digital Brand Lead', 'Product Marketer'],
  Operations: ['Operations Analyst', 'Supply Chain Coordinator', 'Logistics Specialist', 'Facilities Manager'],
  Finance: ['Financial Analyst', 'Senior Accountant', 'Payroll Specialist', 'FP&A Manager'],
  'Human Resources': ['HR Specialist', 'Talent Acquisition Partner', 'People Ops Coordinator', 'HR Business Partner']
};

const REGIONS = ['North America', 'Europe', 'Asia Pacific', 'Latin America'];
const RATINGS: ('Exceeds' | 'Meets' | 'Needs Improvement')[] = ['Meets', 'Meets', 'Exceeds', 'Needs Improvement'];
const EDUCATIONS: ("Bachelor's" | "Master's" | 'PhD' | 'Associate')[] = ["Bachelor's", "Bachelor's", "Master's", 'Associate', 'PhD'];

const SCENARIO_THEMES = [
  {
    title: 'FY2025 Global Revenue & Executive Workforce Audit',
    objective: 'The Board of Directors requests a centralized dashboard to track worldwide talent allocation, high-earner sales output, and departmental compensation variance.'
  },
  {
    title: 'Q4 Multi-Regional Commercial & Talent Review',
    objective: 'Executive leadership needs an interactive cockpit to dissect regional revenue trajectories, evaluate incentive commissions, and isolate high-performing teams.'
  },
  {
    title: 'Executive Boardroom Operations & Sales Strategy Pack',
    objective: 'Design an executive dashboard to benchmark average salaries across technical departments against regional sales generation for strategic budget planning.'
  },
  {
    title: 'Worldwide HR Analytics & Commercial Performance Benchmark',
    objective: 'Transform raw multi-regional employee records into an interactive reporting engine with synchronized slicers for instant board-level drilldowns.'
  }
];

// Seeded pseudo random number generator for reproducible high-volume data
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates 1,520 randomized HR and Sales records.
 * STRICT NON-REPETITION GUARANTEE:
 * 1. Every single EmployeeID is guaranteed unique.
 * 2. Every single FullName is guaranteed unique across all records (using a Set).
 * 3. Randomized salaries, hire dates, revenues, and ratings are varied without duplicate rows.
 */
export function generateHRSalesData(count = 1520, seed?: number): HRSalesRecord[] {
  const effectiveSeed = seed !== undefined && seed !== 0 
    ? seed 
    : Math.floor(Math.random() * 2147483640) + 1;
    
  const rng = mulberry32(effectiveSeed);
  const records: HRSalesRecord[] = [];
  const usedNames = new Set<string>();
  const usedIds = new Set<string>();

  // Ensure unique ID base offset
  const idBase = 10000 + Math.floor(rng() * 40000);

  for (let i = 0; i < count; i++) {
    // 1. Guaranteed unique EmployeeID
    const empId = `EMP-${idBase + i + 1}`;
    usedIds.add(empId);

    // 2. Guaranteed unique Full Name using Set tracking
    let firstName = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
    let lastName = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)];
    let fullName = `${firstName} ${lastName}`;

    let collisionRetries = 0;
    while (usedNames.has(fullName) && collisionRetries < 50) {
      firstName = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
      lastName = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)];
      fullName = `${firstName} ${lastName}`;
      collisionRetries++;
    }

    // In the unlikely case of a persistent duplicate, append a distinct middle initial
    if (usedNames.has(fullName)) {
      const middleLetters = 'ABCDEFGHJKLMNPRSTWYZ';
      const initial = middleLetters[Math.floor(rng() * middleLetters.length)];
      fullName = `${firstName} ${initial}. ${lastName}`;
    }
    usedNames.add(fullName);

    // 3. Select Department based on weighted distribution
    const rollDept = rng();
    let cumulative = 0;
    let dept = 'Sales';
    for (const d of DEPARTMENTS) {
      cumulative += d.weight;
      if (rollDept <= cumulative) {
        dept = d.name;
        break;
      }
    }

    const titles = TITLES_BY_DEPT[dept];
    const jobTitle = titles[Math.floor(rng() * titles.length)];
    const region = REGIONS[Math.floor(rng() * REGIONS.length)];

    // Hire date between Jan 2021 and Dec 2024 with randomized day & month
    const startTimestamp = new Date(2021, 0, 15).getTime();
    const endTimestamp = new Date(2024, 11, 20).getTime();
    const hireTimestamp = startTimestamp + rng() * (endTimestamp - startTimestamp);
    const hireDateObj = new Date(hireTimestamp);
    const hireDate = hireDateObj.toISOString().split('T')[0];

    // Base salary by department (varied increments)
    let baseSalary = 52000;
    if (dept === 'Engineering') {
      baseSalary = Math.round((82000 + rng() * 78000) / 500) * 500;
    } else if (dept === 'Sales') {
      baseSalary = Math.round((54000 + rng() * 46000) / 500) * 500;
    } else if (dept === 'Finance') {
      baseSalary = Math.round((66000 + rng() * 54000) / 500) * 500;
    } else if (dept === 'Marketing') {
      baseSalary = Math.round((58000 + rng() * 49000) / 500) * 500;
    } else {
      baseSalary = Math.round((46000 + rng() * 44000) / 500) * 500;
    }

    // Sales Revenue: high for Sales department, bonus for Marketing
    let salesRevenue = 0;
    let commission = 0;
    if (dept === 'Sales') {
      salesRevenue = Math.round((48000 + rng() * 292000) / 100) * 100;
      commission = Math.round(salesRevenue * (0.04 + rng() * 0.05));
    } else if (dept === 'Marketing' && rng() > 0.65) {
      salesRevenue = Math.round((16000 + rng() * 64000) / 100) * 100;
      commission = Math.round(salesRevenue * 0.02);
    }

    const performanceRating = RATINGS[Math.floor(rng() * RATINGS.length)];
    const education = EDUCATIONS[Math.floor(rng() * EDUCATIONS.length)];

    records.push({
      EmployeeID: empId,
      FullName: fullName,
      Department: dept,
      JobTitle: jobTitle,
      Region: region,
      HireDate: hireDate,
      BaseSalary: baseSalary,
      SalesRevenue: salesRevenue,
      Commission: commission,
      PerformanceRating: performanceRating,
      Education: education
    });
  }

  return records;
}

/**
 * Calculates dynamic ground-truth statistics from any generated dataset.
 */
export function calculateDatasetStats(records: HRSalesRecord[]): DatasetStats {
  const totalRows = records.length;
  const totalColumns = 11;

  let totalRevenue = 0;
  let totalSalary = 0;
  let totalCommission = 0;
  let exceedsRatingCount = 0;

  const revByRegion: Record<string, number> = {};
  const countByDept: Record<string, number> = {};

  for (const r of records) {
    totalRevenue += r.SalesRevenue;
    totalSalary += r.BaseSalary;
    totalCommission += r.Commission;

    if (r.PerformanceRating === 'Exceeds') {
      exceedsRatingCount++;
    }

    revByRegion[r.Region] = (revByRegion[r.Region] || 0) + r.SalesRevenue;
    countByDept[r.Department] = (countByDept[r.Department] || 0) + 1;
  }

  const averageSalary = totalRows > 0 ? Math.round(totalSalary / totalRows) : 0;

  // Determine top region
  let topRegion = 'North America';
  let topRegionRevenue = 0;
  for (const [reg, rev] of Object.entries(revByRegion)) {
    if (rev > topRegionRevenue) {
      topRegionRevenue = rev;
      topRegion = reg;
    }
  }

  // Determine top department
  let topDepartment = 'Sales';
  let topDeptCount = 0;
  for (const [dept, count] of Object.entries(countByDept)) {
    if (count > topDeptCount) {
      topDeptCount = count;
      topDepartment = dept;
    }
  }

  return {
    totalRows,
    totalColumns,
    totalRevenue,
    averageSalary,
    totalCommission,
    departmentsCount: Object.keys(countByDept).length,
    regionsCount: Object.keys(revByRegion).length,
    topRegion,
    topRegionRevenue,
    topDepartment,
    topDeptCount,
    exceedsRatingCount,
    fileSizeApprox: '185 KB',
    fileFormat: '.xlsx',
    fileName: 'HR_and_Sales_Raw_Dataset.xlsx'
  };
}

/**
 * Generates a randomized scenario based on the dataset.
 */
export function generateRandomScenario(records: HRSalesRecord[], seed: number): ChallengeScenario {
  const rng = mulberry32(seed + 9999);
  const theme = SCENARIO_THEMES[Math.floor(rng() * SCENARIO_THEMES.length)];
  const focusRegion = REGIONS[Math.floor(rng() * REGIONS.length)];
  const nonSalesDepts = ['Sales', 'Engineering', 'Marketing', 'Finance'];
  const focusDept = nonSalesDepts[Math.floor(rng() * nonSalesDepts.length)];

  // Ground-truth calculations for the focus combination
  const focusSubset = records.filter(
    (r) => r.Region === focusRegion && r.Department === focusDept
  );
  const focusTargetHeadcount = focusSubset.length;
  const focusTargetRevenue = focusSubset.reduce((sum, r) => sum + r.SalesRevenue, 0);
  const focusAvgSalary =
    focusTargetHeadcount > 0
      ? Math.round(focusSubset.reduce((sum, r) => sum + r.BaseSalary, 0) / focusTargetHeadcount)
      : 0;

  // Find top performer in focus region
  const regionEmployees = records.filter((r) => r.Region === focusRegion && r.Department === 'Sales');
  const sortedByRev = [...regionEmployees].sort((a, b) => b.SalesRevenue - a.SalesRevenue);
  const topSalesperson = sortedByRev[0] || { FullName: 'Top Account Exec', SalesRevenue: 300000 };

  const scenarioId = `SCN-${Math.floor(1000 + rng() * 9000)}`;

  return {
    id: scenarioId,
    themeTitle: theme.title,
    objective: theme.objective,
    focusRegion,
    focusDepartment: focusDept,
    focusTargetRevenue,
    focusTargetHeadcount,
    focusAverageSalary: focusAvgSalary,
    bonusInvestigationPrompt: `Using your dashboard slicers, find the #1 Sales producer in ${focusRegion} and verify their revenue.`,
    bonusInvestigationAnswer: `${topSalesperson.FullName} ($${topSalesperson.SalesRevenue.toLocaleString()} in Sales Revenue)`
  };
}

/**
 * Dynamically constructs the 5 Step-by-Step Challenge milestones,
 * embedding the exact ground-truth values from this randomized dataset so the student
 * can verify their Excel formulas against 100% accurate targets!
 */
export function generateChallengeSteps(
  records: HRSalesRecord[],
  scenario: ChallengeScenario
): ChallengeStep[] {
  const stats = calculateDatasetStats(records);
  const formattedRevenueM = (stats.totalRevenue / 1000000).toFixed(1);
  const formattedTopRegionRevM = (stats.topRegionRevenue / 1000000).toFixed(1);

  return [
    {
      id: 1,
      title: 'Data Prep & Normalization',
      subtitle: 'Convert raw data to a structured Excel Table',
      timeEstimate: '8-10 min',
      difficulty: 'Beginner',
      description:
        `Begin by transforming the flat range of ${stats.totalRows.toLocaleString()} rows into an official Microsoft Excel Table. This establishes dynamic range naming, clean header styling, and ensures future rows or PivotTables automatically expand without broken formulas.`,
      tasks: [
        {
          id: '1-1',
          text: `Select any cell within the raw dataset (A1:K${stats.totalRows + 1}).`,
          detail: 'Click anywhere inside the data block to let Excel auto-detect table boundaries.'
        },
        {
          id: '1-2',
          text: 'Convert the range to an Excel Table using Ctrl + T (or Cmd + T on Mac).',
          detail: 'Ensure the "My table has headers" checkbox is checked in the pop-up modal.'
        },
        {
          id: '1-3',
          text: 'Rename the Table to tbl_HRSales in Table Design > Table Name.',
          detail: 'Replacing generic names like Table1 with tbl_HRSales makes formulas and Pivot references clean and self-documenting.'
        },
        {
          id: '1-4',
          text: 'Format BaseSalary and SalesRevenue columns as Currency ($).',
          detail: 'Highlight columns G and H, press Ctrl + Shift + $ or Home > Number > Currency with 0 decimal places.'
        },
        {
          id: '1-5',
          text: 'Ensure HireDate is formatted as Short Date (YYYY-MM-DD).',
          detail: 'Highlight column F and set format to Short Date to enable date grouping in PivotTables.'
        }
      ],
      excelShortcuts: [
        { key: 'Ctrl + T', description: 'Create Excel Table from active range' },
        { key: 'Ctrl + Shift + $', description: 'Apply Currency formatting ($)' },
        { key: 'Ctrl + Shift + #', description: 'Apply Date formatting' }
      ],
      proTip:
        'Excel Tables use structured references like tbl_HRSales[SalesRevenue]. If you ever add new employee rows next quarter, every linked PivotTable and chart will refresh seamlessly without re-selecting cell ranges!',
      expectedResult:
        `A banded green/blue Excel Table named tbl_HRSales with properly formatted Currency and Date columns across exactly ${stats.totalRows.toLocaleString()} non-repeating employee records.`
    },
    {
      id: 2,
      title: 'The Data Engine',
      subtitle: 'Build 5 PivotTables on a dedicated Working Sheet',
      timeEstimate: '15-18 min',
      difficulty: 'Intermediate',
      description:
        'Create a new tab named "Working_Data" (or "Engine") that will power your dashboard behind the scenes. Storing PivotTables on a dedicated backend tab keeps your front-end presentation tab clean, uncluttered, and professional.',
      tasks: [
        {
          id: '2-1',
          text: 'Insert a new worksheet and rename it to Working_Data.',
          detail: 'Right-click sheet tab > Rename, or double-click to name it.'
        },
        {
          id: '2-2',
          text: 'Pivot 1 (Headcount by Dept): Insert PivotTable using tbl_HRSales.',
          detail: `Rows: Department | Values: EmployeeID (Count of EmployeeID). Grand Total should equal exactly ${stats.totalRows.toLocaleString()}.`
        },
        {
          id: '2-3',
          text: 'Pivot 2 (Revenue by Region): Total Sales Revenue per Region.',
          detail: `Rows: Region | Values: SalesRevenue (Sum of SalesRevenue). Expected top region: ${stats.topRegion} ($${stats.topRegionRevenue.toLocaleString()}).`
        },
        {
          id: '2-4',
          text: 'Pivot 3 (Top Sales Roles): Revenue & Commission by JobTitle.',
          detail: 'Filter for Sales department. Rows: JobTitle | Values: Sum of SalesRevenue and Sum of Commission.'
        },
        {
          id: '2-5',
          text: 'Pivot 4 (Monthly Sales Trajectory): Revenue trend over time.',
          detail: 'Rows: HireDate (grouped by Year and Month) | Values: Sum of SalesRevenue.'
        },
        {
          id: '2-6',
          text: 'Pivot 5 (Performance Distribution): Headcount by Rating & Education.',
          detail: `Rows: PerformanceRating | Columns: Education | Values: Count of EmployeeID. High performers ('Exceeds'): ${stats.exceedsRatingCount} employees.`
        }
      ],
      excelShortcuts: [
        { key: 'Alt + N + V', description: 'Insert PivotTable dialog' },
        { key: 'Alt + F5', description: 'Refresh active PivotTable' },
        { key: 'Ctrl + Alt + F5', description: 'Refresh all PivotTables in workbook' }
      ],
      proTip:
        'Always rename your PivotTables in PivotTable Analyze > PivotTable Name (e.g. pvt_DeptHeadcount, pvt_RegionRevenue). This makes connecting Slicers in Step 5 much faster!',
      expectedResult:
        `5 clean PivotTables organized with blank spacer columns on the Working_Data worksheet. Grand total revenue across regions must sum to $${stats.totalRevenue.toLocaleString()}.`
    },
    {
      id: 3,
      title: 'KPI Metrics & Executive Cards',
      subtitle: 'Calculate Total Employees, Total Revenue, and Average Salary',
      timeEstimate: '10-12 min',
      difficulty: 'Intermediate',
      description:
        'Create the front-facing "Dashboard" worksheet. Design 3 prominent top-row KPI executive cards displaying the high-level business health metrics with formulas that dynamically update.',
      tasks: [
        {
          id: '3-1',
          text: 'Create a new worksheet named Dashboard and position it as the first tab.',
          detail: 'Drag the tab to the far left so it greets anyone opening the workbook.'
        },
        {
          id: '3-2',
          text: 'Calculate KPI 1: Total Employees (Headcount).',
          detail: `Reference Grand Total from Pivot 1 or use formula =COUNTA(tbl_HRSales[EmployeeID]). Expected Result: ${stats.totalRows.toLocaleString()} employees.`
        },
        {
          id: '3-3',
          text: 'Calculate KPI 2: Total Revenue.',
          detail: `Reference Grand Total from Pivot 2 or use formula =SUM(tbl_HRSales[SalesRevenue]). Expected Result: $${formattedRevenueM}M ($${stats.totalRevenue.toLocaleString()}).`
        },
        {
          id: '3-4',
          text: 'Calculate KPI 3: Average Salary.',
          detail: `Reference Average Salary metric or use formula =AVERAGE(tbl_HRSales[BaseSalary]). Expected Result: $${stats.averageSalary.toLocaleString()}.`
        },
        {
          id: '3-5',
          text: 'Format KPI Cards with Excel Green accent containers.',
          detail: 'Merge 3x2 cell cards, set background fill to crisp white, add a 1pt light gray border and top Excel Green (#107C41) accent bar with 20pt bold values.'
        }
      ],
      formulaSnippets: [
        { label: 'Total Employees', formula: '=COUNTA(tbl_HRSales[EmployeeID])' },
        { label: 'Total Sales Revenue', formula: '=SUM(tbl_HRSales[SalesRevenue])' },
        { label: 'Average Base Salary', formula: '=AVERAGE(tbl_HRSales[BaseSalary])' }
      ],
      excelShortcuts: [
        { key: 'Ctrl + 1', description: 'Format Cells modal' },
        { key: 'Alt + H + F + S', description: 'Adjust font size directly' }
      ],
      proTip:
        'To make KPI cards react to slicers, reference cell values directly from your summary PivotTables (e.g., =Working_Data!B12) rather than static table formulas. When slicers filter the PivotTable, your KPI cards update dynamically!',
      expectedResult:
        `3 polished KPI metric tiles spanning the top of the dashboard displaying: ${stats.totalRows.toLocaleString()} Total Employees, $${formattedRevenueM}M Total Revenue, and $${stats.averageSalary.toLocaleString()} Average Salary.`
    },
    {
      id: 4,
      title: 'Interactive Visuals & Charts',
      subtitle: 'Create Pie/Donut, Column, and Line charts',
      timeEstimate: '15-20 min',
      difficulty: 'Intermediate',
      description:
        `Generate clear, executive-grade PivotCharts linked to your working tables. Strip away default Excel visual noise (heavy borders, dark gridlines, field buttons) and apply a cohesive Excel Green color palette centered around your top revenue driver (${stats.topRegion}).`,
      tasks: [
        {
          id: '4-1',
          text: 'Chart 1 (Donut/Pie): Department Headcount Share.',
          detail: 'Select Pivot 1 > Insert Donut Chart. Hide all Field Buttons, add subtle data labels showing percentage, and position legend cleanly.'
        },
        {
          id: '4-2',
          text: 'Chart 2 (Clustered Column): Revenue by Region.',
          detail: `Select Pivot 2 > Insert 2D Clustered Column Chart. Color bars in Excel Green (#107C41), soften horizontal gridlines to #E2E8F0, and verify ${stats.topRegion} leads with $${formattedTopRegionRevM}M.`
        },
        {
          id: '4-3',
          text: 'Chart 3 (Smooth Line): Monthly Revenue Trajectory.',
          detail: 'Select Pivot 4 > Insert Line with Markers Chart. Set line width to 2.5pt, check smooth line, and remove unnecessary background elements.'
        },
        {
          id: '4-4',
          text: 'Hide all PivotChart Field Buttons.',
          detail: 'Right-click any gray field button on each chart > "Hide All Field Buttons on Chart". This instantly elevates amateur charts to SaaS-grade visuals.'
        },
        {
          id: '4-5',
          text: 'Align chart cards symmetrically on the Dashboard sheet.',
          detail: 'Hold Alt while dragging chart borders to snap them perfectly to the underlying Excel cell grid.'
        }
      ],
      excelShortcuts: [
        { key: 'Alt + Drag', description: 'Snap chart or shape to Excel cell gridlines' },
        { key: 'Alt + F1', description: 'Generate instant default chart from selection' }
      ],
      proTip:
        'Hold the Alt key while resizing or moving charts and cards. Excel will automatically snap their borders to cell edges, creating perfect alignment and spacing without any guesswork!',
      expectedResult:
        '3 modern charts (Donut, Column, Line) with unified typography, consistent padding, clean green accents, and zero visual clutter.'
    },
    {
      id: 5,
      title: 'The Final Phase: Assembly & Slicers',
      subtitle: 'Assemble the dashboard, remove gridlines, and connect Slicers using Report Connections',
      timeEstimate: '12-15 min',
      difficulty: 'Advanced',
      description:
        `Transform the worksheet into a true standalone application. Turn off distracting gridlines, insert interactive Slicers, and configure Report Connections so a single click filters all PivotTables, KPI cards, and charts in unison. Test your build using the specific ${scenario.themeTitle} scenario parameters.`,
      tasks: [
        {
          id: '5-1',
          text: 'Remove Sheet Gridlines on Dashboard.',
          detail: 'Go to View tab > uncheck "Gridlines" (Shortcut: Alt + W + V + G). Gives the sheet a clean, application-like white canvas.'
        },
        {
          id: '5-2',
          text: 'Insert Slicers for Region and Department.',
          detail: 'Click any PivotTable or PivotChart > PivotTable Analyze > Insert Slicer > Check "Region" and "Department".'
        },
        {
          id: '5-3',
          text: 'Format Slicers with clean Excel Green theme.',
          detail: 'Select Slicer > Slicer tab > Choose Dark Green or create custom light style matching #107C41 with 2 columns.'
        },
        {
          id: '5-4',
          text: 'The Critical Step: Configure Report Connections.',
          detail: 'Right-click the Region slicer > Report Connections > Check ALL 5 PivotTables. Repeat for Department slicer.'
        },
        {
          id: '5-5',
          text: `Scenario Test: Filter for ${scenario.focusDepartment} in ${scenario.focusRegion}.`,
          detail: `Click "${scenario.focusRegion}" on Region slicer and "${scenario.focusDepartment}" on Department slicer. Verify your KPI cards update to exactly ${scenario.focusTargetHeadcount} employees and $${scenario.focusTargetRevenue.toLocaleString()} in revenue!`
        },
        {
          id: '5-6',
          text: `Executive Bonus Question: ${scenario.bonusInvestigationPrompt}`,
          detail: `Expected Target: ${scenario.bonusInvestigationAnswer}. Check your regional pivot or slicer filter to verify!`
        },
        {
          id: '5-7',
          text: 'Protect & Clean Up: Hide the Working_Data tab.',
          detail: 'Right-click the Working_Data tab > Hide. Users only interact with your sleek Dashboard tab.'
        }
      ],
      excelShortcuts: [
        { key: 'Alt + W + V + G', description: 'Toggle sheet gridlines on/off' },
        { key: 'Ctrl + Click', description: 'Multi-select multiple slicer items' },
        { key: 'Alt + C', description: 'Clear active slicer filter' }
      ],
      proTip:
        'Report Connections is the single most important feature for professional Excel dashboards. By checking every PivotTable in the Report Connections dialog, your slicer acts as a global master remote control for the entire workbook!',
      expectedResult:
        `A fully interactive executive dashboard. Filtering for ${scenario.focusDepartment} in ${scenario.focusRegion} dynamically shifts KPI cards to ${scenario.focusTargetHeadcount} employees and $${scenario.focusTargetRevenue.toLocaleString()} in revenue.`
    }
  ];
}

// Initial defaults for backwards-compatibility
export const DATASET_STATS: DatasetStats = {
  totalRows: 1520,
  totalColumns: 11,
  totalRevenue: 42845900,
  averageSalary: 78450,
  totalCommission: 3820000,
  departmentsCount: 6,
  regionsCount: 4,
  topRegion: 'North America',
  topRegionRevenue: 18450000,
  topDepartment: 'Sales',
  topDeptCount: 532,
  exceedsRatingCount: 380,
  fileSizeApprox: '185 KB',
  fileFormat: '.xlsx',
  fileName: 'HR_and_Sales_Raw_Dataset.xlsx'
};

const initialDefaultRecords = generateHRSalesData(1520, 101);
const initialScenario = generateRandomScenario(initialDefaultRecords, 101);
export const CHALLENGE_STEPS: ChallengeStep[] = generateChallengeSteps(initialDefaultRecords, initialScenario);

// Helper to trigger real .xlsx download
export function downloadDatasetAsXlsx(records: HRSalesRecord[], scenarioName = 'HR_and_Sales_Raw_Dataset') {
  const worksheet = XLSX.utils.json_to_sheet(records);

  // Set column widths for optimal display in Excel
  worksheet['!cols'] = [
    { wch: 14 }, // EmployeeID
    { wch: 22 }, // FullName
    { wch: 18 }, // Department
    { wch: 26 }, // JobTitle
    { wch: 16 }, // Region
    { wch: 14 }, // HireDate
    { wch: 14 }, // BaseSalary
    { wch: 16 }, // SalesRevenue
    { wch: 14 }, // Commission
    { wch: 20 }, // PerformanceRating
    { wch: 16 }  // Education
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Raw_HR_Sales_Data');

  // Also add a sample README / Instructions sheet inside the workbook!
  const stats = calculateDatasetStats(records);
  const readmeData = [
    { Step: 'Overview', Detail: `Excel Business Dashboard Challenge - ${records.length} Raw Records` },
    { Step: 'Table Name', Detail: 'Convert Raw_HR_Sales_Data to table named: tbl_HRSales' },
    { Step: 'Total Rows', Detail: `${stats.totalRows} (100% Unique Employee Records)` },
    { Step: 'Expected Revenue', Detail: `$${stats.totalRevenue.toLocaleString()}` },
    { Step: 'Expected Avg Salary', Detail: `$${stats.averageSalary.toLocaleString()}` },
    { Step: 'Primary Target', Detail: 'Build a 3-KPI Executive Dashboard with 5 PivotTables & 2 Slicers' },
    { Step: 'Accent Color', Detail: 'Excel Green: #107C41' }
  ];
  const readmeSheet = XLSX.utils.json_to_sheet(readmeData);
  XLSX.utils.book_append_sheet(workbook, readmeSheet, 'Challenge_Notes');

  XLSX.writeFile(workbook, `${scenarioName}.xlsx`);
}

// Fallback CSV download
export function downloadDatasetAsCsv(records: HRSalesRecord[], fileName = 'HR_and_Sales_Raw_Dataset') {
  const headers = Object.keys(records[0]) as (keyof HRSalesRecord)[];
  const csvRows: string[] = [];
  csvRows.push(headers.join(','));

  for (const record of records) {
    const values = headers.map((header) => {
      const val = record[header];
      if (typeof val === 'string' && val.includes(',')) {
        return `"${val}"`;
      }
      return val;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
