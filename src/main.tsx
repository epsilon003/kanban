import React from 'react'
import ReactDOM from 'react-dom/client'
import { KanbanBoard } from './components/KanbanBoard/KanbanBoard'
import { useKanbanBoard } from './hooks/useKanbanBoard'
import { useDarkMode } from './hooks/useDarkMode'
import { DarkModeToggle } from './components/primitives/DarkModeToggle'
import { sampleColumns, sampleTasks } from './data/sampleData'
import './styles/globals.css'

const App = () => {
  const {
    columns,
    tasks,
    handleTaskMove,
    handleTaskCreate,
    handleTaskUpdate,
    handleTaskDelete,
  } = useKanbanBoard(sampleColumns, sampleTasks);

  const { isDark, toggle } = useDarkMode();

  return (
    <div className="h-screen bg-neutral-50 dark:bg-neutral-900">
      <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Kanban Board</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Production-ready drag-and-drop task management</p>
          </div>
          <DarkModeToggle isDark={isDark} onToggle={toggle} />
        </div>
      </header>
      <div className="h-[calc(100vh-80px)]">
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
  </React.StrictMode>,
)