// app/(dashboard)/dashboard/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logoutAction } from "@/app/actions/authActions";

export const metadata: Metadata = {
    title: "Dashboard Overview | ProjectHQ",
    description: "Ringkasan metrik dan aktivitas workspace",
};

export default async function DashboardPage() {
    const user = await getCurrentUser();

    // Query metrik riil dari PostgreSQL
    const [totalProjects, totalTasks, completedTasks, recentProjects] = await Promise.all([
        db.project.count(),
        db.task.count(),
        db.task.count({ where: { status: "DONE" } }),
        db.project.findMany({
            take: 4,
            orderBy: { createdAt: "desc" },
            include: {
                _count: { select: { tasks: true, members: true } },
                owner: { select: { name: true } },
            },
        }),
    ]);

    const pendingTasks = totalTasks - completedTasks;

    return (
        <div className="space-y-6 max-w-6xl">
            {/* Header Selamat Datang */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Selamat Datang, {user?.name || "Pengguna"}! 👋
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Berikut adalah ringkasan status workspace dan proyek aktif Anda saat ini.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/projects"
                        className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                        Buka Semua Projects &rarr;
                    </Link>
                    <form action={logoutAction}>
                        <button
                            type="submit"
                            className="px-3 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition cursor-pointer"
                        >
                            Keluar
                        </button>
                    </form>
                </div>
            </div>

            {/* Statistik Kartu Metrik */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Project</p>
                    <p className="text-3xl font-extrabold text-slate-900 mt-2">{totalProjects}</p>
                    <span className="text-[11px] text-blue-600 font-medium mt-1 inline-block">Aktif dalam database</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tasks</p>
                    <p className="text-3xl font-extrabold text-slate-900 mt-2">{totalTasks}</p>
                    <span className="text-[11px] text-slate-500 font-medium mt-1 inline-block">Di seluruh project</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Task Selesai</p>
                    <p className="text-3xl font-extrabold text-emerald-600 mt-2">{completedTasks}</p>
                    <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">
                        {totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}% terselesaikan` : "Belum ada task"}
                    </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Task Pending</p>
                    <p className="text-3xl font-extrabold text-amber-600 mt-2">{pendingTasks}</p>
                    <span className="text-[11px] text-amber-600 font-medium mt-1 inline-block">Perlu ditindaklanjuti</span>
                </div>
            </div>

            {/* Proyek Terbaru */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Project Terkini</h2>
                        <p className="text-xs text-slate-500">Inisiatif terbaru yang baru ditambahkan ke workspace</p>
                    </div>
                    <Link href="/projects" className="text-xs text-blue-600 font-medium hover:underline">
                        Lihat Selengkapnya &rarr;
                    </Link>
                </div>

                {recentProjects.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-slate-200 rounded-lg">
                        <p className="text-xs text-slate-400">Belum ada project yang dibuat.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {recentProjects.map((p) => (
                            <Link
                                key={p.id}
                                href={`/projects/${p.id}`}
                                className="p-4 border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition group"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition">
                                        {p.name}
                                    </h3>
                                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                        {p._count.tasks} Tasks
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                                    {p.description || "Tidak ada deskripsi"}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                                    Owner: {p.owner.name}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
