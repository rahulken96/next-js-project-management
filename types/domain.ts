// types/domain.ts

// 1. Literal Unions untuk status dan prioritas domain
export type UserRole = "ADMIN" | "MEMBER";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

// 2. Interface Entitas Database

/**
 * Entitas User: representasi data pengguna aplikasi (Admin / Member).
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Entitas Project: ruang kerja proyek yang dimiliki oleh User (ownerId).
 */
export interface Project {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Pivot Entity: tabel penghubung relasi Many-to-Many antara Project dan User.
 */
export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  createdAt: Date;
}

/**
 * Entitas Task: unit pekerjaan dalam Project, opsional ditugaskan ke User (assignedToId).
 */
export interface Task {
  id: string;
  projectId: string;
  assignedToId: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// 3. Composite Interface (Entity dengan Relasi untuk UI)

/**
 * DTO Task + info profil penanggung jawab. Memakai inheritance via extends Task.
 */
export interface TaskWithAssignee extends Task {
  assignedTo?: Pick<User, "id" | "name" | "email"> | null;
}

/**
 * DTO Project + agregasi jumlah data (_count). Memakai inheritance via extends Project.
 */
export interface ProjectWithStats extends Project {
  _count: {
    tasks: number;
    members: number;
  };
}