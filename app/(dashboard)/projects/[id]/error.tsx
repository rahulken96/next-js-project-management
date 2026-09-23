// app/(dashboard)/projects/[id]/error.tsx
"use client";

import { useEffect } from "react";

export default function ProjectError({ error, reset }: { error: Error & { digest?: string }; reset: () => void; }) {
    useEffect(() => {
        console.error("Project Detail Error:", error);
    }, [error]);

    return (
        <div className="p-8 bg-rose-50 border border-rose-200 rounded-xl text-center max-w-lg mx-auto mt-10">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                !
            </div>
            <h2 className="text-lg font-bold text-rose-900">Gagal Memuat Detail Project</h2>
            <p className="text-xs text-rose-700 mt-1 mb-5">
                {error.message || "Terjadi kesalahan internal server saat mengambil data project."}
            </p>
            <button
                onClick={() => reset()}
                className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 transition"
            >
                Coba Muat Ulang &rarr;
            </button>
        </div>
    );
}