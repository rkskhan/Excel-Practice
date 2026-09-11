import { ColumnDef, DatasetSize, PracticeTopic, TableSheet, ChallengeQuestion } from '../types/excel';

export const REPS = [
  'Sarah Jenkins',
  'Marcus Vance',
  'Elena Rostova',
  'David Kim',
  'Priya Patel',
  'Jordan Lee',
  'Chloe Bennett',
  'Carlos Mendez',
  'Aisha Al-Mansoor',
  'Lucas Silva',
];

export const REGIONS = ['East', 'West', 'North', 'South', 'Central'];

export const CUSTOMER_STATUSES = ['Active', 'VIP Partner', 'Standard', 'Pending Review', 'At Risk'];

export const PRODUCT_CATALOG = [
  { id: 'PRD-101', name: 'UltraBook Pro 15"', category: 'Hardware & Laptops', unitPrice: 1499.0, supplier: 'NexTech Systems', minStock: 25 },
  { id: 'PRD-102', name: 'Ergonomic Mech Keyboard', category: 'Audio & Peripherals', unitPrice: 129.5, supplier: 'KeyCraft Labs', minStock: 80 },
  { id: 'PRD-103', name: '4K IPS Curved Monitor 32"', category: 'Monitors & Displays', unitPrice: 489.0, supplier: 'VisionMatrix', minStock: 40 },
  { id: 'PRD-104', name: 'Wireless ANC Headset Pro', category: 'Audio & Peripherals', unitPrice: 199.99, supplier: 'AcousticWave', minStock: 60 },
  { id: 'PRD-105', name: 'USB-C Thunderbolt Dock 12-in-1', category: 'Audio & Peripherals', unitPrice: 89.0, supplier: 'NexTech Systems', minStock: 100 },
  { id: 'PRD-106', name: 'Executive Mesh Ergonomic Chair', category: 'Office Ergonomics', unitPrice: 349.0, supplier: 'ErgoLife Corp', minStock: 30 },
  { id: 'PRD-107', name: 'Electric Dual-Motor Standing Desk', category: 'Office Ergonomics', unitPrice: 599.0, supplier: 'ErgoLife Corp', minStock: 20 },
  { id: 'PRD-108', name: 'Gigabit Wi-Fi 6 Mesh Router', category: 'Networking & Cables', unitPrice: 145.0, supplier: 'NetPulse Networks', minStock: 50 },
  { id: 'PRD-109', name: 'Ultra HD 4K Studio Webcam', category: 'Audio & Peripherals', unitPrice: 84.95, supplier: 'VisionMatrix', minStock: 75 },
  { id: 'PRD-110', name: 'Smart Power Surge Tower', category: 'Audio & Peripherals', unitPrice: 38.5, supplier: 'PowerSecure', minStock: 120 },
  { id: 'PRD-111', name: 'Cloud Workspace Suite (Annual)', category: 'Cloud Software', unitPrice: 240.0, supplier: 'CloudSync Inc', minStock: 999 },
  { id: 'PRD-112', name: 'Precision Wireless Laser Mouse', category: 'Audio & Peripherals', unitPrice: 59.0, supplier: 'KeyCraft Labs', minStock: 90 },
  { id: 'PRD-113', name: 'Rugged NVMe SSD 1TB Portable', category: 'Hardware & Laptops', unitPrice: 119.0, supplier: 'DataVault Solutions', minStock: 65 },
  { id: 'PRD-114', name: 'Cable Management Spine & Tray', category: 'Office Ergonomics', unitPrice: 24.5, supplier: 'ErgoLife Corp', minStock: 150 },
  { id: 'PRD-115', name: 'Gas-Spring Dual Monitor Arm', category: 'Monitors & Displays', unitPrice: 74.0, supplier: 'VisionMatrix', minStock: 45 },
];

