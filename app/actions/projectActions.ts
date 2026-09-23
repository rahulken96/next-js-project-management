// app/actions/projectActions.ts
"use server";

import { revalidatePath } from "next/cache";
import { ApiResult } from "@/types/api";
import { Project } from "@/types/domain";

// Simulasi database storage in-memory
const globalProjects: Project[] = [
    {
        id: "prj-alpha",
        name: "Core API Redesign",
        description: "Migrasi endpoint ke Node.js & Prisma ORM",
        ownerId: "usr-admin",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "prj-beta",
        name: "Mobile App Onboarding",
        description: "Re-vamp authentication flow untuk klien mobile",
        ownerId: "usr-admin",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

export async function createProjectAction(formData: FormData): Promise<ApiResult<Project>> {
    // Simulasi latency jaringan
    await new Promise((resolve) => setTimeout(resolve, 500));

    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || null;

    // Server-side guard validation
    if (!name || name.trim().length < 3) {
        return {
            success: false,
            error: "Nama project wajib diisi minimal 3 karakter.",
        };
    }

    const newProject: Project = {
        id: `prj-${crypto.randomUUID().slice(0, 8)}`,
        name: name.trim(),
        description: description ? description.trim() : null,
        ownerId: "usr-admin",
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    globalProjects.unshift(newProject);

    // Revalidasi cache rute agar UI Server Component otomatis update
    revalidatePath("/projects");

    return {
        success: true,
        data: newProject,
        message: "Project baru berhasil dibuat!",
    };
}

export async function getProjectsAction(): Promise<Project[]> {
    return globalProjects;
}
