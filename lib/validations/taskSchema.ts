// lib/validations/taskSchema.ts
import { z } from "zod";

export const createTaskSchema = z.object({
    title: z
        .string({ required_error: "Judul task wajib diisi" })
        .trim()
        .min(3, "Judul task minimal 3 karakter")
        .max(100, "Judul task maksimal 100 karakter"),

    description: z
        .string()
        .trim()
        .max(500, "Deskripsi maksimal 500 karakter")
        .optional()
        .or(z.literal("")),

    priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
        errorMap: () => ({ message: "Prioritas harus LOW, MEDIUM, atau HIGH" }),
    }),

    dueDate: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
            message: "Format tanggal tidak valid",
        }),
});

// Inferensikan tipe data TypeScript langsung dari schema Zod
export type CreateTaskInput = z.infer<typeof createTaskSchema>;