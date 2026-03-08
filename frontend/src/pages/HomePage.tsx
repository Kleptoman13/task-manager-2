import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchTasks } from '../store/slices/taskSlice';
import { Plus, LayoutList, Loader2, Search, Filter } from 'lucide-react';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import type { Task } from '../types';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { tasks, isLoading } = useAppSelector((state) => state.tasks);
  const { authUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleOpenCreate = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <LayoutList size={20} />
              </div>
              <span className="font-bold uppercase tracking-widest text-[10px]">
                Workspaces
              </span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Welcome, {authUser?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-500 mt-1">
              You have {tasks.filter((t) => t.status !== 'done').length} active
              tasks.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="group relative flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 font-bold"
          >
            <Plus
              size={20}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
            <span>New task</span>
          </button>
        </header>

        {/* SEARCH & FILTERS BAR */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="relative flex-1 min-w-[280px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Поиск задач..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl text-gray-600 font-medium hover:bg-gray-50 transition-colors">
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>

        {/* TASKS LIST SECTION */}
        <div className="space-y-4">
          {isLoading && tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
              <p className="text-gray-500 font-medium">Synchronization</p>
            </div>
          ) : tasks.length > 0 ? (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <TaskItem key={task.id} task={task} onEdit={handleOpenEdit} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-gray-100 shadow-sm">
              <div className="bg-gray-50 size-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="text-gray-300" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Список пуст</h3>
              <p className="text-gray-400 max-w-[240px] mx-auto mt-2">
                It's time to plan something big!
              </p>
              <button
                onClick={handleOpenCreate}
                className="mt-6 text-blue-600 font-bold hover:underline"
              >
                Create first task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL COMPONENT */}
      <TaskModal
        key={isModalOpen ? selectedTask?.id || 'new' : 'closed'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskToEdit={selectedTask}
      />
    </div>
  );
};

export default HomePage;
