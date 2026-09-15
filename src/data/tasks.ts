import { PracticeTask, PracticeTopic, TableSheet, DifficultyLevel } from '../types/excel';
import { PRODUCT_CATALOG, SALES_REP_TIERS, REGIONS, REPS } from './generators';

export const DEFAULT_PRACTICE_TASKS: Record<PracticeTopic, PracticeTask[]> = {
  xlookup: [
    {
      id: 'xl-task-1',
      topic: 'xlookup',
      title: 'Task 1: Populate Unit Prices using XLOOKUP',
      scenario: 'You are handed an Orders dataset where Unit Price is blank. Look up the correct price from the Product Catalog table based on Product ID.',
      difficulty: 'Beginner',
      estimatedMinutes: 5,
      status: 'todo',
      subSteps: [
        { id: 'xl-1-1', text: 'Select cell H2 in your Orders sheet (or column [Unit Price] if formatted as Table).', completed: false, excelShortcutOrTip: 'Ctrl + T to convert data into an official Table' },
        { id: 'xl-1-2', text: 'Write the formula: =XLOOKUP(E2, Catalog!A:A, Catalog!D:D)', completed: false, excelShortcutOrTip: 'Catalog!A:A is Product ID, Catalog!D:D is Unit Price' },
        { id: 'xl-1-3', text: 'Lock references with $ (e.g., Catalog!$A$2:$A$100) if using regular ranges.', completed: false, excelShortcutOrTip: 'Press F4 to quickly cycle through absolute $ references' },
        { id: 'xl-1-4', text: 'Double click the fill handle to copy down all rows.', completed: false, excelShortcutOrTip: 'Format the column as Currency ($)' }
      ],
      targetFormula: '=XLOOKUP(E2, Catalog!$A$2:$A$25, Catalog!$D$2:$D$25)',
      ribbonPath: 'Formulas Tab > Lookup & Reference > XLOOKUP',
      expectedResultDescription: 'All rows display valid numeric currency unit prices matching the Catalog (e.g. PRD-101 should return $1,199.99).',
      proTip: 'If using Excel Tables (Ctrl+T), the formula becomes: =XLOOKUP([@[Product ID]], Catalog[ID], Catalog[Price]). It auto-fills the entire column instantly!'
    },
    {
      id: 'xl-task-2',
      topic: 'xlookup',
      title: 'Task 2: Handle Missing & Discontinued Items gracefully',
      scenario: 'Some test orders contain non-existent or legacy Product IDs. Prevent unsightly #N/A errors by configuring XLOOKUP\'s 4th parameter [if_not_found].',
      difficulty: 'Intermediate',
      estimatedMinutes: 5,
      status: 'todo',
      subSteps: [
        { id: 'xl-2-1', text: 'Inspect cell H2 and modify the XLOOKUP formula to add the 4th argument.', completed: false },
        { id: 'xl-2-2', text: 'Set the if_not_found value to "Discontinued - $0.00" or 0.', completed: false, excelShortcutOrTip: '=XLOOKUP(E2, Catalog!A:A, Catalog!D:D, 0)' },
        { id: 'xl-2-3', text: 'Compare with the older legacy approach using IFERROR(VLOOKUP(...), 0).', completed: false },
        { id: 'xl-2-4', text: 'Filter column H for 0 or missing values to verify clean error suppression.', completed: false, excelShortcutOrTip: 'Ctrl + Shift + L to toggle auto-filters' }
      ],
      targetFormula: '=XLOOKUP(E2, Catalog!$A$2:$A$25, Catalog!$D$2:$D$25, 0)',
      ribbonPath: 'Formula Bar > Edit 4th argument [if_not_found]',
      expectedResultDescription: 'Any unknown Product IDs display 0 or "Discontinued" instead of crashing with #N/A.',
      proTip: 'In legacy VLOOKUP, you had to wrap the entire function in =IFERROR(VLOOKUP(...), 0). XLOOKUP has this built natively directly into its 4th argument!'
    },
    {
      id: 'xl-task-3',
      topic: 'xlookup',
      title: 'Task 3: Join Sales Rep Commission Rates from Reps Table',
      scenario: 'The finance team needs commission rate percentages merged into Orders. Pull the commission rate from the Reps master table using Sales Rep ID.',
      difficulty: 'Intermediate',
      estimatedMinutes: 8,
      status: 'todo',
      subSteps: [
        { id: 'xl-3-1', text: 'Insert a new column named "Commission Rate" in the Orders sheet next to Sales Rep ID.', completed: false, excelShortcutOrTip: 'Right-click column header > Insert' },
        { id: 'xl-3-2', text: 'Write: =XLOOKUP(I2, Reps!$A$2:$A$20, Reps!$D$2:$D$20, 0.05)', completed: false, excelShortcutOrTip: 'Matches Rep ID against Reps sheet column A and returns column D' },
        { id: 'xl-3-3', text: 'Format the entire column as Percentage with 1 decimal place (e.g., 7.5%).', completed: false, excelShortcutOrTip: 'Ctrl + Shift + %' },
        { id: 'xl-3-4', text: 'Add another column "Commission Earned" = [Quantity] * [Unit Price] * [Commission Rate].', completed: false }
      ],
      targetFormula: '=XLOOKUP(I2, Reps!$A$2:$A$20, Reps!$D$2:$D$20, 0.05)',
      ribbonPath: 'Home Tab > Number Group > % Percentage Style',
      expectedResultDescription: 'Every row shows the sales rep\'s commission percentage (typically between 5% and 12%).',
      proTip: 'XLOOKUP can also look up multiple adjacent columns simultaneously! If you specify Reps!$B$2:$D$20 as the return array, it spills Rep Name, Tier, and Rate all at once.'
    },
    {
      id: 'xl-task-4',
      topic: 'xlookup',
      title: 'Task 4: Dynamic 2-Way Matrix Lookup (Product + Region)',
      scenario: 'Perform a 2-way matrix lookup where price or freight cost varies depending on both Product Category (Rows) and Region (Columns).',
      difficulty: 'Advanced',
      estimatedMinutes: 10,
      status: 'todo',
      subSteps: [
        { id: 'xl-4-1', text: 'Create a small summary lookup card on a new sheet with two input cells: Region (e.g. West) and Product ID.', completed: false },
        { id: 'xl-4-2', text: 'Write a nested XLOOKUP formula where the return array of the first XLOOKUP is itself an XLOOKUP.', completed: false },
        { id: 'xl-4-3', text: 'Test changing the Region from East to West and verify the returned value updates dynamically.', completed: false },
        { id: 'xl-4-4', text: 'Compare with the classic INDEX / MATCH / MATCH 2-way matrix formula.', completed: false }
      ],
      targetFormula: '=XLOOKUP(Target_Product, Matrix_Row_IDs, XLOOKUP(Target_Region, Matrix_Col_Headers, Matrix_Values))',
      ribbonPath: 'Formulas Tab > Nested Formulas',
      expectedResultDescription: 'Cell dynamically retrieves the intersecting value across both axis coordinates.',
      proTip: 'Nested XLOOKUP has completely replaced the cumbersome INDEX(range, MATCH(), MATCH()) 2-way matrix lookup in modern spreadsheets.'
    },
    {
      id: 'xl-task-5',
      topic: 'xlookup',
      title: 'Task 5: Backward / Reverse Lookup without changing column order',
      scenario: 'Look up a Product ID using the Product Name as the search key. Notice that in the catalog, Name is to the right of ID—VLOOKUP fails here, but XLOOKUP succeeds effortlessly.',
      difficulty: 'Intermediate',
      estimatedMinutes: 6,
      status: 'todo',
      subSteps: [
        { id: 'xl-5-1', text: 'Pick a Product Name (e.g. "Mechanical Keyboard RGB").', completed: false },
        { id: 'xl-5-2', text: 'Write: =XLOOKUP("Mechanical Keyboard RGB", Catalog!B:B, Catalog!A:A, "Not Found")', completed: false, excelShortcutOrTip: 'Notice the return array Catalog!A:A is to the LEFT of lookup array Catalog!B:B' },
        { id: 'xl-5-3', text: 'Observe that XLOOKUP requires zero column counting (no col_index_num = -1 bugs).', completed: false },
        { id: 'xl-5-4', text: 'Insert a new blank column between A and B in Catalog and verify the formula does not break.', completed: false }
      ],
      targetFormula: '=XLOOKUP(Target_Name, Catalog!$B$2:$B$25, Catalog!$A$2:$A$25, "Not Found")',
      ribbonPath: 'Formula Bar',
      expectedResultDescription: 'Returns the exact Product ID (e.g. "PRD-102") even though it sits to the left of the search key.',
      proTip: 'Unlike VLOOKUP which breaks whenever someone inserts or deletes a column, XLOOKUP uses direct range references that automatically adjust.'
    }
  ],
  pivot: [
    {
      id: 'pv-task-1',
      topic: 'pivot',
      title: 'Task 1: Build Sales Summary by Region & Category',
      scenario: 'Create your first Pivot Table to analyze total sales revenue broken down by Region (Rows) and Product Category (Columns).',
      difficulty: 'Beginner',
      estimatedMinutes: 5,
      status: 'todo',
      subSteps: [
        { id: 'pv-1-1', text: 'Click any single cell inside your Sales Transactions table.', completed: false, excelShortcutOrTip: 'Ctrl + A to select all or just click inside Table' },
        { id: 'pv-1-2', text: 'Go to Ribbon: Insert > PivotTable > Choose "New Worksheet".', completed: false, excelShortcutOrTip: 'Alt + N + V + T' },
        { id: 'pv-1-3', text: 'Drag [Region] into the ROWS quadrant.', completed: false },
        { id: 'pv-1-4', text: 'Drag [Category] into the COLUMNS quadrant.', completed: false },
        { id: 'pv-1-5', text: 'Drag [Total Sales] into the VALUES quadrant and format as Currency ($).', completed: false, excelShortcutOrTip: 'Right-click value cell > Number Format > Currency' }
      ],
      ribbonPath: 'Insert Tab > PivotTable > From Table/Range',
      expectedResultDescription: 'A clean 2-dimensional grid showing sales totals with row and column Grand Totals.',
      proTip: 'Always change number formatting via "Number Format" on the Value Field Settings, NOT the regular Home tab, so formatting persists when you filter!'
    },
    {
      id: 'pv-task-2',
      topic: 'pivot',
      title: 'Task 2: Connect Interactive Slicers for Filtering',
      scenario: 'Executives need an interactive one-click dashboard. Insert visual Slicers for Quarter and Sales Rep to slice the data without dropdown menus.',
      difficulty: 'Beginner',
      estimatedMinutes: 5,
      status: 'todo',
      subSteps: [
        { id: 'pv-2-1', text: 'Click inside your newly created PivotTable.', completed: false },
        { id: 'pv-2-2', text: 'Go to Ribbon: PivotTable Analyze > Insert Slicer.', completed: false, excelShortcutOrTip: 'Alt + J + T + S' },
        { id: 'pv-2-3', text: 'Check the boxes for [Quarter] and [Sales Rep], then click OK.', completed: false },
        { id: 'pv-2-4', text: 'Format the Quarter slicer into 4 horizontal columns via Slicer Tab > Columns: 4.', completed: false },
        { id: 'pv-2-5', text: 'Click "Q3" on the slicer and watch the numbers update instantly.', completed: false }
      ],
      ribbonPath: 'PivotTable Analyze Tab > Filter Group > Insert Slicer',
      expectedResultDescription: 'Two sleek button bars floating above the pivot that filter rows with zero lag.',
      proTip: 'Hold down Ctrl while clicking slicer buttons to select multiple non-adjacent items (e.g., Q1 and Q3 together)!'
    },
    {
      id: 'pv-task-3',
      topic: 'pivot',
      title: 'Task 3: Add a Calculated Field for Profit Margin %',
      scenario: 'The raw dataset has Total Sales and Cost, but no Margin %. Create a calculated field inside the Pivot Table engine without altering the source data.',
      difficulty: 'Intermediate',
      estimatedMinutes: 8,
      status: 'todo',
      subSteps: [
        { id: 'pv-3-1', text: 'Click inside the Pivot Table.', completed: false },
        { id: 'pv-3-2', text: 'Navigate to: PivotTable Analyze > Fields, Items, & Sets > Calculated Field.', completed: false },
        { id: 'pv-3-3', text: 'Name the new field: "Profit Margin Pct".', completed: false },
        { id: 'pv-3-4', text: 'In the formula box, enter: = ( \'Total Sales\' - Cost ) / \'Total Sales\'', completed: false },
        { id: 'pv-3-5', text: 'Click Add and OK. Right-click the new column and set Number Format to Percentage (1 decimal place).', completed: false }
      ],
      targetFormula: "=( 'Total Sales' - Cost ) / 'Total Sales'",
      ribbonPath: 'PivotTable Analyze > Fields, Items, & Sets > Calculated Field',
      expectedResultDescription: 'A dynamic percentage margin column appears in the pivot values (e.g., 28.4%), correctly calculated at the aggregate total level.',
      proTip: 'Calculated fields compute `SUM(Sales - Cost) / SUM(Sales)`, which is mathematically accurate. Never average individual margin ratios!'
    },
    {
      id: 'pv-task-4',
      topic: 'pivot',
      title: 'Task 4: Filter for Top 5 Best-Selling Products',
      scenario: 'Instead of displaying dozens of products, configure an automatic Top 5 Value Filter that dynamically highlights the top revenue generators.',
      difficulty: 'Intermediate',
      estimatedMinutes: 6,
      status: 'todo',
      subSteps: [
        { id: 'pv-4-1', text: 'Place [Product] in the ROWS area of your Pivot Table.', completed: false },
        { id: 'pv-4-2', text: 'Click the Row Labels filter funnel icon in cell A3/A4.', completed: false },
        { id: 'pv-4-3', text: 'Hover over "Value Filters" > Select "Top 10...".', completed: false },
        { id: 'pv-4-4', text: 'Change "10" to "5", evaluate by "Sum of Total Sales", and click OK.', completed: false },
        { id: 'pv-4-5', text: 'Right click any sales value > Sort > Sort Largest to Smallest.', completed: false }
      ],
      ribbonPath: 'Row Labels Dropdown > Value Filters > Top 10...',
      expectedResultDescription: 'Only the top 5 highest grossing products are visible, ordered from highest to lowest sales.',
      proTip: 'Combine this with your Quarter slicer. As you toggle quarters, the Top 5 products will automatically recalculate and re-rank!'
    },
    {
      id: 'pv-task-5',
      topic: 'pivot',
      title: 'Task 5: Show Values As "% of Column Total" & Running Sum',
      scenario: 'Convert raw dollar figures into analytical proportions to see which region accounts for what share of total business volume.',
      difficulty: 'Advanced',
      estimatedMinutes: 7,
      status: 'todo',
      subSteps: [
        { id: 'pv-5-1', text: 'Drag [Total Sales] into the VALUES quadrant a second time.', completed: false },
        { id: 'pv-5-2', text: 'Right-click the second sales column in the Pivot Table.', completed: false },
        { id: 'pv-5-3', text: 'Hover over "Show Values As" > Choose "% of Column Total" or "% of Parent Row Total".', completed: false },
        { id: 'pv-5-4', text: 'Rename the column header to "% Contribution".', completed: false },
        { id: 'pv-5-5', text: 'Observe that the Grand Total sums to exactly 100.0%.', completed: false }
      ],
      ribbonPath: 'Right-Click Value Cell > Show Values As > % of Column Total',
      expectedResultDescription: 'Side-by-side view of absolute dollars alongside their exact percentage contribution to the whole.',
      proTip: 'You can also select "Running Total In..." to create month-over-month cumulative financial build curves without writing complex formulas.'
    }
  ],
  power_query: [
    {
      id: 'pq-task-1',
      topic: 'power_query',
      title: 'Task 1: Import Data & Launch Power Query Editor',
      scenario: 'The quarterly store report is arranged in wide spreadsheet format (Q1, Q2, Q3, Q4 across separate columns). Import it into Power Query to transform it into tabular data.',
      difficulty: 'Beginner',
      estimatedMinutes: 4,
      status: 'todo',
      subSteps: [
        { id: 'pq-1-1', text: 'Click inside the Store Quarterly Sales data table.', completed: false },
        { id: 'pq-1-2', text: 'Go to Ribbon: Data Tab > Get & Transform Data > From Sheet (or From Table/Range).', completed: false, excelShortcutOrTip: 'Alt + A + P + T' },
        { id: 'pq-1-3', text: 'Verify the Power Query Editor window opens with your data preview.', completed: false },
        { id: 'pq-1-4', text: 'Check the "Applied Steps" pane on the right-hand side.', completed: false }
      ],
      ribbonPath: 'Data Tab > Get Data > From Sheet / From Table/Range',
      expectedResultDescription: 'The Power Query window opens displaying all store columns and rows ready for transformation.',
      proTip: 'Power Query records every click as a repeatable ETL step. Once built, you can hit "Refresh All" next quarter and it cleans the new data in seconds!'
    },
    {
      id: 'pq-task-2',
      topic: 'power_query',
      title: 'Task 2: Master "Unpivot Other Columns" (Wide to Tall)',
      scenario: 'Relational databases and Pivot Tables require a tall fact table: one row per store per quarter, rather than wide columns.',
      difficulty: 'Intermediate',
      estimatedMinutes: 7,
      status: 'todo',
      subSteps: [
        { id: 'pq-2-1', text: 'In Power Query Editor, hold Ctrl and select: [Store ID], [Store Name], and [Region].', completed: false },
        { id: 'pq-2-2', text: 'Right-click one of the highlighted headers and choose "Unpivot Other Columns".', completed: false, excelShortcutOrTip: 'Transform Tab > Unpivot Columns dropdown > Unpivot Other Columns' },
        { id: 'pq-2-3', text: 'Observe the transformation: 50 wide rows become 200 tall rows!', completed: false },
        { id: 'pq-2-4', text: 'Double click column "Attribute" and rename it to "Quarter".', completed: false },
        { id: 'pq-2-5', text: 'Double click column "Value" and rename it to "Quarterly Revenue".', completed: false }
      ],
      ribbonPath: 'Transform Tab > Any Column Group > Unpivot Columns > Unpivot Other Columns',
      expectedResultDescription: 'The wide Q1-Q4 columns collapse into normalized tall records with Quarter and Revenue columns.',
      proTip: 'Always choose "Unpivot Other Columns" instead of "Unpivot Selected Columns". That way, if a "Q5" or "Adjustment" column is added later, it unpivots automatically!'
    },
    {
      id: 'pq-task-3',
      topic: 'power_query',
      title: 'Task 3: Text Cleaning & Data Type Enforcement',
      scenario: 'Raw store names contain irregular leading spaces and lowercase text. Clean whitespace and assign proper types.',
      difficulty: 'Intermediate',
      estimatedMinutes: 6,
      status: 'todo',
      subSteps: [
        { id: 'pq-3-1', text: 'Click the [Store Name] column header in Power Query.', completed: false },
        { id: 'pq-3-2', text: 'Go to: Transform Tab > Format > Trim (removes invisible leading & trailing spaces).', completed: false },
        { id: 'pq-3-3', text: 'Go to: Transform Tab > Format > Capitalize Each Word.', completed: false },
        { id: 'pq-3-4', text: 'Click the icon in the [Quarterly Revenue] header (e.g. 1.2 or ABC) and change type to "Currency".', completed: false },
        { id: 'pq-3-5', text: 'Ensure [Quarter] is Text and [Store ID] is Text (IDs should never be Whole Numbers).', completed: false }
      ],
      ribbonPath: 'Transform Tab > Text Column > Format > Trim / Capitalize Each Word',
      expectedResultDescription: 'All text strings are pristine and standardized; numbers carry strict currency and decimal data types.',
      proTip: 'Always store identifiers (like Store ID, Zip Code, SSN) as Text data types, never as Numbers, to preserve leading zeroes and avoid accidental summation.'
    },
    {
      id: 'pq-task-4',
      topic: 'power_query',
      title: 'Task 4: Merge Queries via Left Outer Join with Managers Table',
      scenario: 'Join store manager information into your normalized sales table by matching on Store ID, performing a database JOIN in Excel.',
      difficulty: 'Advanced',
      estimatedMinutes: 8,
      status: 'todo',
      subSteps: [
        { id: 'pq-4-1', text: 'Import the Store Managers table into Power Query as a second query.', completed: false },
        { id: 'pq-4-2', text: 'In Home Tab, click "Merge Queries" > "Merge Queries as New".', completed: false },
        { id: 'pq-4-3', text: 'Select Store Sales as top table and Store Managers as bottom table.', completed: false },
        { id: 'pq-4-4', text: 'Click [Store ID] in both table previews to establish the join key.', completed: false },
        { id: 'pq-4-5', text: 'Choose "Left Outer (all from first, matching from second)" and click OK.', completed: false },
        { id: 'pq-4-6', text: 'Click the Expand icon on the new Manager column and select [Manager Name] & [Open Year].', completed: false }
      ],
      ribbonPath: 'Home Tab > Combine Group > Merge Queries',
      expectedResultDescription: 'The merged query contains store sales enriched with Manager Name and Store Size in a single unified table.',
      proTip: 'Power Query merges replace dozens of messy VLOOKUP columns with a clean, single-click database join that runs 10x faster on large datasets.'
    },
    {
      id: 'pq-task-5',
      topic: 'power_query',
      title: 'Task 5: Close & Load into Excel Data Model',
      scenario: 'Load your pristine transformed dataset back into Microsoft Excel as a formatted table or directly into the Power Pivot Data Model.',
      difficulty: 'Beginner',
      estimatedMinutes: 3,
      status: 'todo',
      subSteps: [
        { id: 'pq-5-1', text: 'Go to: Home Tab in Power Query Editor > Click the dropdown below "Close & Load".', completed: false },
        { id: 'pq-5-2', text: 'Select "Close & Load To...".', completed: false },
        { id: 'pq-5-3', text: 'In the dialog, choose "Table" and "New worksheet" (or "Only Create Connection" if using Data Model).', completed: false },
        { id: 'pq-5-4', text: 'Click OK and verify the new clean green Excel Table appears.', completed: false },
        { id: 'pq-5-5', text: 'Test right-clicking inside the loaded table and selecting "Refresh".', completed: false }
      ],
      ribbonPath: 'Home Tab > Close & Load > Close & Load To...',
      expectedResultDescription: 'A newly generated Excel worksheet appears with the unpivoted, trimmed, joined data.',
      proTip: 'Check the box "Add this data to the Data Model" to build lightning-fast Power Pivot analyses exceeding Excel\'s traditional 1-million-row worksheet limit!'
    }
  ],
  conditional_formulas: [
    {
      id: 'cf-task-1',
      topic: 'conditional_formulas',
      title: 'Task 1: Highlight Quota Achievers (>= 100%) in Soft Green',
      scenario: 'Instantly spot sales reps who achieved or surpassed their sales targets by highlighting their Attainment Ratio.',
      difficulty: 'Beginner',
      estimatedMinutes: 4,
      status: 'todo',
      subSteps: [
        { id: 'cf-1-1', text: 'Select the Attainment Ratio column cells (e.g., G2:G51).', completed: false, excelShortcutOrTip: 'Ctrl + Shift + Down Arrow' },
        { id: 'cf-1-2', text: 'Go to Ribbon: Home > Conditional Formatting > Highlight Cells Rules > Greater Than...', completed: false, excelShortcutOrTip: 'Alt + H + L + H + G' },
        { id: 'cf-1-3', text: 'Enter 1.0 (or 100%) in the value box.', completed: false },
        { id: 'cf-1-4', text: 'Select "Green Fill with Dark Green Text" (or create a custom soft green fill).', completed: false },
        { id: 'cf-1-5', text: 'Click OK and verify reps over 100% are highlighted.', completed: false }
      ],
      ribbonPath: 'Home Tab > Styles Group > Conditional Formatting > Highlight Cells Rules',
      expectedResultDescription: 'All reps with Attainment >= 100% are clearly marked in green.',
      proTip: 'Never use harsh neon fills. Choose soft pastels (light sage green, muted coral) with dark text to keep corporate dashboards readable and professional.'
    },
    {
      id: 'cf-task-2',
      topic: 'conditional_formulas',
      title: 'Task 2: Flag At-Risk Employees with a Custom Multi-Condition Formula',
      scenario: 'Flag performance concerns where an employee is under quota (< 85%) AND has 3 or more overdue tasks using a custom formula rule.',
      difficulty: 'Intermediate',
      estimatedMinutes: 8,
      status: 'todo',
      subSteps: [
        { id: 'cf-2-1', text: 'Select the full data rows A2:K51 (so the entire row lights up).', completed: false },
        { id: 'cf-2-2', text: 'Go to: Home > Conditional Formatting > New Rule.', completed: false, excelShortcutOrTip: 'Alt + H + L + N' },
        { id: 'cf-2-3', text: 'Select rule type: "Use a formula to determine which cells to format".', completed: false },
        { id: 'cf-2-4', text: 'Enter formula: =AND($G2<0.85, $J2>=3)', completed: false, excelShortcutOrTip: 'Crucial: Lock column letter ($G2, $J2) but keep row number 2 relative!' },
        { id: 'cf-2-5', text: 'Click Format > Fill > Pick soft rose/red > Click OK.', completed: false }
      ],
      targetFormula: '=AND($G2<0.85, $J2>=3)',
      ribbonPath: 'Home Tab > Conditional Formatting > New Rule > Use a formula',
      expectedResultDescription: 'The entire row turns light red whenever attainment is below 85% and overdue tasks are 3 or greater.',
      proTip: 'The dollar sign before the column letter ($G2) is the secret to whole-row highlighting in Excel. It forces Excel to check column G for every cell across the entire row!'
    },
    {
      id: 'cf-task-3',
      topic: 'conditional_formulas',
      title: 'Task 3: Add In-Cell Gradient Data Bars to Actual Sales',
      scenario: 'Embed micro-visualizations directly inside cells so stakeholders can compare rep revenues at a glance without generating a separate bar chart.',
      difficulty: 'Beginner',
      estimatedMinutes: 5,
      status: 'todo',
      subSteps: [
        { id: 'cf-3-1', text: 'Select the [Actual Sales] column (e.g., F2:F51).', completed: false },
        { id: 'cf-3-2', text: 'Go to: Home > Conditional Formatting > Data Bars.', completed: false },
        { id: 'cf-3-3', text: 'Choose "Gradient Fill" in Soft Emerald / Green.', completed: false },
        { id: 'cf-3-4', text: 'Optional: Go to Manage Rules > Edit Rule > Check "Show Bar Only" if you want a standalone sparkline bar.', completed: false }
      ],
      ribbonPath: 'Home Tab > Conditional Formatting > Data Bars > Gradient Fill',
      expectedResultDescription: 'Each cell contains a proportional visual bar whose length reflects that rep\'s revenue relative to the maximum in the column.',
      proTip: 'Data bars automatically scale to the minimum and maximum of the column, giving executives immediate visual hierarchy.'
    },
    {
      id: 'cf-task-4',
      topic: 'conditional_formulas',
      title: 'Task 4: Dynamic 3-Traffic-Light Icon Set on CSAT Score',
      scenario: 'Customer Satisfaction (CSAT) is rated 1.0 to 5.0. Apply an executive traffic light icon set (Green >= 4.5, Yellow >= 3.8, Red < 3.8).',
      difficulty: 'Intermediate',
      estimatedMinutes: 7,
      status: 'todo',
      subSteps: [
        { id: 'cf-4-1', text: 'Select the [CSAT Score] column (H2:H51).', completed: false },
        { id: 'cf-4-2', text: 'Go to: Home > Conditional Formatting > Icon Sets > 3 Traffic Lights (Unrimmed).', completed: false },
        { id: 'cf-4-3', text: 'Immediately reopen Conditional Formatting > Manage Rules > Edit Rule.', completed: false },
        { id: 'cf-4-4', text: 'Change the Type dropdown from "Percent" to "Number" for both thresholds!', completed: false, excelShortcutOrTip: 'Common mistake: Leaving Type as Percent instead of Number breaks logic!' },
        { id: 'cf-4-5', text: 'Set Green when >= 4.5; Yellow when >= 3.8; Red when < 3.8. Click OK.', completed: false }
      ],
      ribbonPath: 'Home Tab > Conditional Formatting > Manage Rules > Edit Rule > Icon Sets',
      expectedResultDescription: 'Clean circular indicator lights appear next to each customer satisfaction rating.',
      proTip: 'Excel defaults Icon Set thresholds to "Percent" (percentile rank), which confuses almost everyone! Always change the dropdown to "Number" when working with fixed scales like CSAT (1-5).'
    },
    {
      id: 'cf-task-5',
      topic: 'conditional_formulas',
      title: 'Task 5: Highlight Alternate Rows (Zebra Striping) with =MOD(ROW(), 2)',
      scenario: 'When not using standard Excel Tables, apply manual zebra striping that stays intact even when rows are inserted or filtered.',
      difficulty: 'Intermediate',
      estimatedMinutes: 5,
      status: 'todo',
      subSteps: [
        { id: 'cf-5-1', text: 'Select the entire data range (e.g., A2:K51).', completed: false },
        { id: 'cf-5-2', text: 'Go to: Home > Conditional Formatting > New Rule > "Use a formula...".', completed: false },
        { id: 'cf-5-3', text: 'Enter the formula: =MOD(ROW(), 2) = 0', completed: false },
        { id: 'cf-5-4', text: 'Click Format > Fill > Select an ultra-subtle light slate gray (e.g. #F8FAFC).', completed: false },
        { id: 'cf-5-5', text: 'Click OK and inspect how alternate even-numbered rows receive subtle background shading.', completed: false }
      ],
      targetFormula: '=MOD(ROW(), 2) = 0',
      ribbonPath: 'Home Tab > Conditional Formatting > New Rule > Formula: =MOD(ROW(),2)=0',
      expectedResultDescription: 'Every alternating row has a clean, readable contrast background that makes wide tables easy on the eyes.',
      proTip: 'For alternating columns instead of rows, use =MOD(COLUMN(), 2) = 0. Or simply format as Table (Ctrl+T) which handles banded rows automatically!'
    }
  ]
};

