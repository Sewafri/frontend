"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import StatusBadge from "@/components/ui/status-badge";
import { ALL_STUDENTS } from "@/constants/dashboard";
import { getAdminUsers } from "@/lib/data/admin";
import { Search, Mail } from "lucide-react";
import type { User } from "@/types/db";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAdminUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  // MOCK: fall back to hardcoded data if API fails
  const displayUsers = (users.length > 0 ? users : ALL_STUDENTS) as unknown as Record<string, unknown>[];
  const isBackendData = users.length > 0;

  const filtered = displayUsers.filter((u) => {
    const name = String(u.name ?? u.fullName ?? "").toLowerCase();
    const email = String(u.email ?? "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage platform users"
      />

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
        <input
          type="text"
          placeholder="Search users..."
          aria-label="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border-default bg-surface-card py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/10"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-10">
          <p className="text-sm text-text-secondary">Loading users...</p>
        </div>
      )}

      {!loading && (
        <GlassCard className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-default text-xs text-text-tertiary">
                  <th className="px-6 pb-3 pt-4 font-medium">Name</th>
                  <th className="px-6 pb-3 pt-4 font-medium">Email</th>
                  <th className="px-6 pb-3 pt-4 font-medium">Role</th>
                  <th className="px-6 pb-3 pt-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i: number) => (
                  <tr key={String(u.id ?? i)} className="border-b border-border-default transition-colors hover:bg-surface-card-hover last:border-0">
                    <td className="px-6 py-3.5 font-medium text-text-primary">
                      {isBackendData ? String(u.fullName ?? "") : String(u.name ?? "")}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="flex items-center gap-1.5 text-text-secondary">
                        <Mail className="h-3.5 w-3.5 text-text-tertiary" /> {String(u.email ?? "")}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-text-secondary">
                      {isBackendData ? String(u.role ?? "") : "STUDENT"}
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={isBackendData ? (u.isActive ? "Active" : "Inactive") : String(u.status ?? "Active")} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
