"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { updateProfile, deleteAccount } from "@/lib/data/users";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { User, Lock, Bell, CreditCard, TriangleAlert } from "lucide-react";

const NOTIFICATION_SETTINGS = [
  { label: "Course updates", description: "Get notified when course content is updated" },
  { label: "New courses", description: "Get notified when new courses are available" },
  { label: "Deadline reminders", description: "Receive reminders about upcoming deadlines" },
  { label: "Achievements", description: "Get notified when you earn new achievements" },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await updateProfile({
        fullName: fullName.trim() || undefined,
        bio: bio.trim() || undefined,
      });
      setSaved(true);
    } catch {
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="">
      {/* Page Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-brand-text-mid">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-8">
        {/* ── Profile ── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-brand-text">
            <User className="h-5 w-5 text-brand-green" /> Profile
          </h2>
          <div className="rounded-xl border border-brand-border bg-brand-card p-5">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2 text-sm text-brand-text outline-none transition-colors focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">Email</label>
                <input
                  type="email"
                  value={user?.email ?? ""}
                  readOnly
                  className="w-full rounded-lg border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text-mid outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2 text-sm text-brand-text outline-none transition-colors focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="cursor-pointer rounded-lg bg-brand-green px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-green-dark disabled:opacity-50"
              >
                {saving ? "Saving..." : saved ? "Saved!" : "Save Profile"}
              </button>
            </div>
          </div>
        </section>

        {/* ── Password ── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-brand-text">
            <Lock className="h-5 w-5 text-brand-green" /> Password
          </h2>
          <div className="rounded-xl border border-brand-border bg-brand-card p-5">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2 text-sm text-brand-text placeholder:text-brand-text-light outline-none transition-colors focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">New Password</label>
                <input type="password" placeholder="Enter new password" className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2 text-sm text-brand-text placeholder:text-brand-text-light outline-none transition-colors focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Notifications ── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-brand-text">
            <Bell className="h-5 w-5 text-brand-green" /> Notifications
          </h2>
          <div className="rounded-xl border border-brand-border bg-brand-card p-5">
            <div className="space-y-4">
              {NOTIFICATION_SETTINGS.map((n) => (
                <div key={n.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-brand-text">{n.label}</p>
                    <p className="text-xs text-brand-text-mid">{n.description}</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" defaultChecked className="peer sr-only" />
                    <div className="h-5 w-9 rounded-full bg-neutral-300 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-brand-green peer-checked:after:translate-x-full dark:bg-neutral-700" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Payment History ── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-brand-text">
            <CreditCard className="h-5 w-5 text-brand-green" /> Payment History
          </h2>
          <div className="rounded-xl border border-brand-border bg-brand-card p-5">
            <p className="py-4 text-center text-sm text-brand-text-mid">
              Payment history will appear here once available.
            </p>
          </div>
        </section>

        {/* ── Danger Zone ── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-accent-red">
            <TriangleAlert className="h-5 w-5" /> Danger Zone
          </h2>
          <div className="rounded-xl border border-accent-red/20 bg-brand-card p-5">
            <p className="mb-4 text-sm text-brand-text-mid">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button
              onClick={() => setDeleteOpen(true)}
              disabled={deleting}
              className="cursor-pointer rounded-lg border border-accent-red/30 px-4 py-2 text-sm font-medium text-accent-red transition-colors hover:bg-accent-red/10 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>

          <ConfirmDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            title="Delete Account"
            description="Are you sure you want to delete your account? This cannot be undone."
            confirmLabel="Delete Account"
            variant="destructive"
            loading={deleting}
            onConfirm={async () => {
              setDeleting(true);
              try {
                await deleteAccount();
                window.location.href = "/sign-in";
              } catch { setDeleting(false); setDeleteOpen(false) }
            }}
          />
        </section>
      </div>
    </div>
  );
}
