// app/(dashboard)/projects/[id]/page.tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

interface PageProps {
    params: Promise<{ id: string }>;
}

// Simulasi database lookup
async function getProject(id: string) {
    // Simulasi latency jaringan
    await new Promise((resolve) => setTimeout(resolve, 800));

    const projects: Record<string, { name: string; description: string; tasks: string[] }> = {
        "prj-alpha": {
            name: "Core API Redesign",
            description: "Migrasi endpoint ke Node.js & Prisma ORM",
            tasks: ["Rancang skema relasional Prisma", "Setup connection pool PostgreSQL", "Bikin auth middleware"],
        },
        "prj-beta": {
            name: "Mobile App Onboarding",
            description: "Re-vamp authentication flow untuk klien mobile",
            tasks: ["Desain UI login biometric", "Integrasi OAuth refresh token"],
        },
    };

    return projects[id] || null;
}

// Dynamic SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const project = await getProject(id);

    if (!project) {
        return { title: "Project Tidak Ditemukan | ProjectHQ" };
    }

    return {
        title: `${project.name} | ProjectHQ`,
        description: project.description,
    };
}

export default async function ProjectDetailPage({ params }: PageProps) {
    const { id } = await params;
    const project = await getProject(id);

    // Jika ID tidak cocok, lempar ke not-found.tsx
    if (!project) {
        notFound();
    }

    return (
        <div>
            <div className="mb-6">
                <Link href="/projects" className="text-xs text-blue-600 hover:underline font-medium">
                    &larr; Kembali ke Daftar Project
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 mt-2">{project.name}</h1>
                <p className="text-sm text-slate-600 mt-1">{project.description}</p>
                <span className="inline-block mt-2 text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                    ID: {id}
                </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Tasks Terkait</h3>
                <ul className="space-y-2">
                    {project.tasks.map((task, idx) => (
                        <li key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-700 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                            {task}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}