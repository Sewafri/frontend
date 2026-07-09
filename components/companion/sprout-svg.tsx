import { cn } from "@/lib/utils";

export type SproutVariant =
  | "idle"
  | "happy"
  | "thinking"
  | "celebrating"
  | "waving"
  | "sympathetic";

interface SproutSvgProps {
  variant?: SproutVariant;
  size?: "sm" | "md" | "default" | "lg" | "xl" | "xxl" | "xxxl";
  className?: string;
  glow?: boolean;
}

const SIZE_MAP: Record<string, number> = {
  sm: 32, md: 48, default: 64, lg: 80, xl: 112, xxl: 144, xxxl: 192,
};

const BLUSH_OPACITY: Record<SproutVariant, number> = {
  idle: 0.55, happy: 0.7, thinking: 0.35, celebrating: 0.6,
  waving: 0.65, sympathetic: 0.4,
};

/* ── Arm (shoulder + hand) rotation ── */
function armTransform(variant: SproutVariant, side: "left" | "right"): string {
  const cx = side === "left" ? 16 : 64;
  const cy = 46;
  const sign = side === "right" ? -1 : 1;
  const deg: Record<SproutVariant, number> = {
    idle: 10, happy: 28, thinking: 5, celebrating: 55,
    waving: -35, sympathetic: -5,
  };
  return `rotate(${deg[variant] * sign} ${cx} ${cy})`;
}

/* ── Leaf hair-tuft transform ── */
function leafTransform(variant: SproutVariant): string {
  const map: Record<SproutVariant, string> = {
    idle: "rotate(-4 40 7)",
    happy: "rotate(-16 40 7)",
    thinking: "rotate(32 40 7)",
    celebrating: "rotate(-26 40 7)",
    waving: "rotate(-12 40 7)",
    sympathetic: "rotate(-2 40 7)",
  };
  return map[variant];
}

/* ── Eye shapes ── */
function eyeShape(
  variant: SproutVariant,
  side: "left" | "right",
): { path: string; hasPupil: boolean } | null {
  const cx = side === "left" ? 33 : 47;
  switch (variant) {
    case "celebrating":
      return null;
    case "happy":
      return {
        path: `M${cx - 6} 40 Q${cx} 34 ${cx + 6} 40`,
        hasPupil: false,
      };
    case "thinking":
      if (side === "left") {
        return {
          path: `M${cx - 6} 40 Q${cx} 35 ${cx + 6} 40`,
          hasPupil: false,
        };
      }
      return {
        path: `M${cx - 6} 38 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0`,
        hasPupil: true,
      };
    case "sympathetic":
      return {
        path: `M${cx - 5} 41 Q${cx} 39 ${cx + 5} 41`,
        hasPupil: false,
      };
    default:
      return {
        path: `M${cx - 6} 40 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0`,
        hasPupil: true,
      };
  }
}

/* ── Mouth paths ── */
function mouthPath(variant: SproutVariant): string | null {
  switch (variant) {
    case "happy":
    case "waving":
      return "M35 50 Q40 54.5 45 50";
    case "thinking":
      return "M37 51 Q40 53 43 51";
    case "celebrating":
      return "M34 49 Q40 57 46 49";
    case "sympathetic":
      return "M36 51 Q40 52.5 44 51";
    default:
      return "M36 50.5 Q40 53 44 50.5";
  }
}

/* ── Star eye for celebrating ── */
function StarEye({ cx, cy }: { cx: number; cy: number }) {
  const s = 3.5;
  return (
    <g>
      <path
        d={`M${cx} ${cy - s} L${cx + s * 0.4} ${cy - s * 0.3} L${cx + s} ${cy} L${cx + s * 0.4} ${cy + s * 0.3} L${cx} ${cy + s} L${cx - s * 0.4} ${cy + s * 0.3} L${cx - s} ${cy} L${cx - s * 0.4} ${cy - s * 0.3} Z`}
        fill="#2563eb"
      />
      <circle cx={cx + 1.2} cy={cy - 1.2} r={1.2} fill="white" opacity={0.8} />
    </g>
  );
}

