import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { KanbanBoard } from './components/KanbanBoard/KanbanBoard';
import { LoginPage } from './components/Auth/LoginPage';
import { OnboardingTutorial } from './components/Onboarding/OnboardingTutorial';
import { useAuth } from './hooks/useAuth';
import { useFirestore } from './hooks/useFirestore';
import { useDarkMode } from './hooks/useDarkMode';
import { DarkModeToggle } from './components/primitives/DarkModeToggle';
import { UserMenu } from './components/primitives/UserMenu';
import { reorderTasks, moveTaskBetweenColumns } from './utils/column.utils';
import { KanbanTask } from './components/KanbanBoard/KanbanBoard.types';
import './styles/globals.css';

const App = () => {
  const { user, loading: authLoading, error: authError, signInWithGoogle, signOut } = useAuth();
  const {
    columns,
    tasks,
    loading: dbLoading,
    saveTask,
    deleteTask,
    updateColumn,
  } = useFirestore(user?.uid || null);
  const { isDark, toggle } = useDarkMode();

  // Handle task movement
  const handleTaskMove = async (
    taskId: string,
    fromColumn: string,
    toColumn: string,
    newIndex: number
  ) => {
    const sourceColumn = columns.find((col) => col.id === fromColumn);
    const destColumn = columns.find((col) => col.id === toColumn);

    if (!sourceColumn || !destColumn) return;

    const sourceIndex = sourceColumn.taskIds.indexOf(taskId);

    if (sourceColumn.id === destColumn.id) {
      // Reorder within same column
      const newTaskIds = reorderTasks(sourceColumn.taskIds, sourceIndex, newIndex);
      await updateColumn({ ...sourceColumn, taskIds: newTaskIds });
    } else {
      // Move between columns
      const { source, destination } = moveTaskBetweenColumns(
        sourceColumn.taskIds,
        destColumn.taskIds,
        sourceIndex,
        newIndex
      );

      // Update both columns
      await updateColumn({ ...sourceColumn, taskIds: source });
      await updateColumn({ ...destColumn, taskIds: destination });

      // Update task status
      const task = tasks[taskId];
      if (task) {
        await saveTask({ ...task, status: toColumn });
      }
    }
  };

  // Handle task creation
  const handleTaskCreate = async (columnId: string, task: KanbanTask) => {
    await saveTask(task);

    // Add task to column
    const column = columns.find((col) => col.id === columnId);
    if (column) {
      await updateColumn({
        ...column,
        taskIds: [...column.taskIds, task.id],
      });
    }
  };

  // Handle task update
  const handleTaskUpdate = async (taskId: string, updates: Partial<KanbanTask>) => {
    const currentTask = tasks[taskId];
    if (!currentTask) return;

    const updatedTask = { ...currentTask, ...updates };
    await saveTask(updatedTask);

    // If status changed, move task to new column
    if (updates.status && updates.status !== currentTask.status) {
      const oldColumn = columns.find((col) => col.id === currentTask.status);
      const newColumn = columns.find((col) => col.id === updates.status);

      if (oldColumn && newColumn) {
        await updateColumn({
          ...oldColumn,
          taskIds: oldColumn.taskIds.filter((id) => id !== taskId),
        });
        await updateColumn({
          ...newColumn,
          taskIds: [...newColumn.taskIds, taskId],
        });
      }
    }
  };

  // Handle task deletion
  const handleTaskDelete = async (taskId: string) => {
    await deleteTask(taskId);

    // Remove from column
    const column = columns.find((col) => col.taskIds.includes(taskId));
    if (column) {
      await updateColumn({
        ...column,
        taskIds: column.taskIds.filter((id) => id !== taskId),
      });
    }
  };

  // Show loading spinner during auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage onSignIn={signInWithGoogle} loading={authLoading} error={authError} />;
  }

  // Show loading spinner while fetching user data
  if (dbLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400">Loading your board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col">
      {/* Onboarding Tutorial */}
      <OnboardingTutorial userId={user.uid} />

      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-6 py-4 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Kanban Board
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Welcome back, {user.displayName?.split(' ')[0] || 'there'}!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div data-tour="dark-mode">
              <DarkModeToggle isDark={isDark} onToggle={toggle} />
            </div>
            <UserMenu user={user} onSignOut={signOut} />
          </div>
        </div>
      </header>

      {/* Main Board */}
      <div className="flex-1 overflow-hidden">
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);