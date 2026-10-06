// app/actions/taskActions.ts
"use server";

import { revalidatePath } from "next/cache";
import { createTask, toggleTaskStatus, deleteTask } from "@/server/services/taskService";
import { TaskPriority } from "@prisma/client";
import { ApiResult } from "@/types/api";

export async function createTaskAction(
  projectId: string,
  formData: FormData
): Promise<ApiResult<{ id: string }>> {
  const title = formData.get("title") as string;
  const priority = (formData.get("priority") as TaskPriority) || TaskPriority.MEDIUM;
  const assignedToId = (formData.get("assignedToId") as string) || null;

  if (!title || title.trim().length < 3) {
    return { success: false, error: "Judul task minimal 3 karakter." };
  }

  try {
    const task = await createTask(projectId, title.trim(), priority, assignedToId);
    revalidatePath(`/projects/${projectId}`);
    return { success: true, data: { id: task.id }, message: "Task berhasil ditambahkan." };
  } catch (error) {
    return { success: false, error: "Gagal membuat task di database." };
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