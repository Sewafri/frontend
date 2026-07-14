"use client";

import { useState, useEffect } from "react";
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
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-brand-text-mid">Your account and profile settings</p>
      </div>

      <div className="space-y-8">
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
                  className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2 text-sm text-brand-text outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">Email</label>
                <input
                  type="email"
                  value={user?.email ?? ""}
                  readOnly
                  className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2 text-sm text-brand-text-mid outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2 text-sm text-brand-text outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-brand-text">
            <Wallet className="h-5 w-5 text-brand-green" /> Crypto Wallet
          </h2>
          <div className="rounded-xl border border-brand-border bg-brand-card p-5">
            <p className="mb-3 text-sm text-brand-text-mid">
              Set your EVM wallet address (e.g. MetaMask) to receive crypto payments from students.
              Students who pay with cryptocurrency will send ETH directly to this address.
            </p>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">Wallet Address</label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
                className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2 font-mono text-sm text-brand-text placeholder-text-brand-text-mid outline-none focus:border-brand-green/50"
              />
              {walletAddress && !/^0x[0-9a-fA-F]{40}$/.test(walletAddress.trim()) && (
                <p className="mt-1 text-xs text-accent-red">
                  Invalid address format. Must be a 0x-prefixed 42-character EVM address.
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="cursor-pointer flex items-center gap-2 rounded-lg bg-brand-green px-6 py-2 text-sm font-medium text-text-on-accent transition-colors hover:bg-brand-green-dark disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
