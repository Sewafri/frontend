"use client";

import { useState, useRef, useEffect } from "react";
import { AuthMascot } from "./auth-mascot";

/** A non-interactive, simplified mascot silhouette for decoration */
function MascotSilhouette({
  size = 80,
  opacity = 0.08,
  flip = false,
  className = "",
}: {
  size?: number;
  opacity?: number;
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 200"
      width={size}
      height={(size * 200) / 160}
      className={className}
      style={{ opacity, transform: flip ? "scaleX(-1)" : undefined }}
      aria-hidden
    >
      <ellipse cx="80" cy="135" rx="52" ry="55" fill="currentColor" />
      <ellipse cx="80" cy="145" rx="36" ry="38" fill="currentColor" />
      <ellipse cx="32" cy="128" rx="16" ry="10" fill="currentColor" transform="rotate(-20 32 128)" />
      <ellipse cx="128" cy="115" rx="16" ry="10" fill="currentColor" transform="rotate(25 128 115)" />
      <circle cx="142" cy="108" r="9" fill="currentColor" />
      <ellipse cx="58" cy="186" rx="18" ry="8" fill="currentColor" />
      <ellipse cx="102" cy="186" rx="18" ry="8" fill="currentColor" />
      <circle cx="80" cy="68" r="40" fill="currentColor" />
      <circle cx="80" cy="72" r="32" fill="currentColor" />
      <ellipse cx="66" cy="64" rx="12" ry="13" fill="currentColor" />
      <ellipse cx="94" cy="64" rx="12" ry="13" fill="currentColor" />
      <ellipse cx="56" cy="78" rx="7" ry="4" fill="currentColor" />
      <ellipse cx="104" cy="78" rx="7" ry="4" fill="currentColor" />
    </svg>
  );
}

export function AuthScatteredElements() {
  const [speechText, setSpeechText] = useState("Hey! 👋 Click me!");
  const [speechVisible, setSpeechVisible] = useState(true);
  const speechTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => clearTimeout(speechTimerRef.current);
  }, []);

  const handleSpeak = (text: string) => {
    setSpeechText(text);
    setSpeechVisible(true);
    clearTimeout(speechTimerRef.current);
    speechTimerRef.current = setTimeout(() => setSpeechVisible(false), 4500);
  };

  return (
    <>
      {/* ── Main interactive mascot — right side, overlapping form ── */}
      <div className="pointer-events-none absolute right-[2%] top-1/2 z-30 hidden -translate-y-1/2 lg:block">
        <div className="pointer-events-auto relative">
          {speechVisible && (
            <div className="absolute bottom-full right-4 z-20 mb-3 min-w-[200px] max-w-[260px]">
              <div className="rounded-2xl border border-landing-border bg-landing-card px-4 py-3 shadow-lg">
                <p className="text-xs leading-relaxed text-landing-text">
                  {speechText}
                </p>
              </div>
              <div className="absolute -bottom-[6px] right-8 size-3 rotate-45 border-b border-r border-landing-border bg-landing-card" />
            </div>
          )}
          <AuthMascot onSpeak={handleSpeak} />
        </div>
      </div>

      {/* ── Dispersed mascot silhouettes ── */}

      {/* Top-left — flipped */}
      <div className="pointer-events-none absolute left-[3%] top-[10%] z-0 hidden text-landing-green-dark lg:block">
        <MascotSilhouette size={80} opacity={0.18} flip />
      </div>

      {/* Top-right corner */}
      <div className="pointer-events-none absolute right-[6%] top-[8%] z-0 hidden text-landing-amber lg:block">
        <MascotSilhouette size={50} opacity={0.2} />
      </div>

      {/* Bottom-left */}
      <div className="pointer-events-none absolute bottom-[15%] left-[2%] z-0 hidden text-landing-green lg:block">
        <MascotSilhouette size={100} opacity={0.15} flip />
      </div>

      {/* Bottom-right */}
      <div className="pointer-events-none absolute bottom-[22%] right-[5%] z-0 hidden text-landing-amber-dark lg:block">
        <MascotSilhouette size={45} opacity={0.18} />
      </div>

      {/* Behind the form — large watermark */}
      <div className="pointer-events-none fixed left-1/2 top-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 text-landing-green lg:block">
        <MascotSilhouette size={300} opacity={0.06} />
      </div>

      {/* Decorative dots — minimal */}
      <div className="pointer-events-none absolute right-[15%] top-[30%] z-0 hidden lg:block">
        <div className="flex gap-2">
          <div className="size-2 rounded-full bg-landing-green/15" />
          <div className="size-2 rounded-full bg-landing-amber/15" />
          <div className="size-1.5 rounded-full bg-landing-green/10" />
        </div>
      </div>
    </>
  );
}
