// tests/component/TaskItem.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskItem, Task } from "@/components/tasks/taskItem";

describe("<TaskItem />", () => {
    const mockTask: Task = {
        id: "task-1",
        title: "Buat dokumentasi API",
        priority: "HIGH",
        status: "TODO",
    };

    it("harus merender judul task dan badge prioritas dengan benar", () => {
        render(<TaskItem task={mockTask} onToggle={() => { }} onDelete={() => { }} />);

        expect(screen.getByText("Buat dokumentasi API")).toBeDefined();
        expect(screen.getByText("HIGH")).toBeDefined();
    });

    it("harus memicu callback onToggle saat checkbox diklik", () => {
        const handleToggle = vi.fn();
        render(<TaskItem task={mockTask} onToggle={handleToggle} onDelete={() => { }} />);

        const checkbox = screen.getByRole("checkbox");
        fireEvent.click(checkbox);

        expect(handleToggle).toHaveBeenCalledTimes(1);
        expect(handleToggle).toHaveBeenCalledWith("task-1");
    });

    it("harus memicu callback onDelete saat tombol hapus diklik", () => {
        const handleDelete = vi.fn();
        render(<TaskItem task={mockTask} onToggle={() => { }} onDelete={handleDelete} />);

        const deleteBtn = screen.getByText("Hapus");
        fireEvent.click(deleteBtn);

        expect(handleDelete).toHaveBeenCalledTimes(1);
        expect(handleDelete).toHaveBeenCalledWith("task-1");
    });
});