// Pseudo-random engine for dynamic task generation
function createRandomEngine(seedVal?: number) {
  let s = seedVal !== undefined && seedVal > 0 ? seedVal : Math.floor(Math.random() * 2147483640) + 1;
  const next = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  const pick = <T>(arr: T[]): T => arr[Math.floor(next() * arr.length)];
  const pickN = <T>(arr: T[], n: number): T[] => {
    const copy = [...arr];
    const res: T[] = [];
    for (let i = 0; i < n && copy.length > 0; i++) {
      const idx = Math.floor(next() * copy.length);
      res.push(copy.splice(idx, 1)[0]);
    }
    return res;
  };
  const randInt = (min: number, max: number) => Math.floor(next() * (max - min + 1)) + min;
  return { next, pick, pickN, randInt, seed: s };
}

/**
 * Dynamically generates randomized practice tasks for the current topic,
 * tightly coupled with the active dataset properties, sampled products, reps, and rules.
 */
export function generatePracticeTasks(
  topic: PracticeTopic,
  primarySheet?: TableSheet | null,
  secondarySheets: TableSheet[] = [],
  seed?: number,
  difficulty: DifficultyLevel = 'medium'
): PracticeTask[] {
  const { pick, pickN, randInt, seed: taskSeed } = createRandomEngine(seed);
  const tag = taskSeed.toString(36).substring(0, 5);

  const filterByDifficulty = (taskList: PracticeTask[]): PracticeTask[] => {
    if (difficulty === 'easy') {
      return taskList.slice(0, 3);
    }
    if (difficulty === 'medium') {
      return taskList.slice(0, 4);
    }
    return taskList;
  };

  // 1. XLOOKUP / VLOOKUP TASKS
  if (topic === 'xlookup') {
    const catalogSheet = secondarySheets.find((s) => s.id === 'catalog');
    const catalog = (catalogSheet && catalogSheet.rows.length > 0 ? catalogSheet.rows : PRODUCT_CATALOG) as typeof PRODUCT_CATALOG;
    const repsSheet = secondarySheets.find((s) => s.id === 'rep_tiers');
    const reps = (repsSheet && repsSheet.rows.length > 0 ? repsSheet.rows : SALES_REP_TIERS) as typeof SALES_REP_TIERS;

    const p1 = pick(catalog);
    const otherProducts = catalog.filter((p) => p.id !== p1.id);
    const p2 = otherProducts.length > 0 ? pick(otherProducts) : catalog[0];
    const rep = pick(reps);
    const fallbackOption = pick([
      { val: '"Discontinued - $0.00"', label: 'Discontinued marker' },
      { val: '0', label: 'zero amount' },
      { val: '"Out of Catalog"', label: 'out of catalog label' },
      { val: '"Contact Purchasing"', label: 'purchasing alert text' },
    ]);
    const matrixRegion = pick(REGIONS);
    const matrixCategory = pick(['Hardware & Laptops', 'Audio & Peripherals', 'Office Ergonomics', 'Monitors & Displays']);
    const catalogLength = catalog.length;
    const repsLength = reps.length;

    return filterByDifficulty([
      {
        id: `xl-task-1-${tag}`,
        topic: 'xlookup',
        title: `Task 1: Populate Unit Prices using XLOOKUP (Target: ${p1.name})`,
        scenario: `You are handed an Orders dataset where Unit Price is blank. Look up the unit price from the Product Catalog table based on Product ID. Specifically verify that ${p1.id} (${p1.name}) returns $${p1.unitPrice.toFixed(2)}.`,
        difficulty: 'Beginner',
        estimatedMinutes: 5,
        status: 'todo',
        subSteps: [
          { id: `xl-1-1-${tag}`, text: 'Select cell H2 in your Orders sheet (or column [Unit Price] if formatted as an Excel Table).', completed: false, excelShortcutOrTip: 'Ctrl + T to convert data into an official Table' },
          { id: `xl-1-2-${tag}`, text: `Write the formula: =XLOOKUP(E2, Catalog!$A$2:$A$${catalogLength + 1}, Catalog!$D$2:$D$${catalogLength + 1})`, completed: false, excelShortcutOrTip: 'Catalog!$A$2:$A$16 is Product ID, Catalog!$D$2:$D$16 is Unit Price' },
          { id: `xl-1-3-${tag}`, text: 'Lock references with $ (press F4) to prevent range shifting when copied down.', completed: false, excelShortcutOrTip: 'Press F4 while editing cell reference' },
          { id: `xl-1-4-${tag}`, text: `Double click the fill handle and verify that row with ${p1.id} evaluates to $${p1.unitPrice.toFixed(2)}.`, completed: false, excelShortcutOrTip: 'Format the column as Currency ($)' },
        ],
        targetFormula: `=XLOOKUP(E2, Catalog!$A$2:$A$${catalogLength + 1}, Catalog!$D$2:$D$${catalogLength + 1})`,
        ribbonPath: 'Formulas Tab > Lookup & Reference > XLOOKUP',
        expectedResultDescription: `All rows display valid numeric currency unit prices matching the Catalog (e.g. ${p1.id} returns $${p1.unitPrice.toFixed(2)}).`,
        proTip: 'If using Excel Tables (Ctrl+T), the formula becomes: =XLOOKUP([@[Product ID]], Catalog[ID], Catalog[Price]). It auto-fills the entire column instantly!',
      },
      {
        id: `xl-task-2-${tag}`,
        topic: 'xlookup',
        title: `Task 2: Handle Missing & Discontinued Items (${fallbackOption.label})`,
        scenario: `Some test orders contain non-existent or legacy Product IDs (such as PRD-999). Prevent unsightly #N/A errors by configuring XLOOKUP's 4th parameter [if_not_found] to return ${fallbackOption.val}.`,
        difficulty: 'Intermediate',
        estimatedMinutes: 5,
        status: 'todo',
        subSteps: [
          { id: `xl-2-1-${tag}`, text: 'Inspect cell H2 and modify your XLOOKUP formula to add the 4th argument.', completed: false },
          { id: `xl-2-2-${tag}`, text: `Set the if_not_found value to ${fallbackOption.val}.`, completed: false, excelShortcutOrTip: `=XLOOKUP(E2, Catalog!A:A, Catalog!D:D, ${fallbackOption.val})` },
          { id: `xl-2-3-${tag}`, text: 'Compare with the legacy approach: =IFERROR(VLOOKUP(...), 0).', completed: false },
          { id: `xl-2-4-${tag}`, text: 'Filter column H for missing values to verify clean error suppression without #N/A.', completed: false, excelShortcutOrTip: 'Ctrl + Shift + L to toggle auto-filters' },
        ],
        targetFormula: `=XLOOKUP(E2, Catalog!$A$2:$A$${catalogLength + 1}, Catalog!$D$2:$D$${catalogLength + 1}, ${fallbackOption.val})`,
        ribbonPath: 'Formula Bar > Edit 4th argument [if_not_found]',
        expectedResultDescription: `Unknown or discontinued Product IDs cleanly display ${fallbackOption.val} instead of crashing with #N/A.`,
        proTip: 'In legacy VLOOKUP, you had to wrap the entire function in =IFERROR(VLOOKUP(...), 0). XLOOKUP has this built natively directly into its 4th argument!',
      },
      {
        id: `xl-task-3-${tag}`,
        topic: 'xlookup',
        title: `Task 3: Pull Sales Rep Commission Rate (${rep.rep} - ${rep.region})`,
        scenario: `The finance team needs commission rate percentages merged into Orders. Pull the commission rate from the Reps master table using Sales Rep ID. Verify that ${rep.rep} (${rep.region} region) pulls ${((rep.commissionRate || 0.06) * 100).toFixed(1)}%.`,
        difficulty: 'Intermediate',
        estimatedMinutes: 8,
        status: 'todo',
        subSteps: [
          { id: `xl-3-1-${tag}`, text: 'Insert a new column named "Commission Rate" in the Orders sheet next to Sales Rep ID.', completed: false, excelShortcutOrTip: 'Right-click column header > Insert' },
          { id: `xl-3-2-${tag}`, text: `Write: =XLOOKUP(I2, Reps!$A$2:$A$${repsLength + 1}, Reps!$D$2:$D$${repsLength + 1}, 0.05)`, completed: false, excelShortcutOrTip: 'Matches Rep ID against Reps sheet column A and returns column D' },
          { id: `xl-3-3-${tag}`, text: `Format the entire column as Percentage with 1 decimal place (e.g. ${((rep.commissionRate || 0.06) * 100).toFixed(1)}%).`, completed: false, excelShortcutOrTip: 'Ctrl + Shift + %' },
          { id: `xl-3-4-${tag}`, text: 'Add another column "Commission Earned" = [Quantity] * [Unit Price] * [Commission Rate].', completed: false },
        ],
        targetFormula: `=XLOOKUP(I2, Reps!$A$2:$A$${repsLength + 1}, Reps!$D$2:$D$${repsLength + 1}, 0.05)`,
        ribbonPath: 'Home Tab > Number Group > % Percentage Style',
        expectedResultDescription: `Every row accurately shows the sales rep commission percentage (e.g. ${rep.rep} at ${((rep.commissionRate || 0.06) * 100).toFixed(1)}%).`,
        proTip: 'XLOOKUP can also look up multiple adjacent columns simultaneously! If you specify Reps!$B$2:$D$20 as the return array, it spills Rep Name, Tier, and Rate all at once.',
      },
      {
        id: `xl-task-4-${tag}`,
        topic: 'xlookup',
        title: `Task 4: Dynamic 2-Way Matrix Lookup (${matrixRegion} × ${matrixCategory})`,
        scenario: `Perform a 2-way matrix lookup where price, freight, or allowance varies depending on both Product Category (${matrixCategory}) and Region (${matrixRegion}) using nested XLOOKUPs.`,
        difficulty: 'Advanced',
        estimatedMinutes: 10,
        status: 'todo',
        subSteps: [
          { id: `xl-4-1-${tag}`, text: `Create a lookup card on a new sheet with input cells: Region ("${matrixRegion}") and Category ("${matrixCategory}").`, completed: false },
          { id: `xl-4-2-${tag}`, text: 'Write a nested XLOOKUP formula where the return array of the first XLOOKUP is itself an XLOOKUP.', completed: false },
          { id: `xl-4-3-${tag}`, text: `Test changing the Region from ${matrixRegion} to another region and verify the returned value updates dynamically.`, completed: false },
          { id: `xl-4-4-${tag}`, text: 'Compare with the classic INDEX / MATCH / MATCH 2-way matrix formula.', completed: false },
        ],
        targetFormula: `=XLOOKUP(Target_Product, Matrix_Row_IDs, XLOOKUP("${matrixRegion}", Matrix_Col_Headers, Matrix_Values))`,
        ribbonPath: 'Formulas Tab > Nested Formulas',
        expectedResultDescription: 'Cell dynamically retrieves the intersecting value across both horizontal and vertical axis coordinates.',
        proTip: 'Nested XLOOKUP has completely replaced the cumbersome INDEX(range, MATCH(), MATCH()) 2-way matrix lookup in modern spreadsheets.',
      },
      {
        id: `xl-task-5-${tag}`,
        topic: 'xlookup',
        title: `Task 5: Left-Hand Reverse Lookup for "${p2.name}"`,
        scenario: `Look up Product ID using the Product Name ("${p2.name}") as the search key. Because Name is to the right of ID, traditional VLOOKUP fails—show how XLOOKUP performs reverse lookups effortlessly.`,
        difficulty: 'Intermediate',
        estimatedMinutes: 6,
        status: 'todo',
        subSteps: [
          { id: `xl-5-1-${tag}`, text: `Select a cell and reference Product Name "${p2.name}".`, completed: false },
          { id: `xl-5-2-${tag}`, text: `Write: =XLOOKUP("${p2.name}", Catalog!$B$2:$B$${catalogLength + 1}, Catalog!$A$2:$A$${catalogLength + 1}, "Not Found")`, completed: false, excelShortcutOrTip: 'Notice the return array Catalog!A:A is to the LEFT of lookup array Catalog!B:B' },
          { id: `xl-5-3-${tag}`, text: 'Observe that XLOOKUP requires zero column index counting (no col_index_num = -1 crashes).', completed: false },
          { id: `xl-5-4-${tag}`, text: `Confirm the formula returns the exact Product ID "${p2.id}".`, completed: false },
        ],
        targetFormula: `=XLOOKUP("${p2.name}", Catalog!$B$2:$B$${catalogLength + 1}, Catalog!$A$2:$A$${catalogLength + 1}, "Not Found")`,
        ribbonPath: 'Formula Bar',
        expectedResultDescription: `Returns the exact Product ID ("${p2.id}") even though it sits to the left of the search key in the catalog.`,
        proTip: 'Unlike VLOOKUP which breaks whenever someone inserts or deletes a column, XLOOKUP uses direct range references that automatically adjust.',
      },
    ]);
  }

  // 2. PIVOT TABLE TASKS
  if (topic === 'pivot') {
    const rowDim = pick(['Region', 'Sales Rep', 'Customer Segment']);
    const colDim = pick(['Product Category', 'Quarter', 'Ship Mode']);
    const metric = pick(['Total Sales', 'Quantity Sold', 'Net Revenue']);
    const slicerPair = pickN(['Quarter', 'Region', 'Product Category', 'Sales Rep', 'Sales Segment'], 2);
    const calc = pick([
      { name: 'Gross Margin %', formula: "=( 'Total Sales' - Cost ) / 'Total Sales'", desc: 'calculating gross margin % at aggregate level', fmt: 'Percentage (1 decimal place)' },
      { name: 'Sales Commission Pool', formula: "='Total Sales' * 0.08", desc: 'calculating 8% sales commission pool across transactions', fmt: 'Currency ($)' },
      { name: 'Net Revenue after Discount', formula: "='Total Sales' * (1 - Discount)", desc: 'deducting customer volume discounts', fmt: 'Currency ($)' },
      { name: 'Corporate Tax Provision (7%)', formula: "='Total Sales' * 0.07", desc: 'provisioning corporate sales tax liability', fmt: 'Currency ($)' },
    ]);
    const topN = pick([3, 5, 8]);
    const topEntity = pick(['Best-Selling Products', 'Top Performing Sales Reps']);
    const showAs = pick(['% of Column Total', '% of Grand Total', 'Running Total In Order Date']);

    return filterByDifficulty([
      {
        id: `pv-task-1-${tag}`,
        topic: 'pivot',
        title: `Task 1: Build ${metric} Breakdown by ${rowDim} & ${colDim}`,
        scenario: `Create your Pivot Table to analyze ${metric} broken down by ${rowDim} (Rows) and ${colDim} (Columns) with formatted currency/numbers and Grand Totals.`,
        difficulty: 'Beginner',
        estimatedMinutes: 5,
        status: 'todo',
        subSteps: [
          { id: `pv-1-1-${tag}`, text: 'Click any single cell inside your Sales Transactions table.', completed: false, excelShortcutOrTip: 'Ctrl + A to select all or just click inside Table' },
          { id: `pv-1-2-${tag}`, text: 'Go to Ribbon: Insert > PivotTable > Choose "New Worksheet".', completed: false, excelShortcutOrTip: 'Alt + N + V + T' },
          { id: `pv-1-3-${tag}`, text: `Drag [${rowDim}] into the ROWS quadrant.`, completed: false },
          { id: `pv-1-4-${tag}`, text: `Drag [${colDim}] into the COLUMNS quadrant.`, completed: false },
          { id: `pv-1-5-${tag}`, text: `Drag [${metric}] into the VALUES quadrant and set Number Format.`, completed: false, excelShortcutOrTip: 'Right-click value cell > Number Format > Currency' },
        ],
        ribbonPath: 'Insert Tab > PivotTable > From Table/Range',
        expectedResultDescription: `A clean 2-dimensional grid showing ${metric} totals with row and column Grand Totals.`,
        proTip: 'Always change number formatting via "Number Format" on the Value Field Settings, NOT the regular Home tab, so formatting persists when you filter!',
      },
      {
        id: `pv-task-2-${tag}`,
        topic: 'pivot',
        title: `Task 2: Connect Interactive Dual Slicers ([${slicerPair[0]}] & [${slicerPair[1]}])`,
        scenario: `Build an executive one-click dashboard. Insert visual Slicers for ${slicerPair[0]} and ${slicerPair[1]} to filter pivot calculations without dropdown menus.`,
        difficulty: 'Beginner',
        estimatedMinutes: 5,
        status: 'todo',
        subSteps: [
          { id: `pv-2-1-${tag}`, text: 'Click inside your newly created PivotTable.', completed: false },
          { id: `pv-2-2-${tag}`, text: 'Go to Ribbon: PivotTable Analyze > Insert Slicer.', completed: false, excelShortcutOrTip: 'Alt + J + T + S' },
          { id: `pv-2-3-${tag}`, text: `Check the boxes for [${slicerPair[0]}] and [${slicerPair[1]}], then click OK.`, completed: false },
          { id: `pv-2-4-${tag}`, text: `Format the [${slicerPair[0]}] slicer into multiple horizontal columns via Slicer Tab > Columns.`, completed: false },
          { id: `pv-2-5-${tag}`, text: 'Click any slicer button and watch the numbers update instantly.', completed: false },
        ],
        ribbonPath: 'PivotTable Analyze Tab > Filter Group > Insert Slicer',
        expectedResultDescription: 'Two sleek button bars floating above the pivot that filter rows with zero lag.',
        proTip: 'Hold down Ctrl while clicking slicer buttons to select multiple non-adjacent items simultaneously!',
      },
      {
        id: `pv-task-3-${tag}`,
        topic: 'pivot',
        title: `Task 3: Add a Calculated Field for [${calc.name}]`,
        scenario: `The raw dataset does not have a dedicated column for this KPI. Create a calculated field inside the Pivot Table engine: ${calc.desc}.`,
        difficulty: 'Intermediate',
        estimatedMinutes: 8,
        status: 'todo',
        subSteps: [
          { id: `pv-3-1-${tag}`, text: 'Click inside the Pivot Table.', completed: false },
          { id: `pv-3-2-${tag}`, text: 'Navigate to: PivotTable Analyze > Fields, Items, & Sets > Calculated Field.', completed: false },
          { id: `pv-3-3-${tag}`, text: `Name the new field: "${calc.name}".`, completed: false },
          { id: `pv-3-4-${tag}`, text: `In the formula box, enter: = ${calc.formula}`, completed: false },
          { id: `pv-3-5-${tag}`, text: `Click Add and OK. Right-click the new column and set Number Format to ${calc.fmt}.`, completed: false },
        ],
        targetFormula: calc.formula,
        ribbonPath: 'PivotTable Analyze > Fields, Items, & Sets > Calculated Field',
        expectedResultDescription: `A dynamic column for ${calc.name} appears in the pivot values, correctly calculated at the aggregate total level.`,
        proTip: 'Calculated fields compute formulas at the aggregate level, which is mathematically accurate. Never average individual margin ratios!',
      },
      {
        id: `pv-task-4-${tag}`,
        topic: 'pivot',
        title: `Task 4: Filter for Top ${topN} ${topEntity}`,
        scenario: `Instead of displaying dozens of items, configure an automatic Top ${topN} Value Filter that dynamically isolates the highest revenue generators.`,
        difficulty: 'Intermediate',
        estimatedMinutes: 6,
        status: 'todo',
        subSteps: [
          { id: `pv-4-1-${tag}`, text: 'Place the target category/entity in the ROWS area of your Pivot Table.', completed: false },
          { id: `pv-4-2-${tag}`, text: 'Click the Row Labels filter funnel icon in the header cell.', completed: false },
          { id: `pv-4-3-${tag}`, text: 'Hover over "Value Filters" > Select "Top 10...".', completed: false },
          { id: `pv-4-4-${tag}`, text: `Change "10" to "${topN}", evaluate by "Sum of Total Sales", and click OK.`, completed: false },
          { id: `pv-4-5-${tag}`, text: 'Right click any sales value > Sort > Sort Largest to Smallest.', completed: false },
        ],
        ribbonPath: 'Row Labels Dropdown > Value Filters > Top 10...',
        expectedResultDescription: `Only the top ${topN} highest grossing items are visible, ordered from highest to lowest sales.`,
        proTip: 'Combine this with your slicers. As you toggle quarters or regions, the Top items will automatically recalculate and re-rank!',
      },
      {
        id: `pv-task-5-${tag}`,
        topic: 'pivot',
        title: `Task 5: Transform Metric to "${showAs}"`,
        scenario: `Convert raw numbers into analytical proportions to see which group accounts for what relative share of business volume.`,
        difficulty: 'Advanced',
        estimatedMinutes: 7,
        status: 'todo',
        subSteps: [
          { id: `pv-5-1-${tag}`, text: 'Drag [Total Sales] into the VALUES quadrant a second time.', completed: false },
          { id: `pv-5-2-${tag}`, text: 'Right-click the second sales column in the Pivot Table.', completed: false },
          { id: `pv-5-3-${tag}`, text: `Hover over "Show Values As" > Choose "${showAs}".`, completed: false },
          { id: `pv-5-4-${tag}`, text: 'Rename the column header to "% Contribution" or "Running Total".', completed: false },
          { id: `pv-5-5-${tag}`, text: 'Observe that the total matches analytical expectations.', completed: false },
        ],
        ribbonPath: `Right-Click Value Cell > Show Values As > ${showAs}`,
        expectedResultDescription: 'Side-by-side view of absolute values alongside their exact analytical proportion to the whole.',
        proTip: 'You can also select "Running Total In..." to create month-over-month cumulative financial build curves without writing complex formulas.',
      },
    ]);
  }

  // 3. POWER QUERY TASKS
  if (topic === 'power_query') {
    const storeCount = primarySheet?.rows?.length || 50;
    const unpivotedCount = storeCount * 4;
    const sampleStoreName = pick(['apex tech flagship', 'metro electronics hub', 'beacon bay retail', 'summit electronics depot', 'vanguard computer outlet']);
    const threshold = pick([120000, 150000, 175000, 200000]);
    const joinTarget = pick(['Store Managers Table', 'Regional Distribution Centers', 'District Sales Targets']);

    return filterByDifficulty([
      {
        id: `pq-task-1-${tag}`,
        topic: 'power_query',
        title: 'Task 1: Import Data & Launch Power Query Editor',
        scenario: 'The quarterly store report is arranged in wide spreadsheet format (Q1, Q2, Q3, Q4 across separate columns). Import it into Power Query to transform it into tabular data.',
        difficulty: 'Beginner',
        estimatedMinutes: 4,
        status: 'todo',
        subSteps: [
          { id: `pq-1-1-${tag}`, text: 'Click inside the Store Quarterly Sales data table.', completed: false, excelShortcutOrTip: 'Alt + A + P + T' },
          { id: `pq-1-2-${tag}`, text: 'Go to Ribbon: Data Tab > Get & Transform Data > From Sheet (or From Table/Range).', completed: false },
          { id: `pq-1-3-${tag}`, text: 'Verify the Power Query Editor window opens with your data preview.', completed: false },
          { id: `pq-1-4-${tag}`, text: 'Check the "Applied Steps" pane on the right-hand side.', completed: false },
        ],
        ribbonPath: 'Data Tab > Get Data > From Sheet / From Table/Range',
        expectedResultDescription: 'The Power Query window opens displaying all store columns and rows ready for transformation.',
        proTip: 'Power Query records every click as a repeatable ETL step. Once built, you can hit "Refresh All" next quarter and it cleans the new data in seconds!',
      },
      {
        id: `pq-task-2-${tag}`,
        topic: 'power_query',
        title: `Task 2: Master "Unpivot Other Columns" (${storeCount} wide to ${unpivotedCount} tall)`,
        scenario: `Relational databases and Pivot Tables require a tall fact table: one row per store per quarter, transforming ${storeCount} wide store rows into ${unpivotedCount} normalized records.`,
        difficulty: 'Intermediate',
        estimatedMinutes: 7,
        status: 'todo',
        subSteps: [
          { id: `pq-2-1-${tag}`, text: 'In Power Query Editor, hold Ctrl and select: [Store ID], [Store Name], and [Region].', completed: false },
          { id: `pq-2-2-${tag}`, text: 'Right-click one of the highlighted headers and choose "Unpivot Other Columns".', completed: false, excelShortcutOrTip: 'Transform Tab > Unpivot Columns dropdown > Unpivot Other Columns' },
          { id: `pq-2-3-${tag}`, text: `Observe the transformation: ${storeCount} wide rows become ${unpivotedCount} tall rows!`, completed: false },
          { id: `pq-2-4-${tag}`, text: 'Double click column "Attribute" and rename it to "Quarter".', completed: false },
          { id: `pq-2-5-${tag}`, text: 'Double click column "Value" and rename it to "Quarterly Revenue".', completed: false },
        ],
        ribbonPath: 'Transform Tab > Any Column Group > Unpivot Columns > Unpivot Other Columns',
        expectedResultDescription: `The wide Q1-Q4 columns collapse into normalized tall records with Quarter and Revenue columns (${unpivotedCount} total rows).`,
        proTip: 'Always choose "Unpivot Other Columns" instead of "Unpivot Selected Columns". That way, if a "Q5" or "Adjustment" column is added later, it unpivots automatically!',
      },
      {
        id: `pq-task-3-${tag}`,
        topic: 'power_query',
        title: `Task 3: Text Cleaning & Case Normalization (e.g. "${sampleStoreName}")`,
        scenario: 'Raw store names contain irregular leading spaces and lowercase text. Clean whitespace and assign proper types.',
        difficulty: 'Intermediate',
        estimatedMinutes: 6,
        status: 'todo',
        subSteps: [
          { id: `pq-3-1-${tag}`, text: 'Click the [Store Name] column header in Power Query.', completed: false },
          { id: `pq-3-2-${tag}`, text: 'Go to: Transform Tab > Format > Trim (removes invisible leading & trailing spaces).', completed: false },
          { id: `pq-3-3-${tag}`, text: 'Go to: Transform Tab > Format > Capitalize Each Word.', completed: false },
          { id: `pq-3-4-${tag}`, text: 'Click the icon in the [Quarterly Revenue] header and change type to "Currency".', completed: false },
          { id: `pq-3-5-${tag}`, text: 'Ensure [Quarter] is Text and [Store ID] is Text (IDs should never be Whole Numbers).', completed: false },
        ],
        ribbonPath: 'Transform Tab > Text Column > Format > Trim / Capitalize Each Word',
        expectedResultDescription: 'All text strings are pristine and standardized; numbers carry strict currency and decimal data types.',
        proTip: 'Always store identifiers (like Store ID, Zip Code, SSN) as Text data types, never as Numbers, to preserve leading zeroes and avoid accidental summation.',
      },
      {
        id: `pq-task-4-${tag}`,
        topic: 'power_query',
        title: `Task 4: Add Conditional Column for Flagship Outlets (>= $${threshold.toLocaleString()})`,
        scenario: `Add a business logic conditional column: If [Quarterly Revenue] >= ${threshold}, classify as "Tier 1 Flagship", otherwise "Standard Outlet".`,
        difficulty: 'Intermediate',
        estimatedMinutes: 6,
        status: 'todo',
        subSteps: [
          { id: `pq-4-1-${tag}`, text: 'Navigate to: Add Column Tab > Conditional Column.', completed: false },
          { id: `pq-4-2-${tag}`, text: 'Name the new column "Store Tier".', completed: false },
          { id: `pq-4-3-${tag}`, text: `Set Clause: If [Quarterly Revenue] is greater than or equal to ${threshold}, then "Tier 1 Flagship".`, completed: false },
          { id: `pq-4-4-${tag}`, text: 'Set Else: "Standard Outlet". Click OK.', completed: false },
          { id: `pq-4-5-${tag}`, text: 'Verify the new column populates with the correct branch classifications.', completed: false },
        ],
        ribbonPath: 'Add Column Tab > General > Conditional Column',
        expectedResultDescription: 'Each record is labeled with its operational tier based on quarterly revenue performance.',
        proTip: 'Conditional columns in Power Query write standard M code like `if [Quarterly Revenue] >= ... then ... else ...` under the hood!',
      },
      {
        id: `pq-task-5-${tag}`,
        topic: 'power_query',
        title: `Task 5: Merge Queries via Left Outer Join with ${joinTarget}`,
        scenario: `Join relational manager or warehouse metadata into your normalized sales table by matching on Store ID, performing a database JOIN in Excel.`,
        difficulty: 'Advanced',
        estimatedMinutes: 8,
        status: 'todo',
        subSteps: [
          { id: `pq-5-1-${tag}`, text: `Import the ${joinTarget} into Power Query as a second query.`, completed: false },
          { id: `pq-5-2-${tag}`, text: 'In Home Tab, click "Merge Queries" > "Merge Queries as New".', completed: false },
          { id: `pq-5-3-${tag}`, text: `Select Store Sales as top table and ${joinTarget} as bottom table.`, completed: false },
          { id: `pq-5-4-${tag}`, text: 'Click [Store ID] in both table previews to establish the join key.', completed: false },
          { id: `pq-5-5-${tag}`, text: 'Choose "Left Outer (all from first, matching from second)" and click OK.', completed: false },
          { id: `pq-5-6-${tag}`, text: 'Click the Expand icon on the merged column and select the desired metadata fields.', completed: false },
        ],
        ribbonPath: 'Home Tab > Combine Group > Merge Queries',
        expectedResultDescription: `The merged query contains store sales enriched with manager/regional fields in a single unified table.`,
        proTip: 'Power Query merges replace dozens of messy VLOOKUP columns with a clean, single-click database join that runs 10x faster on large datasets.',
      },
    ]);
  }

  // 4. CONDITIONAL FORMATTING TASKS
  const quotaPct = pick([95, 100, 105, 110]);
  const overdueNum = randInt(2, 4);
  const condRule = pick([
    { formula: `=AND($G2<0.85, $J2>=${overdueNum})`, desc: `Attainment < 85% and Overdue Tasks >= ${overdueNum}` },
    { formula: `=AND($G2>=1.0, $H2>=4.5)`, desc: 'Attainment >= 100% and CSAT Rating >= 4.5' },
    { formula: `=OR($G2<0.80, $K2="At Risk")`, desc: 'Attainment < 80% or Status is "At Risk"' },
    { formula: `=AND($F2>=80000, $G2>=1.05)`, desc: 'Actual Sales >= $80,000 and Attainment >= 105%' },
  ]);
  const barPalette = pick(['Soft Emerald Green', 'Ocean Blue', 'Warm Amber Gold', 'Vibrant Teal']);
  const iconSetScheme = pick([
    { name: 'CSAT 3 Traffic Lights', thresholds: 'Green >= 4.5, Yellow >= 3.8, Red < 3.8 (Type: Number)' },
    { name: 'Attainment 3 Flags', thresholds: 'Green >= 1.05, Yellow >= 0.90, Red < 0.90 (Type: Number)' },
    { name: 'Performance 4 Ratings Stars', thresholds: '4 Stars >= 4.5, 3 Stars >= 3.8, 2 Stars >= 3.0 (Type: Number)' },
  ]);
  const formulaZebraOrLarge = pick([
    { name: 'Zebra Striping (=MOD(ROW(), 2) = 0)', formula: '=MOD(ROW(), 2) = 0', desc: 'Apply dynamic alternating row shading that stays intact when rows are inserted or filtered' },
    { name: `Highlight Top ${pick([3, 5, 10])} Sales with =LARGE()`, formula: `=F2>=LARGE($F$2:$F$51, ${pick([3, 5, 10])})`, desc: 'Highlight the top revenue achievers dynamically across the company using the LARGE function' },
  ]);

  return filterByDifficulty([
    {
      id: `cf-task-1-${tag}`,
      topic: 'conditional_formulas',
      title: `Task 1: Highlight Quota Achievers (>= ${quotaPct}%) in Soft Green`,
      scenario: `Instantly spot sales reps who achieved or surpassed ${quotaPct}% of their monthly sales targets by highlighting their Attainment Ratio.`,
      difficulty: 'Beginner',
      estimatedMinutes: 4,
      status: 'todo',
      subSteps: [
        { id: `cf-1-1-${tag}`, text: 'Select the Attainment Ratio column cells (e.g., G2:G51).', completed: false, excelShortcutOrTip: 'Ctrl + Shift + Down Arrow' },
        { id: `cf-1-2-${tag}`, text: 'Go to Ribbon: Home > Conditional Formatting > Highlight Cells Rules > Greater Than...', completed: false, excelShortcutOrTip: 'Alt + H + L + H + G' },
        { id: `cf-1-3-${tag}`, text: `Enter ${(quotaPct / 100).toFixed(2)} (or ${quotaPct}%) in the value box.`, completed: false },
        { id: `cf-1-4-${tag}`, text: 'Select "Green Fill with Dark Green Text" (or create a custom soft pastel green fill).', completed: false },
        { id: `cf-1-5-${tag}`, text: `Click OK and verify reps over ${quotaPct}% are highlighted.`, completed: false },
      ],
      ribbonPath: 'Home Tab > Styles Group > Conditional Formatting > Highlight Cells Rules',
      expectedResultDescription: `All reps with Attainment >= ${quotaPct}% are clearly marked in green.`,
      proTip: 'Never use harsh neon fills. Choose soft pastels with dark text to keep corporate dashboards readable and professional.',
    },
    {
      id: `cf-task-2-${tag}`,
      topic: 'conditional_formulas',
      title: `Task 2: Flag At-Risk Employees with ${condRule.formula}`,
      scenario: `Flag performance concerns where an employee matches: ${condRule.desc} using a custom formula rule that highlights the entire row.`,
      difficulty: 'Intermediate',
      estimatedMinutes: 8,
      status: 'todo',
      subSteps: [
        { id: `cf-2-1-${tag}`, text: 'Select the full data rows A2:K51 (so the entire row lights up).', completed: false },
        { id: `cf-2-2-${tag}`, text: 'Go to: Home > Conditional Formatting > New Rule.', completed: false, excelShortcutOrTip: 'Alt + H + L + N' },
        { id: `cf-2-3-${tag}`, text: 'Select rule type: "Use a formula to determine which cells to format".', completed: false },
        { id: `cf-2-4-${tag}`, text: `Enter formula: ${condRule.formula}`, completed: false, excelShortcutOrTip: 'Crucial: Lock column letters ($G2) but keep row number relative!' },
        { id: `cf-2-5-${tag}`, text: 'Click Format > Fill > Pick soft rose/red > Click OK.', completed: false },
      ],
      targetFormula: condRule.formula,
      ribbonPath: 'Home Tab > Conditional Formatting > New Rule > Use a formula',
      expectedResultDescription: `The entire row highlights whenever the row satisfies: ${condRule.desc}.`,
      proTip: 'The dollar sign before the column letter ($G2) is the secret to whole-row highlighting in Excel. It forces Excel to check column G for every cell across the entire row!',
    },
    {
      id: `cf-task-3-${tag}`,
      topic: 'conditional_formulas',
      title: `Task 3: Add In-Cell Gradient Data Bars (${barPalette})`,
      scenario: `Embed micro-visualizations directly inside cells so stakeholders can compare rep revenues at a glance without generating a separate bar chart.`,
      difficulty: 'Beginner',
      estimatedMinutes: 5,
      status: 'todo',
      subSteps: [
        { id: `cf-3-1-${tag}`, text: 'Select the [Actual Sales] column (e.g., F2:F51).', completed: false },
        { id: `cf-3-2-${tag}`, text: 'Go to: Home > Conditional Formatting > Data Bars.', completed: false },
        { id: `cf-3-3-${tag}`, text: `Choose "Gradient Fill" in ${barPalette}.`, completed: false },
        { id: `cf-3-4-${tag}`, text: 'Optional: Go to Manage Rules > Edit Rule > Check "Show Bar Only" if you want a standalone sparkline bar.', completed: false },
      ],
      ribbonPath: 'Home Tab > Conditional Formatting > Data Bars > Gradient Fill',
      expectedResultDescription: 'Each cell contains a proportional visual bar whose length reflects that rep revenue relative to the maximum.',
      proTip: 'Data bars automatically scale to the minimum and maximum of the column, giving executives immediate visual hierarchy.',
    },
    {
      id: `cf-task-4-${tag}`,
      topic: 'conditional_formulas',
      title: `Task 4: Dynamic Indicator Icon Set (${iconSetScheme.name})`,
      scenario: `Apply an executive indicator icon set with explicit numerical thresholds: ${iconSetScheme.thresholds}.`,
      difficulty: 'Intermediate',
      estimatedMinutes: 7,
      status: 'todo',
      subSteps: [
        { id: `cf-4-1-${tag}`, text: 'Select the target KPI metric column (e.g., CSAT Score or Attainment).', completed: false },
        { id: `cf-4-2-${tag}`, text: `Go to: Home > Conditional Formatting > Icon Sets > Select ${iconSetScheme.name}.`, completed: false },
        { id: `cf-4-3-${tag}`, text: 'Immediately reopen Conditional Formatting > Manage Rules > Edit Rule.', completed: false },
        { id: `cf-4-4-${tag}`, text: 'Change the Type dropdown from "Percent" to "Number" for both thresholds!', completed: false, excelShortcutOrTip: 'Common mistake: Leaving Type as Percent instead of Number breaks logic!' },
        { id: `cf-4-5-${tag}`, text: `Enter numerical thresholds (${iconSetScheme.thresholds}) and click OK.`, completed: false },
      ],
      ribbonPath: 'Home Tab > Conditional Formatting > Manage Rules > Edit Rule > Icon Sets',
      expectedResultDescription: 'Clean indicator icons appear next to each rating with accurate boundary thresholds.',
      proTip: 'Excel defaults Icon Set thresholds to "Percent" (percentile rank), which confuses almost everyone! Always change the dropdown to "Number" when working with fixed scales.',
    },
    {
      id: `cf-task-5-${tag}`,
      topic: 'conditional_formulas',
      title: `Task 5: ${formulaZebraOrLarge.name}`,
      scenario: formulaZebraOrLarge.desc,
      difficulty: 'Intermediate',
      estimatedMinutes: 5,
      status: 'todo',
      subSteps: [
        { id: `cf-5-1-${tag}`, text: 'Select the entire data range (e.g., A2:K51).', completed: false },
        { id: `cf-5-2-${tag}`, text: 'Go to: Home > Conditional Formatting > New Rule > "Use a formula...".', completed: false },
        { id: `cf-5-3-${tag}`, text: `Enter the formula: ${formulaZebraOrLarge.formula}`, completed: false },
        { id: `cf-5-4-${tag}`, text: 'Click Format > Fill > Select an ultra-subtle light background shading.', completed: false },
        { id: `cf-5-5-${tag}`, text: 'Click OK and inspect how cells matching the formula receive dynamic highlighting.', completed: false },
      ],
      targetFormula: formulaZebraOrLarge.formula,
      ribbonPath: `Home Tab > Conditional Formatting > New Rule > Formula: ${formulaZebraOrLarge.formula}`,
      expectedResultDescription: 'Cells or alternate rows display clean, readable contrast background formatting.',
      proTip: 'Formulas in conditional formatting evaluate dynamically as values change, giving you programmatic control over cell aesthetics.',
    },
  ]);
}
