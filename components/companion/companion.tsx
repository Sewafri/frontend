"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import SproutSvg from "./sprout-svg";
import type { SproutVariant } from "./sprout-svg";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useCursorTracking } from "@/hooks/use-cursor-tracking";
import { cn } from "@/lib/utils";

type AnimationIntensity = "low" | "normal" | "high";

interface CompanionProps {
  message: string;
  variant?: SproutVariant;
  size?: "sm" | "md" | "default" | "lg" | "xl" | "xxl" | "xxxl";
  bubblePosition?: "left" | "right" | "top";
  className?: string;
  animate?: boolean;
  glow?: boolean;
  intensity?: AnimationIntensity;
  interactive?: boolean;
  onBubbleClick?: () => void;
}

const GAP: Record<string, string> = {
  sm: "gap-2", md: "gap-2.5", default: "gap-3", lg: "gap-4",
  xl: "gap-5", xxl: "gap-6", xxxl: "gap-8",
};

const BUBBLE_PAD: Record<string, string> = {
  sm: "px-3 py-1.5", md: "px-3.5 py-2", default: "px-4 py-2.5", lg: "px-5 py-3",
  xl: "px-6 py-3.5", xxl: "px-7 py-4", xxxl: "px-8 py-5",
};

const BUBBLE_SIZE: Record<string, string> = {
  sm: "text-xs", md: "text-xs", default: "text-sm", lg: "text-sm",
  xl: "text-base", xxl: "text-lg", xxxl: "text-xl",
};

/* ── Intensity multiplier ── */
function intensityFactor(intensity: AnimationIntensity): number {
  switch (intensity) {
    case "high": return 1.4;
    case "low": return 0.5;
    default: return 1;
  }
}

type Keyframes = {
  scaleX: number[];
  scaleY: number[];
};

/* ── Squash keyframes (scale-only; rotate handled by cursor tilt) ── */
function squashKeyframes(variant: SproutVariant, int: AnimationIntensity): Keyframes {
  const f = intensityFactor(int);
  switch (variant) {
    case "celebrating":
      return {
        scaleX: [1, 1 + 0.14 * f, 1 - 0.14 * f, 1 + 0.08 * f, 1 - 0.04 * f, 1],
        scaleY: [1, 1 - 0.14 * f, 1 + 0.16 * f, 1 - 0.06 * f, 1 + 0.04 * f, 1],
      };
    case "happy":
    case "waving":
      return {
        scaleX: [1, 1 - 0.04 * f, 1 + 0.04 * f, 1 - 0.03 * f, 1],
        scaleY: [1, 1 + 0.05 * f, 1 - 0.05 * f, 1 + 0.03 * f, 1],
      };
    case "sympathetic":
      return {
        scaleX: [1, 1 + 0.01 * f, 1 - 0.01 * f, 1],
        scaleY: [1, 1 - 0.01 * f, 1 + 0.01 * f, 1],
      };
    default:
      return {
        scaleX: [1, 1 - 0.03 * f, 1],
        scaleY: [1, 1 + 0.04 * f, 1],
      };
  }
}

function squashDuration(variant: SproutVariant, int: AnimationIntensity): number {
  const base: Record<SproutVariant, number> = {
    celebrating: 1.2, happy: 1.8, waving: 1.8, sympathetic: 3.5,
    idle: 3, thinking: 3,
  };
  const speed = int === "high" ? 0.75 : int === "low" ? 1.5 : 1;
  return base[variant] * speed;
}

/* ── Click easter-egg messages ── */
const EASTER_EGGS = [
  "You found me! 👋",
  "Boop!",
  "Hey hey!",
  "*happy wiggle*",
  "Let's learn something!",
];

