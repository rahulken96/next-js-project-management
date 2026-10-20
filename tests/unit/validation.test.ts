// tests/unit/validation.test.ts
import { describe, it, expect } from "vitest";
import { createTaskSchema } from "@/lib/validations/taskSchema";

describe("createTaskSchema Validation", () => {
    it("harus meloloskan payload task yang valid", () => {
        const validData = {
            title: "Integrasi sistem pembayaran",
            description: "Gunakan webhook Xendit",
            priority: "HIGH",
            dueDate: "2026-12-31",
        };

        const result = createTaskSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.title).toBe("Integrasi sistem pembayaran");
            expect(result.data.priority).toBe("HIGH");
        }
    });

    it("harus menolak judul task yang kurang dari 3 karakter", () => {
        const invalidData = {
            title: "Ab",
            priority: "LOW",
        };

        const result = createTaskSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            expect(errors.title).toContain("Judul task minimal 3 karakter");
        }
    });

    it("harus menolak prioritas task yang tidak dikenal", () => {
        const invalidData = {
            title: "Judul yang valid",
            priority: "CRITICAL", // Nilai invalid (bukan LOW/MEDIUM/HIGH)
        };

        const result = createTaskSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            expect(errors.priority).toBeDefined();
        }
    });
});