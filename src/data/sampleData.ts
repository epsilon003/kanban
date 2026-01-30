import { KanbanColumn, KanbanTask } from '@/components/KanbanBoard/KanbanBoard.types';

export const sampleColumns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: [], maxTasks: 10 },
  { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: [], maxTasks: 5 },
  { id: 'review', title: 'Review', color: '#f59e0b', taskIds: [], maxTasks: 3 },
  { id: 'done', title: 'Done', color: '#10b981', taskIds: [] },
];

export const sampleTasks: Record<string, KanbanTask> = {
  'task-1': {
    id: 'task-1',
    title: 'Implement drag and drop functionality',
    description: 'Add D&D functionality to kanban cards using @dnd-kit/core',
    status: 'todo',
    priority: 'high',
    assignee: 'John Doe',
    tags: ['frontend', 'feature'],
    createdAt: new Date(2024, 0, 10),
    dueDate: new Date(2024, 1, 20),
  },
  'task-2': {
    id: 'task-2',
    title: 'Design task modal',
    description: 'Create modal component for editing task details',
    status: 'todo',
    priority: 'medium',
    assignee: 'Jane Smith',
    tags: ['design', 'ui'],
    createdAt: new Date(2024, 0, 11),
    dueDate: new Date(2024, 1, 18),
  },
  'task-3': {
    id: 'task-3',
    title: 'Setup TypeScript configuration',
    status: 'in-progress',
    priority: 'urgent',
    assignee: 'John Doe',
    tags: ['setup', 'typescript'],
    createdAt: new Date(2024, 0, 9),
  },
  'task-4': {
    id: 'task-4',
    title: 'Create project structure',
    description: 'Setup folder structure and initial files',
    status: 'done',
    priority: 'low',
    assignee: 'Jane Smith',
    tags: ['setup'],
    createdAt: new Date(2024, 0, 8),
    dueDate: new Date(2024, 0, 9),
  },
  'task-5': {
    id: 'task-5',
    title: 'Install dependencies',
    status: 'done',
    priority: 'low',
    assignee: 'John Doe',
    tags: ['setup'],
    createdAt: new Date(2024, 0, 8),
  },
};

// Update columns with task IDs
sampleColumns[0].taskIds = ['task-1', 'task-2'];
sampleColumns[1].taskIds = ['task-3'];
sampleColumns[3].taskIds = ['task-4', 'task-5'];

// Generate large dataset for performance testing
export const generateLargeDataset = (taskCount: number = 50): {
  columns: KanbanColumn[];
  tasks: Record<string, KanbanTask>;
} => {
  const columns: KanbanColumn[] = [
    { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: [], maxTasks: 20 },
    { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: [], maxTasks: 10 },
    { id: 'review', title: 'Review', color: '#f59e0b', taskIds: [], maxTasks: 5 },
    { id: 'done', title: 'Done', color: '#10b981', taskIds: [] },
  ];
  
  const tasks: Record<string, KanbanTask> = {};
  const priorities: Array<'low' | 'medium' | 'high' | 'urgent'> = ['low', 'medium', 'high', 'urgent'];
  const assignees = ['Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown', 'Eve Davis'];
  const tagsList = ['frontend', 'backend', 'design', 'bug', 'feature', 'documentation', 'testing'];
  
  for (let i = 0; i < taskCount; i++) {
    const columnIndex = i % 4;
    const taskId = `task-${i + 1}`;
    const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
    const randomAssignee = assignees[Math.floor(Math.random() * assignees.length)];
    const randomTags = tagsList
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 1);
    
    tasks[taskId] = {
      id: taskId,
      title: `Task ${i + 1}: ${getRandomTaskTitle()}`,
      description: Math.random() > 0.5 ? `Description for task ${i + 1}` : undefined,
      status: columns[columnIndex].id,
      priority: Math.random() > 0.2 ? randomPriority : undefined,
      assignee: Math.random() > 0.3 ? randomAssignee : undefined,
      tags: randomTags,
      createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1),
      dueDate: Math.random() > 0.5 
        ? new Date(2024, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1)
        : undefined,
    };
    
    columns[columnIndex].taskIds.push(taskId);
  }
  
  return { columns, tasks };
};

const taskTitles = [
  'Implement authentication',
  'Fix navigation bug',
  'Update documentation',
  'Optimize database queries',
  'Design new landing page',
  'Add unit tests',
  'Refactor API endpoints',
  'Improve accessibility',
  'Setup CI/CD pipeline',
  'Create user onboarding flow',
];

const getRandomTaskTitle = (): string => {
  return taskTitles[Math.floor(Math.random() * taskTitles.length)];
};