import React from 'react';
import type { Task } from '../types';
import { useAppDispatch } from '../store';
import { deleteTask, updateTask } from '../store/slices/taskSlice';
import { CheckCircle2, Circle, Clock, Edit3, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const dispatch = useAppDispatch();

  const handleStatusToggle = async () => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    await dispatch(updateTask({ id: task.id, data: { status: newStatus } }));
  };

  const handleDelete = async () => {
    if (window.confirm('Delete Task?')) {
      await dispatch(deleteTask(task.id));
      toast.success('Task deleted successfully!');
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all group">
      <div className="flex items-center gap-4">
        <button
          onClick={handleStatusToggle}
          className="transition-transform active:scale-90"
        >
          {task.status === 'done' ? (
            <CheckCircle2 className="text-green-500" size={26} />
          ) : (
            <Circle className="text-gray-300 hover:text-blue-500" size={26} />
          )}
        </button>

        <div>
          <h3
            className={`font-semibold text-lg ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-800'}`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-500 line-clamp-1">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2">
            {task.deadline && (
              <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-gray-400">
                <Clock size={12} />
                <span>{new Date(task.deadline).toLocaleDateString()}</span>
              </div>
            )}
            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                task.priority === 'high'
                  ? 'bg-red-50 text-red-600'
                  : task.priority === 'medium'
                    ? 'bg-yellow-50 text-yellow-600'
                    : 'bg-green-50 text-green-600'
              }`}
            >
              {task.priority}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Edit3 size={18} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
