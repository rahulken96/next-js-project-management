// components/tasks/validatedForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema, CreateTaskInput } from "@/lib/validations/taskSchema";
import { createTaskAction } from "@/app/actions/taskActions";

interface ValidatedTaskFormProps {
    projectId: string;
}

export function ValidatedTaskForm({ projectId }: ValidatedTaskFormProps) {
    const [serverError, setServerError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<CreateTaskInput>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            title: "",
            description: "",
            priority: "MEDIUM",
            dueDate: "",
        },
    });

    const onSubmit = async (data: CreateTaskInput) => {
        setServerError("");
        setIsSuccess(false);

        const res = await createTaskAction(projectId, data);

        if (!res.success) {
            if (res.fieldErrors) {
                // Petakan error server ke field React Hook Form secara presisi
                Object.entries(res.fieldErrors).forEach(([field, messages]) => {
                    if (messages && messages[0]) {
                        setError(field as keyof CreateTaskInput, { message: messages[0] });
                    }
                });
            }
            setServerError(res.error);
            return;
        }

        setIsSuccess(true);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-6">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Tambah Task Baru (Validated)</h3>

            {serverError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
                    {serverError}
                </div>
            )}

            {isSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg font-medium">
                    ✓ Task baru berhasil ditambahkan!
                </div>
            )}

            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Judul Task <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        {...register("title")}
                        placeholder="Misal: Buat dokumentasi REST API"
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.title ? "border-rose-400 focus:ring-rose-200" : "border-slate-300 focus:ring-blue-500"
                            }`}
                    />
                    {errors.title && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Tambahan</label>
                    <textarea
                        {...register("description")}
                        rows={2}
                        placeholder="Rincian task (opsional)..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                    {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Prioritas</label>
                        <select
                            {...register("priority")}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                        {errors.priority && <p className="text-xs text-rose-600 mt-1">{errors.priority.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Tenggat Waktu (Due Date)</label>
                        <input
                            type="date"
                            {...register("dueDate")}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.dueDate && <p className="text-xs text-rose-600 mt-1">{errors.dueDate.message}</p>}
                    </div>
                </div>

                <div className="pt-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer shadow-sm"
                    >
                        {isSubmitting ? "Memvalidasi..." : "Simpan Task"}
                    </button>
                </div>
            </div>
        </form>
    );
}