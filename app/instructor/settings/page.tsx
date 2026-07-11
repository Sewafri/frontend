"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { useAuth } from "@/lib/auth/auth-context";
import { updateProfile } from "@/lib/data/users";
import { User, Wallet, Save } from "lucide-react";
import { toast } from "sonner";

export default function InstructorSettingsPage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [bio, setBio] = useState("");
  const [walletAddress, setWalletAddress] = useState(user?.walletAddress ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setWalletAddress(user.walletAddress ?? "");
    }
  }, [user]);

  async function handleSave() {
    setSaving(true);
    try {
      await updateProfile({
        fullName: fullName.trim() || undefined,
        bio: bio.trim() || undefined,
        walletAddress: walletAddress.trim() || undefined,
      });
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="">
      <PageHeader
        title="Settings"
        description="Your account and profile settings"
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
          </GlassCard>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary">
            <Wallet className="h-5 w-5 text-accent-500" /> Crypto Wallet
          </h2>
          <GlassCard>
            <p className="mb-3 text-sm text-text-secondary">
              Set your EVM wallet address (e.g. MetaMask) to receive crypto payments from students.
              Students who pay with cryptocurrency will send ETH directly to this address.
            </p>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Wallet Address</label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
                className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2 font-mono text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent-500/50"
              />
              {walletAddress && !/^0x[0-9a-fA-F]{40}$/.test(walletAddress.trim()) && (
                <p className="mt-1 text-xs text-accent-red">
                  Invalid address format. Must be a 0x-prefixed 42-character EVM address.
                </p>
              )}
            </div>
          </GlassCard>
        </section>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="cursor-pointer flex items-center gap-2 rounded-lg bg-accent-500 px-6 py-2 text-sm font-medium text-text-on-accent transition-colors hover:bg-accent-500/90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
