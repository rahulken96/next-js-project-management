// app/(dashboard)/projects/[id]/page.tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getProjectById } from "@/server/services/projectService";
import { TaskRow } from "@/components/tasks/taksRow";
import { ValidatedTaskForm } from "@/components/tasks/validatedForm";
import { DeleteProjectButton } from "@/components/projects/deleteProjectButton";
import { getCurrentUser } from "@/lib/auth";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) return { title: "Project Tidak Ditemukan | ProjectHQ" };

  return {
    title: `${project.name} | ProjectHQ`,
    description: project.description || undefined,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectById(id);
  const currentUser = await getCurrentUser();

  const isOwner = currentUser?.id == project?.ownerId || currentUser?.role == "ADMIN";

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link href="/projects" className="text-xs text-blue-600 hover:underline font-medium">
            &larr; Kembali ke Daftar Project
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
          <p className="text-sm text-slate-500">{project.description}</p>
          <div className="flex gap-4 mt-3 text-xs text-slate-500">
            <span>Owner: <strong>{project.owner.name}</strong></span>
            <span>Member: <strong>{project.members.length} orang</strong></span>
            <span>Total Task: <strong>{project.tasks.length}</strong></span>
          </div>
        </div>

        {/* Tombol Hapus HANYA muncul jika user terbukti Owner di Server Component */}
        {isOwner && (
          <DeleteProjectButton projectId={project.id} projectName={project.name} />
        )}
      </div>

      {/* Form Validated (Zod + React Hook Form) */}
      <ValidatedTaskForm projectId={project.id} members={project.members} />

      {/* List Task Live dari PostgreSQL */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Daftar Task ({project.tasks.length})</h3>
        {project.tasks.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">Belum ada task pada project ini.</p>
        ) : (
          <ul className="space-y-2.5">
            {project.tasks.map((task) => (
              <TaskRow
                key={task.id}
                id={task.id}
                projectId={project.id}
                title={task.title}
                status={task.status}
                priority={task.priority}
                assigneeName={task.assignedTo?.name}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}