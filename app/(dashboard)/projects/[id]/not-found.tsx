// app/(dashboard)/projects/[id]/not-found.tsx
import Link from "next/link";

export default function ProjectNotFound() {
    return (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-xl">
            <h2 className="text-4xl font-extrabold text-slate-800 mb-2">404</h2>
            <h3 className="text-base font-semibold text-slate-700 mb-1">Project Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto">
                ID project yang kamu tuju tidak ada dalam database atau telah dihapus oleh pemiliknya.
            </p>
            <Link
                href="/projects"
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
            >
                Kembali ke Daftar Project
            </Link>
        </div>
    );
}