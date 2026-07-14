"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const SPEECH_TIPS = [
  "Hey! 👋 Click the tabs to switch forms.",
  "Use a strong password! 🔐",
  "You can sign in with Google too! 🌐",
  "10,000+ learners already joined! 🌍",
  "All courses have blockchain certificates! ⛓️",
  "Did you know? 95% get jobs within 6 months! 💼",
];

export function AuthMascot({ onSpeak }: { onSpeak?: (text: string) => void }) {
  const [bouncing, setBouncing] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; color: string; sx: number; sy: number; size: number }[]>([]);
  const mascotRef = useRef<HTMLDivElement>(null);
  const sparkleIdRef = useRef(0);
  const leftPupilRef = useRef<SVGEllipseElement>(null);
  const rightPupilRef = useRef<SVGEllipseElement>(null);
  const leftShineRef = useRef<SVGCircleElement>(null);
  const rightShineRef = useRef<SVGCircleElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Eye tracking
  useEffect(() => {
    if (!mounted) return;
    const handleMouseMove = (e: MouseEvent) => {
      const svg = document.getElementById("auth-mascot-svg");
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const scale = rect.width / 160;
      const eyes = [
        { pupil: leftPupilRef, shine: leftShineRef, cx: 66, cy: 64 },
        { pupil: rightPupilRef, shine: rightShineRef, cx: 94, cy: 64 },
      ];
      eyes.forEach(({ pupil, shine, cx, cy }) => {
        const dx = (e.clientX - rect.left) / scale - cx;
        const dy = (e.clientY - rect.top) / scale - cy;
        const angle = Math.atan2(dy, dx);
        const maxMove = 2.5;
        const dist = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.015, maxMove);
        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle) * dist;
        if (pupil.current) {
          pupil.current.setAttribute("cx", String(px));
          pupil.current.setAttribute("cy", String(py));
        }
        if (shine.current) {
          shine.current.setAttribute("cx", String(px + 3));
          shine.current.setAttribute("cy", String(py - 4));
        }
      });
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [mounted]);

  const handleClick = useCallback(() => {
    // Bounce
    setBouncing(true);
    setTimeout(() => setBouncing(false), 600);

    // Sparkles
    const rect = mascotRef.current?.getBoundingClientRect();
    if (rect) {
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const colors = ["#0a7c42", "#f5a623", "#12b85e", "#0d9650", "#ffd700"];
      const newSparkles: { id: number; x: number; y: number; color: string; sx: number; sy: number; size: number }[] = [];
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        const dist = 30 + Math.random() * 35;
        newSparkles.push({
          id: sparkleIdRef.current++,
          x: cx,
          y: cy,
          color: colors[i % colors.length],
          sx: Math.cos(angle) * dist,
          sy: Math.sin(angle) * dist,
          size: 4 + Math.random() * 4,
        });
      }
      setSparkles((prev) => [...prev, ...newSparkles]);
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => !newSparkles.find((n) => n.id === s.id)));
      }, 500);
    }

    // Speech
    const tip = SPEECH_TIPS[Math.floor(Math.random() * SPEECH_TIPS.length)];
    onSpeak?.(tip);
  }, [onSpeak]);

  return (
    <div
      ref={mascotRef}
      id="authMascot"
      className="relative cursor-pointer"
      onClick={handleClick}
      style={{ touchAction: "manipulation" }}
    >
      <svg
        id="auth-mascot-svg"
        className={`auth-mascot-svg ${bouncing ? "scale-110" : ""}`}
        viewBox="0 0 160 200"
        fill="none"
      >
        <g className={mounted ? "animate-mascot-float" : ""}>
          <ellipse cx="80" cy="135" rx="52" ry="55" fill="#0a7c42" />
          <ellipse cx="80" cy="145" rx="36" ry="38" fill="#0d9650" />
          <ellipse cx="80" cy="138" rx="24" ry="22" fill="#12b85e" opacity="0.4" />
          <ellipse cx="32" cy="128" rx="16" ry="10" fill="#0a7c42" transform="rotate(-20 32 128)" />
          <g className={mounted ? "animate-mascot-wave" : ""}>
            <ellipse cx="128" cy="115" rx="16" ry="10" fill="#0a7c42" transform="rotate(25 128 115)" />
            <circle cx="142" cy="108" r="9" fill="#0d9650" />
          </g>
          <ellipse cx="58" cy="186" rx="18" ry="8" fill="#065c30" />
          <ellipse cx="102" cy="186" rx="18" ry="8" fill="#065c30" />
          <circle cx="80" cy="68" r="40" fill="#0a7c42" />
          <circle cx="80" cy="72" r="32" fill="#0d9650" />
          <g className={mounted ? "animate-mascot-blinking" : ""}>
            <ellipse cx="66" cy="64" rx="12" ry="13" fill="white" />
            <ellipse ref={leftPupilRef} cx="68" cy="65" rx="6" ry="7" fill="#1a1d23" />
            <circle ref={leftShineRef} cx="71" cy="61" r="3" fill="white" />
            <ellipse cx="94" cy="64" rx="12" ry="13" fill="white" />
            <ellipse ref={rightPupilRef} cx="92" cy="65" rx="6" ry="7" fill="#1a1d23" />
            <circle ref={rightShineRef} cx="95" cy="61" r="3" fill="white" />
          </g>
          <path d="M68 80 Q80 92 92 80" stroke="#065c30" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <ellipse cx="56" cy="78" rx="7" ry="4" fill="#f5a623" opacity="0.35" />
          <ellipse cx="104" cy="78" rx="7" ry="4" fill="#f5a623" opacity="0.35" />
          <path d="M80 28 Q60 10 45 30 Q55 18 80 28Z" fill="#12b85e" />
          <path d="M80 28 Q100 10 115 30 Q105 18 80 28Z" fill="#0d9650" />
          <circle cx="80" cy="26" r="4" fill="#f5a623" />
        </g>
      </svg>

      {/* Sparkles */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="sparkle"
          style={{
            left: s.x,
            top: s.y,
            background: s.color,
            width: s.size,
            height: s.size,
            "--sx": `${s.sx}px`,
            "--sy": `${s.sy}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
