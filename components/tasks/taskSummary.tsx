interface TaskSummaryProps {
    total: number;
    pending: number;
    completed: number;
}

export function TaskSummary({ total, pending, completed }: TaskSummaryProps) {
    return (
        <footer className="grid grid-cols-3 gap-3 p-4 bg-white border border-slate-200 rounded-lg text-center shadow-sm">
            <div>
                <span className="text-xs text-slate-500 font-medium block">
                    Total Task
                </span>
                <span className="text-lg font-bold text-slate-800">
                    {total}
                </span>
            </div>
            <div>
                <span className="text-xs text-amber-600 font-medium block">
                    Pending
                </span>
                <span className="text-lg font-bold text-amber-600">
                    {pending}
                </span>
            </div>
            <div>
                <span className="text-xs text-emerald-600 font-medium block">
                    Selesai
                </span>
                <span className="text-lg font-bold text-emerald-600">
                    {completed}
                </span>
            </div>
        </footer>
    );
}
