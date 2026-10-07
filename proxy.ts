// proxy.ts (Next.js 16 convention, previously middleware.ts)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
    process.env.AUTH_SECRET || "default-secret-change-in-production-min-32-chars"
);

const SESSION_COOKIE_NAME = "pms_session_v1";

// Rute yang WAJIB login
const PROTECTED_ROUTES = ["/dashboard", "/projects", "/tasks"];

// Rute khusus tamu (jika sudah login, lempar ke dashboard)
const AUTH_ROUTES = ["/login", "/register"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    let isAuthenticated = false;

    if (token) {
        try {
            await jwtVerify(token, SECRET_KEY);
            isAuthenticated = true;
        } catch {
            isAuthenticated = false;
        }
    }

    // 1. User belum login mencoba akses rute protected -> Redirect ke /login
    const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
    if (isProtected && !isAuthenticated) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 2. User sudah login mencoba akses /login atau /register -> Redirect ke /dashboard
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export default proxy;

export const config = {
    matcher: ["/dashboard/:path*", "/projects/:path*", "/tasks/:path*", "/login", "/register"],
};
