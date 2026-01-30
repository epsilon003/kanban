import type { Meta, StoryObj } from '@storybook/react';
import { KanbanBoard } from './KanbanBoard';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';
import { useDarkMode } from '@/hooks/useDarkMode';
import { DarkModeToggle } from '@/components/primitives/DarkModeToggle';
import { sampleColumns, sampleTasks, generateLargeDataset } from '@/data/sampleData';
import { KanbanColumn, KanbanTask } from './KanbanBoard.types';

const meta: Meta<typeof KanbanBoard> = {
  title: 'Components/KanbanBoard',
  component: KanbanBoard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A fully functional Kanban Board component with drag-and-drop functionality, task management, and responsive design.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof KanbanBoard>;

// Wrapper component to provide state management
const KanbanBoardWrapper = ({ 
  initialColumns, 
  initialTasks 
}: { 
  initialColumns: KanbanColumn[];
  initialTasks: Record<string, KanbanTask>;
}) => {
  const {
    columns,
    tasks,
    handleTaskMove,
    handleTaskCreate,
    handleTaskUpdate,
    handleTaskDelete,
  } = useKanbanBoard(initialColumns, initialTasks);

  const { isDark, toggle } = useDarkMode();

  return (
    <div className="h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Kanban Board Demo</h2>
        <DarkModeToggle isDark={isDark} onToggle={toggle} />
      </div>
      <div className="h-[calc(100vh-64px)]">
        <KanbanBoard
          columns={columns}
          tasks={tasks}
          onTaskMove={handleTaskMove}
          onTaskCreate={handleTaskCreate}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
        />
      </div>
    </div>
  );
};

/**
 * Default Kanban board with sample tasks across multiple columns.
 * This demonstrates the basic functionality including drag-and-drop,
 * task creation, editing, and deletion.
 */
export const Default: Story = {
  render: () => (
    <KanbanBoardWrapper
      initialColumns={sampleColumns}
      initialTasks={sampleTasks}
    />
  ),
};

/**
 * Empty Kanban board with no tasks.
 * This demonstrates the empty state for each column.
 */
export const EmptyState: Story = {
  render: () => {
    const emptyColumns: KanbanColumn[] = [
      { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: [] },
      { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: [] },
      { id: 'review', title: 'Review', color: '#f59e0b', taskIds: [] },
      { id: 'done', title: 'Done', color: '#10b981', taskIds: [] },
    ];
    
    return (
      <KanbanBoardWrapper
        initialColumns={emptyColumns}
        initialTasks={{}}
      />
    );
  },
};

/**
 * Kanban board with many tasks (50+) to demonstrate performance
 * and virtualization capabilities. Tests handling of large datasets.
 */
export const WithManyTasks: Story = {
  render: () => {
    const { columns, tasks } = generateLargeDataset(60);
    
    return (
      <KanbanBoardWrapper
        initialColumns={columns}
        initialTasks={tasks}
      />
    );
  },
};

/**
 * Demonstrates all priority levels and their visual representation.
 * Shows how different priority tasks are displayed with color coding.
 */
export const DifferentPriorities: Story = {
  render: () => {
    const priorityTasks: Record<string, KanbanTask> = {
      'task-low': {
        id: 'task-low',
        title: 'Low priority task',
        description: 'This task has low priority',
        status: 'todo',
        priority: 'low',
        assignee: 'John Doe',
        tags: ['feature'],
        createdAt: new Date(),
      },
      'task-medium': {
        id: 'task-medium',
        title: 'Medium priority task',
        description: 'This task has medium priority',
        status: 'todo',
        priority: 'medium',
        assignee: 'Jane Smith',
        tags: ['bug'],
        createdAt: new Date(),
      },
      'task-high': {
        id: 'task-high',
        title: 'High priority task',
        description: 'This task has high priority',
        status: 'in-progress',
        priority: 'high',
        assignee: 'Bob Johnson',
        tags: ['urgent', 'bug'],
        createdAt: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      'task-urgent': {
        id: 'task-urgent',
        title: 'Urgent priority task',
        description: 'This task is urgent and needs immediate attention',
        status: 'in-progress',
        priority: 'urgent',
        assignee: 'Alice Williams',
        tags: ['critical', 'bug'],
        createdAt: new Date(),
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Overdue by 2 days
      },
    };
    
    const priorityColumns: KanbanColumn[] = [
      { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: ['task-low', 'task-medium'] },
      { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: ['task-high', 'task-urgent'] },
      { id: 'review', title: 'Review', color: '#f59e0b', taskIds: [] },
      { id: 'done', title: 'Done', color: '#10b981', taskIds: [] },
    ];
    
    return (
      <KanbanBoardWrapper
        initialColumns={priorityColumns}
        initialTasks={priorityTasks}
      />
    );
  },
};

/**
 * Fully interactive demo with all features enabled.
 * Try dragging tasks, creating new tasks, editing, and deleting.
 */
export const InteractiveDemo: Story = {
  render: () => (
    <KanbanBoardWrapper
      initialColumns={sampleColumns}
      initialTasks={sampleTasks}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Try dragging tasks between columns, clicking on tasks to edit them, adding new tasks, and deleting tasks.',
      },
    },
  },
};

/**
 * Mobile-optimized view of the Kanban board.
 * View in mobile viewport to see responsive behavior.
 */
export const MobileView: Story = {
  render: () => (
    <KanbanBoardWrapper
      initialColumns={sampleColumns}
      initialTasks={sampleTasks}
    />
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Optimized for mobile devices with horizontal scrolling and touch-friendly interactions.',
      },
    },
  },
};

/**
 * Demonstrates keyboard navigation and accessibility features.
 * Use Tab to navigate, Space/Enter to interact with tasks.
 */
export const AccessibilityDemo: Story = {
  render: () => (
    <div className="h-screen bg-neutral-50">
      <div className="p-4 bg-primary-50 border-b border-primary-200">
        <h2 className="text-lg font-semibold text-primary-900 mb-2">
          Keyboard Navigation Guide
        </h2>
        <ul className="text-sm text-primary-800 space-y-1">
          <li><kbd className="px-2 py-1 bg-white rounded border border-primary-300">Tab</kbd> - Navigate between tasks</li>
          <li><kbd className="px-2 py-1 bg-white rounded border border-primary-300">Enter</kbd> - Open task for editing</li>
          <li><kbd className="px-2 py-1 bg-white rounded border border-primary-300">Space</kbd> - Pick up task for dragging</li>
          <li><kbd className="px-2 py-1 bg-white rounded border border-primary-300">Arrow Keys</kbd> - Move dragged task</li>
          <li><kbd className="px-2 py-1 bg-white rounded border border-primary-300">Esc</kbd> - Close modal or cancel drag</li>
        </ul>
      </div>
      <KanbanBoardWrapper
        initialColumns={sampleColumns}
        initialTasks={sampleTasks}
      />
    </div>
  ),
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'aria-roles',
            enabled: true,
          },
        ],
      },
    },
  },
};