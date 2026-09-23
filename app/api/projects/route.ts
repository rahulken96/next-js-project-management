// app/api/projects/route.ts
import { NextResponse } from "next/server";
import { getProjectsAction } from "@/app/actions/projectActions";

// GET /api/projects
export async function GET() {
    try {
        const projects = await getProjectsAction();
        return NextResponse.json({
            success: true,
            data: projects,
            count: projects.length,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Gagal mengambil data project." },
            { status: 500 },
        );
    }
}

// POST /api/projects
export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (
            !body.name ||
            typeof body.name !== "string" ||
            body.name.trim().length < 3
        ) {
            return NextResponse.json(
                { success: false, error: "Nama project minimal 3 karakter." },
                { status: 400 },
            );
        }

        const formData = new FormData();
        formData.append("name", body.name);
        if (body.description) formData.append("description", body.description);

        // Reuse business logic dari server action
        const { createProjectAction } =
            await import("@/app/actions/projectActions");
        const result = await createProjectAction(formData);

        if (!result.success) {
            return NextResponse.json(result, { status: 400 });
        }

        return NextResponse.json(result, { status: 201 });
    } catch {
        return NextResponse.json(
            { success: false, error: "Request payload tidak valid." },
            { status: 400 },
        );
    }
}
