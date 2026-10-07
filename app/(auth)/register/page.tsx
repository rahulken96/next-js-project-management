// app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { registerAction } from "@/app/actions/authActions";

export default function RegisterPage() {
    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const res = await registerAction(formData);

        if (res && !res.success) {
            setError(res.error);
            setIsPending(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Daftar ke ProjectHQ</h1>
                    <p className="text-xs text-slate-500 mt-1">Buat akun Anda untuk mengelola workspace</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Misal: John Doe"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="nama@email.com"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            minLength={6}
                            placeholder="Minimal 6 karakter"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-lg hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer shadow-sm mt-2"
                    >
                        {isPending ? "Mendaftarkan..." : "Daftar Akun"}
                    </button>
                </form>

                <p className="text-center text-xs text-slate-500 mt-6">
                    Sudah punya akun?{" "}
                    <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                        Masuk
                    </Link>
                </p>
            </div>
        </div>
    );
}