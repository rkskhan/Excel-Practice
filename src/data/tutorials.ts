import { TopicTutorial } from '../types/excel';

export const TOPIC_TUTORIALS: Record<string, TopicTutorial> = {
  xlookup: {
    topic: 'xlookup',
    title: 'XLOOKUP & VLOOKUP Mastery',
    subtitle: 'Pulling prices, customer details, and relational attributes between tables seamlessly.',
    objective: 'Pull the Unit Price from the "Product Master Catalog" table into your "Sales Transactions" sheet based on matching Product ID.',
    badge: 'Core Formula Skill',
    steps: [
      {
        stepNumber: 1,
        title: 'Inspect the Common Lookup Key',
        description: 'Notice that both sheets share a common key: Product ID (Column F in "Sales Transactions", Column A in "Product Master Catalog").',
        proTip: 'Always verify that lookup keys have identical formatting (no hidden leading/trailing spaces or mixed text/number types).',
      },
      {
        stepNumber: 2,
        title: 'Construct the Modern XLOOKUP Formula (Recommended)',
        description: 'Click into cell H2 (Unit Price) in the Sales Transactions sheet. Enter the XLOOKUP formula referencing the master catalog.',
        excelAction: 'Enter in Cell H2: =XLOOKUP(F2, Product_Catalog!$A$2:$A$16, Product_Catalog!$D$2:$D$16, "Not Found")',
        formula: {
          code: '=XLOOKUP(F2, Product_Catalog!$A$2:$A$16, Product_Catalog!$D$2:$D$16, "Not Found")',
          explanation: 'Finds the product ID in cell F2 inside Product_Catalog column A, and returns the unit price from column D.',
          breakdown: [
            { part: 'F2', meaning: 'lookup_value: The Product ID you want to search for in this row.' },
            { part: 'Product_Catalog!$A$2:$A$16', meaning: 'lookup_array: The column where Excel should search for matches. Press F4 to lock references with $ signs.' },
            { part: 'Product_Catalog!$D$2:$D$16', meaning: 'return_array: The column containing the value you want to retrieve (Unit Price). Locked with $ signs.' },
            { part: '"Not Found"', meaning: '[if_not_found]: Optional fallback text if the ID does not exist, preventing ugly #N/A errors!' },
          ],
        },
        proTip: 'Unlike VLOOKUP, XLOOKUP defaults to an exact match, can search to the left, and never breaks when new columns are inserted!',
      },
      {
        stepNumber: 3,
        title: 'Legacy Fallback: How to Write the Classic VLOOKUP',
        description: 'If your organization uses Excel 2016, 2019, or older perpetual licenses without XLOOKUP support, use VLOOKUP.',
        excelAction: 'Enter in Cell H2: =VLOOKUP(F2, Product_Catalog!$A$2:$D$16, 4, FALSE)',
        formula: {
          code: '=VLOOKUP(F2, Product_Catalog!$A$2:$D$16, 4, FALSE)',
          explanation: 'Classic vertical lookup. Column 4 of range A:D is Unit Price. FALSE enforces an exact match.',
          breakdown: [
            { part: 'F2', meaning: 'lookup_value: The target Product ID.' },
            { part: 'Product_Catalog!$A$2:$D$16', meaning: 'table_array: Full range starting from the lookup key column (A) through the return column (D).' },
            { part: '4', meaning: 'col_index_num: The 1-based column number (A=1, B=2, C=3, D=4).' },
            { part: 'FALSE', meaning: '[range_lookup]: Enforces exact match. Never omit this or Excel may return incorrect approximate values!' },
          ],
        },
        proTip: 'Wrap VLOOKUP in =IFERROR(VLOOKUP(...), "Not Found") to handle missing IDs gracefully.',
      },
      {
        stepNumber: 4,
        title: 'Flash Fill / Double-Click to Copy Down',
        description: 'Hover your cursor over the bottom-right corner of cell H2 until the cursor turns into a black plus sign (+), then double-click. Excel will automatically flash fill the formula down for all 50, 500, or 2,000 rows!',
        excelAction: 'Shortcut: Select H2:H501 and press Ctrl + D (Fill Down).',
        proTip: 'If your data is formatted as an official Excel Table (Ctrl + T), Excel calculates the entire calculated column instantly without dragging!',
      },
    ],
    alternativeFormulas: [
      {
        name: 'INDEX / MATCH (The Robust Pre-XLOOKUP Solution)',
        code: '=INDEX(Product_Catalog!$D$2:$D$16, MATCH(F2, Product_Catalog!$A$2:$A$16, 0))',
        note: 'Ideal for legacy Excel workbooks requiring two-way lookups or leftward lookups without column counting.',
      },
      {
        name: 'Structured Table Reference (Cleanest in Excel)',
        code: '=XLOOKUP([@[Product ID]], Table_Catalog[Product ID], Table_Catalog[Unit Price], 0)',
        note: 'When both datasets are formatted as Excel Tables (Ctrl + T), formulas use clean human-readable column names.',
      },
    ],
  },

  pivot: {
    topic: 'pivot',
    title: 'Pivot Tables & Slicers Workshop',
    subtitle: 'Aggregate, slice, and discover multi-dimensional insights without writing complex formulas.',
    objective: 'Summarize Total Net Sales and Profit by Region and Product Category, and configure an interactive Month Slicer.',
    badge: 'Executive Reporting',
    steps: [
      {
        stepNumber: 1,
        title: 'Convert Raw Data to an Official Excel Table',
        description: 'Click anywhere inside your downloaded practice CSV in Excel. Press Ctrl + T (Cmd + T on Mac) to turn it into an Excel Table. Check the box "My table has headers".',
        excelAction: 'Shortcut: Ctrl + T > Enter. Name the table "SalesData" in the Table Design tab.',
        proTip: 'Converting to an official Excel Table guarantees that if you add new rows later, refreshing the Pivot Table will automatically include the new data without changing source ranges!',
      },
      {
        stepNumber: 2,
        title: 'Insert the Pivot Table',
        description: 'Navigate to the top ribbon: Insert > PivotTable. Choose "New Worksheet" and click OK. The PivotTable Fields pane will appear on the right side of Excel.',
        excelAction: 'Ribbon: Insert > PivotTable > From Table/Range > OK.',
        proTip: 'Keyboard shortcut for fast Pivot Table creation: Alt + N + V + T + Enter.',
      },
      {
        stepNumber: 3,
        title: 'Arrange Fields into the 4 Quadrants',
        description: 'Drag and drop fields from the field list into the four layout zones:',
        excelAction: 'Rows: "Region" | Columns: "Product Category" | Values: "Net Sales" (Sum) | Filters: "Quarter"',
        formula: {
          code: 'Field Setup: Rows [Region], Columns [Product Category], Values [Sum of Net Sales]',
          explanation: 'This generates a matrix comparing sales across every region by product category.',
          breakdown: [
            { part: 'Rows Area', meaning: 'Creates unique horizontal row labels for each Region (East, West, North, etc.).' },
            { part: 'Columns Area', meaning: 'Creates vertical columns for each Product Category (Hardware, Displays, Audio).' },
            { part: 'Values Area', meaning: 'Calculates the mathematical aggregation (Sum of Net Sales).' },
            { part: 'Filters / Slicers', meaning: 'Allows high-level global filtering by Quarter or Sales Channel.' },
          ],
        },
        proTip: 'To format values as currency, right-click any number in the Pivot Table > Value Field Settings > Number Format > Currency ($). Do not use the Home tab format button, as it will reset on refresh!',
      },
      {
        stepNumber: 4,
        title: 'Add an Interactive Slicer',
        description: 'With any cell in the Pivot Table selected, go to the PivotTable Analyze ribbon tab > Click "Insert Slicer" > Check "Month" and "Sales Channel". Click OK.',
        excelAction: 'Ribbon: PivotTable Analyze > Insert Slicer > Select [Month] & [Sales Channel].',
        proTip: 'Slicers provide one-click visual filtering buttons that executives love for dashboard presentations!',
      },
      {
        stepNumber: 5,
        title: 'Show Values as % of Grand Total or Column Total',
        description: 'Drag "Net Sales" into the Values quadrant a second time. Right-click the new column > Show Values As > "% of Grand Total". Rename the header to "% Share".',
        proTip: 'This gives you both the absolute revenue dollar figure and the relative market share in one compact view.',
      },
    ],
    alternativeFormulas: [
      {
        name: 'Calculated Field (Profit Margin)',
        code: "= ('Net Sales' - 'Estimated Cost') / 'Net Sales'",
        note: 'PivotTable Analyze > Fields, Items, & Sets > Calculated Field. Creates a custom metric evaluated across all aggregations.',
      },
      {
        name: 'SUMIFS Equivalent Formula',
        code: '=SUMIFS($N$2:$N$501, $E$2:$E$501, "East", $I$2:$I$501, "Hardware & Laptops")',
        note: 'How you would calculate the same intersection cell using traditional Excel formulas.',
      },
    ],
  },

  power_query: {
    topic: 'power_query',
    title: 'Power Query Data Transformation',
    subtitle: 'Automate tedious data cleaning, unpivoting wide spreadsheets, and merging tables like an ETL engineer.',
    objective: 'Transform wide quarterly columns (2024_Q1 to 2024_Q4) into a normalized tabular format and merge with the Customer Dimension table.',
    badge: 'Modern Data Prep',
    steps: [
      {
        stepNumber: 1,
        title: 'Load the Practice Data into Power Query',
        description: 'Open your downloaded CSV in Excel. Navigate to Data > From Sheet / From Table/Range. The Power Query Editor window will open.',
        excelAction: 'Ribbon: Data > Get & Transform Data > From Sheet (or From Text/CSV).',
        proTip: 'Power Query records every cleaning step as an automated recipe in the Applied Steps pane, so you can repeat it on new files with 1 click!',
      },
      {
        stepNumber: 2,
        title: 'The Famous "Unpivot Other Columns" Transformation',
        description: 'Wide tables with quarters or months across the top are impossible to pivot cleanly. We must normalize them into two columns: Quarter and Sales.',
        excelAction: 'Step: Hold Ctrl and select the metadata columns: [Store ID], [Store Name], [Region], [Store Type], [Manager]. Right-click any selected header > "Unpivot Other Columns".',
        formula: {
          code: '= Table.UnpivotOtherColumns(#"Changed Type", {"store_id", "store_name", "region", "store_type", "manager"}, "Quarter", "Revenue")',
          explanation: 'Collapses the 4 quarterly columns (Q1, Q2, Q3, Q4) into two columns named "Quarter" and "Revenue".',
          breakdown: [
            { part: 'Attribute Column', meaning: 'Automatically holds the original header names ("2024_Q1", "2024_Q2", etc.). Rename this to "Quarter".' },
            { part: 'Value Column', meaning: 'Holds the corresponding sales number for that store and quarter. Rename to "Sales Revenue".' },
          ],
        },
        proTip: 'Always choose "Unpivot Other Columns" instead of "Unpivot Selected Columns". If a new quarter column (like Q5 or next year Q1) is added later, it will automatically be unpivoted without breaking!',
      },
      {
        stepNumber: 3,
        title: 'Clean Messy Text (Trim & Clean Whitespace)',
        description: 'In practice data, names often contain extra leading or trailing spaces. Select [Store Name] > Transform tab > Format > Trim, then Clean.',
        excelAction: 'Ribbon: Transform > Format > Trim (removes outer spaces) and Format > Capitalize Each Word.',
        proTip: 'This prevents lookup errors caused by invisible trailing spaces like "New York Central " vs "New York Central".',
      },
      {
        stepNumber: 4,
        title: 'Merge Queries (Excel\'s Super-VLOOKUP)',
        description: 'To join the Customer Dimension table, click Home > Merge Queries. Select your matching key (e.g. Customer ID) in both tables and select "Left Outer Join". Click the expand icon (two arrows) on the new column to pull in Company Name and Industry.',
        excelAction: 'Ribbon: Home > Merge Queries > Select Table 2 > Match ID columns > Left Outer Join.',
        proTip: 'Merge Queries completely eliminates the need to write dozens of VLOOKUP formulas across multiple columns.',
      },
      {
        stepNumber: 5,
        title: 'Close & Load to Excel',
        description: 'Click Home > Close & Load > Close & Load To... Choose "Table" into a New Worksheet. You now have clean, normalized, analysis-ready data!',
        excelAction: 'Ribbon: Home > Close & Load To... > Table.',
      },
    ],
    alternativeFormulas: [
      {
        name: 'M-Code: Replace Text Pattern',
        code: '= Table.ReplaceValue(#"PrevStep", "STR-", "STORE-", Replacer.ReplaceText, {"store_id"})',
        note: 'Power Query M language expression for bulk replacing values in a column.',
      },
      {
        name: 'Conditional Column (Business Logic)',
        code: 'if [Revenue] > 100000 then "Tier A Flagship" else "Standard Branch"',
        note: 'Add Column > Conditional Column. Replaces complex nested IF formulas.',
      },
    ],
  },

  conditional_formulas: {
    topic: 'conditional_formulas',
    title: 'Conditional Formatting & Modern Formulas',
    subtitle: 'Dynamic visual heatmaps, KPI indicators, and multi-condition logical rules.',
    objective: 'Create a custom formula rule highlighting the entire row for high performers, plus Data Bars for quota attainment.',
    badge: 'Visual Analytics',
    steps: [
      {
        stepNumber: 1,
        title: 'Highlighting Whole Rows with a Custom Formula',
        description: 'Most beginners only know how to highlight a single cell. To highlight the ENTIRE row when an employee meets quota, you must lock the column with a dollar sign ($).',
        excelAction: 'Select all data rows A2:L501 > Home > Conditional Formatting > New Rule > "Use a formula to determine which cells to format".',
        formula: {
          code: '=$G2>=1.0',
          explanation: 'Evaluates whether Column G (Attainment %) in the current row is >= 100%. The $ locks column G while row 2 dynamically increments.',
          breakdown: [
            { part: '$G', meaning: 'Column G is absolute (locked). Every cell in the row will look at column G to determine its color.' },
            { part: '2', meaning: 'Row 2 is relative (unlocked). Row 3 evaluates $G3, row 4 evaluates $G4, and so on.' },
            { part: '>= 1.0', meaning: 'Threshold: Attainment ratio of 1.0 is 100% in Excel percentage formatting.' },
          ],
        },
        proTip: 'Failure to include the dollar sign ($) before G will cause cells to shift right and misalign your formatting across the row!',
      },
      {
        stepNumber: 2,
        title: 'Multi-Condition Highlighting with =AND()',
        description: 'Highlight Star Performers who exceeded quota AND achieved a Customer CSAT Score of 4.5 or higher.',
        excelAction: 'Formula: =AND($G2>=1.2, $I2>=4.5) > Set Format Fill to soft emerald green with dark green text.',
        formula: {
          code: '=AND($G2>=1.2, $I2>=4.5)',
          explanation: 'Both criteria must be TRUE simultaneously: Attainment >= 120% and CSAT >= 4.5.',
          breakdown: [
            { part: '$G2>=1.2', meaning: 'Quota Attainment in column G is at least 120%.' },
            { part: '$I2>=4.5', meaning: 'Customer Satisfaction rating in column I is 4.5 out of 5.' },
          ],
        },
      },
      {
        stepNumber: 3,
        title: 'Add In-Cell Data Bars for Quota Attainment',
        description: 'Select Column G (Attainment %) > Home > Conditional Formatting > Data Bars > Gradient or Solid Fill. Excel paints horizontal progress bars directly inside each cell!',
        excelAction: 'Ribbon: Home > Conditional Formatting > Data Bars > More Rules > Set Min to 0 (Number) and Max to 1.5 (Number).',
        proTip: 'In the Data Bar rules dialog, check "Show Bar Only" if you want to create a clean minimalist progress visual without numbers.',
      },
      {
        stepNumber: 4,
        title: 'Add Overdue Alert Flags with =COUNTIF and Highlights',
        description: 'Select Column J (Overdue Tasks) > Home > Conditional Formatting > Highlight Cell Rules > Greater Than 3 > Light Red Fill with Dark Red Text.',
        proTip: 'Use Conditional Formatting > Manage Rules to reorder rules and enable "Stop If True" to prevent conflicting fills.',
      },
    ],
    alternativeFormulas: [
      {
        name: 'SUMIFS (Multi-Criteria Aggregation)',
        code: '=SUMIFS($F$2:$F$501, $D$2:$D$501, "East", $G$2:$G$501, ">=1.0")',
        note: 'Sums Actual Revenue (F) where Region (D) is "East" and Quota Attainment (G) is >= 100%.',
      },
      {
        name: 'Dynamic Status Label with Nested IFS / SWITCH',
        code: '=IFS(G2>=1.2, "Star Performer", G2>=1.0, "On Target", G2<0.75, "At Risk", TRUE, "In Progress")',
        note: 'Modern Excel IFS function replaces messy nested IF(IF(IF())) statements.',
      },
    ],
  },
};

