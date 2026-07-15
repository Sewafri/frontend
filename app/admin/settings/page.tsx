import { Info } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-brand-text-mid">Platform configuration</p>
      </div>

      <div className="mb-6 flex items-center gap-2 rounded-lg border border-brand-amber/20 bg-brand-amber/5 px-4 py-3 text-xs text-brand-amber">
        <Info className="h-4 w-4 shrink-0" />
        Platform settings endpoint not yet available.
      </div>

      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-brand-text-light">Platform settings will be available when the backend endpoint is added.</p>
      </div>
    </div>
  );
}
