import React, { useState, useEffect } from 'react';
import { KanbanTask, KanbanColumn } from './KanbanBoard.types';
import { Modal } from '@/components/primitives/Modal';
import { Button } from '@/components/primitives/Button';

interface TaskModalProps {
  task: KanbanTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: KanbanTask) => void;
  onDelete: (taskId: string) => void;
  columns: KanbanColumn[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete,
  columns,
}) => {
  const [formData, setFormData] = useState<Partial<KanbanTask>>({
    title: '',
    description: '',
    status: '',
    priority: undefined,
    assignee: '',
    tags: [],
    dueDate: undefined,
  });
  
  const [tagInput, setTagInput] = useState('');
  
  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({
        title: '',
        description: '',
        status: columns[0]?.id || '',
        priority: undefined,
        assignee: '',
        tags: [],
        dueDate: undefined,
      });
    }
  }, [task, columns]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.status) return;
    
    const taskData: KanbanTask = {
      id: task?.id || `task-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      assignee: formData.assignee,
      tags: formData.tags || [],
      createdAt: task?.createdAt || new Date(),
      dueDate: formData.dueDate,
    };
    
    onSave(taskData);
    onClose();
  };
  
  const handleDelete = () => {
    if (task && window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
      onClose();
    }
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag),
    });
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create Task'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
            autoFocus
          />
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]"
            rows={4}
          />
        </div>
        
        {/* Status and Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Status *
            </label>
            <select
              id="status"
              value={formData.status || ''}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              {columns.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.title}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={formData.priority || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                priority: e.target.value as KanbanTask['priority'] || undefined 
              })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">None</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
        
        {/* Assignee and Due Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="assignee" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Assignee
            </label>
            <input
              type="text"
              id="assignee"
              value={formData.assignee || ''}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter name"
            />
          </div>
          
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                dueDate: e.target.value ? new Date(e.target.value) : undefined 
              })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        
        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Add a tag"
            />
            <Button type="button" onClick={handleAddTag} variant="secondary">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-sm bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-2 py-1 rounded"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-error-600"
                  aria-label={`Remove tag ${tag}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-between pt-4">
          <div>
            {task && (
              <Button type="button" variant="danger" onClick={handleDelete}>
                Delete Task
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {task ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};