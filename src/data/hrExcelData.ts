import * as XLSX from 'xlsx';

export interface HREmployeeRecord {
  EmployeeID: string;
  FullName: string;
  Department: string;
  JobTitle: string;
  GradeLevel: string;
  Location: string;
  HireDate: string;
  EmploymentStatus: 'Active' | 'Terminated' | 'On Leave';
  TerminationDate?: string;
  TerminationType?: 'Voluntary' | 'Involuntary' | 'N/A';
  TerminationReason?: string;
  BaseSalary: number;
  SalaryMin: number;
  SalaryMid: number;
  SalaryMax: number;
  CompaRatio: number;
  RangePenetration: number;
  PerformanceRating: number; // 1 to 5
  PotentialRating: 'Low' | 'Medium' | 'High';
  PTOAccruedHours: number;
  PTOUsedHours: number;
  PTOBalanceHours: number;
  ComplianceCertExpiry: string;
  ComplianceStatus: 'Compliant' | 'Expiring Soon' | 'Expired';
}

export interface SalaryGradeDef {
  grade: string;
  levelTitle: string;
  min: number;
  mid: number;
  max: number;
  spread: string;
}

export interface MeritMatrixCell {
  rating: number; // 1 to 5
  ratingLabel: string;
  q1Increase: number; // Compa-ratio < 85%
  q2Increase: number; // 85% - 100%
  q3Increase: number; // 100% - 115%
  q4Increase: number; // > 115%
}

export const HR_SALARY_GRADES: SalaryGradeDef[] = [
  { grade: 'GR-10', levelTitle: 'Associate / Entry Level', min: 48000, mid: 60000, max: 72000, spread: '50%' },
  { grade: 'GR-11', levelTitle: 'Specialist / Intermediate', min: 62000, mid: 78000, max: 94000, spread: '52%' },
  { grade: 'GR-12', levelTitle: 'Senior Specialist / Analyst', min: 82000, mid: 104000, max: 126000, spread: '54%' },
  { grade: 'GR-13', levelTitle: 'Team Lead / Lead Specialist', min: 105000, mid: 132000, max: 159000, spread: '51%' },
  { grade: 'GR-14', levelTitle: 'Manager / Principal', min: 130000, mid: 165000, max: 200000, spread: '54%' },
  { grade: 'GR-15', levelTitle: 'Senior Manager / Director', min: 168000, mid: 215000, max: 262000, spread: '56%' },
  { grade: 'GR-16', levelTitle: 'VP / Executive', min: 220000, mid: 290000, max: 360000, spread: '64%' },
];

export const HR_MERIT_MATRIX: MeritMatrixCell[] = [
  { rating: 5, ratingLabel: '5 - Role Model / Top 10%', q1Increase: 8.5, q2Increase: 7.0, q3Increase: 5.5, q4Increase: 4.0 },
  { rating: 4, ratingLabel: '4 - Exceeds Expectations', q1Increase: 6.5, q2Increase: 5.0, q3Increase: 4.0, q4Increase: 3.0 },
  { rating: 3, ratingLabel: '3 - Strong Contributor / Meets', q1Increase: 4.5, q2Increase: 3.5, q3Increase: 2.5, q4Increase: 1.5 },
  { rating: 2, ratingLabel: '2 - Partially Meets / Needs Work', q1Increase: 2.0, q2Increase: 1.0, q3Increase: 0.0, q4Increase: 0.0 },
  { rating: 1, ratingLabel: '1 - Unsatisfactory / PIP', q1Increase: 0.0, q2Increase: 0.0, q3Increase: 0.0, q4Increase: 0.0 },
];

export interface HRUseCategory {
  id: string;
  title: string;
  shortDesc: string;
  iconName: string;
  importance: string;
  keyFormulas: {
    name: string;
    excelFormula: string;
    description: string;
    syntaxBreakdown: { param: string; meaning: string }[];
    realWorldExample: string;
    gotcha: string;
  }[];
  bestPractices: string[];
  caseStudyScenario: string;
}

