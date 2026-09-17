// components/tasks/TaskForm.tsx
"use client";

import { useState } from "react";

interface TaskFormProps {
  onAddTask: (title: string, priority: "LOW" | "MEDIUM" | "HIGH") => void;
}

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("HIGH");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Judul task tidak boleh kosong");
      return;
    }
    if (title.trim().length < 3) {
      setError("Judul task minimal 3 karakter");
      return;
    }

    onAddTask(title.trim(), priority);
    setTitle("");
    setPriority("MEDIUM");
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm mb-6">
      <h2 className="text-sm font-semibold text-slate-800 mb-3">Tambah Task Baru</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            placeholder="Misal: Siapkan rancangan database..."
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
        </div>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")}
          className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
        >
          Tambah
        </button>
      </div>
    </form>
  );
}