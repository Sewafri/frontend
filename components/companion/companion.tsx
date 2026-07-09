"use client";

import { useRef, useState, useEffect, useCallback } from "react";
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

/* ── Intensity ── */
function intensityFactor(intensity: AnimationIntensity): number {
  switch (intensity) {
    case "high": return 1.4;
    case "low": return 0.5;
    default: return 1;
  }
}

type Keyframes = { scaleX: number[]; scaleY: number[] };

function squashKeyframes(variant: SproutVariant, int: AnimationIntensity): Keyframes {
  const f = intensityFactor(int);
  switch (variant) {
    case "celebrating":
    case "excited":
      return {
        scaleX: [1, 1 + 0.14 * f, 1 - 0.14 * f, 1 + 0.08 * f, 1 - 0.04 * f, 1],
        scaleY: [1, 1 - 0.14 * f, 1 + 0.16 * f, 1 - 0.06 * f, 1 + 0.04 * f, 1],
      };
    case "happy":
    case "waving":
    case "laughing":
      return {
        scaleX: [1, 1 - 0.04 * f, 1 + 0.04 * f, 1 - 0.03 * f, 1],
        scaleY: [1, 1 + 0.05 * f, 1 - 0.05 * f, 1 + 0.03 * f, 1],
      };
    case "eating":
      return {
        scaleX: [1, 1 - 0.02 * f, 1 + 0.03 * f, 1 - 0.01 * f, 1],
        scaleY: [1, 1 + 0.02 * f, 1 - 0.03 * f, 1 + 0.01 * f, 1],
      };
    case "sleepy":
      return {
        scaleX: [1, 1 + 0.02 * f, 1 - 0.01 * f, 1],
        scaleY: [1, 1 - 0.03 * f, 1 + 0.01 * f, 1],
      };
    case "sympathetic":
      return {
        scaleX: [1, 1 + 0.01 * f, 1 - 0.01 * f, 1],
        scaleY: [1, 1 - 0.01 * f, 1 + 0.01 * f, 1],
      };
    case "surprised":
      return {
        scaleX: [1, 1 + 0.06 * f, 1, 1 + 0.03 * f, 1],
        scaleY: [1, 1 - 0.06 * f, 1, 1 - 0.03 * f, 1],
      };
    case "confused":
      return {
        scaleX: [1, 1 + 0.03 * f, 1 - 0.03 * f, 1 + 0.02 * f, 1],
        scaleY: [1, 1 - 0.02 * f, 1 + 0.02 * f, 1 - 0.01 * f, 1],
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
    idle: 3, thinking: 3, eating: 2, laughing: 1.5, sleepy: 4,
    surprised: 2.5, excited: 1.2, confused: 3,
  };
  const speed = int === "high" ? 0.75 : int === "low" ? 1.5 : 1;
  return base[variant] * speed;
}

/* ── Click easter-egg actions ── */
type ActionKey = "eat" | "laugh" | "yawn" | "boop" | "confuse";

interface EggAction {
  key: ActionKey;
  variant: SproutVariant;
  message: string;
  duration: number;
}

const EGG_ACTIONS: EggAction[] = [
  { key: "eat", variant: "eating", message: "Mmm! *nom nom*", duration: 2800 },
  { key: "laugh", variant: "laughing", message: "BWAHAHA! *wheeze*", duration: 2200 },
  { key: "yawn", variant: "sleepy", message: "*yaaaaawn* so sleepy...", duration: 2500 },
  { key: "boop", variant: "surprised", message: "BLORP! You got me!", duration: 2000 },
  { key: "confuse", variant: "confused", message: "Wait... wha?", duration: 2200 },
];

function randomAction(exclude?: ActionKey): EggAction {
  const pool = EGG_ACTIONS.filter((a) => a.key !== exclude);
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

/* ── Random integer helper ── */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

  /* ── Blinking (random interval) ── */
  const [blinking, setBlinking] = useState(false);
  const blinkTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const scheduleBlink = useCallback(() => {
    const next = randInt(2000, 5000);
    blinkTimerRef.current = setTimeout(() => {
      setBlinking(true);
      setTimeout(() => {
        setBlinking(false);
        scheduleBlink();
      }, 180);
    }, next);
  }, []);

  useEffect(() => {
    if (!shouldAnimate) return;
    scheduleBlink();
    return () => clearTimeout(blinkTimerRef.current);
  }, [shouldAnimate, scheduleBlink]);

  /* ── Eye darting (random offset, random interval) ── */
  const [eyeOffsetX, setEyeOffsetX] = useState(0);
  const eyeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const scheduleEyeDart = useCallback(() => {
    const next = randInt(3000, 6000);
    eyeTimerRef.current = setTimeout(() => {
      setEyeOffsetX([-1.5, -1, 0, 0, 1, 1.5][randInt(0, 5)]);
      setTimeout(scheduleEyeDart, 400);
    }, next);
  }, []);

  useEffect(() => {
    if (!shouldAnimate) return;
    scheduleEyeDart();
    return () => clearTimeout(eyeTimerRef.current);
  }, [shouldAnimate, scheduleEyeDart]);

  /* ── Hover / click action state ── */
  const [hovered, setHovered] = useState(false);
  const [action, setAction] = useState<EggAction | null>(null);
  const actionTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const displayVariant: SproutVariant = action ? action.variant : hovered ? "happy" : variant;
  const kf = squashKeyframes(displayVariant, intensity);
  const dur = squashDuration(displayVariant, intensity);

  /* ── Eating chew animation ── */
  const [chew, setChew] = useState(false);
  const chewTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!action || action.key !== "eat") {
      setChew(false);
      clearTimeout(chewTimerRef.current);
      return;
    }
    const cycle = () => {
      setChew((c) => !c);
      chewTimerRef.current = setTimeout(cycle, 350);
    };
    const start = setTimeout(cycle, 600);
    return () => {
      clearTimeout(start);
      clearTimeout(chewTimerRef.current);
    };
  }, [action]);

  const eatVariant: SproutVariant = action?.key === "eat" ? (chew ? "happy" : "eating") : displayVariant;

  function handleCharacterClick() {
    if (!interactive || !shouldAnimate) return;
    cursor.handleTap();
    const egg = randomAction(action?.key);
    setAction(egg);
    clearTimeout(actionTimeoutRef.current);
    actionTimeoutRef.current = setTimeout(() => {
      setAction(null);
      setChew(false);
    }, egg.duration);
  }

  function handleCharacterHoverStart() {
    if (!interactive || !shouldAnimate) return;
    setHovered(true);
  }

  function handleCharacterHoverEnd() {
    if (!interactive) return;
    if (!action) setHovered(false);
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
      {/* ── Character ── */}
      <motion.div
        onClick={interactive ? handleCharacterClick : undefined}
        onMouseEnter={interactive ? handleCharacterHoverStart : undefined}
        onMouseLeave={interactive && !action ? handleCharacterHoverEnd : undefined}
        initial={isCelebrating && shouldAnimate ? { scale: 0 } : false}
        animate={{
          scale: 1,
          rotate: cursor.tiltX,
          x: cursor.tiltY * 0.5,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        whileTap={interactive && shouldAnimate ? { scale: 0.9, transition: { duration: 0.1 } } : undefined}
        className={cn("shrink-0", interactive && "cursor-pointer")}
      >
        <motion.div
          animate={shouldAnimate ? { scaleX: kf.scaleX, scaleY: kf.scaleY } : {}}
          transition={shouldAnimate ? { duration: dur, ease: "easeInOut", repeat: Infinity } : {}}
        >
          <SproutSvg
            variant={action?.key === "eat" ? eatVariant : displayVariant}
            size={size}
            glow={glow}
            blinking={blinking}
            eyeOffsetX={eyeOffsetX}
          />
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
          {action ? action.message : message}
        </div>
      </div>
    </div>
  );
}
