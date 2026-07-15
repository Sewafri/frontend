"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const SPEECHES = [
  "Hey there! 👋 Ready to start learning?",
  "Did you know? 95% of our graduates advance within 6 months! 🚀",
  "Try clicking on a course card above! 📚",
  "Our certificates are verified on blockchain — pretty cool right? ⛓️",
  "Over 10,000 learners across 18 African countries! 🌍",
  "Web Development is our most popular category! 💻",
  "All courses are built by real African tech professionals 🎯",
  "You can learn at your own pace — totally flexible! ⏰",
  "Fun fact: Our average rating is 4.8 out of 5! ⭐",
  "Join free — no credit card needed! 💚",
];

const CONFETTI_COLORS = [
  "#0a7c42", "#f5a623", "#12b85e", "#0d9650",
  "#ffd700", "#ff6b6b", "#4ecdc4",
];

interface ConfettiPiece {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  vx: number;
  vy: number;
  rot: number;
  rotV: number;
  gravity: number;
  opacity: number;
}

export function Mascot() {
  const [speechIndex, setSpeechIndex] = useState(0);
  const [speechVisible, setSpeechVisible] = useState(false);
  const [speechText, setSpeechText] = useState(SPEECHES[0]);
  const [bouncing, setBouncing] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; color: string; sx: number; sy: number; size: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const speechTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const clickCountRef = useRef(0);
  const firstVisitRef = useRef(true);
  const sparkleIdRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiPiecesRef = useRef<ConfettiPiece[]>([]);
  const animatingRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  // Left and right pupil refs
  const leftPupilRef = useRef<SVGEllipseElement>(null);
  const rightPupilRef = useRef<SVGEllipseElement>(null);
  const leftShineRef = useRef<SVGCircleElement>(null);
  const rightShineRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-show speech on first visit
  useEffect(() => {
    if (firstVisitRef.current) {
      const t = setTimeout(() => {
        showSpeech(SPEECHES[0]);
        setSpeechIndex(1);
        firstVisitRef.current = false;
      }, 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const showSpeech = useCallback((text: string) => {
    setSpeechText(text);
    setSpeechVisible(true);
    clearTimeout(speechTimerRef.current);
    speechTimerRef.current = setTimeout(() => setSpeechVisible(false), 5000);
  }, []);

  const hideSpeech = useCallback(() => {
    setSpeechVisible(false);
  }, []);

  // Eye tracking on mousemove
  useEffect(() => {
    if (!mounted) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!mascotRef.current) return;
      const rect = mascotRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const scale = rect.width / 160;

      const eyeCenters = [
        { pupil: leftPupilRef, shine: leftShineRef, cx: 66, cy: 64 },
        { pupil: rightPupilRef, shine: rightShineRef, cx: 94, cy: 64 },
      ];

      eyeCenters.forEach(({ pupil, shine, cx, cy }) => {
        const dx = (mx / scale) - cx;
        const dy = (my / scale) - cy;
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

  // Confetti system
  const launchConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    for (let i = 0; i < 80; i++) {
      confettiPiecesRef.current.push({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
        y: window.innerHeight * 0.3,
        w: 6 + Math.random() * 6,
        h: 4 + Math.random() * 4,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        vx: (Math.random() - 0.5) * 12,
        vy: -8 - Math.random() * 8,
        rot: Math.random() * 360,
        rotV: (Math.random() - 0.5) * 15,
        gravity: 0.15 + Math.random() * 0.1,
        opacity: 1,
      });
    }

    if (!animatingRef.current) {
      animatingRef.current = true;
      animateConfetti(ctx, canvas);
    }
  }, []);

  const animateConfetti = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const pieces = confettiPiecesRef.current;

    pieces.forEach((p) => {
      p.x += p.vx;
      p.vy += p.gravity;
      p.y += p.vy;
      p.rot += p.rotV;
      p.vx *= 0.99;
      if (p.y > canvas.height - 50) p.opacity -= 0.02;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    confettiPiecesRef.current = pieces.filter((p) => p.opacity > 0 && p.y < canvas.height + 50);

    if (confettiPiecesRef.current.length > 0) {
      requestAnimationFrame(() => animateConfetti(ctx, canvas));
    } else {
      animatingRef.current = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  // Resize canvas
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [mounted]);

  const createSparkles = useCallback((e: React.MouseEvent) => {
    const rect = mascotRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const colors = ["#0a7c42", "#f5a623", "#12b85e", "#0d9650", "#ffd700"];
    const newSparkles: typeof sparkles = [];

    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const dist = 40 + Math.random() * 40;
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
    }, 600);
  }, []);

  const handleMascotClick = useCallback((e: React.MouseEvent) => {
    // Bounce
    setBouncing(true);
    setTimeout(() => setBouncing(false), 600);

    // Sparkles
    createSparkles(e);

    // Speech
    showSpeech(SPEECHES[speechIndex]);
    const nextIndex = (speechIndex + 1) % SPEECHES.length;
    setSpeechIndex(nextIndex);

    // Confetti every 5th click
    clickCountRef.current += 1;
    if (clickCountRef.current % 5 === 0) {
      launchConfetti();
    }
  }, [speechIndex, showSpeech, createSparkles, launchConfetti]);

  return (
    <section className="relative z-10 -mt-10 pb-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative flex min-h-[300px] items-end justify-center" ref={containerRef}>
          {/* Floating particles */}
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            {[
              { left: "30%", top: "20%", size: "size-2", bg: "bg-landing-green", delay: "0s" },
              { left: "65%", top: "30%", size: "size-1.5", bg: "bg-landing-amber", delay: "0.8s" },
              { left: "20%", top: "60%", size: "size-2.5", bg: "bg-landing-green-bright", delay: "1.6s" },
              { left: "75%", top: "55%", size: "size-[5px]", bg: "bg-landing-amber", delay: "2.4s" },
              { left: "45%", top: "15%", size: "size-[7px]", bg: "bg-landing-green", delay: "3.2s" },
            ].map((p, i) => (
              <div
                key={i}
                className={`absolute rounded-full ${p.size} ${p.bg} animate-particle`}
                style={{ left: p.left, top: p.top, animationDelay: p.delay }}
              />
            ))}
          </div>

          {/* Speech bubble */}
          {speechVisible && (
            <div
              className="absolute bottom-[130px] left-1/2 z-20 max-w-[280px] min-w-[220px] -translate-x-1/2 rounded-2xl border border-landing-border bg-landing-card px-5 py-3.5 shadow-lg"
              style={{
                animation: "none",
                transform: "translateX(-50%) scale(1)",
                opacity: 1,
              }}
            >
              <p className="text-center text-sm leading-relaxed text-landing-text">
                {speechText}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); hideSpeech(); }}
                className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full border border-landing-border bg-landing-card text-[11px] text-landing-text-mid transition-colors hover:bg-gray-100"
                aria-label="Close speech"
              >
                ×
              </button>
              {/* Arrow */}
              <div
                className="absolute -bottom-[7px] left-1/2 size-3.5 -translate-x-1/2 rotate-45 border-b border-r border-landing-border bg-landing-card"
              />
            </div>
          )}

          {/* Mascot SVG */}
          <div
            ref={mascotRef}
            onClick={handleMascotClick}
            className={`relative cursor-pointer transition-transform duration-300 ${bouncing ? "scale-110" : "hover:scale-105"}`}
            style={{ touchAction: "manipulation" }}
          >
            <svg
              className="size-[120px] drop-shadow-lg sm:size-[140px] md:size-[160px]"
              viewBox="0 0 160 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Body group */}
              <g className={mounted ? "animate-mascot-float" : ""}>
                {/* Main body */}
                <ellipse cx="80" cy="135" rx="52" ry="55" fill="#0a7c42" />
                {/* Belly */}
                <ellipse cx="80" cy="145" rx="36" ry="38" fill="#0d9650" />
                {/* Belly highlight */}
                <ellipse cx="80" cy="138" rx="24" ry="22" fill="#12b85e" opacity="0.4" />
                {/* Left arm */}
                <ellipse cx="32" cy="128" rx="16" ry="10" fill="#0a7c42" transform="rotate(-20 32 128)" />
                {/* Right arm (waving) */}
                <g className={mounted ? "animate-mascot-wave" : ""}>
                  <ellipse cx="128" cy="115" rx="16" ry="10" fill="#0a7c42" transform="rotate(25 128 115)" />
                  <circle cx="142" cy="108" r="9" fill="#0d9650" />
                </g>
                {/* Feet */}
                <ellipse cx="58" cy="186" rx="18" ry="8" fill="#065c30" />
                <ellipse cx="102" cy="186" rx="18" ry="8" fill="#065c30" />
                {/* Head */}
                <circle cx="80" cy="68" r="40" fill="#0a7c42" />
                <circle cx="80" cy="72" r="32" fill="#0d9650" />
                {/* Eyes */}
                <g className={mounted ? "animate-mascot-blinking" : ""}>
                  <ellipse cx="66" cy="64" rx="12" ry="13" fill="white" />
                  <ellipse ref={leftPupilRef} cx="68" cy="65" rx="6" ry="7" fill="#1a1d23" />
                  <circle ref={leftShineRef} cx="71" cy="61" r="3" fill="white" />
                  <ellipse cx="94" cy="64" rx="12" ry="13" fill="white" />
                  <ellipse ref={rightPupilRef} cx="92" cy="65" rx="6" ry="7" fill="#1a1d23" />
                  <circle ref={rightShineRef} cx="95" cy="61" r="3" fill="white" />
                </g>
                {/* Smile */}
                <path d="M68 80 Q80 92 92 80" stroke="#065c30" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                {/* Cheeks */}
                <ellipse cx="56" cy="78" rx="7" ry="4" fill="#f5a623" opacity="0.35" />
                <ellipse cx="104" cy="78" rx="7" ry="4" fill="#f5a623" opacity="0.35" />
                {/* Leaf cap */}
                <path d="M80 28 Q60 10 45 30 Q55 18 80 28Z" fill="#12b85e" />
                <path d="M80 28 Q100 10 115 30 Q105 18 80 28Z" fill="#0d9650" />
                <circle cx="80" cy="26" r="4" fill="#f5a623" />
              </g>
            </svg>
            <div className="mx-auto mt-2 size-[100px] animate-shadow-pulse rounded-full bg-black/10 md:size-[80px]" />
          </div>

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
      </div>

      {/* Confetti canvas */}
      <canvas
        ref={canvasRef}
        id="confetti-canvas"
        className="pointer-events-none fixed inset-0 z-[9999]"
      />
    </section>
  );
}
