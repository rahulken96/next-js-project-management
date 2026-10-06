// server/services/projectService.ts
import { db } from "@/lib/db";

export async function getAllProjects() {
  return await db.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      _count: { select: { tasks: true, members: true } },
    },
  });
}

export async function getProjectById(id: string) {
  return await db.project.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      members: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
      tasks: {
        orderBy: { createdAt: "desc" },
        include: { assignedTo: { select: { id: true, name: true, email: true } } },
      },
    },
  });
}

export async function createProject(name: string, description: string | null, ownerId: string) {
  return await db.project.create({
    data: {
      name,
      description,
      ownerId,
    },
  });
}

export async function deleteProject(id: string) {
  return await db.project.delete({
    where: { id },
  });
}