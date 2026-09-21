// app/page.tsx
import Link from "next/link";

// 1. 'export default': Konvensi WAJIB Next.js App Router.
// File rute khusus (page.tsx, layout.tsx, error.tsx) HARUS diexport secara 'default'
// agar sistem routing Next.js mengenali komponen ini sebagai UI utama untuk path rute "/" (root).
// Jika hanya pakai 'named export' (misal: export function HomePage), Next.js akan melempar error.
//
// 2. 'HomePage': Nama komponen React (PascalCase).
// Bebas dinamai apa saja (misal Page/HomePage), berguna untuk identifikasi saat debugging di React DevTools.
//
// 3. Karakteristik Server Component:
// Karena TIDAK ada deklarasi '"use client"' di baris teratas, komponen ini secara default
// berstatus React Server Component (RSC) — di-render di sisi server, tanpa menambah beban bundle JS ke browser.
export default function Page() {
  return (
    <main className="min-h-screen p-8 bg-slate-50 text-slate-900 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Project Management System</h1>
      <p className="text-slate-600 mb-6">Sprint 14 Hari — React + Next.js Production-Grade</p>
      
      {/* Komponen Link Next.js: Navigasi client-side instan (SPA) tanpa reload halaman penuh */}
      <Link
        href="/tasks-demo"
        className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
      >
        Buka Demo Task (Hari 1) &rarr;
      </Link>
      <Link
        href="/tasks-demo-2"
        className="mt-2.5 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
      >
        Buka Demo Task (Hari 2) &rarr;
      </Link>
    </main>
  );
}