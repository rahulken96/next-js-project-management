// app/actions/projectActions.ts
"use server";

import { revalidatePath } from "next/cache";
import { ApiResult } from "@/types/api";
import { createProject, getAllProjects } from "@/server/services/projectService";
import { db } from "@/lib/db";

export async function createProjectAction(formData: FormData): Promise<ApiResult<{ id: string }>> {
    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || null;

    // Server-side guard validation
    if (!name || name.trim().length < 3) {
        return {
            success: false,
            error: "Nama project wajib diisi minimal 3 karakter.",
        };
    }

    try {
        // Ambil user pertama (Admin) sebagai default owner jika belum ada auth session
        const defaultOwner = await db.user.findFirst();
        if (!defaultOwner) {
            return {
                success: false,
                error: "Database belum memiliki User. Silakan jalankan `npx prisma db seed` terlebih dahulu.",
            };
        }

        const newProject = await createProject(name.trim(), description ? description.trim() : null, defaultOwner.id);

        // Revalidasi cache rute agar UI Server Component otomatis update
        revalidatePath("/projects");

        return {
            success: true,
            data: { id: newProject.id },
            message: "Project baru berhasil dibuat!",
        };
    } catch {
        return {
            success: false,
            error: "Gagal menyimpan project ke database.",
        };
    }
}

export async function getProjectsAction() {
    return await getAllProjects();
}

