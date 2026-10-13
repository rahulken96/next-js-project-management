// lib/errors.ts

export type ErrorCode =
    | "BAD_REQUEST"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "CONFLICT"
    | "INTERNAL_SERVER_ERROR";

export class AppError extends Error {
    public readonly code: ErrorCode;
    public readonly statusCode: number;

    constructor(message: string, code: ErrorCode = "INTERNAL_SERVER_ERROR", statusCode = 500) {
        super(message);
        this.name = "AppError";
        this.code = code;
        this.statusCode = statusCode;
    }
}

export class ValidationError extends AppError {
    constructor(message = "Data input tidak valid.") {
        super(message, "BAD_REQUEST", 400);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource tidak ditemukan.") {
        super(message, "NOT_FOUND", 404);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Data sudah ada dalam sistem.") {
        super(message, "CONFLICT", 409);
    }
}

// Utility: Format pesan error yang aman dikirim ke Client
export function formatActionError(error: unknown): string {
    if (error instanceof AppError) {
        return error.message;
    }

    // Jika error tidak dikenal (misal Prisma crash, syntax error), samarkan!
    console.error("🔥 UNHANDLED SERVER CRASH:", error);
    return "Terjadi kesalahan internal server. Silakan coba beberapa saat lagi.";
}