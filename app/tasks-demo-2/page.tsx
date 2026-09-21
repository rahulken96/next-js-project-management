// app/tasks-demo/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Task } from "@/components/tasks/taskItem";
import { TaskForm } from "@/components/tasks/taskForm";
import { TaskFilter, FilterStatus } from "@/components/tasks/taskFilter";
import { TaskList } from "@/components/tasks/taskList";
import { TaskSummary } from "@/components/tasks/taskSummary";
import Link from "next/link";

const STORAGE_KEY = "strg_key_next_1";

const INITIAL_TASKS: Task[] = [
    {
        id: "1",
        title: "Setup Next.js & Tailwind CSS",
        priority: "HIGH",
        isCompleted: true,
    },
    {
        id: "2",
        title: "Pisahkan komponen modular & hooks",
        priority: "MEDIUM",
        isCompleted: false,
    },
    {
        id: "3",
        title: "Sinkronisasi task ke localStorage",
        priority: "LOW",
        isCompleted: false,
    },
];

export default function TasksDemoPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<FilterStatus>("ALL");
    const [search, setSearch] = useState("");
    const [isHydrated, setIsHydrated] = useState(false);

    console.table(tasks);

    // 1. Baca data dari localStorage HANYA setelah mount di browser (Cegah SSR Hydration Mismatch)
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setTasks(Array.isArray(parsed) ? parsed : INITIAL_TASKS);
            } else {
                setTasks(INITIAL_TASKS);
            }
        } catch {
            setTasks(INITIAL_TASKS);
        } finally {
            setIsHydrated(true);
        }
    }, []);

    // 2. Simpan setiap perubahan tasks ke localStorage
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        }
    }, [tasks, isHydrated]);

    // Handlers
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
    };

    const handleToggleTask = (id: string) => {
        setTasks((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, isCompleted: !t.isCompleted } : t,
            ),
        );
    };

    const handleDeleteTask = (id: string) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    // 3. useMemo: Komputasi pencarian & filter hanya berjalan saat tasks, filter, atau search berubah
    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const matchSearch = task.title
                .toLowerCase()
                .includes(search.toLowerCase());
            if (!matchSearch) return false;

            if (filter === "ACTIVE") return !task.isCompleted;
            if (filter === "COMPLETED") return task.isCompleted;
            return true;
        });
    }, [tasks, filter, search]);

    // Derived Values
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.isCompleted).length;
    const pendingTasks = totalTasks - completedTasks;

    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-sm text-slate-500 animate-pulse">
                    Memuat data task...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <Link href="/">&larr; Home Page</Link>
                <header className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Task Management Modular
                    </h1>
                    <p className="text-sm text-slate-600">
                        Latihan Hari 2: Component Architecture, useRef &
                        LocalStorage
                    </p>
                </header>

                {/* Presentational Components dikoordinasikan oleh page container */}
                <TaskForm onAddTask={handleAddTask} />

                <TaskFilter
                    currentFilter={filter}
                    onFilterChange={setFilter}
                    searchQuery={search}
                    onSearchChange={setSearch}
                />

                <TaskList
                    tasks={filteredTasks}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                />

                <TaskSummary
                    total={totalTasks}
                    pending={pendingTasks}
                    completed={completedTasks}
                />
            </div>
        </div>
    );
}
