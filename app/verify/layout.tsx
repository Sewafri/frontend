import { BRAND } from "@/constants/brand";
import Link from "next/link";

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-dark">
      <header className="flex items-center justify-between border-b border-border-glass px-6 py-4">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="font-space-grotesk text-lg font-bold text-text-primary">{BRAND.name}</span>
          <span className="h-2 w-2 rounded-full bg-brand-orange" />
        </Link>
        <Link href="/" className="text-sm text-text-secondary transition-colors hover:text-text-primary">
          Back to Home
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        {children}
      </main>
    </div>
  );
}
