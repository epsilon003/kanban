import React, { useState, useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanViewProps, KanbanTask } from './KanbanBoard.types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { TaskModal } from './TaskModal';

export const KanbanBoard: React.FC<KanbanViewProps> = ({
  columns,
  tasks,
  onTaskMove,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [modalTask, setModalTask] = useState<KanbanTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createColumnId, setCreateColumnId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const activeTask = useMemo(
    () => (activeId ? tasks[activeId] : null),
    [activeId, tasks]
  );
  
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }
    
    const activeTaskId = active.id as string;
    const activeTask = tasks[activeTaskId];
    
    if (!activeTask) {
      setActiveId(null);
      return;
    }
    
    const overColumnId = over.id as string;
    
    // Find which column the task is coming from
    const fromColumn = columns.find((col) =>
      col.taskIds.includes(activeTaskId)
    );
    
    if (!fromColumn) {
      setActiveId(null);
      return;
    }
    
    // Check if we're dropping on a column or a task
    const overColumn = columns.find((col) => col.id === overColumnId);
    const overTask = tasks[overColumnId];
    
    let targetColumnId: string;
    let targetIndex: number;
    
    if (overColumn) {
      // Dropping on a column
      targetColumnId = overColumn.id;
      targetIndex = overColumn.taskIds.length;
    } else if (overTask) {
      // Dropping on a task
      targetColumnId = overTask.status;
      const targetColumn = columns.find((col) => col.id === targetColumnId);
      targetIndex = targetColumn?.taskIds.indexOf(overTask.id) || 0;
    } else {
      setActiveId(null);
      return;
    }
    
    // Only proceed if we have valid data
    if (fromColumn.id !== targetColumnId || 
        fromColumn.taskIds.indexOf(activeTaskId) !== targetIndex) {
      onTaskMove(activeTaskId, fromColumn.id, targetColumnId, targetIndex);
    }
    
    setActiveId(null);
  };
  
  const handleTaskEdit = (task: KanbanTask) => {
    setModalTask(task);
    setIsModalOpen(true);
  };
  
  const handleTaskCreateClick = (columnId: string) => {
    setCreateColumnId(columnId);
    setModalTask(null);
    setIsModalOpen(true);
  };
  
  const handleModalSave = (task: KanbanTask) => {
    if (modalTask) {
      onTaskUpdate(task.id, task);
    } else if (createColumnId) {
      onTaskCreate(createColumnId, task);
    }
    setIsModalOpen(false);
    setModalTask(null);
    setCreateColumnId(null);
  };
  
  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalTask(null);
    setCreateColumnId(null);
  };
  
  return (
    <div className="h-full w-full" role="application" aria-label="Kanban Board">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 h-full overflow-x-auto p-4">
          {columns.map((column) => {
            const columnTasks = column.taskIds
              .map((taskId) => tasks[taskId])
              .filter(Boolean);
            
            return (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={columnTasks}
                onTaskCreate={handleTaskCreateClick}
                onTaskEdit={handleTaskEdit}
              />
            );
          })}
        </div>
        
        <DragOverlay>
          {activeTask ? (
            <div className="rotate-3">
              <KanbanCard
                task={activeTask}
                onEdit={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      
      <TaskModal
        task={modalTask}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        onDelete={onTaskDelete}
        columns={columns}
      />
    </div>
  );
};