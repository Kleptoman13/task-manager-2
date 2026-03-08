const TaskSkeleton = () => {
  return (
    <div className="animate-pulse bg-white p-4 rounded-2xl border border-gray-100 shadow-sm h-[88px] flex items-center gap-4">
      <div className="size-10 bg-gray-200 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-100 rounded w-1/4" />
      </div>
    </div>
  );
};

export default TaskSkeleton;
