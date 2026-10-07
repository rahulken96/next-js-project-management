// prisma/seed.ts
import { PrismaClient, UserRole, TaskPriority, TaskStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai seeding database...");

  // 1. Bersihkan database sebelumnya
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Hash valid untuk 'password123'
  const passwordHash = await bcrypt.hash("password123", 10);

  // 2. Buat User Admin & Member
  const admin = await prisma.user.create({
    data: {
      name: "Admin Workspace",
      email: "admin@projecthq.local",
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  const member = await prisma.user.create({
    data: {
      name: "Budi Developer",
      email: "budi@projecthq.local",
      passwordHash,
      role: UserRole.MEMBER,
    },
  });

  // 3. Buat Project Utama
  const project1 = await prisma.project.create({
    data: {
      name: "Fullstack Platform Migration",
      description: "Migrasi sistem monolitik ke Next.js 15 App Router & PostgreSQL.",
      ownerId: admin.id,
      members: {
        create: [{ userId: member.id }],
      },
      tasks: {
        create: [
          {
            title: "Desain Skema Database Prisma",
            description: "Membuat model relasional User, Project, Member, dan Task.",
            status: TaskStatus.DONE,
            priority: TaskPriority.HIGH,
            assignedToId: member.id,
          },
          {
            title: "Implementasi Server Actions CRUD",
            description: "Menghubungkan form client ke PostgreSQL dengan Prisma.",
            status: TaskStatus.IN_PROGRESS,
            priority: TaskPriority.HIGH,
            assignedToId: member.id,
          },
          {
            title: "Setup Auth Cookie & Middleware",
            description: "Proteksi rute menggunakan stateless session token.",
            status: TaskStatus.TODO,
            priority: TaskPriority.MEDIUM,
            assignedToId: admin.id,
          },
        ],
      },
    },
  });

  console.log(`✅ Seeding sukses! Project dibuat: ${project1.name} (Owner: ${admin.email})`);
}

main()
  .catch((e) => {
    console.error("❌ Gagal seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });