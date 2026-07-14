"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: "rect" | "circle" | "star";
}

const COLORS = [
  "#0a7c42",
  "#f5a623",
  "#ff6b6b",
  "#12b85e",
  "#0d9650",
  "#ffd700",
  "#4ecdc4",
  "#45b7d1",
];

const SHAPES: ("rect" | "circle" | "star")[] = ["rect", "circle", "star"];

export function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Spawn particles
    const count = 120;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      size: 4 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      opacity: 0.8 + Math.random() * 0.2,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    }));

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      particlesRef.current.forEach((p) => {
        if (p.y > canvas.height + 20 || p.opacity <= 0) return;
        alive = true;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.0008;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(p.opacity, 0);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 4;

        const s = p.size;
        if (p.shape === "rect") {
          ctx.fillRect(-s / 2, -s / 4, s, s / 2);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "star") {
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const r = i % 2 === 0 ? s / 2 : s / 4;
            ctx[i === 0 ? "moveTo" : "lineTo"](Math.cos(angle) * r, Math.sin(angle) * r);
          }
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      });

      if (alive) {
        animFrameRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden
    />
  );
}
