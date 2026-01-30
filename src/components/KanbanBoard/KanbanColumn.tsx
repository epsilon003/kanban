import React from 'react';
import clsx from 'clsx';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanColumn as KanbanColumnType, KanbanTask } from './KanbanBoard.types';
import { KanbanCard } from './KanbanCard';
import { Button } from '@/components/primitives/Button';

interface KanbanColumnProps {
  column: KanbanColumnType;
  tasks: KanbanTask[];
  onTaskCreate: (columnId: string) => void;
  onTaskEdit: (task: KanbanTask) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  onTaskCreate,
  onTaskEdit,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });
  
  const handleCreateTask = () => {
    onTaskCreate(column.id);
  };
  
  const isNearLimit = column.maxTasks && tasks.length >= column.maxTasks * 0.8;
  const isAtLimit = column.maxTasks && tasks.length >= column.maxTasks;
  
  return (
    <div
      className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4 min-w-[280px] max-w-[320px] shrink-0"
      role="region"
      aria-label={`${column.title} column. ${tasks.length} tasks${column.maxTasks ? `, limit ${column.maxTasks}` : ''}.`}
    >
      {/* Column Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: column.color }}
              aria-hidden="true"
            />
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{column.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={clsx(
                'text-sm font-medium px-2 py-0.5 rounded',
                isAtLimit ? 'bg-error-100 text-error-700' :
                isNearLimit ? 'bg-warning-100 text-warning-700' :
                'bg-neutral-200 text-neutral-600'
              )}
            >
              {tasks.length}
              {column.maxTasks && ` / ${column.maxTasks}`}
            </span>
          </div>
        </div>
      </div>
      
      {/* Tasks Container */}
      <div
        ref={setNodeRef}
        className={clsx(
          'flex-1 overflow-y-auto space-y-2 min-h-[200px] rounded-lg p-2 transition-colors',
          isOver && 'bg-primary-50'
        )}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-neutral-400 text-sm">
              No tasks yet
            </div>
          ) : (
            tasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                onEdit={onTaskEdit}
              />
            ))
          )}
        </SortableContext>
      </div>
      
      {/* Add Task Button */}
      <div className="mt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCreateTask}
          className="w-full justify-start"
          disabled={isAtLimit}
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </Button>
      </div>
    </div>
  );
};