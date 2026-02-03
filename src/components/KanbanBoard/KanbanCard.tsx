import React from 'react';
import clsx from 'clsx';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanTask } from './KanbanBoard.types';
import { formatDate, isOverdue, getPriorityBadgeColor } from '@/utils/task.utils';
import { Avatar } from '@/components/primitives/Avatar';

interface KanbanCardProps {
  task: KanbanTask;
  onEdit: (task: KanbanTask) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ task, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const handleClick = () => {
    onEdit(task);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onEdit(task);
    }
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={clsx(
        'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-3 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer select-none',
        isDragging && 'opacity-50',
        task.priority && 'border-l-4'
      )}
      role="button"
      tabIndex={0}
      aria-label={`Task: ${task.title}. Status: ${task.status}${task.priority ? `. Priority: ${task.priority}` : ''}. Press Enter to edit.`}
      data-tour="task-card"
    >
      <div className="flex items-start justify-between mb-2 gap-2">
        <h4 className="font-medium text-sm text-neutral-900 dark:text-neutral-100 line-clamp-2 flex-1">
          {task.title}
        </h4>
        {task.priority && (
          <span
            className={clsx(
              'text-xs px-2 py-0.5 rounded shrink-0',
              getPriorityBadgeColor(task.priority)
            )}
          >
            {task.priority}
          </span>
        )}
      </div>
      
      {task.description && (
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between mt-2">
        <div className="flex gap-1 flex-wrap">
          {task.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {task.assignee && (
          <Avatar name={task.assignee} size="sm" />
        )}
      </div>
      
      {task.dueDate && (
        <div
          className={clsx(
            'text-xs mt-2 font-medium',
            isOverdue(task.dueDate) ? 'text-error-600' : 'text-neutral-500'
          )}
        >
          Due: {formatDate(task.dueDate)}
        </div>
      )}
    </div>
  );
};