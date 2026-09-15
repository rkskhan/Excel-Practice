export type PracticeTopic = 'xlookup' | 'pivot' | 'power_query' | 'conditional_formulas';

export type DatasetSize = 'small' | 'medium' | 'large';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface ColumnDef {
  key: string;
  label: string;
  type: 'text' | 'number' | 'currency' | 'date' | 'percent' | 'badge';
  excelLetter?: string;
  description?: string;
}

export interface TableSheet {
  id: string;
  name: string;
  fileName: string;
  description: string;
  columns: ColumnDef[];
  rows: Record<string, any>[];
}

export interface DatasetPayload {
  topic: PracticeTopic;
  primarySheet: TableSheet;
  secondarySheets?: TableSheet[];
  activeSheetId: string;
}

export interface TutorialStep {
  stepNumber: number;
  title: string;
  description: string;
  excelAction?: string;
  formula?: {
    code: string;
    explanation: string;
    breakdown?: { part: string; meaning: string }[];
  };
  proTip?: string;
}

export interface TopicTutorial {
  topic: PracticeTopic;
  title: string;
  subtitle: string;
  objective: string;
  badge: string;
  steps: TutorialStep[];
  alternativeFormulas?: {
    name: string;
    code: string;
    note: string;
  }[];
}

export interface ChallengeQuestion {
  id: string;
  question: string;
  expectedAnswer: string | number;
  displayAnswer: string;
  excelFormula: string;
  explanation: string;
  hint: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export type TaskDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface TaskSubStep {
  id: string;
  text: string;
  completed: boolean;
  excelShortcutOrTip?: string;
}

export interface PracticeTask {
  id: string;
  topic: PracticeTopic;
  title: string;
  scenario: string;
  difficulty: TaskDifficulty;
  estimatedMinutes: number;
  status: TaskStatus;
  subSteps: TaskSubStep[];
  targetFormula?: string;
  ribbonPath?: string;
  expectedResultDescription: string;
  proTip?: string;
  notes?: string;
  isCustom?: boolean;
}
