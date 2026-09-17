// components/tasks/TaskFilter.tsx
export type FilterStatus = "ALL" | "ACTIVE" | "COMPLETED";

interface TaskFilterProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TaskFilter({ currentFilter, onFilterChange, searchQuery, onSearchChange }: TaskFilterProps) {
  const filters: { label: string; value: FilterStatus }[] = [
    { label: "Semua", value: "ALL" },
    { label: "Aktif", value: "ACTIVE" },
    { label: "Selesai", value: "COMPLETED" },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
      <input
        type="text"
        placeholder="Cari task..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-64"
      />

      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg self-start">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition ${
              currentFilter === f.value
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}