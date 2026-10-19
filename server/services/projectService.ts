// server/services/projectService.ts
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

const CACHE_KEY_PROJECTS = "projects:list";
const CACHE_TTL_SECONDS = 60; // 1 Menit

// Fungsi Invalidasi Cache
export async function invalidateProjectsCache() {
  try {
    await redis.del(CACHE_KEY_PROJECTS);
    console.log("🧹 [CACHE INVALIDATED]: Key projects:list berhasil dihapus");
  } catch (err) {
    console.warn("Gagal menghapus cache Redis:", err);
  }
}

export async function getAllProjects() {
  // 1. Coba baca dari Redis
  try {
    const cached = await redis.get(CACHE_KEY_PROJECTS);
    if (cached) {
      console.log("⚡ [REDIS CACHE HIT]: Mengembalikan daftar project dari memory");
      return JSON.parse(cached);
    }
  } catch (err) {
    console.warn("Bypass Redis membaca langsung PostgreSQL");
  }

  // 2. Cache Miss: Query PostgreSQL
  console.log("🐢 [POSTGRESQL QUERY]: Mengambil daftar project dari database");
  const projects = await db.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      _count: { select: { tasks: true, members: true } },
    },
  });

  // 3. Simpan ke Redis secara non-blocking
  try {
    await redis.set(CACHE_KEY_PROJECTS, JSON.stringify(projects), "EX", CACHE_TTL_SECONDS);
    await invalidateProjectsCache();
  } catch (err) {
    console.warn("⚠️ Redis saved cache issue: ", err);
  }

  return projects;
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