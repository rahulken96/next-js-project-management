// app/error.tsx
"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Kirim telemetry / report error ke Sentry atau Datadog di sini
        console.error("Critical Application Error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
                <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    ✕
                </div>
                <h1 className="text-xl font-bold text-slate-900 mb-1">Terjadi Masalah Sistem</h1>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                    Aplikasi mendeteksi error tak terduga. Kami telah mencatat log kejadian ini untuk diperbaiki tim teknis.
                </p>

                <div className="flex justify-center gap-3">
                    <button
                        onClick={() => window.location.href = "/dashboard"}
                        className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition"
                    >
                        Ke Dashboard
                    </button>
                    <button
                        onClick={() => reset()}
                        className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer"
                    >
                        Muat Ulang
                    </button>
                </div>
            </div>
        </div>
    );
}