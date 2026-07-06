import Link from "next/link";
import { BRAND } from "@/constants/brand";

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle py-12">
      <div className="grid gap-8 sm:grid-cols-3">
        <div>
          <h4 className="text-sm font-semibold text-white">{BRAND.name}</h4>
          <p className="mt-2 text-xs text-text-secondary">Education platform for Africa.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Product</h4>
          <ul className="mt-2 space-y-1.5 text-xs text-text-secondary">
            <li><Link href="/courses" className="hover:text-white">Courses</Link></li>
            <li><Link href="/certificates" className="hover:text-white">Certificates</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Company</h4>
          <ul className="mt-2 space-y-1.5 text-xs text-text-secondary">
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
