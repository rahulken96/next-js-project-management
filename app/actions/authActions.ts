// app/actions/authActions.ts
"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword, setSessionCookie, deleteSessionCookie } from "@/lib/auth";
import { ApiResult } from "@/types/api";
import { UserRole } from "@prisma/client";

export async function registerAction(formData: FormData): Promise<ApiResult<void>> {
  const name = formData.get("name") as string;
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;

  if (!name || name.trim().length < 2) {
    return { success: false, error: "Nama minimal 2 karakter." };
  }
  if (!email || !email.includes("@")) {
    return { success: false, error: "Email tidak valid." };
  }
  if (!password || password.length < 6) {
    return { success: false, error: "Password minimal 6 karakter." };
  }

  // Cek duplikasi email
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "Email sudah terdaftar. Silakan login." };
  }

  const passwordHash = await hashPassword(password);

  const user = await db.user.create({
    data: {
      name: name.trim(),
      email,
      passwordHash,
      role: UserRole.MEMBER,
    },
  });

  // Otomatis login setelah registrasi
  await setSessionCookie({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  redirect("/dashboard");
}

export async function loginAction(formData: FormData): Promise<ApiResult<void>> {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email dan password wajib diisi." };
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    // Pesan dibuat generik untuk mencegah user enumeration
    return { success: false, error: "Email atau password salah." };
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return { success: false, error: "Email atau password salah." };
  }

  await setSessionCookie({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  await deleteSessionCookie();
  redirect("/login");
}