// components/tasks/TaskForm.tsx
"use client";

import { useState, useRef, useEffect } from "react";

interface TaskFormProps {
  onAddTask: (title: string, priority: "LOW" | "MEDIUM" | "HIGH") => void;
}

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [error, setError] = useState("");

  // Menggunakan useRef untuk mengakses elemen DOM input tanpa memicu re-render
  const inputRef = useRef<HTMLInputElement>(null);

  // Autofocus saat komponen pertama kali mount
  useEffect(() => { inputRef.current?.focus() }, []);

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

    // Kembalikan fokus kursor ke input secara otomatis
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm mb-6">
      <h2 className="text-sm font-semibold text-slate-800 mb-3">Tambah Task Baru</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            placeholder="Ketik task baru dan tekan Enter..."
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
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition cursor-pointer"
        >
          Tambah
        </button>
      </div>
    </form>
  );
}