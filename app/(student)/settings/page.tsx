"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
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
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences"
      />

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary">
            <User className="h-5 w-5 text-accent-500" /> Profile
          </h2>
          <GlassCard>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2 text-sm text-text-primary outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Email</label>
                <input
                  type="email"
                  value={user?.email ?? ""}
                  readOnly
                  className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2 text-sm text-text-secondary outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2 text-sm text-text-primary outline-none"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="cursor-pointer rounded-lg bg-accent-500 px-5 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-accent-500/90 disabled:opacity-50"
              >
                {saving ? "Saving..." : saved ? "Saved!" : "Save Profile"}
              </button>
            </div>
          </GlassCard>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary">
            <Lock className="h-5 w-5 text-accent-500" /> Password
          </h2>
          <GlassCard>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2 text-sm text-text-primary placeholder-text-secondary outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">New Password</label>
                <input type="password" placeholder="Enter new password" className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2 text-sm text-text-primary placeholder-text-secondary outline-none" />
              </div>
            </div>
          </GlassCard>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary">
            <Bell className="h-5 w-5 text-accent-500" /> Notifications
          </h2>
          <GlassCard>
            <div className="space-y-4">
              {NOTIFICATION_SETTINGS.map((n) => (
                <div key={n.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{n.label}</p>
                    <p className="text-xs text-text-secondary">{n.description}</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" defaultChecked className="peer sr-only" />
                    <div className="h-5 w-9 rounded-full bg-neutral-700 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-accent-500 peer-checked:after:translate-x-full" />
                  </label>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary">
            <CreditCard className="h-5 w-5 text-accent-500" /> Payment History
          </h2>
          <GlassCard>
            <p className="py-4 text-center text-sm text-text-secondary">
              Payment history will appear here once available.
            </p>
          </GlassCard>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-accent-red">
            <TriangleAlert className="h-5 w-5" /> Danger Zone
          </h2>
          <GlassCard>
            <p className="mb-4 text-sm text-text-secondary">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button
              onClick={() => setDeleteOpen(true)}
              disabled={deleting}
              className="cursor-pointer rounded-lg border border-accent-red/30 px-4 py-2 text-sm font-medium text-accent-red transition-colors hover:bg-accent-red/10 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete Account"}
            </button>
          </GlassCard>

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
