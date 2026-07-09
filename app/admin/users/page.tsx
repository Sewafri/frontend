"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { getAdminUsers, suspendUser, reactivateUser, changeUserRole } from "@/lib/data/admin";
import type { User } from "@/types/db";
import { Search, ShieldAlert, ShieldCheck, RotateCcw } from "lucide-react";

type RoleOption = "STUDENT" | "INSTRUCTOR" | "ADMIN";

const ROLE_COLORS: Record<RoleOption, string> = {
  STUDENT: "bg-accent-blue/10 text-accent-blue",
  INSTRUCTOR: "bg-accent-purple/10 text-accent-purple",
  ADMIN: "bg-accent-500/10 text-accent-500",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionUserId, setActionUserId] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    getAdminUsers({ search: search || undefined })
      .then((res) => {
        setUsers(res.users);
        setTotal(res.total);
      })
      .catch(() => {
        setUsers([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleSuspend = async (userId: string) => {
    setActionUserId(userId);
    try {
      await suspendUser(userId);
      fetchUsers();
    } catch {
      alert("Failed to suspend user");
    } finally {
      setActionUserId(null);
    }
  };

  const handleReactivate = async (userId: string) => {
    setActionUserId(userId);
    try {
      await reactivateUser(userId);
      fetchUsers();
    } catch {
      alert("Failed to reactivate user");
    } finally {
      setActionUserId(null);
    }
  };

  const handleRoleChange = async (userId: string, role: RoleOption) => {
    setActionUserId(userId);
    try {
      await changeUserRole(userId, role);
      fetchUsers();
    } catch {
      alert("Failed to change role");
    } finally {
      setActionUserId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Users"
        description={`${total} total users`}
      />

      <form onSubmit={handleSearch} className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
        <input
          type="text"
          placeholder="Search by name or email..."
          aria-label="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border-default bg-surface-card py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/10"
        />
      </form>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-text-secondary">Loading users...</p>
        </div>
      )}

      {!loading && users.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-text-tertiary">No users found.</p>
        </div>
      )}

      {!loading && users.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border-default bg-surface-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-default text-xs text-text-tertiary">
                <th className="px-5 pb-3 pt-4 font-medium">Name</th>
                <th className="px-5 pb-3 pt-4 font-medium">Email</th>
                <th className="px-5 pb-3 pt-4 font-medium">Role</th>
                <th className="px-5 pb-3 pt-4 font-medium">Status</th>
                <th className="px-5 pb-3 pt-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isBusy = actionUserId === u.id;
                return (
                  <tr
                    key={u.id}
                    className="border-b border-border-default transition-colors hover:bg-surface-card-hover last:border-0"
                  >
                    <td className="px-5 py-3.5 font-medium text-text-primary">{u.fullName}</td>
                    <td className="px-5 py-3.5 text-text-secondary">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_COLORS[u.role as RoleOption] || ROLE_COLORS.STUDENT}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        u.isActive ? "bg-accent-green/10 text-accent-green" : "bg-accent-red/10 text-accent-red"
                      }`}>
                        {u.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {u.isActive ? (
                          <button
                            onClick={() => handleSuspend(u.id)}
                            disabled={isBusy}
                            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-accent-red transition-colors hover:bg-accent-red/10 disabled:opacity-50"
                          >
                            <ShieldAlert className="h-3.5 w-3.5" />
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReactivate(u.id)}
                            disabled={isBusy}
                            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-accent-green transition-colors hover:bg-accent-green/10 disabled:opacity-50"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Reactivate
                          </button>
                        )}

                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as RoleOption)}
                          disabled={isBusy}
                          className="rounded-md border border-border-default bg-surface-card px-2 py-1 text-xs text-text-secondary outline-none transition-colors focus:border-accent-500/50 disabled:opacity-50"
                        >
                          <option value="STUDENT">Student</option>
                          <option value="INSTRUCTOR">Instructor</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
