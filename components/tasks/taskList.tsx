import { Task, TaskItem } from "./taskItem";

interface TaskListProp {
    tasks: Task[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export function TaskList({ tasks, onToggle, onDelete }: TaskListProp) {
    if (tasks.length == 0) {
        return (
            <div className="text-center py-10 bg-white border border-dashed border-slate-300 rounded-lg mb-6">
                <p className="text-sm text-slate-500 font-medium">
                    Belum ada task yang sesuai filter.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                    Tambahkan task baru atau ubah kriteria pencarian.
                </p>
            </div>
        );
    }

    return (
        <ul className="space-y-2.5 mb-6">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
}
