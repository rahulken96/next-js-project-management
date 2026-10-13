// app/actions/taskActions.ts
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { toggleTaskStatus, deleteTask } from "@/server/services/taskService";
import { requireProjectMember, ForbiddenError, UnauthorizedError } from "@/server/guards/authGuards";
import { createTaskSchema } from "@/lib/validations/taskSchema";
import { TaskPriority, TaskStatus } from "@prisma/client";
import { ApiResult } from "@/types/api";

export async function createTaskAction(
  projectId: string,
  rawData: unknown,
): Promise<ApiResult<{ id: string }>> {
  // 1. Dukung baik input FormData maupun plain object (dari React Hook Form)
  const rawInput =
    rawData instanceof FormData
      ? Object.fromEntries(rawData.entries())
      : rawData;

  // 2. Validasi defensif di server menggunakan Zod
  const parseResult = createTaskSchema.safeParse(rawInput);

  if (!parseResult.success) {
    // Ekstrak pesan error per-field menjadi format rapi
    const fieldErrors = parseResult.error.flatten().fieldErrors;
    return {
      success: false,
      error: "Input tidak valid. Periksa kembali form Anda.",
      fieldErrors,
    };
  }

  const { title, description, priority, dueDate, assignedToId } = parseResult.data;

  try {
    const task = await db.task.create({
      data: {
        projectId,
        title,
        description: description || null,
        priority: priority as TaskPriority,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: TaskStatus.TODO,
        assignedToId: assignedToId || null,
      },
    });

    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
      data: { id: task.id },
      message: "Task berhasil dibuat!",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan internal server saat menyimpan data.",
    };
  }
}

export async function toggleTaskAction(
  taskId: string,
  projectId: string
): Promise<ApiResult<void>> {
  try {
    await toggleTaskStatus(taskId);
    revalidatePath(`/projects/${projectId}`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Gagal memperbarui status task." };
  }
}

export async function deleteTaskAction(
  taskId: string,
  projectId: string
): Promise<ApiResult<void>> {
  try {
    await deleteTask(taskId);
    revalidatePath(`/projects/${projectId}`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Gagal menghapus task." };
  }
}

export async function deleteSecureTaskAction(
  taskId: string,
  projectId: string
): Promise<ApiResult<void>> {
  try {
    // Pastikan pemanggil adalah member atau owner dari project ini
    await requireProjectMember(projectId);

    await db.task.delete({
      where: { id: taskId },
    });

    revalidatePath(`/projects/${projectId}`);
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Gagal menghapus task." };
  }
}