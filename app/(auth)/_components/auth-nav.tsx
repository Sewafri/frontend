import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function AuthNav() {
  return (
    <div className="auth-nav">
      <Link href="/" className="text-[22px] font-extrabold -tracking-[0.03em] text-landing-green">
        Sew<span className="text-landing-amber">Afri</span>
      </Link>
      <Link
        href="/"
        className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium text-landing-text-light transition-all hover:bg-black/5 hover:text-landing-text"
      >
        <ArrowLeft size={14} />
        Back to home
      </Link>
    </div>
  );
}
