// components/projects/createModalProject.tsx
"use client";

import { useState } from "react";
import { createProjectAction } from "@/app/actions/projectActions";

export function CreateProjectModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);
        setErrorMessage("");

        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const res = await createProjectAction(formData);

            if (!res.success) {
                setErrorMessage(res.error);
                return;
            }

            // Berhasil: tutup modal dan reset form
            setIsOpen(false);
            form.reset();
        } catch {
            setErrorMessage("Terjadi kesalahan jaringan.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm cursor-pointer"
            >
                + Buat Project Baru
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in duration-150">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-900">Project Baru</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                disabled={isPending}
                                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
                            >
                                ✕
                            </button>
                        </div>

                        {errorMessage && (
                            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                                {errorMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Nama Project <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Misal: Redesign Landing Page"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Deskripsi
                                </label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    placeholder="Penjelasan ringkas target dan deliverables project..."
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    disabled={isPending}
                                    className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                                >
                                    {isPending ? "Menyimpan..." : "Simpan Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}