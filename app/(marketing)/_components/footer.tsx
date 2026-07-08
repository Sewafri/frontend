import Link from "next/link";
import { BRAND } from "@/constants/brand";

const footerLinks = {
  product: [
    { label: "Courses", href: "/courses" },
    { label: "Certificates", href: "/certificates" },
    { label: "Pricing", href: "/pricing" },
    { label: "For Teams", href: "/teams" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border-default py-16">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
        {/* Brand column */}
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="font-display text-xl font-bold text-text-primary">
              {BRAND.name}
            </span>
            <span className="h-2 w-2 rounded-full bg-accent-500" />
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-secondary">
            {BRAND.description}
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([key, links]) => (
          <div key={key}>
            <h4 className="text-sm font-semibold capitalize text-text-primary">
              {key}
            </h4>
            <ul className="mt-3 space-y-2">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-border-default pt-6 text-center text-xs text-text-tertiary">
        {BRAND.copyright}
      </div>
    </footer>
  );
}
