// server/services/taskService.ts
import { db } from "@/lib/db";
import { TaskPriority, TaskStatus } from "@prisma/client";

export async function getTasksByProject(
  projectId: string,
  search?: string,
  status?: TaskStatus
) {
  return await db.task.findMany({
    where: {
      projectId,
      ...(status ? { status } : {}),
      ...(search
        ? {
            title: { contains: search, mode: "insensitive" },
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function createTask(
  projectId: string,
  title: string,
  priority: TaskPriority,
  assignedToId?: string | null
) {
  return await db.task.create({
    data: {
      projectId,
      title,
      priority,
      assignedToId: assignedToId || null,
      status: TaskStatus.TODO,
    },
  });
}

export async function toggleTaskStatus(id: string) {
  const existing = await db.task.findUnique({ where: { id } });
  if (!existing) throw new Error("Task tidak ditemukan");

  const nextStatus = existing.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE;

  return await db.task.update({
    where: { id },
    data: { status: nextStatus },
  });
}

export async function deleteTask(id: string) {
  return await db.task.delete({
    where: { id },
  });
}