export const HR_USE_CATEGORIES: HRUseCategory[] = [
  {
    id: 'headcount-turnover',
    title: 'Headcount, Turnover & Retention Tracking',
    shortDesc: 'Calculate monthly active headcount, voluntary vs. involuntary attrition, annualized turnover rates, and exact tenure cohorts.',
    iconName: 'Users',
    importance: 'The #1 report requested by the C-Suite and Board of Directors every month to monitor organizational health.',
    keyFormulas: [
      {
        name: 'Annualized Turnover Rate (%)',
        excelFormula: '=(COUNTIFS($F$2:$F$500, "Terminated", $G$2:$G$500, ">=2025-01-01", $G$2:$G$500, "<=2025-12-31") / AVERAGE(C2, C14)) * 100',
        description: 'Measures employee separation velocity against average workforce headcount for the reporting period.',
        syntaxBreakdown: [
          { param: 'COUNTIFS(...)', meaning: 'Total number of terminations within the specific date boundary' },
          { param: 'AVERAGE(C2, C14)', meaning: 'Average of starting headcount (Jan 1) and ending headcount (Dec 31)' },
          { param: '* 100', meaning: 'Converts the fractional ratio to an executive-ready percentage' },
        ],
        realWorldExample: 'If 45 employees left in 2025 and your average headcount was 300, turnover rate is (45 / 300) * 100 = 15.0%.',
        gotcha: 'Never divide by ending headcount alone! Rapid growth or hiring freezes will heavily distort the true attrition rate. Always use the average of Start and End headcount.',
      },
      {
        name: 'Exact Employee Tenure in Years and Months',
        excelFormula: '=DATEDIF(F2, IF(ISBLANK(H2), TODAY(), H2), "Y") & " yrs, " & DATEDIF(F2, IF(ISBLANK(H2), TODAY(), H2), "YM") & " mos"',
        description: 'Computes exact length of service dynamically for active employees (using TODAY) and terminated staff (using Separation Date).',
        syntaxBreakdown: [
          { param: 'F2', meaning: 'Hire Date cell' },
          { param: 'IF(ISBLANK(H2), TODAY(), H2)', meaning: 'If termination date in H2 is blank, calculates to today; otherwise uses exit date' },
          { param: '"Y"', meaning: 'Calculates completed full years of service' },
          { param: '"YM"', meaning: 'Calculates remaining months past the last full year' },
        ],
        realWorldExample: 'An employee hired March 15, 2021 evaluated today outputs "4 yrs, 11 mos".',
        gotcha: 'DATEDIF is a legacy Excel function not listed in the standard AutoComplete dropdown, but it is 100% natively supported. Ensure hire dates are formatted as valid Excel serial dates.',
      },
      {
        name: 'Active Headcount on a Specific Target Date',
        excelFormula: '=COUNTIFS($F$2:$F$500, "<="&TargetDate, $H$2:$H$500, ">"&TargetDate) + COUNTIFS($F$2:$F$500, "<="&TargetDate, $H$2:$H$500, "")',
        description: 'Determines the exact active headcount at any point in historical time (point-in-time census).',
        syntaxBreakdown: [
          { param: '$F$2:$F$500, "<="&TargetDate', meaning: 'Hired on or before the target snapshot date' },
          { param: '$H$2:$H$500, ">"&TargetDate', meaning: 'Terminated after the target snapshot date (was active then)' },
          { param: 'COUNTIFS(..., "")', meaning: 'Still active today with no termination date recorded' },
        ],
        realWorldExample: 'Audit your exact headcount on June 30 for mid-year benefit enrollment renewals.',
        gotcha: 'Avoid filtering raw records manually in Excel; point-in-time formula logic eliminates human error during historical audits.',
      },
    ],
    bestPractices: [
      'Categorize all terminations into Voluntary (resignation, retirement) vs. Involuntary (layoff, performance dismissal).',
      'Track 90-day new-hire retention separately; first 90-day attrition highlights onboarding failure or recruitment misalignment.',
      'Maintain an immutable Employee ID so rehires or internal transfers do not duplicate records.',
    ],
    caseStudyScenario: 'The VP of HR needs to know which department is hemorrhaging senior engineers. By combining tenure bands with voluntary turnover formulas, you reveal that 72% of exits occurred between month 18 and 24 due to stagnant promotion cycles.',
  },
  {
    id: 'comp-compa-ratio',
    title: 'Compensation, Compa-Ratio & Merit Matrix',
    shortDesc: 'Benchmark employee base pay against market salary grades, calculate range penetration, and model annual salary review increase pools.',
    iconName: 'BadgeDollarSign',
    importance: 'The backbone of annual merit cycles, promotion recommendations, and internal pay equity audits.',
    keyFormulas: [
      {
        name: 'Compa-Ratio Calculation',
        excelFormula: '=BaseSalary / XLOOKUP(GradeLevel, SalaryGrades!$A$2:$A$20, SalaryGrades!$C$2:$C$20)',
        description: 'Measures where an individual’s pay sits relative to the market midpoint for their salary grade. 1.00 (100%) represents exact market parity.',
        syntaxBreakdown: [
          { param: 'BaseSalary', meaning: 'The employee’s current annualized base wage' },
          { param: 'XLOOKUP(...)', meaning: 'Pulls the exact salary grade midpoint from the corporate compensation structure tab' },
        ],
        realWorldExample: 'A Senior Engineer earning $110,000 in a grade with a $100,000 midpoint has a Compa-Ratio of 1.10 (110% of midpoint).',
        gotcha: 'Compa-ratios below 0.80 indicate flight risk or outdated pay bands. Compa-ratios above 1.20 indicate an employee capping out their grade who needs a promotion or lump-sum bonus.',
      },
      {
        name: 'Salary Range Penetration (%)',
        excelFormula: '=(BaseSalary - RangeMin) / (RangeMax - RangeMin) * 100',
        description: 'Calculates the exact position of an employee within their salary range, where 0% is range minimum and 100% is range maximum.',
        syntaxBreakdown: [
          { param: 'BaseSalary - RangeMin', meaning: 'Distance above the pay grade floor' },
          { param: 'RangeMax - RangeMin', meaning: 'Total dollar width of the salary band' },
        ],
        realWorldExample: 'Salary $90k, Range $70k - $110k: Range Penetration = ($90k - $70k) / ($110k - $70k) = $20k / $40k = 50.0%.',
        gotcha: 'Range penetration is more intuitive for line managers than compa-ratio because 50% cleanly corresponds to the exact midpoint.',
      },
      {
        name: 'Two-Dimensional Merit Increase Lookup',
        excelFormula: '=INDEX(MeritGrid!$C$3:$F$7, MATCH(PerformanceRating, MeritGrid!$A$3:$A$7, 0), MATCH(CompaQuartile, MeritGrid!$C$2:$F$2, 0))',
        description: 'Allocates salary increase percentages based on a dual-axis matrix: higher performers lower in the salary band receive the largest percentage increases.',
        syntaxBreakdown: [
          { param: 'MeritGrid!$C$3:$F$7', meaning: 'Table of merit percentage guidelines (e.g., 0% to 8.5%)' },
          { param: 'MATCH(Rating, ...)', meaning: 'Row index based on performance score (1 through 5)' },
          { param: 'MATCH(Quartile, ...)', meaning: 'Column index based on salary quartile (Q1, Q2, Q3, Q4)' },
        ],
        realWorldExample: 'A Rating 5 employee in Quartile 1 receives 8.5% increase; a Rating 3 employee in Quartile 4 receives 1.5%.',
        gotcha: 'This protects corporate payroll from inflation by giving higher % increases to underpaid stars while tapering increases for employees already at the top of band.',
      },
    ],
    bestPractices: [
      'Always keep salary band tables on a separate password-protected tab named `Ref_SalaryBands` so midpoints update company-wide with one edit.',
      'Perform unadjusted and adjusted pay gap analyses by testing for statistically significant pay differences across gender and ethnicity at identical grade levels.',
      'Round salary increase models to the nearest whole dollar using `=ROUND(NewSalary, 0)`.',
    ],
    caseStudyScenario: 'During the Q1 compensation review, a line director submitted 10% raises for all 15 direct reports. Using your Merit Matrix lookup model, you reallocated the fixed $75,000 budget to give 8% to underpaid top performers and 2.5% to tenure-heavy plateaued staff, saving $24,000 in budget overrun.',
  },
  {
    id: 'leave-pto-accrual',
    title: 'PTO, Leave Accrual & Attendance Tracking',
    shortDesc: 'Automate tenure-tiered monthly vacation accruals, calculate exact working days with NETWORKDAYS, manage carryover caps, and track absenteeism.',
    iconName: 'CalendarDays',
    importance: 'Accurate PTO liability tracking protects companies from financial audit restatements and compliance penalties during employee separations.',
    keyFormulas: [
      {
        name: 'Tenure-Tiered Monthly Accrual (IFS / VLOOKUP)',
        excelFormula: '=IFS(TenureYears < 2, 10/12, TenureYears < 5, 15/12, TenureYears < 10, 20/12, TRUE, 25/12) * 8',
        description: 'Calculates monthly accrued PTO hours based on continuous years of completed service.',
        syntaxBreakdown: [
          { param: 'TenureYears < 2', meaning: 'Under 2 years service: 10 days/year accrued monthly (10/12 * 8 hrs)' },
          { param: 'TenureYears < 5', meaning: '2 to 5 years service: 15 days/year (10 hours/month)' },
          { param: 'TRUE, 25/12', meaning: 'Default catch-all for senior employees (10+ years): 25 days/year' },
        ],
        realWorldExample: 'A 3-year employee receives 10.0 hours of PTO added to their balance on the 1st of every month.',
        gotcha: 'Always track PTO in hours, not days. Half-day sick leaves and fractional medical appointments quickly cause discrepancies if tracked as decimal days.',
      },
      {
        name: 'True Working Days (Excluding Weekends & Public Holidays)',
        excelFormula: '=NETWORKDAYS.INTL(StartDate, EndDate, 1, Holidays!$A$2:$A$15)',
        description: 'Calculates the net billable or chargeable work days between leave start and end dates, automatically ignoring weekends and company holidays.',
        syntaxBreakdown: [
          { param: 'StartDate, EndDate', meaning: 'Employee leave requested range' },
          { param: '1', meaning: 'Standard Saturday/Sunday weekend rule' },
          { param: 'Holidays!$A$2:$A$15', meaning: 'Range listing official company-recognized statutory holidays' },
        ],
        realWorldExample: 'Leave from Dec 23 to Jan 2 spanning 11 calendar days only deducts 5 working days from the employee’s bank.',
        gotcha: 'Never do simple subtraction `(EndDate - StartDate)` for leave requests, or employees will be mistakenly deducted for Saturdays, Sundays, and Christmas!',
      },
      {
        name: 'Year-End PTO Carryover Cap Enforcement',
        excelFormula: '=MIN(UnusedHours, 40)',
        description: 'Enforces corporate policy limiting the maximum hours an employee can roll over into the new calendar year.',
        syntaxBreakdown: [
          { param: 'UnusedHours', meaning: 'Remaining unused PTO balance at midnight December 31' },
          { param: '40', meaning: 'Company maximum rollover threshold (e.g., 5 days / 40 hours); excess is forfeited' },
        ],
        realWorldExample: 'An employee with 64 accrued hours rolls over 40 hours on Jan 1; 24 hours are forfeited according to policy.',
        gotcha: 'Check local employment laws! Several states (e.g., California, Colorado) ban "use-it-or-lose-it" PTO forfeiture and require payout upon exit.',
      },
    ],
    bestPractices: [
      'Maintain a dedicated statutory holidays reference table `Holidays` in Excel with all official observed dates.',
      'Use conditional formatting to flag negative balances in red whenever requested hours exceed available balance.',
      'Compute the financial balance sheet PTO liability: `=SUM(ActiveEmployees_PTO_Hours * HourlyRate)`.',
    ],
    caseStudyScenario: 'Finance was surprised by a $120,000 unplanned severance payout for a retiring director who never took vacation. By creating an automated accrual and carryover model, HR prevented unchecked PTO balance accumulation.',
  },
  {
    id: 'recruiting-talent-acquisition',
    title: 'Recruiting Metrics & Talent Funnel Analysis',
    shortDesc: 'Track Time-to-Fill, Offer Acceptance Rates (OAR), recruitment stage conversion rates, cost-per-hire, and job board ROI.',
    iconName: 'UserCheck',
    importance: 'Helps talent leaders predict hiring capacity, optimize recruiter workload, and justify agency spend.',
    keyFormulas: [
      {
        name: 'Time-to-Fill / Time-to-Hire',
        excelFormula: '=AVERAGEIFS($D$2:$D$120, $E$2:$E$120, "Engineering", $F$2:$F$120, "Filled")',
        description: 'Calculates the average calendar days elapsed from requisition opening date to formal offer acceptance date for a specific department.',
        syntaxBreakdown: [
          { param: '$D$2:$D$120', meaning: 'Column containing days elapsed `=OfferDate - ReqOpenDate`' },
          { param: '$E$2:$E$120, "Engineering"', meaning: 'Filtered specifically to technical/engineering roles' },
          { param: '$F$2:$F$120, "Filled"', meaning: 'Excludes currently open or cancelled requisitions' },
        ],
        realWorldExample: 'Engineering average Time-to-Fill is 54 days compared to 28 days for Sales.',
        gotcha: 'Differentiate between "Time to Fill" (from req approval to offer accept) and "Time to Start" (from req approval to candidate Day 1). Notice periods skew start dates.',
      },
      {
        name: 'Offer Acceptance Rate (OAR %)',
        excelFormula: '=(COUNTIF(StatusRange, "Offer Accepted") / COUNTIF(StatusRange, "Offer Extended")) * 100',
        description: 'Measures candidate closing effectiveness and compensation competitiveness.',
        syntaxBreakdown: [
          { param: 'COUNTIF(..., "Offer Accepted")', meaning: 'Candidates who signed their offer letter' },
          { param: 'COUNTIF(..., "Offer Extended")', meaning: 'Total offers approved and sent to candidates' },
        ],
        realWorldExample: 'Out of 25 offers extended, 22 were accepted = 88.0% OAR.',
        gotcha: 'An OAR below 80% is an urgent warning signal that market compensation is uncompetitive or hiring managers take too long to decide.',
      },
      {
        name: 'Fully Loaded Cost-per-Hire (CPH)',
        excelFormula: '=(SUM(InternalCosts) + SUM(ExternalAgencyFees) + SUM(JobBoardAds)) / TotalHires',
        description: 'Calculates the average dollar investment required to recruit each new employee.',
        syntaxBreakdown: [
          { param: 'InternalCosts', meaning: 'Recruiter salaries, travel, candidate interview expenses' },
          { param: 'ExternalAgencyFees', meaning: 'Headhunter search fees (typically 20-25% of first-year base)' },
          { param: 'JobBoardAds', meaning: 'LinkedIn Recruiter seats, Indeed postings, campus job fairs' },
        ],
        realWorldExample: 'Annual talent budget of $240,000 for 60 hires yields an average Cost-per-Hire of $4,000.',
        gotcha: 'Benchmarking CPH without segmenting executive search vs. high-volume hourly hires will severely skew department averages.',
      },
    ],
    bestPractices: [
      'Track stage conversion rates: Screened ➔ First Round ➔ Technical Assessment ➔ Final On-Site ➔ Offer.',
      'Measure source effectiveness: Employee Referrals typically show 2.5x higher 1-year retention than cold job board applicants.',
      'Log requisition aging: Requisitions open for > 60 days require immediate calibration meetings between HR and the hiring executive.',
    ],
    caseStudyScenario: 'Marketing complained that recruiting was slow. By calculating stage duration in Excel, HR proved that candidates spent 4 days with recruiting but sat for 26 days waiting for the Marketing VP to schedule the final interview.',
  },
  {
    id: 'performance-9box',
    title: 'Performance Calibration & 9-Box Talent Grid',
    shortDesc: 'Calibrate annual review score distributions against corporate bell curves, normalize manager grading bias, and map high-potentials on a 9-Box grid.',
    iconName: 'LineChart',
    importance: 'Essential for fair succession planning, promotion panels, and identifying flight-risk top performers.',
    keyFormulas: [
      {
        name: '9-Box Talent Grid Category Assignment',
        excelFormula: '=IFS(AND(Rating>=4, Potential="High"), "Box 1: Future Star", AND(Rating=3, Potential="High"), "Box 2: High Potential", AND(Rating>=4, Potential="Medium"), "Box 3: Key Contributor", AND(Rating<=2, Potential="Low"), "Box 9: Action Required", TRUE, "Core Player")',
        description: 'Categorizes employees into executive succession buckets based on their dual performance score and leadership potential assessment.',
        syntaxBreakdown: [
          { param: 'Rating>=4, Potential="High"', meaning: 'Top performers with high executive trajectory (Stars to nurture for VP roles)' },
          { param: 'Rating<=2, Potential="Low"', meaning: 'Underperforming employees needing structured Performance Improvement Plans (PIPs)' },
        ],
        realWorldExample: 'Maps 350 employees across 9 distinct talent quadrants for executive succession planning.',
        gotcha: 'Avoid leaving potential ratings subjective. Use standardized rubrics for "Learning Agility", "Emotional Intelligence", and "Strategic Thinking".',
      },
      {
        name: 'Performance Score Percentile Rank',
        excelFormula: '=PERCENTRANK.INC(DepartmentRatingsRange, IndividualRating, 2)',
        description: 'Calculates where an employee stands relative to all peers in their department regardless of the specific grading scale.',
        syntaxBreakdown: [
          { param: 'DepartmentRatingsRange', meaning: 'All rating scores within the employee’s department' },
          { param: 'IndividualRating', meaning: 'The specific employee’s evaluated score' },
        ],
        realWorldExample: 'A rating of 4.2 ranks in the 88th percentile (top 12% of the department).',
        gotcha: 'Different managers grade differently (harsh vs. easy graders). Comparing raw scores without percentile ranking disadvantages teams under strict managers.',
      },
    ],
    bestPractices: [
      'Compare actual rating distributions against recommended corporate guidelines (e.g., 15% Top, 70% Core, 15% Needs Improvement).',
      'Track 9-Box movement year-over-year to verify if "High Potentials" were successfully promoted or left the company.',
      'Mask identifying personal information during calibration calibration reviews to mitigate unconscious bias.',
    ],
    caseStudyScenario: 'In a company-wide appraisal, the Engineering VP gave 60% of their staff the top rating "5", while the Operations Director gave only 5% "5"s. Using an Excel distribution calibration model, HR normalized the distributions to ensure fair bonus pool allocation.',
  },
  {
    id: 'compliance-certification',
    title: 'Training, Compliance & Certification Tracking',
    shortDesc: 'Monitor mandatory regulatory training (OSHA, HIPAA, Security), audit license expiration dates, and build automated traffic-light alerts.',
    iconName: 'ShieldCheck',
    importance: 'Protects the enterprise from multi-million dollar compliance fines, legal audit failures, and revoked operating licenses.',
    keyFormulas: [
      {
        name: 'Days Until Certification Expiry',
        excelFormula: '=ExpiryDate - TODAY()',
        description: 'Calculates remaining days until an employee’s mandatory qualification or license expires.',
        syntaxBreakdown: [
          { param: 'ExpiryDate', meaning: 'Date when the certification ceases to be valid' },
          { param: 'TODAY()', meaning: 'Current dynamic date; recalculates automatically whenever the workbook opens' },
        ],
        realWorldExample: 'A nursing license expiring in 18 days outputs `18`; an expired license outputs `-5`.',
        gotcha: 'Remember that `=TODAY()` updates every time Excel recalculates. If calculating historical compliance for an audit snapshot, use a fixed static audit date.',
      },
      {
        name: 'Compliance Traffic Light Status',
        excelFormula: '=IFS(ExpiryDate < TODAY(), "EXPIRED", ExpiryDate <= TODAY() + 30, "EXPIRING SOON", TRUE, "COMPLIANT")',
        description: 'Classifies employee compliance into clear audit categories for conditional formatting and executive reporting.',
        syntaxBreakdown: [
          { param: 'ExpiryDate < TODAY()', meaning: 'Certificate has already lapsed (immediate breach)' },
          { param: 'ExpiryDate <= TODAY() + 30', meaning: 'Within the 30-day grace/renewal window' },
          { param: 'TRUE, "COMPLIANT"', meaning: 'Valid for more than 30 days' },
        ],
        realWorldExample: 'Enables quick filtering for managers to see all staff due for annual anti-harassment recertification.',
        gotcha: 'Always pair this formula with Excel Conditional Formatting: Red fill for "EXPIRED", Amber fill for "EXPIRING SOON", Light green fill for "COMPLIANT".',
      },
      {
        name: 'Departmental Compliance Completion Rate (%)',
        excelFormula: '=(COUNTIFS(DeptRange, "Finance", StatusRange, "COMPLIANT") / COUNTIF(DeptRange, "Finance")) * 100',
        description: 'Computes overall audit readiness for ISO, SOC2, or OSHA regulatory inspections.',
        syntaxBreakdown: [
          { param: 'COUNTIFS(..., "COMPLIANT")', meaning: 'Compliant employees in the department' },
          { param: 'COUNTIF(...)', meaning: 'Total headcount in the department' },
        ],
        realWorldExample: 'Finance has 48 out of 50 staff compliant = 96.0% compliance rate.',
        gotcha: 'A single expired certification in regulated industries (healthcare, aviation) can halt operations. Automated reporting prevents last-minute surprises.',
      },
    ],
    bestPractices: [
      'Set automated Conditional Formatting highlighting rows where Days Remaining is `<= 14` in bold red text.',
      'Keep copies of certification PDF IDs or accreditation numbers in an adjacent column `License_Number`.',
      'Schedule quarterly audit reviews to retire obsolete training modules from historical records.',
    ],
    caseStudyScenario: 'Before an upcoming ISO 27001 audit, HR filtered the compliance sheet to discover that 35 remote developers had unrenewed Data Privacy certifications. With a 14-day automated alert, all 35 completed the course before auditors arrived.',
  },
];

