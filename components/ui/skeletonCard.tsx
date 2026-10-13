// components/ui/skeletonCard.tsx
export function SkeletonCard({ count = 3 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="p-5 bg-white border border-slate-200 rounded-xl animate-pulse space-y-3">
                    <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-100 rounded w-full"></div>
                    <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                    <div className="pt-4 flex justify-between">
                        <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}