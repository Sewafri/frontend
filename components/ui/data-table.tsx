"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  placeholder?: string;
}

export function DataTable<T>({
  columns,
  data,
  searchable = true,
  searchKeys,
  placeholder = "Search...",
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");

  const filtered = searchable && searchKeys
    ? data.filter((item) =>
        searchKeys.some((key) =>
          String((item as Record<string, unknown>)[key as string]).toLowerCase().includes(query.toLowerCase())
        )
      )
    : data;

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-border-glass bg-surface-card py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand-orange/50 focus:outline-none"
          />
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-border-glass">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-glass bg-surface-dark">
              {columns.map((col) => (
                <th key={String(col.key)} className="px-4 py-3 font-medium text-text-secondary">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-text-tertiary">
                  No results found.
                </td>
              </tr>
            ) : (
              filtered.map((item, i) => (
                <tr
                  key={i}
                  className="border-b border-border-glass last:border-0 hover:bg-surface-card/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3 text-text-primary">
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {searchable && query && (
        <p className="text-xs text-text-tertiary">
          Showing {filtered.length} of {data.length} results
        </p>
      )}
    </div>
  );
}
