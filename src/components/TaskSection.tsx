import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PracticeTask, PracticeTopic, TaskDifficulty, TaskStatus } from '../types/excel';
import { DEFAULT_PRACTICE_TASKS } from '../data/tasks';
import {
  CheckSquare,
  Square,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  BookCheck,
  Trophy,
  Lightbulb,
  ExternalLink,
  Printer,
  FileText,
  AlertCircle,
  HelpCircle,
  Shuffle,
  Dices,
  RefreshCw,
} from 'lucide-react';

interface TaskSectionProps {
  topic: PracticeTopic;
  tasks: PracticeTask[];
  onTasksChange?: (tasks: PracticeTask[]) => void;
  onRandomizeTasks: () => void;
  onRegenerateAll: () => void;
  onCopyFormula: (formula: string, label: string) => void;
  seed?: number;
}

export const TaskSection: React.FC<TaskSectionProps> = ({
  topic,
  tasks,
  onTasksChange,
  onRandomizeTasks,
  onRegenerateAll,
  onCopyFormula,
  seed,
}) => {
  // Current active tasks list, synced with props and custom tasks
  const [currentTasks, setCurrentTasks] = useState<PracticeTask[]>(() => {
    try {
      const savedCustom = localStorage.getItem(`excel_custom_tasks_${topic}`);
      const customList: PracticeTask[] = savedCustom ? JSON.parse(savedCustom) : [];
      const base = tasks && tasks.length > 0 ? tasks : DEFAULT_PRACTICE_TASKS[topic] || [];
      return [...customList, ...base];
    } catch (e) {
      return tasks && tasks.length > 0 ? tasks : DEFAULT_PRACTICE_TASKS[topic] || [];
    }
  });

  // Sync when tasks prop, topic, or seed updates (e.g. on regeneration or refresh)
  useEffect(() => {
    try {
      const savedCustom = localStorage.getItem(`excel_custom_tasks_${topic}`);
      const customList: PracticeTask[] = savedCustom ? JSON.parse(savedCustom) : [];
      const base = tasks && tasks.length > 0 ? tasks : DEFAULT_PRACTICE_TASKS[topic] || [];
      const combined = [...customList, ...base];
      setCurrentTasks(combined);
      if (combined.length > 0) {
        setExpandedTaskId(combined[0].id);
      }
    } catch (e) {
      setCurrentTasks(tasks);
    }
  }, [tasks, topic, seed]);

  // Filter & Search states
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'in_progress' | 'completed'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | TaskDifficulty>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Set first task open by default on mount or topic switch
  useEffect(() => {
    if (currentTasks.length > 0) {
      setExpandedTaskId(currentTasks[0].id);
    }
  }, [topic]);

  // Practice Stopwatch / Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const toggleTimer = () => setIsTimerRunning((r) => !r);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Add Custom Task Modal State
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customScenario, setCustomScenario] = useState('');
  const [customDifficulty, setCustomDifficulty] = useState<TaskDifficulty>('Intermediate');
  const [customMinutes, setCustomMinutes] = useState(10);
  const [customStepsText, setCustomStepsText] = useState('');
  const [customFormula, setCustomFormula] = useState('');

  // Track copied task formula for immediate visual checkmark feedback
  const [copiedTaskId, setCopiedTaskId] = useState<string | null>(null);

  const handleCopyFormulaLocal = (formula: string, label: string, taskId?: string) => {
    onCopyFormula(formula, label);
    if (taskId) {
      setCopiedTaskId(taskId);
      setTimeout(() => setCopiedTaskId(null), 2500);
    }
  };

  // Toggle single sub-step completion
  const handleToggleSubStep = (taskId: string, stepId: string) => {
    setCurrentTasks((prev) => {
      const updated = prev.map((task) => {
        if (task.id !== taskId) return task;

        const nextSteps = task.subSteps.map((step) => {
          if (step.id !== stepId) return step;
          return { ...step, completed: !step.completed };
        });

        // Auto-update overall task status if all steps completed
        const allCompleted = nextSteps.length > 0 && nextSteps.every((s) => s.completed);
        const anyCompleted = nextSteps.some((s) => s.completed);

        let nextStatus = task.status;
        if (allCompleted) {
          nextStatus = 'completed';
        } else if (anyCompleted && task.status === 'todo') {
          nextStatus = 'in_progress';
        }

        return {
          ...task,
          subSteps: nextSteps,
          status: nextStatus,
        };
      });

      if (onTasksChange) onTasksChange(updated);
      return updated;
    });
  };

  // Change Task Status manually
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setCurrentTasks((prev) => {
      const updated = prev.map((task) => {
        if (task.id !== taskId) return task;

        // If marked completed, mark all sub-steps completed too
        let subSteps = task.subSteps;
        if (newStatus === 'completed') {
          subSteps = task.subSteps.map((s) => ({ ...s, completed: true }));
        } else if (newStatus === 'todo' && task.status === 'completed') {
          subSteps = task.subSteps.map((s) => ({ ...s, completed: false }));
        }

        return { ...task, status: newStatus, subSteps };
      });

      if (onTasksChange) onTasksChange(updated);
      return updated;
    });
  };

  // Reset topic tasks to original uncompleted state
  const handleResetTopicTasks = () => {
    setCurrentTasks((prev) => {
      const reset = prev.map((t) => ({
        ...t,
        status: 'todo' as TaskStatus,
        subSteps: t.subSteps.map((s) => ({ ...s, completed: false })),
      }));
      if (onTasksChange) onTasksChange(reset);
      return reset;
    });
  };

  // Delete custom task
  const handleDeleteTask = (taskId: string) => {
    try {
      const savedCustom = localStorage.getItem(`excel_custom_tasks_${topic}`);
      if (savedCustom) {
        const customList: PracticeTask[] = JSON.parse(savedCustom);
        const updated = customList.filter((t) => t.id !== taskId);
        localStorage.setItem(`excel_custom_tasks_${topic}`, JSON.stringify(updated));
      }
    } catch (e) {
      console.error(e);
    }
    setCurrentTasks((prev) => {
      const filtered = prev.filter((t) => t.id !== taskId);
      if (onTasksChange) onTasksChange(filtered);
      return filtered;
    });
  };

  // Create new custom task
  const handleCreateCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const subStepsList = customStepsText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((text, idx) => ({
        id: `custom-sub-${Date.now()}-${idx}`,
        text: text.replace(/^[-*•\d.]+\s*/, ''), // remove leading bullets
        completed: false,
      }));

    const newTask: PracticeTask = {
      id: `custom-task-${Date.now()}`,
      topic,
      title: customTitle.trim(),
      scenario: customScenario.trim() || 'Custom user practice assignment.',
      difficulty: customDifficulty,
      estimatedMinutes: Number(customMinutes) || 10,
      status: 'todo',
      subSteps:
        subStepsList.length > 0
          ? subStepsList
          : [
              { id: `custom-sub-${Date.now()}-1`, text: 'Review requirement in Excel', completed: false },
              { id: `custom-sub-${Date.now()}-2`, text: 'Apply formula or feature', completed: false },
              { id: `custom-sub-${Date.now()}-3`, text: 'Verify output numbers', completed: false },
            ],
      targetFormula: customFormula.trim() || undefined,
      expectedResultDescription: 'Custom practice output validated in Excel.',
      isCustom: true,
    };

    // Save custom task to persistent storage for custom assignments
    try {
      const savedCustom = localStorage.getItem(`excel_custom_tasks_${topic}`);
      const customList: PracticeTask[] = savedCustom ? JSON.parse(savedCustom) : [];
      localStorage.setItem(`excel_custom_tasks_${topic}`, JSON.stringify([newTask, ...customList]));
    } catch (e) {
      console.error(e);
    }

    setCurrentTasks((prev) => {
      const updated = [newTask, ...prev];
      if (onTasksChange) onTasksChange(updated);
      return updated;
    });

    // Reset modal
    setCustomTitle('');
    setCustomScenario('');
    setCustomStepsText('');
    setCustomFormula('');
    setIsAddingCustom(false);
    setExpandedTaskId(newTask.id);
  };

  // Export tasks as printable / copyable markdown
  const handleExportTaskSheet = () => {
    const lines = [
      `# Excel Practice Tasks: ${topic.toUpperCase()}`,
      `Generated by Excel Practice Lab on ${new Date().toLocaleDateString()}`,
      '',
      `## Summary`,
      `Total Tasks: ${currentTasks.length}`,
      `Completed: ${currentTasks.filter((t) => t.status === 'completed').length}`,
      '',
      '---',
      '',
    ];

    currentTasks.forEach((task, idx) => {
      lines.push(`### ${task.title} [${task.difficulty} - ${task.estimatedMinutes} min]`);
      lines.push(`Status: ${task.status.toUpperCase()}`);
      lines.push(`Scenario: ${task.scenario}`);
      if (task.targetFormula) lines.push(`Target Formula: \`${task.targetFormula}\``);
      if (task.ribbonPath) lines.push(`Ribbon Path: ${task.ribbonPath}`);
      lines.push('');
      lines.push('Sub-Tasks Checklist:');
      task.subSteps.forEach((s) => {
        lines.push(`- [${s.completed ? 'x' : ' '}] ${s.text}`);
      });
      lines.push('');
      lines.push(`Verification: ${task.expectedResultDescription}`);
      lines.push('');
      lines.push('---');
      lines.push('');
    });

    const content = lines.join('\n');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content);
      onCopyFormula(content, 'Practice Tasks Checklist');
    }
  };

  // Filtered tasks calculation
  const filteredTasks = useMemo(() => {
    return currentTasks.filter((task) => {
      // Status filter
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;

      // Difficulty filter
      if (difficultyFilter !== 'all' && task.difficulty !== difficultyFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchScenario = task.scenario.toLowerCase().includes(q);
        const matchFormula = task.targetFormula?.toLowerCase().includes(q);
        const matchSteps = task.subSteps.some((s) => s.text.toLowerCase().includes(q));
        if (!matchTitle && !matchScenario && !matchFormula && !matchSteps) return false;
      }

      return true;
    });
  }, [currentTasks, statusFilter, difficultyFilter, searchQuery]);

  // Metrics
  const totalCount = currentTasks.length;
  const completedCount = currentTasks.filter((t) => t.status === 'completed').length;
  const inProgressCount = currentTasks.filter((t) => t.status === 'in_progress').length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xs border border-slate-200/80 dark:border-slate-800 p-5 mb-6 transition-colors">
      {/* 1. Header & Practice Overview */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800">
              Practice Missions
            </span>
            {seed !== undefined && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700"
                title="Random seed for this task batch"
              >
                <Dices className="w-3 h-3 text-slate-400" />
                <span>Seed #{seed.toString(36).toUpperCase()}</span>
              </span>
            )}
            <span className="text-xs text-slate-300 dark:text-slate-600">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Randomized assignments
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Hands-On Excel Practice Checklist
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Practical business tasks with formula references, ribbon navigation paths, and validation criteria. Click the copy icon to instantly grab formula solutions.
          </p>
        </div>

        {/* Minimalist Practice Timer */}
        <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 px-3 py-1.5 rounded-lg shrink-0 self-start lg:self-auto text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Clock className={`w-3.5 h-3.5 ${isTimerRunning ? 'text-emerald-600 dark:text-emerald-400 animate-pulse' : 'text-slate-400 dark:text-slate-500'}`} />
            <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-100 tracking-wide">
              {formatTimer(timerSeconds)}
            </span>
          </div>

          <div className="flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-700">
            <button
              onClick={toggleTimer}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                isTimerRunning
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 hover:bg-amber-200'
                  : 'bg-slate-200/80 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
              }`}
              title={isTimerRunning ? 'Pause Timer' : 'Start Timer'}
            >
              {isTimerRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={resetTimer}
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Progress Tracker Bar & Fast Actions */}
      <div className="bg-slate-50/70 dark:bg-slate-800/60 rounded-lg p-3.5 border border-slate-200/70 dark:border-slate-700/70 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        {/* Progress meter */}
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Progress:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{completionPercentage}%</span>
              <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                ({completedCount} of {totalCount} completed)
              </span>
            </div>
            {completionPercentage === 100 && (
              <span className="inline-flex items-center gap-1 font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded text-[11px] border border-emerald-200 dark:border-emerald-800">
                <Trophy className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Mastered!
              </span>
            )}
          </div>

          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
          {/* New Random Tasks Button */}
          <button
            onClick={onRandomizeTasks}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#107C41] hover:bg-[#0d6535] active:scale-95 text-white text-xs font-medium rounded-md shadow-2xs transition-all cursor-pointer"
            title="Generate new randomized tasks for this topic"
          >
            <Shuffle className="w-3 h-3" />
            <span>New Tasks</span>
          </button>

          {/* Refresh All Button */}
          <button
            onClick={onRegenerateAll}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
            title="Refresh both data and tasks"
          >
            <RefreshCw className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">Refresh All</span>
          </button>

          <button
            onClick={() => setIsAddingCustom(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
            title="Create your own custom Excel practice task"
          >
            <Plus className="w-3 h-3 text-slate-400" />
            <span>Custom Task</span>
          </button>

          <button
            onClick={handleExportTaskSheet}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
            title="Copy checklist to clipboard"
          >
            <FileText className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">Export Sheet</span>
          </button>

          <button
            onClick={handleResetTopicTasks}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs rounded transition-colors cursor-pointer"
            title="Reset checkmarks"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 3. Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Tasks ({totalCount})
          </button>
          <button
            onClick={() => setStatusFilter('todo')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'todo'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            To Do ({currentTasks.filter((t) => t.status === 'todo').length})
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'in_progress'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'completed'
                ? 'bg-emerald-700 dark:bg-emerald-600 text-white font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Search & Difficulty Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      {/* 4. Task Cards List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No tasks match your current filter.</p>
            <button
              onClick={() => {
                setStatusFilter('all');
                setDifficultyFilter('all');
                setSearchQuery('');
              }}
              className="mt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isExpanded = expandedTaskId === task.id;
            const subStepsCompleted = task.subSteps.filter((s) => s.completed).length;
            const totalSubSteps = task.subSteps.length;
            const isFullyCompleted = task.status === 'completed';
            const isThisCopied = copiedTaskId === task.id;

            return (
              <div
                key={task.id}
                className={`rounded-xl border transition-all ${
                  isFullyCompleted
                    ? 'border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/15 dark:bg-emerald-950/20'
                    : task.status === 'in_progress'
                    ? 'border-blue-200 dark:border-blue-800/80 bg-blue-50/10 dark:bg-blue-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Task Header Bar */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Status quick toggle checkbox */}
                    <button
                      onClick={() =>
                        handleStatusChange(task.id, isFullyCompleted ? 'todo' : 'completed')
                      }
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
                      title={isFullyCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
                    >
                      {isFullyCompleted ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3
                          onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                          className={`text-sm font-bold cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors ${
                            isFullyCompleted ? 'line-through text-slate-500 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {task.title}
                        </h3>

                        {task.isCustom && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            Custom
                          </span>
                        )}

                        {/* Difficulty badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            task.difficulty === 'Beginner'
                              ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : task.difficulty === 'Intermediate'
                              ? 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                              : 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                          }`}
                        >
                          {task.difficulty}
                        </span>

                        {/* Estimated Time */}
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" />
                          {task.estimatedMinutes} min
                        </span>

                        {/* Quick-Access Clickable Copy Icon for Individual Formula Solution */}
                        {task.targetFormula && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyFormulaLocal(task.targetFormula!, `${task.title} Formula`, task.id);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer ml-1"
                            title={`Quick copy formula solution: ${task.targetFormula}`}
                            aria-label={`Copy formula for ${task.title}`}
                          >
                            {isThisCopied ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                <span className="hidden sm:inline">Copy Formula</span>
                                <span className="sm:hidden">Formula</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{task.scenario}</p>
                    </div>
                  </div>

                  {/* Status Dropdown & Expand Toggle */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none ${
                        isFullyCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                          : task.status === 'in_progress'
                          ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>

                    <button
                      onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors cursor-pointer"
                      title={isExpanded ? 'Collapse' : 'View Subtasks & Details'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {task.isCustom && (
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md transition-colors cursor-pointer"
                        title="Delete custom task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Details: Sub-tasks checklist, formulas, and verification */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-700/80 space-y-4 animate-in fade-in duration-150">
                    {/* Sub-steps Checklist */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Action Steps ({subStepsCompleted}/{totalSubSteps} done)</span>
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">Click steps as you complete them in Excel</span>
                      </div>

                      <div className="space-y-1.5">
                        {task.subSteps.map((step) => (
                          <div
                            key={step.id}
                            onClick={() => handleToggleSubStep(task.id, step.id)}
                            className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                              step.completed
                                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-medium'
                                : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            <button
                              type="button"
                              className="mt-0.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0"
                            >
                              {step.completed ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                              )}
                            </button>

                            <div className="flex-1 text-xs leading-relaxed">
                              <span className={step.completed ? 'line-through text-slate-500 dark:text-slate-400' : ''}>
                                {step.text}
                              </span>
                              {step.excelShortcutOrTip && (
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[11px] text-emerald-800 dark:text-emerald-400 font-mono">
                                    Tip: {step.excelShortcutOrTip}
                                  </span>
                                  {step.excelShortcutOrTip.includes('=') && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopyFormulaLocal(step.excelShortcutOrTip!, 'Formula Tip');
                                      }}
                                      className="p-0.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded transition-colors"
                                      title="Copy tip snippet"
                                    >
                                      <Copy className="w-2.5 h-2.5" />
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Target Formula / Ribbon Path Box */}
                    {(task.targetFormula || task.ribbonPath) && (
                      <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-xl p-3.5 border border-slate-800">
                        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-800">
                          <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                            Target Formula / Navigation
                          </span>
                          {task.targetFormula && (
                            <button
                              onClick={() => handleCopyFormulaLocal(task.targetFormula!, `${task.title} Formula`, task.id)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              {isThisCopied ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400 font-semibold">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Formula</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {task.targetFormula && (
                          <div className="relative group font-mono text-xs text-emerald-300 dark:text-emerald-400 bg-slate-950/90 dark:bg-slate-900/90 p-2.5 rounded-lg overflow-hidden mb-2 border border-slate-800 flex items-center justify-between gap-2">
                            <span className="overflow-x-auto select-all pr-2 font-semibold">
                              {task.targetFormula}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyFormulaLocal(task.targetFormula!, `${task.title} Formula`, task.id)}
                              className="shrink-0 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                              title="Click to copy formula to clipboard"
                              aria-label="Copy formula"
                            >
                              {isThisCopied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        )}

                        {task.ribbonPath && (
                          <div className="text-xs text-slate-300 flex items-center gap-1.5">
                            <span className="text-slate-400 font-semibold">Excel Path:</span>
                            <span className="font-mono text-emerald-400">{task.ribbonPath}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Expected Verification Outcome */}
                    <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 flex items-start gap-2.5">
                      <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-0.5">
                          How to Verify Your Result in Excel:
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {task.expectedResultDescription}
                        </p>
                      </div>
                    </div>

                    {/* Pro Tip */}
                    {task.proTip && (
                      <div className="bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl p-3 flex items-start gap-2.5 text-amber-900 dark:text-amber-200">
                        <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div className="text-xs leading-relaxed">
                          <strong className="font-bold text-amber-950 dark:text-amber-100">Expert Pro-Tip: </strong>
                          {task.proTip}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 5. Add Custom Task Modal */}
      {isAddingCustom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsAddingCustom(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 dark:bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Plus className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">Add Custom Practice Task</h3>
              </div>
              <button
                onClick={() => setIsAddingCustom(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomTask} className="p-5 space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Build dynamic monthly sales tracker..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Scenario / Instructions</label>
                <textarea
                  rows={2}
                  value={customScenario}
                  onChange={(e) => setCustomScenario(e.target.value)}
                  placeholder="Describe the business scenario or challenge to solve..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Difficulty</label>
                  <select
                    value={customDifficulty}
                    onChange={(e) => setCustomDifficulty(e.target.value as TaskDifficulty)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Estimated Minutes</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                  </input>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Sub-tasks Checklist (One per line)
                </label>
                <textarea
                  rows={3}
                  value={customStepsText}
                  onChange={(e) => setCustomStepsText(e.target.value)}
                  placeholder="1. Open workbook&#10;2. Apply XLOOKUP to Unit Price&#10;3. Format as Currency"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Target Formula (Optional)</label>
                <input
                  type="text"
                  value={customFormula}
                  onChange={(e) => setCustomFormula(e.target.value)}
                  placeholder="=XLOOKUP(...)"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
