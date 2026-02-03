import { useState, useEffect, useCallback } from 'react';
import { 
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { KanbanColumn, KanbanTask } from '@/components/KanbanBoard/KanbanBoard.types';

export const useFirestore = (userId: string | null) => {
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [tasks, setTasks] = useState<Record<string, KanbanTask>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize default board structure for new users
  const initializeBoard = useCallback(async (uid: string) => {
    const defaultColumns: KanbanColumn[] = [
      { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: [], maxTasks: 10 },
      { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: [], maxTasks: 5 },
      { id: 'review', title: 'Review', color: '#f59e0b', taskIds: [], maxTasks: 3 },
      { id: 'done', title: 'Done', color: '#10b981', taskIds: [] },
    ];

    try {
      // Save columns to Firestore
      for (const column of defaultColumns) {
        await setDoc(doc(db, `users/${uid}/columns`, column.id), {
          ...column,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error('Error initializing board:', err);
      throw err;
    }
  }, []);

  // Load user's board data
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Real-time listener for columns
    const columnsRef = collection(db, `users/${userId}/columns`);
    const unsubscribeColumns = onSnapshot(
      columnsRef,
      async (snapshot) => {
        if (snapshot.empty) {
          // New user - initialize board
          await initializeBoard(userId);
          return;
        }

        const loadedColumns: KanbanColumn[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          loadedColumns.push({
            id: doc.id,
            title: data.title,
            color: data.color,
            taskIds: data.taskIds || [],
            maxTasks: data.maxTasks,
          });
        });
        setColumns(loadedColumns);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    // Real-time listener for tasks
    const tasksRef = collection(db, `users/${userId}/tasks`);
    const unsubscribeTasks = onSnapshot(
      tasksRef,
      (snapshot) => {
        const loadedTasks: Record<string, KanbanTask> = {};
        snapshot.forEach((doc) => {
          const data = doc.data();
          loadedTasks[doc.id] = {
            id: doc.id,
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority,
            assignee: data.assignee,
            tags: data.tags || [],
            createdAt: data.createdAt?.toDate() || new Date(),
            dueDate: data.dueDate?.toDate(),
          };
        });
        setTasks(loadedTasks);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup subscriptions
    return () => {
      unsubscribeColumns();
      unsubscribeTasks();
    };
  }, [userId, initializeBoard]);

  // Save task to Firestore
  const saveTask = useCallback(async (task: KanbanTask) => {
    if (!userId) return;

    try {
      await setDoc(doc(db, `users/${userId}/tasks`, task.id), {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee,
        tags: task.tags,
        createdAt: task.createdAt,
        dueDate: task.dueDate,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error saving task:', err);
      throw err;
    }
  }, [userId]);

  // Delete task from Firestore
  const deleteTask = useCallback(async (taskId: string) => {
    if (!userId) return;

    try {
      await deleteDoc(doc(db, `users/${userId}/tasks`, taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
  }, [userId]);

  // Update column in Firestore
  const updateColumn = useCallback(async (column: KanbanColumn) => {
    if (!userId) return;

    try {
      await setDoc(doc(db, `users/${userId}/columns`, column.id), {
        title: column.title,
        color: column.color,
        taskIds: column.taskIds,
        maxTasks: column.maxTasks,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.error('Error updating column:', err);
      throw err;
    }
  }, [userId]);

  return {
    columns,
    tasks,
    loading,
    error,
    saveTask,
    deleteTask,
    updateColumn,
  };
};