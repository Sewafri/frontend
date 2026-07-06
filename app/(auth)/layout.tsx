import Link from "next/link";
import { BRAND } from "@/constants/brand";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-surface-dark">
      {/* Brand logo — centered at top */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-center px-4 pt-10 sm:px-6 lg:px-8">
        <Link href="/" className="flex cursor-pointer items-center gap-2">
          <span className="font-space-grotesk text-2xl font-bold text-white">
            {BRAND.name}
          </span>
          <span className="h-2.5 w-2.5 rounded-full bg-brand-orange" />
        </Link>
      </div>

      {/* Centered content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  );
}