function randomEgg(exclude?: string): string {
  const pool = EASTER_EGGS.filter((m) => m !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

/* ── Tail ── */
function Tail({ position }: { position: "left" | "right" | "top" }) {
  const posClass =
    position === "left"
      ? "right-0 top-1/2 -translate-y-1/2 translate-x-[3px] border-l-0 border-b-0"
      : position === "right"
        ? "left-0 top-1/2 -translate-y-1/2 -translate-x-[3px] border-r-0 border-t-0"
        : "bottom-0 left-1/2 -translate-x-1/2 translate-y-[3px] border-l-0 border-t-0";

  return (
    <div
      className={cn(
        "absolute h-2 w-2 rotate-45 border border-border-default bg-surface-card",
        posClass,
      )}
    />
  );
}

export default function Companion({
  message,
  variant = "idle",
  size = "default",
  bubblePosition = "left",
  className,
  animate = true,
  glow = false,
  intensity = "normal",
  interactive = false,
  onBubbleClick,
}: CompanionProps) {
  const reduced = useReducedMotion();
  const shouldAnimate = animate && !reduced;
  const isCelebrating = variant === "celebrating";

  /* ── Cursor tracking ── */
  const cursor = useCursorTracking({ enabled: interactive && shouldAnimate, maxTilt: 3 });

  /* ── Hover / click state ── */
  const [hovered, setHovered] = useState(false);
  const [eggMessage, setEggMessage] = useState<string | null>(null);
  const eggTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const displayVariant: SproutVariant = hovered ? "happy" : variant;
  const kf = squashKeyframes(displayVariant, intensity);
  const dur = squashDuration(displayVariant, intensity);

  function handleCharacterClick() {
    if (!interactive || !shouldAnimate) return;
    cursor.handleTap();
    setEggMessage(randomEgg(eggMessage ?? undefined));
    setHovered(true);
    clearTimeout(eggTimeoutRef.current);
    eggTimeoutRef.current = setTimeout(() => {
      setEggMessage(null);
      setHovered(false);
    }, 2000);
  }

  function handleCharacterHoverStart() {
    if (!interactive || !shouldAnimate) return;
    setHovered(true);
  }

  function handleCharacterHoverEnd() {
    if (!interactive) return;
    if (!eggMessage) setHovered(false);
  }

  return (
    <div
      ref={cursor.ref}
      className={cn(
        bubblePosition === "top" ? "flex flex-col items-center" : "flex items-start",
        bubblePosition === "right" ? "flex-row" : "flex-row-reverse",
        GAP[size],
        className,
      )}
      onMouseMove={interactive ? cursor.handleMouseMove : undefined}
      onMouseLeave={interactive ? cursor.handleMouseLeave : undefined}
    >
      {/* ── Character (two layers: outer = entrance + tilt, inner = squash) ── */}
      <motion.div
        onClick={interactive ? handleCharacterClick : undefined}
        onMouseEnter={interactive ? handleCharacterHoverStart : undefined}
        onMouseLeave={interactive && !eggMessage ? handleCharacterHoverEnd : undefined}
        initial={isCelebrating && shouldAnimate ? { scale: 0 } : false}
        animate={{ scale: 1, rotate: cursor.tiltX, x: cursor.tiltY * 0.5 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        whileTap={interactive && shouldAnimate ? { scale: 0.9, transition: { duration: 0.1 } } : undefined}
        className={cn("shrink-0", interactive && "cursor-pointer")}
      >
        <motion.div
          animate={shouldAnimate ? { scaleX: kf.scaleX, scaleY: kf.scaleY } : {}}
          transition={shouldAnimate ? { duration: dur, ease: "easeInOut", repeat: Infinity } : {}}
        >
          <SproutSvg variant={displayVariant} size={size} glow={glow} />
        </motion.div>
      </motion.div>

      {/* ── Speech bubble ── */}
      <div className="relative">
        <Tail position={bubblePosition} />
        <div
          onClick={onBubbleClick}
          className={cn(
            "relative rounded-xl border border-border-default bg-surface-card",
            BUBBLE_PAD[size],
            BUBBLE_SIZE[size],
            "text-text-primary",
            (onBubbleClick || interactive) && "cursor-pointer transition-colors hover:bg-surface-hover",
          )}
        >
          {eggMessage ?? message}
        </div>
      </div>
    </div>
  );
}