// Sample realistic HR Master Census Dataset (50 rows)
export function generateSampleHRCensus(): HREmployeeRecord[] {
  const departments = ['Engineering', 'Sales', 'Product', 'Marketing', 'Finance', 'Human Resources', 'Customer Support', 'Operations'];
  const locations = ['New York, NY', 'San Francisco, CA', 'Austin, TX', 'Chicago, IL', 'London, UK', 'Remote (US)'];
  
  const rawEmployees = [
    { name: 'Elena Rostova', dept: 'Engineering', title: 'Senior Software Engineer', grade: 'GR-12', salary: 118000, hire: '2021-03-15', status: 'Active', perf: 5, pot: 'High', cert: '2026-11-30' },
    { name: 'Marcus Sterling', dept: 'Engineering', title: 'Staff Engineer', grade: 'GR-13', salary: 142000, hire: '2019-06-01', status: 'Active', perf: 4, pot: 'High', cert: '2026-08-15' },
    { name: 'Aisha Al-Mansoor', dept: 'Engineering', title: 'Software Engineer II', grade: 'GR-11', salary: 84000, hire: '2022-09-10', status: 'Active', perf: 4, pot: 'Medium', cert: '2026-04-12' },
    { name: 'David Kim', dept: 'Engineering', title: 'Junior Developer', grade: 'GR-10', salary: 58000, hire: '2024-01-15', status: 'Active', perf: 3, pot: 'Medium', cert: '2026-09-20' },
    { name: 'Chloe Dubois', dept: 'Engineering', title: 'Engineering Manager', grade: 'GR-14', salary: 172000, hire: '2018-04-10', status: 'Active', perf: 5, pot: 'High', cert: '2026-12-01' },
    { name: 'Liam O’Connor', dept: 'Engineering', title: 'Senior DevOps Specialist', grade: 'GR-12', salary: 98000, hire: '2022-01-20', status: 'Terminated', exit: '2024-11-15', exitType: 'Voluntary', reason: 'Better Compensation Elsewhere', perf: 4, pot: 'Medium', cert: '2025-01-01' },
    { name: 'Sophia Chen', dept: 'Product', title: 'Lead Product Manager', grade: 'GR-13', salary: 138000, hire: '2020-05-18', status: 'Active', perf: 5, pot: 'High', cert: '2026-10-14' },
    { name: 'Javier Morales', dept: 'Product', title: 'Product Designer', grade: 'GR-11', salary: 76000, hire: '2023-02-01', status: 'Active', perf: 3, pot: 'Medium', cert: '2026-05-20' },
    { name: 'Sarah Jenkins', dept: 'Sales', title: 'Enterprise Account Executive', grade: 'GR-12', salary: 105000, hire: '2021-08-15', status: 'Active', perf: 5, pot: 'High', cert: '2026-03-30' },
    { name: 'Rajesh Patel', dept: 'Sales', title: 'Senior Sales Director', grade: 'GR-15', salary: 225000, hire: '2017-02-10', status: 'Active', perf: 4, pot: 'High', cert: '2026-11-10' },
    { name: 'Tyler Brooks', dept: 'Sales', title: 'BDR Specialist', grade: 'GR-10', salary: 52000, hire: '2024-03-01', status: 'Active', perf: 3, pot: 'Low', cert: '2026-02-15' },
    { name: 'Amanda Lewis', dept: 'Sales', title: 'Account Executive', grade: 'GR-11', salary: 72000, hire: '2023-06-12', status: 'Terminated', exit: '2024-08-30', exitType: 'Involuntary', reason: 'Performance Unmet Quota', perf: 2, pot: 'Low', cert: '2025-06-01' },
    { name: 'Benjamin Hayes', dept: 'Marketing', title: 'VP of Growth Marketing', grade: 'GR-16', salary: 285000, hire: '2019-11-01', status: 'Active', perf: 4, pot: 'High', cert: '2026-07-22' },
    { name: 'Fatima Zahra', dept: 'Marketing', title: 'Content & Brand Lead', grade: 'GR-12', salary: 92000, hire: '2022-04-15', status: 'Active', perf: 4, pot: 'Medium', cert: '2026-09-05' },
    { name: 'Lucas Meyer', dept: 'Marketing', title: 'SEO Analyst', grade: 'GR-10', salary: 61000, hire: '2023-10-01', status: 'Active', perf: 3, pot: 'Medium', cert: '2026-04-01' },
    { name: 'Hannah Wright', dept: 'Finance', title: 'Senior Financial Analyst', grade: 'GR-12', salary: 108000, hire: '2021-01-11', status: 'Active', perf: 4, pot: 'High', cert: '2026-10-31' },
    { name: 'Carlos Gomez', dept: 'Finance', title: 'Payroll Manager', grade: 'GR-13', salary: 128000, hire: '2018-09-01', status: 'Active', perf: 5, pot: 'Medium', cert: '2026-12-15' },
    { name: 'Rachel Vance', dept: 'Human Resources', title: 'Director of People Operations', grade: 'GR-15', salary: 210000, hire: '2019-01-14', status: 'Active', perf: 5, pot: 'High', cert: '2026-06-30' },
    { name: 'Kevin Tran', dept: 'Human Resources', title: 'Compensation Analyst', grade: 'GR-11', salary: 81000, hire: '2022-11-01', status: 'Active', perf: 4, pot: 'High', cert: '2026-08-20' },
    { name: 'Samantha Clark', dept: 'Human Resources', title: 'Technical Recruiter', grade: 'GR-11', salary: 77000, hire: '2023-04-10', status: 'Active', perf: 3, pot: 'Medium', cert: '2026-03-15' },
    { name: 'Noah Miller', dept: 'Customer Support', title: 'Support Operations Lead', grade: 'GR-11', salary: 74000, hire: '2022-07-18', status: 'Active', perf: 4, pot: 'Medium', cert: '2026-05-10' },
    { name: 'Grace Taylor', dept: 'Customer Support', title: 'Customer Success Specialist', grade: 'GR-10', salary: 54000, hire: '2023-11-20', status: 'Active', perf: 3, pot: 'Medium', cert: '2026-02-28' },
    { name: 'Oliver Scott', dept: 'Operations', title: 'Procurement Specialist', grade: 'GR-11', salary: 75000, hire: '2022-03-01', status: 'Active', perf: 3, pot: 'Low', cert: '2026-04-18' },
    { name: 'Isabella Rossi', dept: 'Engineering', title: 'Data Platform Architect', grade: 'GR-14', salary: 180000, hire: '2018-10-15', status: 'Active', perf: 5, pot: 'High', cert: '2026-11-25' },
    { name: 'Ethan Hunt', dept: 'Sales', title: 'Regional Sales Manager', grade: 'GR-13', salary: 135000, hire: '2020-08-01', status: 'Active', perf: 4, pot: 'Medium', cert: '2026-07-14' },
    { name: 'Mia Robinson', dept: 'Finance', title: 'Controller', grade: 'GR-14', salary: 168000, hire: '2017-06-15', status: 'Active', perf: 5, pot: 'High', cert: '2026-09-30' },
    { name: 'Zack Walker', dept: 'Customer Support', title: 'Tier 1 Support Agent', grade: 'GR-10', salary: 49000, hire: '2024-02-10', status: 'Terminated', exit: '2024-05-02', exitType: 'Voluntary', reason: 'Relocation', perf: 3, pot: 'Low', cert: '2025-02-01' },
    { name: 'Victoria Stone', dept: 'Product', title: 'Associate PM', grade: 'GR-10', salary: 65000, hire: '2023-08-15', status: 'Active', perf: 4, pot: 'High', cert: '2026-12-10' },
    { name: 'Daniel Reed', dept: 'Engineering', title: 'QA Automation Engineer', grade: 'GR-11', salary: 83000, hire: '2022-05-20', status: 'Active', perf: 3, pot: 'Medium', cert: '2026-01-20' },
    { name: 'Leila Farouk', dept: 'Operations', title: 'Director of Business Ops', grade: 'GR-15', salary: 215000, hire: '2019-04-01', status: 'Active', perf: 5, pot: 'High', cert: '2026-08-30' },
  ];

  return rawEmployees.map((e, idx) => {
    const gradeInfo = HR_SALARY_GRADES.find((g) => g.grade === e.grade) || HR_SALARY_GRADES[0];
    const compa = +(e.salary / gradeInfo.mid).toFixed(3);
    const penetration = +(((e.salary - gradeInfo.min) / (gradeInfo.max - gradeInfo.min)) * 100).toFixed(1);

    // Mock PTO
    const ptoAccrued = 120 + ((idx * 8) % 48);
    const ptoUsed = (idx * 5) % 80;
    const ptoBalance = ptoAccrued - ptoUsed;

    // Compliance status calculation based on year 2026
    const expiryDate = new Date(e.cert);
    const now = new Date('2026-09-15');
    const diffDays = Math.round((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    let compStatus: 'Compliant' | 'Expiring Soon' | 'Expired' = 'Compliant';
    if (diffDays < 0) {
      compStatus = 'Expired';
    } else if (diffDays <= 45) {
      compStatus = 'Expiring Soon';
    }

    return {
      EmployeeID: `EMP-${(1001 + idx).toString()}`,
      FullName: e.name,
      Department: e.dept,
      JobTitle: e.title,
      GradeLevel: e.grade,
      Location: locations[idx % locations.length],
      HireDate: e.hire,
      EmploymentStatus: e.status as 'Active' | 'Terminated' | 'On Leave',
      TerminationDate: e.exit,
      TerminationType: (e.exitType || 'N/A') as 'Voluntary' | 'Involuntary' | 'N/A',
      TerminationReason: e.reason || 'N/A',
      BaseSalary: e.salary,
      SalaryMin: gradeInfo.min,
      SalaryMid: gradeInfo.mid,
      SalaryMax: gradeInfo.max,
      CompaRatio: compa,
      RangePenetration: penetration,
      PerformanceRating: e.perf,
      PotentialRating: e.pot as 'Low' | 'Medium' | 'High',
      PTOAccruedHours: ptoAccrued,
      PTOUsedHours: ptoUsed,
      PTOBalanceHours: ptoBalance,
      ComplianceCertExpiry: e.cert,
      ComplianceStatus: compStatus,
    };
  });
}

// Generate complete downloadable multi-tab Excel Workbook (.xlsx)
export function downloadHRExcelWorkbook(employees: HREmployeeRecord[]) {
  const wb = XLSX.utils.book_new();

  // Tab 1: Employee Census
  const censusData = employees.map((emp) => ({
    'Employee ID': emp.EmployeeID,
    'Full Name': emp.FullName,
    'Department': emp.Department,
    'Job Title': emp.JobTitle,
    'Grade Level': emp.GradeLevel,
    'Location': emp.Location,
    'Hire Date': emp.HireDate,
    'Employment Status': emp.EmploymentStatus,
    'Separation Date': emp.TerminationDate || '',
    'Separation Type': emp.TerminationType !== 'N/A' ? emp.TerminationType : '',
    'Separation Reason': emp.TerminationReason !== 'N/A' ? emp.TerminationReason : '',
    'Base Salary ($)': emp.BaseSalary,
    'Grade Min ($)': emp.SalaryMin,
    'Grade Mid ($)': emp.SalaryMid,
    'Grade Max ($)': emp.SalaryMax,
    'Compa-Ratio': emp.CompaRatio,
    'Range Penetration (%)': emp.RangePenetration,
    'Performance Rating (1-5)': emp.PerformanceRating,
    'Potential Rating': emp.PotentialRating,
    'PTO Accrued (Hrs)': emp.PTOAccruedHours,
    'PTO Used (Hrs)': emp.PTOUsedHours,
    'PTO Balance (Hrs)': emp.PTOBalanceHours,
    'Cert Expiration Date': emp.ComplianceCertExpiry,
    'Compliance Status': emp.ComplianceStatus,
  }));
  const wsCensus = XLSX.utils.json_to_sheet(censusData);
  XLSX.utils.book_append_sheet(wb, wsCensus, 'Employee_Census');

  // Tab 2: Salary Structure
  const salaryStructure = HR_SALARY_GRADES.map((g) => ({
    'Grade Code': g.grade,
    'Level / Seniority Title': g.levelTitle,
    'Range Minimum ($)': g.min,
    'Market Midpoint ($)': g.mid,
    'Range Maximum ($)': g.max,
    'Band Spread (%)': g.spread,
    'Quartile 1 Max': g.min + (g.mid - g.min) * 0.5,
    'Quartile 2 Max': g.mid,
    'Quartile 3 Max': g.mid + (g.max - g.mid) * 0.5,
  }));
  const wsSalary = XLSX.utils.json_to_sheet(salaryStructure);
  XLSX.utils.book_append_sheet(wb, wsSalary, 'Salary_Structure');

  // Tab 3: Merit Review Matrix
  const meritMatrix = HR_MERIT_MATRIX.map((m) => ({
    'Performance Rating': m.rating,
    'Rating Label': m.ratingLabel,
    'Quartile 1 (< 85% Compa)': `${m.q1Increase}%`,
    'Quartile 2 (85% - 100% Compa)': `${m.q2Increase}%`,
    'Quartile 3 (100% - 115% Compa)': `${m.q3Increase}%`,
    'Quartile 4 (> 115% Compa)': `${m.q4Increase}%`,
  }));
  const wsMerit = XLSX.utils.json_to_sheet(meritMatrix);
  XLSX.utils.book_append_sheet(wb, wsMerit, 'Merit_Increase_Grid');

  // Tab 4: Formula Cheat Sheet
  const formulaCheatSheet = [
    {
      'HR Category': 'Turnover & Retention',
      'Metric Name': 'Annualized Turnover Rate (%)',
      'Excel Formula': '=(COUNTIFS(StatusRange, "Terminated", DateRange, ">=2025-01-01", DateRange, "<=2025-12-31") / AVERAGE(StartHC, EndHC)) * 100',
      'Why HR Uses It': 'Standard board-level workforce health KPI; tracks organizational talent drain.',
    },
    {
      'HR Category': 'Turnover & Retention',
      'Metric Name': 'Service Tenure (Yrs & Mos)',
      'Excel Formula': '=DATEDIF(HireDate, IF(ISBLANK(ExitDate), TODAY(), ExitDate), "Y") & " yrs, " & DATEDIF(HireDate, IF(ISBLANK(ExitDate), TODAY(), ExitDate), "YM") & " mos"',
      'Why HR Uses It': 'Accurate vesting, anniversary bonuses, severance eligibility, and milestone awards.',
    },
    {
      'HR Category': 'Compensation & Equity',
      'Metric Name': 'Compa-Ratio',
      'Excel Formula': '=BaseSalary / XLOOKUP(Grade, SalaryGrades!A:A, SalaryGrades!C:C)',
      'Why HR Uses It': 'Ensures competitive market alignment and eliminates arbitrary manager salary inflation.',
    },
    {
      'HR Category': 'Compensation & Equity',
      'Metric Name': 'Range Penetration (%)',
      'Excel Formula': '=(BaseSalary - RangeMin) / (RangeMax - RangeMin) * 100',
      'Why HR Uses It': 'Identifies how deep into a pay bracket an employee has climbed.',
    },
    {
      'HR Category': 'Compensation & Equity',
      'Metric Name': 'Merit Matrix Grid Increase',
      'Excel Formula': '=INDEX(MeritGrid, MATCH(PerfRating, RatingsCol, 0), MATCH(Quartile, QuartilesRow, 0))',
      'Why HR Uses It': 'Equitably allocates limited annual merit salary review budgets.',
    },
    {
      'HR Category': 'Time & Leave (PTO)',
      'Metric Name': 'True Working Days (Excl. Holidays)',
      'Excel Formula': '=NETWORKDAYS.INTL(StartDate, EndDate, 1, HolidaysList)',
      'Why HR Uses It': 'Ensures employees are not unfairly docked vacation balance on weekends or statutory holidays.',
    },
    {
      'HR Category': 'Time & Leave (PTO)',
      'Metric Name': 'Year-End Carryover Cap',
      'Excel Formula': '=MIN(UnusedHours, 40)',
      'Why HR Uses It': 'Enforces corporate rollover policy and accurately books PTO liability for corporate finance balance sheets.',
    },
    {
      'HR Category': 'Recruiting & TA',
      'Metric Name': 'Time to Fill / Time to Hire',
      'Excel Formula': '=AVERAGEIFS(DaysElapsedRange, DeptRange, "Engineering", StatusRange, "Filled")',
      'Why HR Uses It': 'Evaluates recruiting bandwidth, agency efficiency, and hiring manager scheduling velocity.',
    },
    {
      'HR Category': 'Recruiting & TA',
      'Metric Name': 'Offer Acceptance Rate (OAR %)',
      'Excel Formula': '=(COUNTIF(StatusRange, "Offer Accepted") / COUNTIF(StatusRange, "Offer Extended")) * 100',
      'Why HR Uses It': 'Direct health metric of compensation competitiveness and employer brand attractiveness.',
    },
    {
      'HR Category': 'Compliance & Audits',
      'Metric Name': 'Days to License Expiry',
      'Excel Formula': '=ExpiryDate - TODAY()',
      'Why HR Uses It': 'Prevents lapsed medical, safety, or legal certifications with automatic countdowns.',
    },
  ];
  const wsFormulas = XLSX.utils.json_to_sheet(formulaCheatSheet);
  XLSX.utils.book_append_sheet(wb, wsFormulas, 'HR_Formula_CheatSheet');

  XLSX.writeFile(wb, 'Real_World_HR_Analytics_Workbook.xlsx');
}
