// server/guards/authGuards.ts
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

// Custom Error Classes untuk penanganan rapi
export class UnauthorizedError extends Error {
    constructor(message = "Anda harus login untuk melakukan aksi ini.") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export class ForbiddenError extends Error {
    constructor(message = "Anda tidak memiliki izin untuk mengakses resource ini.") {
        super(message);
        this.name = "ForbiddenError";
    }
}

// 1. Guard: Pastikan user sudah login
export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        throw new UnauthorizedError();
    }
    return user;
}

// 2. Guard: Pastikan user berstatus ADMIN
export async function requireAdmin() {
    const user = await requireAuth();
    if (user.role != UserRole.ADMIN) {
        throw new ForbiddenError("Aksi ini khusus Administrator.");
    }
    return user;
}

// 3. Guard: Pastikan user adalah OWNER dari project
export async function requireProjectOwner(projectId: string) {
    const user = await requireAuth();

    const project = await db.project.findUnique({
        where: { id: projectId },
        select: { ownerId: true },
    });

    if (!project) {
        throw new Error("Project tidak ditemukan.");
    }

    // Admin diberi privilege bypass, selain itu wajib pemilik sah
    if (user.role != UserRole.ADMIN && project.ownerId != user.id) {
        throw new ForbiddenError("Hanya pemilik project yang berhak mengubah atau menghapus project ini.");
    }

    return user;
}

// 4. Guard: Pastikan user adalah OWNER atau MEMBER dari project
export async function requireProjectMember(projectId: string) {
    const user = await requireAuth();

    const project = await db.project.findUnique({
        where: { id: projectId },
        include: {
            members: { where: { userId: user.id } },
        },
    });

    if (!project) {
        throw new Error("Project tidak ditemukan.");
    }

    const isOwner = project.ownerId == user.id;
    const isMember = project.members.length > 0;
    const isAdmin = user.role == UserRole.ADMIN;

    if (!isOwner && !isMember && !isAdmin) {
        throw new ForbiddenError("Anda bukan anggota dari project ini.");
    }

    return user;
}