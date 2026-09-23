// app/(dashboard)/projects/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { getProjectsAction } from "@/app/actions/projectActions";
import { CreateProjectModal } from "@/components/projects/createModalProject";

export const metadata: Metadata = {
    title: "Projects | ProjectHQ",
    description: "Daftar seluruh project aktif dalam workspace",
};

export default async function ProjectsPage() {
    // Fetch data langsung di Server Component (tanpa fetch HTTP overhead)
    const projects = await getProjectsAction();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Daftar Project</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Kelola seluruh inisiatif dan progress tim</p>
                </div>
                {/* Client Component Button & Modal */}
                <CreateProjectModal />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white border border-dashed border-slate-300 rounded-xl">
                        <p className="text-sm text-slate-500 font-medium">Belum ada project yang dibuat.</p>
                        <p className="text-xs text-slate-400 mt-1">Klik tombol di atas untuk membuat project pertamamu.</p>
                    </div>
                ) : (
                    projects.map((proj) => (
                        <Link
                            key={proj.id}
                            href={`/projects/${proj.id}`}
                            className="block p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition group"
                        >
                            <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition text-base">
                                {proj.name}
                            </h3>
                            <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                                {proj.description || "Tidak ada deskripsi."}
                            </p>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                                <span className="font-mono">{proj.id}</span>
                                <span>Owner: {proj.ownerId}</span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}