export const SALES_REP_TIERS = [
  { rep: 'Sarah Jenkins', region: 'East', tier: 'Tier 1 (Senior)', commissionRate: 0.08, quota: 120000 },
  { rep: 'Marcus Vance', region: 'West', tier: 'Tier 1 (Senior)', commissionRate: 0.08, quota: 125000 },
  { rep: 'Elena Rostova', region: 'Central', tier: 'Tier 2 (Core)', commissionRate: 0.06, quota: 95000 },
  { rep: 'David Kim', region: 'North', tier: 'Tier 2 (Core)', commissionRate: 0.06, quota: 90000 },
  { rep: 'Priya Patel', region: 'South', tier: 'Tier 1 (Senior)', commissionRate: 0.08, quota: 110000 },
  { rep: 'Jordan Lee', region: 'East', tier: 'Tier 3 (Associate)', commissionRate: 0.04, quota: 65000 },
  { rep: 'Chloe Bennett', region: 'West', tier: 'Tier 2 (Core)', commissionRate: 0.06, quota: 85000 },
  { rep: 'Carlos Mendez', region: 'Central', tier: 'Tier 3 (Associate)', commissionRate: 0.04, quota: 60000 },
  { rep: 'Aisha Al-Mansoor', region: 'North', tier: 'Tier 1 (Senior)', commissionRate: 0.08, quota: 115000 },
  { rep: 'Lucas Silva', region: 'South', tier: 'Tier 3 (Associate)', commissionRate: 0.04, quota: 70000 },
];

export function getRowCount(size: DatasetSize): number {
  switch (size) {
    case 'small':
      return 50;
    case 'medium':
      return 500;
    case 'large':
      return 2000;
  }
}

