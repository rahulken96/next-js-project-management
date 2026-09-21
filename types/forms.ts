// types/forms.ts
import { Task, Project } from "./domain";

/**
 * CreateTaskDTO:
 * - Kenapa `Pick`? Mengambil HANYA field wajib ("title" & "priority") dari model Task (DRY).
 *   Jika tipe di Task berubah, otomatis tersinkronisasi tanpa deklarasi ulang.
 * - Simbol `&`: Intersection type untuk menambah/mengganti field khusus input form
 *   (misal `dueDate` bertipe string dari `<input type="date" />`, bukan objek Date).
 */
export type CreateTaskDTO = Pick<Task, "title" | "priority"> & {
  description?: string;
  dueDate?: string; // String dari input HTML date
  projectId?: string;
};

/**
 * UpdateTaskDTO:
 * - Kenapa `Omit`? Membuang field yang TIDAK BOLEH dimutasi oleh user (timestamps `createdAt` & `updatedAt`).
 * - Kenapa `Partial`? Logika update/PATCH. User bisa mengedit sebagian field saja (misal hanya status).
 *   Semua field sisa diubah menjadi opsional (`?`).
 * - Kenapa `& { id: string }`? Meski field data opsional, identifier `id` WAJIB ada
 *   agar backend tahu record mana yang di-update.
 */
export type UpdateTaskDTO = Partial<Omit<Task, "id" | "createdAt" | "updatedAt">> & {
  id: string;
};

/**
 * CreateProjectDTO:
 * - `Pick` hanya mengambil `name` dari `Project`. Field sistem seperti `id`, `ownerId`,
 *   dan timestamps dihasilkan otomatis oleh backend, tidak boleh diinput manual dari form.
 */
export type CreateProjectDTO = Pick<Project, "name"> & {
  description?: string;
};