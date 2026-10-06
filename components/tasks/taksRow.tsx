// components/tasks/taksRow.tsx
"use client";

import { useTransition } from "react";
import { toggleTaskAction, deleteTaskAction } from "@/app/actions/taskActions";
import { TaskPriority, TaskStatus } from "@prisma/client";

interface TaskRowProps {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeName?: string | null;
}

export function TaskRow({ id, projectId, title, status, priority, assigneeName }: TaskRowProps) {
  const [isPending, startTransition] = useTransition();
  const isDone = status === TaskStatus.DONE;

  const priorityColors = {
    LOW: "bg-slate-100 text-slate-600 border-slate-200",
    MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
    HIGH: "bg-rose-100 text-rose-700 border-rose-200",
  };

  const handleToggle = () => {
    startTransition(async () => {
      await toggleTaskAction(id, projectId);
    });
  };

  const handleDelete = () => {
    if (!confirm("Hapus task ini?")) return;
    startTransition(async () => {
      await deleteTaskAction(id, projectId);
    });
  };

  return (
    <li
      className={`flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-lg shadow-sm transition ${
        isPending ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isDone}
          disabled={isPending}
          onChange={handleToggle}
          className="w-4 h-4 text-blue-600 rounded cursor-pointer"
        />
        <div>
          <span className={`text-sm font-medium ${isDone ? "line-through text-slate-400" : "text-slate-800"}`}>
            {title}
          </span>
          {assigneeName && (
            <span className="block text-xs text-slate-400 mt-0.5">Assigned: {assigneeName}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className={`text-xs px-2.5 py-0.5 font-semibold rounded-full border ${priorityColors[priority]}`}>
          {priority}
        </span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded hover:bg-rose-50 transition cursor-pointer"
        >
          Hapus
        </button>
      </div>
    </li>
  );
}