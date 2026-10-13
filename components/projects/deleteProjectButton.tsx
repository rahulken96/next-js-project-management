// components/projects/deleteProjectButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProjectSecureAction } from "@/app/actions/projectActions";

interface DeleteProjectButtonProps {
    projectId: string;
    projectName: string;
}

export function DeleteProjectButton({ projectId, projectName }: DeleteProjectButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Yakin ingin menghapus project "${projectName}"?\nSemua task di dalamnya akan ikut terhapus. Aksi ini tidak bisa dibatalkan.`
        );
        if (!confirmed) return;

        setIsDeleting(true);
        const res = await deleteProjectSecureAction(projectId);

        if (res.success) {
            router.push("/projects");
        } else {
            alert(res.error);
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold rounded-lg hover:bg-rose-100 transition disabled:opacity-50 cursor-pointer"
        >
            {isDeleting ? "Menghapus..." : "Hapus Project Ini"}
        </button>
    );
}
