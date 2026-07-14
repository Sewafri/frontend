import { AuthNav } from "./auth-nav";
import { AuthScatteredElements } from "./auth-scattered-elements";
import { ToastContainer } from "./toast";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-page relative min-h-screen">
      {/* Background grid */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(10,124,66,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(10,124,66,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
        aria-hidden
      />

      {/* Decorative circles */}
      <div
        className="pointer-events-none fixed -right-[15%] -top-[15%] z-0 size-[400px] rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #0a7c42, transparent 65%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -bottom-[10%] -left-[10%] z-0 size-[300px] rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(circle, #f5a623, transparent 65%)" }}
        aria-hidden
      />

      {/* Nav */}
      <div className="relative z-20 mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <AuthNav />
      </div>

      {/* Main content — centered form with scattered decorations */}
      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-68px)] max-w-7xl items-center justify-center px-5 pb-20 sm:px-8">
        {/* Scattered decorative elements */}
        <AuthScatteredElements />

        {/* Centered form card */}
        <div className="w-full max-w-md rounded-2xl border border-landing-border bg-landing-card p-8 shadow-xl sm:p-10">
          {children}
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-20 border-t border-landing-border bg-landing-card/60">
        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
          <p className="text-center text-xs text-landing-text-light">
            &copy; {new Date().getFullYear()} SewAfri. All rights reserved.
          </p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
