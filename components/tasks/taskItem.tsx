// components/tasks/TaskItem.tsx

// 1. Domain Model: Kontrak struktur data Task
// 'export' agar tipe data ini bisa di-import dan dipakai ulang di file/komponen lain
export interface Task {
  id: string;          // Identifier unik item (misal: UUID atau auto-increment ID)
  title: string;       // Nama atau teks deskripsi task
  
  // String Literal Union: Membatasi nilai HANYA boleh salah satu dari 3 teks ini.
  // Mencegah typo dan nilai ilegal (misal tidak sengaja mengisi "urgent" atau "NORMAL")
  priority: "LOW" | "MEDIUM" | "HIGH";
  
  isCompleted: boolean; // Flag status: true jika selesai, false jika belum
}

// 2. Component Contract: Daftar props yang WAJIB dikirim oleh parent ke TaskItem
// Tanpa 'export' karena interface ini khusus untuk konsumsi internal file ini saja
interface TaskItemProps {
  task: Task; // Menerima satu objek task utuh sesuai interface Task di atas

  // Callback signature: Function yang dikirim parent untuk menerima sinyal event dari child.
  // 'void' adalah RETURN TYPE fungsi ini (artinya: fungsi tidak mengembalikan nilai / return value diabaikan).
  // Child hanya bertugas melapor ("task ID ini diklik"), eksekusi perubahan state ditangani oleh parent.
  onToggle: (id: string) => void; 
  onDelete: (id: string) => void;
}

// 3. Presentational Component: Murni bertugas me-render UI dari props tanpa state sendiri
export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  // Record mapping class warna Tailwind berdasarkan union priority
  const priorityColors = {
    LOW: "bg-slate-100 text-slate-700 border-slate-300",
    MEDIUM: "bg-amber-100 text-amber-800 border-amber-300",
    HIGH: "bg-rose-100 text-rose-800 border-rose-300",
  };

  return (
    <li className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 transition">
      <div className="flex items-center gap-3">
        {/* Checkbox status: memicu onToggle ke parent dengan ID task */}
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={() => onToggle(task.id)}
          className="w-4 h-4 text-blue-600 rounded cursor-pointer"
        />
        {/* Conditional styling: coret teks jika selesai */}
        <span className={`text-sm font-medium ${task.isCompleted ? "line-through text-slate-400" : "text-slate-800"}`}>
          {task.title}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Badge priority sesuai mapping warna */}
        <span className={`text-xs px-2.5 py-0.5 font-semibold rounded-full border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        {/* Tombol aksi: memicu onDelete ke parent dengan ID task */}
        <button
          onClick={() => onDelete(task.id)}
          className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded hover:bg-rose-50 transition"
        >
          Hapus
        </button>
      </div>
    </li>
  );
}