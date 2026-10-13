// components/ui/emptyState.tsx
import Link from "next/link";

interface EmptyStateProps {
    title: string;
    description: string;
    actionHref?: string;
    actionLabel?: string;
    onActionClick?: () => void;
}

export function EmptyState({
    title,
    description,
    actionHref,
    actionLabel,
    onActionClick,
}: EmptyStateProps) {
    return (
        <div className="text-center py-12 px-4 bg-white border border-dashed border-slate-300 rounded-xl max-w-lg mx-auto">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                ∅
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">{title}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">{description}</p>

            {actionHref && actionLabel && (
                <Link
                    href={actionHref}
                    className="inline-block px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm"
                >
                    {actionLabel}
                </Link>
            )}

            {onActionClick && actionLabel && (
                <button
                    onClick={onActionClick}
                    className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm cursor-pointer"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}