export const EXCEL_SHORTCUTS = [
  { category: 'General & Tables', action: 'Create Official Excel Table', windows: 'Ctrl + T', mac: 'Cmd + T' },
  { category: 'General & Tables', action: 'Toggle AutoFilter Dropdowns', windows: 'Ctrl + Shift + L', mac: 'Cmd + Shift + F' },
  { category: 'General & Tables', action: 'Insert Pivot Table', windows: 'Alt + N + V + T', mac: 'Insert > PivotTable' },
  { category: 'Formulas & Editing', action: 'Lock Reference ($ Absolute)', windows: 'F4 (or Fn + F4)', mac: 'Cmd + T (in formula)' },
  { category: 'Formulas & Editing', action: 'Fill Down from Cell Above', windows: 'Ctrl + D', mac: 'Cmd + D' },
  { category: 'Formulas & Editing', action: 'AutoSum Selected Range', windows: 'Alt + =', mac: 'Cmd + Shift + T' },
  { category: 'Formulas & Editing', action: 'Flash Fill Pattern Down', windows: 'Ctrl + E', mac: 'Ctrl + E' },
  { category: 'Navigation & Select', action: 'Jump to Edge of Data Block', windows: 'Ctrl + Arrow Keys', mac: 'Cmd + Arrow Keys' },
  { category: 'Navigation & Select', action: 'Select All Contiguous Cells', windows: 'Ctrl + Shift + Arrow', mac: 'Cmd + Shift + Arrow' },
  { category: 'Formatting', action: 'Format as Currency ($)', windows: 'Ctrl + Shift + $ (4)', mac: 'Ctrl + Shift + $' },
  { category: 'Formatting', action: 'Format as Percentage (%)', windows: 'Ctrl + Shift + % (5)', mac: 'Ctrl + Shift + %' },
  { category: 'Formatting', action: 'Open Format Cells Dialog', windows: 'Ctrl + 1', mac: 'Cmd + 1' },
];