// Pseudo-random generator with seed support for deterministic/repeatable testing
function createRng(seed = 12345) {
  let s = seed;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function generateDataset(
  topic: PracticeTopic,
  size: DatasetSize,
  options: {
    includeBlanks?: boolean;
    clearLookupTarget?: boolean;
    currencySymbol?: string;
    seed?: number;
  } = {}
): {
  primarySheet: TableSheet;
  secondarySheets: TableSheet[];
  seed: number;
} {
  const rowCount = getRowCount(size);
  const effectiveSeed =
    options.seed !== undefined && options.seed > 0
      ? options.seed
      : Math.floor(Math.random() * 2147483640) + 1;
  const rand = createRng(effectiveSeed);

  const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
  const randInt = (min: number, max: number): number => Math.floor(rand() * (max - min + 1)) + min;
  const randFloat = (min: number, max: number, decimals = 2): number =>
    Number((rand() * (max - min) + min).toFixed(decimals));

  const startDate = new Date('2024-01-02');
  const endDate = new Date('2024-12-15');
  const timeSpan = endDate.getTime() - startDate.getTime();

  const getRandomDate = () => new Date(startDate.getTime() + rand() * timeSpan);

  // 1. XLOOKUP / VLOOKUP DATASET
  if (topic === 'xlookup') {
    const primaryRows: Record<string, any>[] = [];
    const productLookupMap = new Map(PRODUCT_CATALOG.map((p) => [p.id, p]));

    for (let i = 1; i <= rowCount; i++) {
      const orderId = `ORD-${1000 + i}`;
      const orderDate = formatDate(getRandomDate());
      const rep = pick(REPS);
      const region = pick(REGIONS);
      const customerId = `CUST-${randInt(101, 160)}`;
      
      // Deliberately introduce missing Product ID if includeBlanks is enabled
      const isMissingProduct = options.includeBlanks && rand() < 0.05;
      const product = isMissingProduct
        ? { id: 'PRD-999', name: 'Unknown Discontinued Item', category: 'Unassigned', unitPrice: 0 }
        : pick(PRODUCT_CATALOG);

      const quantity = randInt(1, 12);
      // In practice exercises, the user needs to populate Unit Price via XLOOKUP!
      const unitPrice = options.clearLookupTarget ? '' : product.unitPrice;
      const totalSales = options.clearLookupTarget ? '' : Number((product.unitPrice * quantity).toFixed(2));
      const customerStatus = pick(CUSTOMER_STATUSES);

      primaryRows.push({
        order_id: orderId,
        order_date: orderDate,
        customer_id: customerId,
        sales_rep: rep,
        region: region,
        product_id: product.id,
        quantity: quantity,
        unit_price: unitPrice,
        total_sales: totalSales,
        customer_status: customerStatus,
      });
    }

    const primaryColumns: ColumnDef[] = [
      { key: 'order_id', label: 'Order ID', type: 'text', excelLetter: 'A' },
      { key: 'order_date', label: 'Order Date', type: 'date', excelLetter: 'B' },
      { key: 'customer_id', label: 'Customer ID', type: 'text', excelLetter: 'C' },
      { key: 'sales_rep', label: 'Sales Rep', type: 'text', excelLetter: 'D' },
      { key: 'region', label: 'Region', type: 'text', excelLetter: 'E' },
      { key: 'product_id', label: 'Product ID', type: 'text', excelLetter: 'F', description: 'Lookup Key' },
      { key: 'quantity', label: 'Quantity', type: 'number', excelLetter: 'G' },
      { key: 'unit_price', label: 'Unit Price', type: 'currency', excelLetter: 'H', description: 'Formula target via XLOOKUP' },
      { key: 'total_sales', label: 'Total Sales', type: 'currency', excelLetter: 'I', description: '=G2*H2' },
      { key: 'customer_status', label: 'Customer Status', type: 'badge', excelLetter: 'J' },
    ];

    const catalogColumns: ColumnDef[] = [
      { key: 'id', label: 'Product ID', type: 'text', excelLetter: 'A', description: 'Key identifier' },
      { key: 'name', label: 'Product Name', type: 'text', excelLetter: 'B' },
      { key: 'category', label: 'Category', type: 'text', excelLetter: 'C' },
      { key: 'unitPrice', label: 'Unit Price', type: 'currency', excelLetter: 'D', description: 'Target return value' },
      { key: 'supplier', label: 'Supplier', type: 'text', excelLetter: 'E' },
      { key: 'minStock', label: 'Min Stock Level', type: 'number', excelLetter: 'F' },
    ];

    const tiersColumns: ColumnDef[] = [
      { key: 'rep', label: 'Sales Rep', type: 'text', excelLetter: 'A' },
      { key: 'region', label: 'Territory', type: 'text', excelLetter: 'B' },
      { key: 'tier', label: 'Seniority Tier', type: 'text', excelLetter: 'C' },
      { key: 'commissionRate', label: 'Commission Rate', type: 'percent', excelLetter: 'D' },
      { key: 'quota', label: 'Annual Target', type: 'currency', excelLetter: 'E' },
    ];

    return {
      primarySheet: {
        id: 'sales_transactions',
        name: 'Sales Transactions',
        fileName: 'Excel_Practice_Sales_Transactions.csv',
        description: 'Main sales fact table. Use column F (Product ID) to lookup Unit Price from the Product Catalog!',
        columns: primaryColumns,
        rows: primaryRows,
      },
      secondarySheets: [
        {
          id: 'product_catalog',
          name: 'Product Master Catalog',
          fileName: 'Excel_Practice_Product_Catalog.csv',
          description: 'Reference dimension table containing master product pricing, categories, and suppliers.',
          columns: catalogColumns,
          rows: PRODUCT_CATALOG,
        },
        {
          id: 'rep_tiers',
          name: 'Sales Rep Tiers & Bonus',
          fileName: 'Excel_Practice_Rep_Tiers.csv',
          description: 'Secondary reference table for looking up commission rates by sales representative.',
          columns: tiersColumns,
          rows: SALES_REP_TIERS,
        },
      ],
      seed: effectiveSeed,
    };
  }

  // 2. PIVOT TABLES DATASET
  if (topic === 'pivot') {
    const primaryRows: Record<string, any>[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const segments = ['Enterprise', 'Mid-Market', 'Small Business', 'Government'];
    const channels = ['Direct Sales', 'Online Store', 'Partner Reseller', 'Enterprise RFP'];

    for (let i = 1; i <= rowCount; i++) {
      const orderDateObj = getRandomDate();
      const monthIdx = orderDateObj.getMonth();
      const monthName = months[monthIdx];
      const quarter = quarters[Math.floor(monthIdx / 3)];
      const product = pick(PRODUCT_CATALOG);
      const rep = pick(REPS);
      const region = pick(REGIONS);
      const segment = pick(segments);
      const channel = pick(channels);
      const quantity = randInt(1, 20);
      const unitPrice = product.unitPrice;
      const discountPct = pick([0, 0.05, 0.1, 0.15, 0.2]);
      const grossSales = Number((quantity * unitPrice).toFixed(2));
      const discountAmount = Number((grossSales * discountPct).toFixed(2));
      const netSales = Number((grossSales - discountAmount).toFixed(2));
      // Approximate cost as 55-70% of base price
      const estimatedCost = Number((unitPrice * 0.62 * quantity).toFixed(2));
      const netProfit = Number((netSales - estimatedCost).toFixed(2));

      primaryRows.push({
        order_id: `PO-${20000 + i}`,
        order_date: formatDate(orderDateObj),
        year: orderDateObj.getFullYear(),
        quarter: quarter,
        month: monthName,
        region: region,
        sales_rep: rep,
        customer_segment: segment,
        sales_channel: channel,
        product_category: product.category,
        product_name: product.name,
        quantity: quantity,
        unit_price: unitPrice,
        discount_rate: discountPct,
        gross_sales: grossSales,
        net_sales: netSales,
        net_profit: netProfit,
      });
    }

    const pivotColumns: ColumnDef[] = [
      { key: 'order_id', label: 'Order ID', type: 'text', excelLetter: 'A' },
      { key: 'order_date', label: 'Date', type: 'date', excelLetter: 'B' },
      { key: 'quarter', label: 'Quarter', type: 'text', excelLetter: 'C' },
      { key: 'month', label: 'Month', type: 'text', excelLetter: 'D' },
      { key: 'region', label: 'Region', type: 'text', excelLetter: 'E' },
      { key: 'sales_rep', label: 'Sales Rep', type: 'text', excelLetter: 'F' },
      { key: 'customer_segment', label: 'Customer Segment', type: 'text', excelLetter: 'G' },
      { key: 'sales_channel', label: 'Channel', type: 'text', excelLetter: 'H' },
      { key: 'product_category', label: 'Product Category', type: 'text', excelLetter: 'I' },
      { key: 'quantity', label: 'Quantity', type: 'number', excelLetter: 'J' },
      { key: 'unit_price', label: 'Unit Price', type: 'currency', excelLetter: 'K' },
      { key: 'discount_rate', label: 'Discount %', type: 'percent', excelLetter: 'L' },
      { key: 'gross_sales', label: 'Gross Sales', type: 'currency', excelLetter: 'M' },
      { key: 'net_sales', label: 'Net Sales', type: 'currency', excelLetter: 'N' },
      { key: 'net_profit', label: 'Net Profit', type: 'currency', excelLetter: 'O' },
    ];

    return {
      primarySheet: {
        id: 'pivot_sales_matrix',
        name: 'Regional Sales Matrix',
        fileName: 'Excel_Practice_Pivot_Sales_Matrix.csv',
        description: 'Multi-dimensional transaction dataset with dates, regions, segments, sales reps, and financial metrics.',
        columns: pivotColumns,
        rows: primaryRows,
      },
      secondarySheets: [],
      seed: effectiveSeed,
    };
  }

  // 3. POWER QUERY DATASET (Unpivot & Transform / Merge)
  if (topic === 'power_query') {
    // Scenario 1: Wide Quarterly Stores Matrix (Ideal for "Unpivot Columns")
    const storeCount = Math.min(rowCount, 150); // stores usually 50-150
    const storeRows: Record<string, any>[] = [];
    const storeTypes = ['Flagship Retail', 'Mall Outlet', 'B2B Center', 'Express Kiosk', 'Regional Hub'];
    const cities = [
      { name: 'New York Central', region: 'East' },
      { name: 'Boston Downtown', region: 'East' },
      { name: 'Chicago Loop', region: 'Central' },
      { name: 'Dallas Galleria', region: 'Central' },
      { name: 'San Francisco Market', region: 'West' },
      { name: 'Seattle Westlake', region: 'West' },
      { name: 'Atlanta Midtown', region: 'South' },
      { name: 'Miami Brickell', region: 'South' },
      { name: 'Minneapolis Nicollet', region: 'North' },
      { name: 'Denver 16th Street', region: 'West' },
    ];

    for (let i = 1; i <= storeCount; i++) {
      const cityObj = cities[(i - 1) % cities.length];
      const q1 = randInt(45000, 185000);
      const q2 = randInt(50000, 195000);
      const q3 = randInt(48000, 210000);
      const q4 = randInt(65000, 260000);
      const total = q1 + q2 + q3 + q4;

      // Deliberately introduce messy whitespace or casing if requested to practice Power Query Text.Trim/Clean
      const rawStoreName = options.includeBlanks && i % 4 === 0 
        ? `  ${cityObj.name} Store #${100 + i}  ` 
        : `${cityObj.name} Store #${100 + i}`;

      storeRows.push({
        store_id: `STR-${1000 + i}`,
        store_name: rawStoreName,
        region: cityObj.region,
        store_type: pick(storeTypes),
        manager: REPS[(i - 1) % REPS.length],
        q1_sales: q1,
        q2_sales: q2,
        q3_sales: q3,
        q4_sales: q4,
        annual_total: total,
      });
    }

    const storeColumns: ColumnDef[] = [
      { key: 'store_id', label: 'Store ID', type: 'text', excelLetter: 'A' },
      { key: 'store_name', label: 'Store Name', type: 'text', excelLetter: 'B', description: 'Wide format with leading/trailing spaces' },
      { key: 'region', label: 'Region', type: 'text', excelLetter: 'C' },
      { key: 'store_type', label: 'Store Type', type: 'text', excelLetter: 'D' },
      { key: 'manager', label: 'Manager', type: 'text', excelLetter: 'E' },
      { key: 'q1_sales', label: '2024_Q1', type: 'currency', excelLetter: 'F', description: 'Unpivot target' },
      { key: 'q2_sales', label: '2024_Q2', type: 'currency', excelLetter: 'G', description: 'Unpivot target' },
      { key: 'q3_sales', label: '2024_Q3', type: 'currency', excelLetter: 'H', description: 'Unpivot target' },
      { key: 'q4_sales', label: '2024_Q4', type: 'currency', excelLetter: 'I', description: 'Unpivot target' },
      { key: 'annual_total', label: 'Annual Total', type: 'currency', excelLetter: 'J' },
    ];

    // Secondary table for Power Query Merge Queries challenge (Customer Dimension)
    const customerMasterRows: Record<string, any>[] = [];
    for (let c = 101; c <= 150; c++) {
      customerMasterRows.push({
        customer_id: `CUST-${c}`,
        company_name: `Enterprise Client #${c}`,
        industry: pick(['Healthcare', 'Fintech', 'Logistics', 'Retail', 'Education', 'Biotech']),
        credit_limit: pick([50000, 100000, 250000, 500000]),
        payment_terms: pick(['Net 30', 'Net 60', 'Immediate']),
      });
    }

    const customerMasterColumns: ColumnDef[] = [
      { key: 'customer_id', label: 'Customer ID', type: 'text', excelLetter: 'A' },
      { key: 'company_name', label: 'Company Name', type: 'text', excelLetter: 'B' },
      { key: 'industry', label: 'Industry', type: 'text', excelLetter: 'C' },
      { key: 'credit_limit', label: 'Credit Limit', type: 'currency', excelLetter: 'D' },
      { key: 'payment_terms', label: 'Payment Terms', type: 'text', excelLetter: 'E' },
    ];

    return {
      primarySheet: {
        id: 'quarterly_store_sales',
        name: 'Store Quarterly Sales (Wide Table)',
        fileName: 'Excel_Practice_PowerQuery_Unpivot_Stores.csv',
        description: 'Classic wide cross-tab report. Perfect for practicing Power Query "Transform > Unpivot Other Columns"!',
        columns: storeColumns,
        rows: storeRows,
      },
      secondarySheets: [
        {
          id: 'customer_dimension',
          name: 'Customer Dimension (For Merge)',
          fileName: 'Excel_Practice_Customer_Dimension.csv',
          description: 'Dimension table to practice Power Query "Home > Merge Queries" and expanding relational columns.',
          columns: customerMasterColumns,
          rows: customerMasterRows,
        },
      ],
      seed: effectiveSeed,
    };
  }

  // 4. CONDITIONAL FORMATTING & FORMULAS DATASET
  // Topic: Rep Quota Performance & KPIs Tracker
  const perfRows: Record<string, any>[] = [];
  const repList = rowCount <= 50 ? REPS : Array.from({ length: rowCount }, (_, i) => `Associate Rep #${100 + i}`);

  for (let i = 0; i < repList.length; i++) {
    const repName = repList[i];
    const region = pick(REGIONS);
    const department = pick(['Commercial Sales', 'Strategic Accounts', 'SMB Growth', 'Renewals']);
    const monthlyQuota = randInt(40000, 150000);
    // Attainment varies from 40% to 160%
    const attainmentRatio = randFloat(0.4, 1.55);
    const actualRevenue = Number((monthlyQuota * attainmentRatio).toFixed(2));
    const dealsClosed = randInt(4, 35);
    const csatRating = randFloat(3.2, 5.0, 1);
    const overdueTasks = randInt(0, 8);
    
    // Status flag based on attainment
    let status = 'On Track';
    let bonusEligible = 'No';
    if (attainmentRatio >= 1.2 && csatRating >= 4.5) {
      status = 'Star Performer';
      bonusEligible = 'Double Bonus (200%)';
    } else if (attainmentRatio >= 1.0) {
      status = 'Target Met';
      bonusEligible = 'Standard Bonus (100%)';
    } else if (attainmentRatio < 0.75 || overdueTasks >= 5) {
      status = 'Needs Attention';
      bonusEligible = 'No';
    }

    perfRows.push({
      employee_id: `EMP-${5000 + i + 1}`,
      rep_name: repName,
      department: department,
      region: region,
      monthly_quota: monthlyQuota,
      actual_revenue: actualRevenue,
      quota_attainment: attainmentRatio,
      deals_closed: dealsClosed,
      csat_rating: csatRating,
      overdue_tasks: overdueTasks,
      performance_status: status,
      bonus_status: bonusEligible,
    });
  }

  const perfColumns: ColumnDef[] = [
    { key: 'employee_id', label: 'Emp ID', type: 'text', excelLetter: 'A' },
    { key: 'rep_name', label: 'Sales Rep', type: 'text', excelLetter: 'B' },
    { key: 'department', label: 'Department', type: 'text', excelLetter: 'C' },
    { key: 'region', label: 'Region', type: 'text', excelLetter: 'D' },
    { key: 'monthly_quota', label: 'Monthly Quota', type: 'currency', excelLetter: 'E' },
    { key: 'actual_revenue', label: 'Actual Revenue', type: 'currency', excelLetter: 'F' },
    { key: 'quota_attainment', label: 'Attainment %', type: 'percent', excelLetter: 'G', description: '=F2/E2 (Use Data Bars)' },
    { key: 'deals_closed', label: 'Deals Closed', type: 'number', excelLetter: 'H' },
    { key: 'csat_rating', label: 'CSAT Score (1-5)', type: 'number', excelLetter: 'I', description: 'Use Icon Sets' },
    { key: 'overdue_tasks', label: 'Overdue Tasks', type: 'number', excelLetter: 'J', description: 'Highlight > 3 in Red' },
    { key: 'performance_status', label: 'Performance Status', type: 'badge', excelLetter: 'K', description: 'Highlight Text' },
    { key: 'bonus_status', label: 'Bonus Eligible', type: 'text', excelLetter: 'L' },
  ];

  return {
    primarySheet: {
      id: 'quota_performance',
      name: 'Sales Quota & KPI Tracker',
      fileName: 'Excel_Practice_KPI_Performance_Tracker.csv',
      description: 'KPI performance metrics dataset engineered for practicing Data Bars, Color Scales, Icon Sets, and `=AND()` custom formula rules.',
      columns: perfColumns,
      rows: perfRows,
    },
    secondarySheets: [],
    seed: effectiveSeed,
  };
}

// Convert dataset to standard RFC 4180 CSV
export function exportToCsv(rows: Record<string, any>[], columns: ColumnDef[], fileName: string): void {
  const header = columns.map((col) => `"${col.label.replace(/"/g, '""')}"`).join(',');
  const lines = rows.map((row) => {
    return columns
      .map((col) => {
        const val = row[col.key];
        if (val === null || val === undefined) return '""';
        let str = String(val);
        // Clean double quotes
        str = str.replace(/"/g, '""');
        return `"${str}"`;
      })
      .join(',');
  });

  const csvContent = [header, ...lines].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Copy to clipboard as Tab-Separated Values (TSV)
// When pasted into Microsoft Excel or Google Sheets, TSV automatically maps directly into cells!
export async function copyToClipboardAsTsv(rows: Record<string, any>[], columns: ColumnDef[]): Promise<boolean> {
  const header = columns.map((col) => col.label).join('\t');
  const lines = rows.map((row) => {
    return columns
      .map((col) => {
        const val = row[col.key];
        if (val === null || val === undefined) return '';
        return String(val).replace(/\t|\r|\n/g, ' ');
      })
      .join('\t');
  });

  const tsvContent = [header, ...lines].join('\n');
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(tsvContent);
      return true;
    } else {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = tsvContent;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}

// Dynamic challenge question answers computed from CURRENT active dataset
export function generateChallengeQuestions(
  topic: PracticeTopic,
  primarySheet: TableSheet,
  secondarySheets: TableSheet[]
): ChallengeQuestion[] {
  const rows = primarySheet.rows;

  if (topic === 'xlookup') {
    // Challenge 1: Find total count of orders for a specific sales rep
    const targetRep = rows[0]?.sales_rep || 'Sarah Jenkins';
    const repOrdersCount = rows.filter((r) => r.sales_rep === targetRep).length;

    // Challenge 2: Find unit price of a specific product ID in Product Catalog
    const sampleProduct = PRODUCT_CATALOG[2] || PRODUCT_CATALOG[0];

    // Challenge 3: Total sales for "West" region
    const catalogMap = new Map(PRODUCT_CATALOG.map((p) => [p.id, p.unitPrice]));
    const westSales = rows
      .filter((r) => r.region === 'West')
      .reduce((acc, r) => {
        if (typeof r.total_sales === 'number') return acc + r.total_sales;
        const price = catalogMap.get(r.product_id) || 0;
        return acc + price * (r.quantity || 0);
      }, 0);

    return [
      {
        id: 'xl-1',
        question: `Using XLOOKUP or VLOOKUP, what is the Unit Price of Product ID "${sampleProduct.id}"?`,
        expectedAnswer: sampleProduct.unitPrice,
        displayAnswer: `$${sampleProduct.unitPrice.toFixed(2)}`,
        excelFormula: `=XLOOKUP("${sampleProduct.id}", Product_Catalog!A2:A16, Product_Catalog!D2:D16)`,
        explanation: `Lookup "${sampleProduct.id}" in column A of the Product Master Catalog and return the corresponding value from column D (Unit Price).`,
        hint: `Reference sheet syntax is SheetName!A2:A16. In older Excel, use =VLOOKUP("${sampleProduct.id}", Product_Catalog!A2:D16, 4, FALSE)`,
        difficulty: 'Beginner',
      },
      {
        id: 'xl-2',
        question: `How many total orders were processed by Sales Rep "${targetRep}"?`,
        expectedAnswer: repOrdersCount,
        displayAnswer: `${repOrdersCount} orders`,
        excelFormula: `=COUNTIF(D2:D${rows.length + 1}, "${targetRep}")`,
        explanation: `Use COUNTIF to tally every row where the Sales Rep in Column D matches "${targetRep}".`,
        hint: `Syntax: =COUNTIF(range, criteria). Column D contains Sales Rep names.`,
        difficulty: 'Beginner',
      },
      {
        id: 'xl-3',
        question: `What is the grand total sales amount generated across all orders in the "West" region?`,
        expectedAnswer: Math.round(westSales),
        displayAnswer: `$${westSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        excelFormula: `=SUMIF(E2:E${rows.length + 1}, "West", I2:I${rows.length + 1})`,
        explanation: `Use SUMIF with criteria "West" in Region column E, summing the Total Sales column I.`,
        hint: `Syntax: =SUMIF(range, criteria, [sum_range]). Sum column I where column E is "West".`,
        difficulty: 'Intermediate',
      },
    ];
  }

  if (topic === 'pivot') {
    // Challenge 1: Top sales region
    const regionTotals: Record<string, number> = {};
    rows.forEach((r) => {
      const reg = r.region || 'Unknown';
      regionTotals[reg] = (regionTotals[reg] || 0) + (r.net_sales || 0);
    });
    const sortedRegions = Object.entries(regionTotals).sort((a, b) => b[1] - a[1]);
    const topRegion = sortedRegions[0] ? sortedRegions[0][0] : 'East';
    const topRegionSales = sortedRegions[0] ? sortedRegions[0][1] : 0;

    // Challenge 2: Total units of "Hardware & Laptops" category sold
    const laptopUnits = rows
      .filter((r) => r.product_category === 'Hardware & Laptops')
      .reduce((sum, r) => sum + (r.quantity || 0), 0);

    return [
      {
        id: 'pvt-1',
        question: `In a Pivot Table with Region in Rows and Net Sales in Values, which Region achieved the highest total Net Sales?`,
        expectedAnswer: topRegion,
        displayAnswer: `${topRegion} ($${topRegionSales.toLocaleString('en-US', { maximumFractionDigits: 0 })})`,
        excelFormula: `Pivot Table: Drag Region to Rows, Net Sales to Values (Summarize by Sum), Sort Descending by Sum of Net Sales`,
        explanation: `A simple one-field row breakdown quickly highlights the top-performing territory without writing any formulas.`,
        hint: `Click inside the Pivot Table, right click any value in the Net Sales column > Sort > Sort Largest to Smallest.`,
        difficulty: 'Beginner',
      },
      {
        id: 'pvt-2',
        question: `What is the total quantity of items sold within the "Hardware & Laptops" product category?`,
        expectedAnswer: laptopUnits,
        displayAnswer: `${laptopUnits.toLocaleString()} units`,
        excelFormula: `=SUMIF(I2:I${rows.length + 1}, "Hardware & Laptops", J2:J${rows.length + 1})`,
        explanation: `Drag Product Category to Rows and Quantity to Values, or write a SUMIF formula checking column I.`,
        hint: `In your Pivot Table, filter or row-group by Product Category and check the Quantity column sum.`,
        difficulty: 'Intermediate',
      },
    ];
  }

  if (topic === 'power_query') {
    // Total stores in West region
    const westStores = rows.filter((r) => r.region === 'West').length;
    // Total annual sales sum
    const totalSalesSum = rows.reduce((sum, r) => sum + (r.annual_total || 0), 0);

    return [
      {
        id: 'pq-1',
        question: `After unpivoting the 4 quarterly columns into an "Attribute" (Quarter) and "Value" (Sales) column, how many total rows will the transformed dataset contain?`,
        expectedAnswer: rows.length * 4,
        displayAnswer: `${(rows.length * 4).toLocaleString()} rows (${rows.length} stores × 4 quarters)`,
        excelFormula: `Power Query M-Code: = Table.UnpivotOtherColumns(#"Changed Type", {"store_id", "store_name", "region", "store_type", "manager", "annual_total"}, "Quarter", "Sales")`,
        explanation: `Unpivoting expands each wide row into 4 discrete quarter rows, turning cross-tabulated data into normalized 2D records ideal for analysis.`,
        hint: `Each store had 4 quarterly columns. 1 row × 4 quarters = 4 rows per store in the unpivoted output.`,
        difficulty: 'Intermediate',
      },
      {
        id: 'pq-2',
        question: `How many retail store locations are located in the "West" Region?`,
        expectedAnswer: westStores,
        displayAnswer: `${westStores} stores`,
        excelFormula: `=COUNTIF(C2:C${rows.length + 1}, "West")`,
        explanation: `In Power Query, you can filter Region = "West" or apply a Group By step to view store counts by region.`,
        hint: `Column C is Region. Filter dropdown in Power Query or use COUNTIF.`,
        difficulty: 'Beginner',
      },
    ];
  }

  // Conditional formatting topic
  const starPerformers = rows.filter((r) => r.performance_status === 'Star Performer').length;
  const targetMet = rows.filter((r) => r.quota_attainment >= 1.0).length;

  return [
    {
      id: 'cf-1',
      question: `How many sales representatives exceeded 100% of their monthly quota (Attainment >= 1.0)?`,
      expectedAnswer: targetMet,
      displayAnswer: `${targetMet} representatives`,
      excelFormula: `=COUNTIF(G2:G${rows.length + 1}, ">=1.0")`,
      explanation: `Count all employees where Column G (Attainment %) is greater than or equal to 1.0 (100%).`,
      hint: `Syntax: =COUNTIF(range, ">=1"). Make sure the criteria is wrapped in quotes.`,
      difficulty: 'Beginner',
    },
    {
      id: 'cf-2',
      question: `What exact Conditional Formatting custom formula rule would highlight the entire row for any employee whose Actual Revenue (Column F) is greater than their Quota (Column E)?`,
      expectedAnswer: '=$F2>$E2',
      displayAnswer: `=$F2>$E2`,
      excelFormula: `Rule: Use a formula to determine which cells to format: =$F2>$E2 applied to =$A$2:$L$${rows.length + 1}`,
      explanation: `The dollar sign ($) locks the column reference so that every cell in the row inspects column F and E, while the relative row reference (2) allows the rule to evaluate dynamically for row 3, 4, 5...`,
      hint: `Remember to lock the column letters with $ (e.g. =$F2) so the entire row highlights, not just individual cells!`,
      difficulty: 'Advanced',
    },
  ];
}
