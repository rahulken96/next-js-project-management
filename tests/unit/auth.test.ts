// tests/unit/auth.test.ts
import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth";

describe("Auth Utility Logic", () => {
    it("harus menghasilkan hash yang berbeda dari password asli", async () => {
        const raw = "superpassword123";
        const hash = await hashPassword(raw);

        expect(hash).not.toBe(raw);
        expect(hash.startsWith("$2a$") || hash.startsWith("$2b$")).toBe(true); // Standar prefix bcrypt
    });

    it("harus memverifikasi password benar dan menolak password salah", async () => {
        const raw = "superpassword123";
        const hash = await hashPassword(raw);

        const isMatch = await verifyPassword(raw, hash);
        expect(isMatch).toBe(true);

        const isWrong = await verifyPassword("blablabla", hash);
        expect(isWrong).toBe(false);
    });
});