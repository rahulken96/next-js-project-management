// app/(dashboard)/layout.tsx
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const navItems = [
        { label: "Overview", href: "/dashboard" },
        { label: "Projects", href: "/projects" },
        { label: "Tasks", href: "/tasks" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Sidebar Kiri */}
            <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        P
                    </div>
                    <span className="font-bold text-slate-800 text-base tracking-tight">ProjectHQ</span>
                </div>

                <nav className="p-3 space-y-1 flex-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 rounded-md hover:bg-slate-50 hover:text-slate-900 transition"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700">
                            AD
                        </div>
                        <div className="text-xs">
                            <p className="font-semibold text-slate-800">Admin User</p>
                            <p className="text-slate-500">admin@project-next.js</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <h2 className="text-sm font-semibold text-slate-700">Workspace / Management</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-xs bg-emerald-50 text-emerald-700 font-medium px-2.5 py-1 rounded-full border border-emerald-200">
                            System Online
                        </span>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}