/* ── Eye renderer ── */
function EyeRenderer({ variant, side }: { variant: SproutVariant; side: "left" | "right" }) {
  const cx = side === "left" ? 33 : 47;
  if (variant === "celebrating") return <StarEye cx={cx} cy={40} />;

  const eye = eyeShape(variant, side);
  if (!eye) return null;

  return (
    <g>
      <path d={eye.path} fill="#784d3a" />
      {eye.hasPupil && (
        <>
          <circle cx={cx + 2} cy={38} r={1.8} fill="white" opacity={0.9} />
          <circle cx={cx - 1.2} cy={41.8} r={0.7} fill="white" opacity={0.4} />
        </>
      )}
    </g>
  );
}

export default function SproutSvg({
  variant = "idle",
  size = "default",
  className,
  glow = false,
}: SproutSvgProps) {
  const px = SIZE_MAP[size];
  const h = Math.round(px * 1.25);

  return (
    <svg
      width={px}
      height={h}
      viewBox="0 0 80 100"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="spr-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#16a34a" stopOpacity="0.18" />
          <stop offset="60%" stopColor="#16a34a" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="spr-body" x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#facc15" />
        </linearGradient>
        <linearGradient id="spr-backpack" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c4a882" />
          <stop offset="100%" stopColor="#b89b72" />
        </linearGradient>
      </defs>

      {/* ── Glow ── */}
      {glow && <circle cx="40" cy="46" r="42" fill="url(#spr-glow)" />}

      {/* ── Shadow layers ── */}
      <ellipse cx="40" cy="96" rx="24" ry="6" fill="var(--color-text-tertiary)" opacity="0.08" />
      <ellipse cx="40" cy="95" rx="18" ry="4.5" fill="var(--color-text-tertiary)" opacity="0.12" />
      <ellipse cx="40" cy="94" rx="12" ry="3" fill="var(--color-text-tertiary)" opacity="0.15" />

      {/* ── Backpack ── */}
      <g>
        <path
          d="M52 22 Q62 18 64 26 Q66 34 58 38 Q50 36 50 30 Z"
          fill="url(#spr-backpack)"
          stroke="#a68b6e"
          strokeWidth="1"
        />
        <path
          d="M53 24 Q60 21 62 26 Q64 30 58 33 Q52 32 52 27 Z"
          fill="#d4c4a8"
          stroke="#a68b6e"
          strokeWidth="0.6"
        />
        <rect x="56" y="25" width="3" height="2.5" rx="0.8" fill="#f59e0b" />
      </g>

      {/* ── Backpack (mirrored to left) ── */}
      <g>
        <path
          d="M28 22 Q18 18 16 26 Q14 34 22 38 Q30 36 30 30 Z"
          fill="url(#spr-backpack)"
          stroke="#a68b6e"
          strokeWidth="1"
        />
        <path
          d="M27 24 Q20 21 18 26 Q16 30 22 33 Q28 32 28 27 Z"
          fill="#d4c4a8"
          stroke="#a68b6e"
          strokeWidth="0.6"
        />
        <rect x="21" y="25" width="3" height="2.5" rx="0.8" fill="#f59e0b" />
      </g>

      {/* ── Legs + shoes ── */}
      <rect x="30" y="72" width="8" height="14" rx="4" fill="url(#spr-body)" stroke="#eab308" strokeWidth="1" />
      <rect x="42" y="72" width="8" height="14" rx="4" fill="url(#spr-body)" stroke="#eab308" strokeWidth="1" />
      <ellipse cx="33" cy="87" rx="7" ry="3.5" fill="#c4a882" stroke="#a68b6e" strokeWidth="0.8" />
      <ellipse cx="47" cy="87" rx="7" ry="3.5" fill="#c4a882" stroke="#a68b6e" strokeWidth="0.8" />

      {/* ── Arms + hands ── */}
      <g transform={armTransform(variant, "left")}>
        <ellipse cx="15" cy="46" rx="4" ry="7" fill="url(#spr-body)" stroke="#eab308" strokeWidth="1" />
        <ellipse cx="13" cy="53" rx="4" ry="3.5" fill="url(#spr-body)" stroke="#eab308" strokeWidth="1" />
      </g>
      <g transform={armTransform(variant, "right")}>
        <ellipse cx="65" cy="46" rx="4" ry="7" fill="url(#spr-body)" stroke="#eab308" strokeWidth="1" />
        <ellipse cx="67" cy="53" rx="4" ry="3.5" fill="url(#spr-body)" stroke="#eab308" strokeWidth="1" />
      </g>

      {/* ── Pill body (cylindrical, rounded top/bottom) ── */}
      <path
        d="M40 14 C26 14 20 20 20 30 L20 52 C20 64 26 72 40 72 C54 72 60 64 60 52 L60 30 C60 20 54 14 40 14 Z"
        fill="url(#spr-body)"
        stroke="#eab308"
        strokeWidth="1.5"
      />

      {/* ── Scarf (drape mirrored to left) ── */}
      <g>
        <path
          d="M24 30 Q40 26 56 30 Q60 34 56 38 Q40 34 24 38 Q20 34 24 30 Z"
          fill="#16a34a"
          stroke="#15803d"
          strokeWidth="0.8"
        />
        <path
          d="M25 32 Q40 28 55 32"
          stroke="#15803d"
          strokeWidth="0.6"
          fill="none"
          opacity="0.3"
        />
        <path
          d="M25 31 Q22 34 24 44"
          stroke="#16a34a"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M24 33 L25 42"
          stroke="#15803d"
          strokeWidth="0.6"
          fill="none"
          opacity="0.3"
        />
        <ellipse cx="24" cy="44" rx="2" ry="1.5" fill="#16a34a" />
      </g>

      {/* ── Blush ── */}
      <g opacity={BLUSH_OPACITY[variant]}>
        <ellipse cx="28" cy="44" rx="4.5" ry="2.5" fill="#fca5a5" />
        <ellipse cx="52" cy="44" rx="4.5" ry="2.5" fill="#fca5a5" />
      </g>

      {/* ── Leaf hair-tuft ── */}
      <g transform={leafTransform(variant)}>
        <path d="M40 14V7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M40 7 C37 3.5 38 0.5 50 1.5 C54 3.5 52 9 40 7 Z" fill="#16a34a" />
        <path d="M40 7 Q44 4 50 1.5" stroke="#15803d" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.5" />
        <path d="M42 5.5 L39 5" stroke="#15803d" strokeWidth="0.5" strokeLinecap="round" fill="none" opacity="0.4" />
        <path d="M42 5.5 L44.5 4.5" stroke="#15803d" strokeWidth="0.5" strokeLinecap="round" fill="none" opacity="0.4" />
        <path d="M44 4 L41.5 3.5" stroke="#15803d" strokeWidth="0.5" strokeLinecap="round" fill="none" opacity="0.4" />
        <path d="M44 4 L46.5 3" stroke="#15803d" strokeWidth="0.5" strokeLinecap="round" fill="none" opacity="0.4" />
      </g>

      {/* ── Eyes ── */}
      {variant === "celebrating" ? (
        <>
          <StarEye cx={33} cy={40} />
          <StarEye cx={47} cy={40} />
        </>
      ) : (
        <>
          <EyeRenderer variant={variant} side="left" />
          <EyeRenderer variant={variant} side="right" />
        </>
      )}

      {/* ── Mouth ── */}
      {mouthPath(variant) && (
        <path
          d={mouthPath(variant)!}
          stroke="#a16207"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}
