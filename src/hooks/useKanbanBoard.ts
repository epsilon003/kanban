import { useState, useCallback } from 'react';
import { KanbanColumn, KanbanTask } from '@/components/KanbanBoard/KanbanBoard.types';
import { reorderTasks, moveTaskBetweenColumns } from '@/utils/column.utils';

export const useKanbanBoard = (
  initialColumns: KanbanColumn[],
  initialTasks: Record<string, KanbanTask>
) => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [tasks, setTasks] = useState<Record<string, KanbanTask>>(initialTasks);
  
  const handleTaskMove = useCallback(
    (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => {
      setColumns((prevColumns) => {
        const sourceColumn = prevColumns.find((col) => col.id === fromColumn);
        const destColumn = prevColumns.find((col) => col.id === toColumn);
        
        if (!sourceColumn || !destColumn) return prevColumns;
        
        const sourceIndex = sourceColumn.taskIds.indexOf(taskId);
        
        if (sourceColumn.id === destColumn.id) {
          // Reorder within same column
          const newTaskIds = reorderTasks(sourceColumn.taskIds, sourceIndex, newIndex);
          
          return prevColumns.map((col) =>
            col.id === sourceColumn.id ? { ...col, taskIds: newTaskIds } : col
          );
        } else {
          // Move between columns
          const { source, destination } = moveTaskBetweenColumns(
            sourceColumn.taskIds,
            destColumn.taskIds,
            sourceIndex,
            newIndex
          );
          
          return prevColumns.map((col) => {
            if (col.id === sourceColumn.id) return { ...col, taskIds: source };
            if (col.id === destColumn.id) return { ...col, taskIds: destination };
            return col;
          });
        }
      });
      
      // Update task status
      setTasks((prevTasks) => ({
        ...prevTasks,
        [taskId]: { ...prevTasks[taskId], status: toColumn },
      }));
    },
    []
  );
  
  const handleTaskCreate = useCallback((columnId: string, task: KanbanTask) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [task.id]: task,
    }));
    
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId
          ? { ...col, taskIds: [...col.taskIds, task.id] }
          : col
      )
    );
  }, []);
  
  const handleTaskUpdate = useCallback((taskId: string, updates: Partial<KanbanTask>) => {
    setTasks((prevTasks) => {
      const currentTask = prevTasks[taskId];
      if (!currentTask) return prevTasks;
      
      const updatedTask = { ...currentTask, ...updates };
      
      // If status changed, move task to new column
      if (updates.status && updates.status !== currentTask.status) {
        setColumns((prevColumns) => {
          const oldColumn = prevColumns.find((col) => col.id === currentTask.status);
          const newColumn = prevColumns.find((col) => col.id === updates.status);
          
          if (!oldColumn || !newColumn) return prevColumns;
          
          return prevColumns.map((col) => {
            if (col.id === oldColumn.id) {
              return { ...col, taskIds: col.taskIds.filter((id) => id !== taskId) };
            }
            if (col.id === newColumn.id) {
              return { ...col, taskIds: [...col.taskIds, taskId] };
            }
            return col;
          });
        });
      }
      
      return {
        ...prevTasks,
        [taskId]: updatedTask,
      };
    });
  }, []);
  
  const handleTaskDelete = useCallback((taskId: string) => {
    setTasks((prevTasks) => {
      const { [taskId]: deleted, ...rest } = prevTasks;
      return rest;
    });
    
    setColumns((prevColumns) =>
      prevColumns.map((col) => ({
        ...col,
        taskIds: col.taskIds.filter((id) => id !== taskId),
      }))
    );
  }, []);
  
  return {
    columns,
    tasks,
    handleTaskMove,
    handleTaskCreate,
    handleTaskUpdate,
    handleTaskDelete,
  };
};