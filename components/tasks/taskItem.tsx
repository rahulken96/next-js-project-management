// components/tasks/TaskItem.tsx
import { TaskPriority, TaskStatus } from "@/types/domain";

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  status?: TaskStatus;
  isCompleted?: boolean;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const isCompleted = task.status == "DONE" || Boolean(task.isCompleted);

  const priorityColors: Record<TaskPriority, string> = {
    LOW: "bg-slate-100 text-slate-700 border-slate-300",
    MEDIUM: "bg-amber-100 text-amber-800 border-amber-300",
    HIGH: "bg-rose-100 text-rose-800 border-rose-300",
  };

  return (
    <li className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 transition">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => onToggle(task.id)}
          className="w-4 h-4 text-blue-600 rounded cursor-pointer"
        />
        <span
          className={`text-sm font-medium ${isCompleted ? "line-through text-slate-400" : "text-slate-800"}`}
        >
          {task.title}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`text-xs px-2.5 py-0.5 font-semibold rounded-full border ${priorityColors[task.priority]}`}
        >
          {task.priority}
        </span>
        <button
          onClick={() => onDelete(task.id)}
          className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded hover:bg-rose-50 transition cursor-pointer"
        >
          Hapus
        </button>
      </div>
    </li>
  );
}
