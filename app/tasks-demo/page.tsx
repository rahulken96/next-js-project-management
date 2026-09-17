// app/tasks-demo/page.tsx
"use client";

import { useState } from "react";
import { Task, TaskItem } from "@/components/tasks/taskItem";
import { TaskForm } from "@/components/tasks/taskForm";
import { TaskFilter, FilterStatus } from "@/components/tasks/taskFilter";
import Link from "next/link";

const INITIAL_TASKS: Task[] = [
    {
        id: "1",
        title: "Setup Next.js & Tailwind CSS",
        priority: "HIGH",
        isCompleted: true,
    },
    {
        id: "2",
        title: "Pelajari mental model Props & State",
        priority: "MEDIUM",
        isCompleted: false,
    },
    {
        id: "3",
        title: "Implementasi task filter & derived counter",
        priority: "LOW",
        isCompleted: true,
    },
];

export default function TasksDemoPage() {
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    const [filter, setFilter] = useState<FilterStatus>("ALL");
    const [search, setSearch] = useState("");

    console.table(tasks);

    // Handler: Add task (Immutability pattern)
    const handleAddTask = (
        title: string,
        priority: "LOW" | "MEDIUM" | "HIGH",
    ) => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            priority,
            isCompleted: false,
        };
        setTasks((prev) => [newTask, ...prev]);

        /* SALAH: */
        // tasks.unshift(newTask); // <- Mutasi array asli (direct mutation)
        // setTasks(tasks);      // <- Set state dengan array yang sama
    };

    // Handler: Toggle complete status
    const handleToggleTask = (id: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id == id
                    ? { ...task, isCompleted: !task.isCompleted }
                    : task,
            ),
        );
    };

    // Handler: Delete task
    const handleDeleteTask = (id: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    // Derived Values (Dihitung saat render — BUKAN State terpisah!)
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.isCompleted).length;
    const pendingTasks = totalTasks - completedTasks;

    // Filtered list
    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
        if (!matchesSearch) return false;

        if (filter === "ACTIVE") return !task.isCompleted;
        if (filter === "COMPLETED") return task.isCompleted;
        return true;
    });

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <header className="mb-6">
                    <Link href="/">&larr; Home Page</Link>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Task Management Prototype
                    </h1>
                    <p className="text-sm text-slate-600">
                        Latihan Hari 1: Props, State, dan Derived Values
                    </p>
                </header>

                {/* Form Input */}
                <TaskForm onAddTask={handleAddTask} />

                {/* Filter & Search Controls */}
                <TaskFilter
                    currentFilter={filter}
                    onFilterChange={setFilter}
                    searchQuery={search}
                    onSearchChange={setSearch}
                />

                {/* Task List */}
                <ul className="space-y-2.5 mb-6">
                    {filteredTasks.length === 0 ? (
                        <li className="text-center py-8 bg-white border border-dashed border-slate-300 rounded-lg text-slate-500 text-sm">
                            Tidak ada task yang ditemukan.
                        </li>
                    ) : (
                        filteredTasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggle={handleToggleTask}
                                onDelete={handleDeleteTask}
                            />
                        ))
                    )}
                </ul>

                {/* Summary Card (Derived Data Showcase) */}
                <footer className="grid grid-cols-3 gap-3 p-4 bg-white border border-slate-200 rounded-lg text-center shadow-sm">
                    <div>
                        <span className="text-xs text-slate-500 font-medium block">
                            Total Task
                        </span>
                        <span className="text-lg font-bold text-slate-800">
                            {totalTasks}
                        </span>
                    </div>
                    <div>
                        <span className="text-xs text-amber-600 font-medium block">
                            Pending
                        </span>
                        <span className="text-lg font-bold text-amber-600">
                            {pendingTasks}
                        </span>
                    </div>
                    <div>
                        <span className="text-xs text-emerald-600 font-medium block">
                            Selesai
                        </span>
                        <span className="text-lg font-bold text-emerald-600">
                            {completedTasks}
                        </span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
