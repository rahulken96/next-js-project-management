// app/(dashboard)/projects/[id]/loading.tsx
export default function ProjectDetailLoading() {
    return (
        <div className="animate-pulse">
            {/* Back link skeleton */}
            <div className="w-24 h-4 bg-slate-200 rounded mb-4"></div>

            {/* Title & description skeleton */}
            <div className="w-72 h-8 bg-slate-200 rounded mb-2"></div>
            <div className="w-96 h-4 bg-slate-200 rounded mb-6"></div>

            {/* Card skeleton */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="w-32 h-5 bg-slate-200 rounded mb-4"></div>
                <div className="space-y-3">
                    <div className="w-full h-10 bg-slate-100 rounded-lg"></div>
                    <div className="w-full h-10 bg-slate-100 rounded-lg"></div>
                    <div className="w-full h-10 bg-slate-100 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}