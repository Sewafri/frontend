import { cn } from "@/lib/utils";

export type SproutVariant =
  | "idle"
  | "happy"
  | "thinking"
  | "celebrating"
  | "waving"
  | "sympathetic"
  | "eating"
  | "laughing"
  | "sleepy"
  | "surprised"
  | "excited"
  | "confused"
  | "playing"
  | "scrolling";

export type Tone =
  | "original"
  | "mint"
  | "coral"
  | "sky"
  | "lavender"
  | "rose";

interface SproutSvgProps {
  variant?: SproutVariant;
  size?: "sm" | "md" | "default" | "lg" | "xl" | "xxl" | "xxxl";
  className?: string;
  glow?: boolean;
  blinking?: boolean;
  eyeOffsetX?: number;
  tone?: Tone;
  gradientId?: string;
}

const SIZE_MAP: Record<string, number> = {
  sm: 32, md: 48, default: 64, lg: 80, xl: 112, xxl: 144, xxxl: 192,
};

const BLUSH_OPACITY: Record<SproutVariant, number> = {
  idle: 0.55, happy: 0.7, thinking: 0.35, celebrating: 0.6,
  waving: 0.65, sympathetic: 0.4,
  eating: 0.6, laughing: 0.8, sleepy: 0.25, surprised: 0.45,
  excited: 0.7, confused: 0.35,
  playing: 0.65, scrolling: 0.3,
};

type Palette = {
  body: [string, string];
  bodyStroke: string;
  scarf: [string, string];
  leaf: string;
  leafDark: string;
  backpack: [string, string];
  backpackStroke: string;
  backpackLight: string;
  blush: string;
  eyes: string;
  mouth: string;
  accent: string;
  glow: string;
};

const TONES: Record<Tone, Palette> = {
  original: {
    body: ["#e5e5e5", "#d4d4d4"],
    bodyStroke: "#a3a3a3",
    scarf: ["#fafafa", "#f5f5f5"],
    leaf: "#fafafa",
    leafDark: "#e5e5e5",
    backpack: ["#d4d4d4", "#a3a3a3"],
    backpackStroke: "#737373",
    backpackLight: "#e5e5e5",
    blush: "#d4d4d4",
    eyes: "#404040",
    mouth: "#404040",
    accent: "#525252",
    glow: "#525252",
  },
  mint: {
    body: ["#e5e5e5", "#d4d4d4"],
    bodyStroke: "#a3a3a3",
    scarf: ["#f5f5f5", "#e5e5e5"],
    leaf: "#f5f5f5",
    leafDark: "#d4d4d4",
    backpack: ["#d4d4d4", "#a3a3a3"],
    backpackStroke: "#737373",
    backpackLight: "#e5e5e5",
    blush: "#d4d4d4",
    eyes: "#404040",
    mouth: "#404040",
    accent: "#525252",
    glow: "#525252",
  },
  coral: {
    body: ["#d4d4d4", "#a3a3a3"],
    bodyStroke: "#737373",
    scarf: ["#fafafa", "#f5f5f5"],
    leaf: "#fafafa",
    leafDark: "#e5e5e5",
    backpack: ["#a3a3a3", "#737373"],
    backpackStroke: "#525252",
    backpackLight: "#d4d4d4",
    blush: "#a3a3a3",
    eyes: "#262626",
    mouth: "#262626",
    accent: "#404040",
    glow: "#404040",
  },
  sky: {
    body: ["#e5e5e5", "#d4d4d4"],
    bodyStroke: "#a3a3a3",
    scarf: ["#ffffff", "#fafafa"],
    leaf: "#ffffff",
    leafDark: "#e5e5e5",
    backpack: ["#d4d4d4", "#a3a3a3"],
    backpackStroke: "#737373",
    backpackLight: "#e5e5e5",
    blush: "#d4d4d4",
    eyes: "#404040",
    mouth: "#404040",
    accent: "#525252",
    glow: "#525252",
  },
  lavender: {
    body: ["#d4d4d4", "#a3a3a3"],
    bodyStroke: "#737373",
    scarf: ["#f5f5f5", "#e5e5e5"],
    leaf: "#f5f5f5",
    leafDark: "#d4d4d4",
    backpack: ["#a3a3a3", "#737373"],
    backpackStroke: "#525252",
    backpackLight: "#d4d4d4",
    blush: "#a3a3a3",
    eyes: "#262626",
    mouth: "#262626",
    accent: "#404040",
    glow: "#404040",
  },
  rose: {
    body: ["#e5e5e5", "#d4d4d4"],
    bodyStroke: "#a3a3a3",
    scarf: ["#fafafa", "#f5f5f5"],
    leaf: "#fafafa",
    leafDark: "#e5e5e5",
    backpack: ["#d4d4d4", "#a3a3a3"],
    backpackStroke: "#737373",
    backpackLight: "#e5e5e5",
    blush: "#d4d4d4",
    eyes: "#404040",
    mouth: "#404040",
    accent: "#525252",
    glow: "#525252",
  },
};

/* ── Arm rotation ── */
function armTransform(variant: SproutVariant, side: "left" | "right"): string {
  const cx = side === "left" ? 16 : 64;
  const cy = 46;
  const sign = side === "right" ? -1 : 1;

  if (variant === "eating") {
    if (side === "right") return "rotate(-30 64 46)";
    return "rotate(10 16 46)";
  }

  if (variant === "playing") {
    if (side === "left") return "rotate(50 16 46)";
    return "rotate(-15 64 46)";
  }
  if (variant === "scrolling") {
    if (side === "left") return "rotate(30 16 46)";
    return "rotate(-30 64 46)";
  }

  const deg: Record<SproutVariant, number> = {
    idle: 10, happy: 28, thinking: 5, celebrating: 55,
    waving: -35, sympathetic: -5,
    eating: 10, laughing: 35, sleepy: 0, surprised: 40,
    excited: 50, confused: -10,
    playing: 50, scrolling: 30,
  };
  return `rotate(${deg[variant] * sign} ${cx} ${cy})`;
}

/* ── Leaf hair-tuft ── */
function leafTransform(variant: SproutVariant): string {
  const map: Record<SproutVariant, string> = {
    idle: "rotate(-4 40 7)", happy: "rotate(-16 40 7)",
    thinking: "rotate(32 40 7)", celebrating: "rotate(-26 40 7)",
    waving: "rotate(-12 40 7)", sympathetic: "rotate(-2 40 7)",
    eating: "rotate(-8 40 7)", laughing: "rotate(-20 40 7)",
    sleepy: "rotate(4 40 7)", surprised: "rotate(-10 40 7)",
    excited: "rotate(-22 40 7)", confused: "rotate(24 40 7)",
    playing: "rotate(-18 40 7)", scrolling: "rotate(8 40 7)",
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
    case "excited":
      return null;

    case "playing":
    case "happy":
    case "laughing":
      return { path: `M${cx - 6} 40 Q${cx} 34 ${cx + 6} 40`, hasPupil: false };

    case "thinking":
      if (side === "left") return { path: `M${cx - 6} 40 Q${cx} 35 ${cx + 6} 40`, hasPupil: false };
      return { path: `M${cx - 6} 38 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0`, hasPupil: true };

    case "sympathetic":
      return { path: `M${cx - 5} 41 Q${cx} 39 ${cx + 5} 41`, hasPupil: false };

    case "scrolling":
      return { path: `M${cx - 6} 40 Q${cx} 41.5 ${cx + 6} 40`, hasPupil: false };

    case "sleepy":
      return {
        path: `M${cx - 6} 40 Q${cx} 43 ${cx + 6} 40`,
        hasPupil: true,
      };

    case "eating":
      return { path: `M${cx - 6} 40 Q${cx} 36 ${cx + 6} 40`, hasPupil: false };

    case "surprised":
      return {
        path: `M${cx - 7} 40 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0`,
        hasPupil: true,
      };

    case "confused":
      if (side === "left") return { path: `M${cx - 5} 40 Q${cx} 38.5 ${cx + 5} 40`, hasPupil: false };
      return { path: `M${cx - 6} 38 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0`, hasPupil: true };

    default:
      return { path: `M${cx - 6} 40 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0`, hasPupil: true };
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
    case "eating":
      return "M36 49.5 Q40 46 44 49.5";
    case "laughing":
      return "M33 48 Q40 57 47 48";
    case "sleepy":
      return "M37 51.5 Q40 53 43 51.5";
    case "surprised":
      return "M36 49 Q40 44 44 49";
    case "excited":
      return "M34 48 Q40 55 46 48";
    case "playing":
      return "M34 48 Q40 56 46 48";
    case "scrolling":
      return "M37 50.5 Q40 52 43 50.5";
    case "confused":
      return "M36 51.5 Q40 54 44 51";
    default:
      return "M36 50.5 Q40 53 44 50.5";
  }
}

/* ── Star eye (celebrating / excited) ── */
function StarEye({ cx, cy, accent }: { cx: number; cy: number; accent: string }) {
  const s = 3.5;
  return (
    <g>
      <path
        d={`M${cx} ${cy - s} L${cx + s * 0.4} ${cy - s * 0.3} L${cx + s} ${cy} L${cx + s * 0.4} ${cy + s * 0.3} L${cx} ${cy + s} L${cx - s * 0.4} ${cy + s * 0.3} L${cx - s} ${cy} L${cx - s * 0.4} ${cy - s * 0.3} Z`}
        fill={accent}
      />
      <circle cx={cx + 1.2} cy={cy - 1.2} r={1.2} fill="white" opacity={0.8} />
    </g>
  );
}

/* ── Eye renderer ── */
function EyeRenderer({
  variant, side, blinking, eyeOffsetX, eyes, accent,
}: {
  variant: SproutVariant;
  side: "left" | "right";
  blinking: boolean;
  eyeOffsetX: number;
  eyes: string;
  accent: string;
}) {
  const cx = side === "left" ? 33 : 47;
  const isStar = variant === "celebrating" || variant === "excited";

  if (isStar) return <StarEye cx={cx} cy={40} accent={accent} />;

  if (blinking) {
    return (
      <path
        d={`M${cx - 6} 40 L${cx + 6} 40`}
        stroke={eyes}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    );
  }

  const eye = eyeShape(variant, side);
  if (!eye) return null;

  return (
    <g>
      <path d={eye.path} fill={eyes} />
      {eye.hasPupil && (
        <>
          <circle cx={cx + 2 + eyeOffsetX} cy={38} r={1.8} fill="white" opacity={0.9} />
          <circle cx={cx - 1.2 + eyeOffsetX} cy={41.8} r={0.7} fill="white" opacity={0.4} />
        </>
      )}
    </g>
  );
}

/* ── Prop: tear drops ── */
function TearDrops({ accent }: { accent: string }) {
  return (
    <g>
      <path d="M26 44 Q24 49 26 51 Q28 49 26 44" fill={accent} opacity={0.6} />
      <path d="M54 44 Q52 49 54 51 Q56 49 54 44" fill={accent} opacity={0.6} />
    </g>
  );
}

/* ── Prop: Zzz ── */
function ZzzDoodles({ accent }: { accent: string }) {
  return (
    <g>
      <text x="50" y="22" fontSize="5" fill={accent} opacity={0.5} fontFamily="sans-serif" fontWeight="bold">z</text>
      <text x="54" y="18" fontSize="6" fill={accent} opacity={0.35} fontFamily="sans-serif" fontWeight="bold">z</text>
      <text x="59" y="13" fontSize="7" fill={accent} opacity={0.2} fontFamily="sans-serif" fontWeight="bold">z</text>
    </g>
  );
}

/* ── Prop: question mark ── */
function QuestionMark({ accent }: { accent: string }) {
  return (
    <g transform="translate(54, 22)">
      <path d="M0 -2 Q0 -7 4 -7 Q7 -7 7 -3 Q7 1 4 2 Q4 4 4 5" stroke={accent} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <circle cx="4" cy="7.5" r="0.8" fill={accent} />
    </g>
  );
}

/* ── Prop: ball ── */
function Ball() {
  return (
    <g transform="translate(40, 88)">
      <circle cx="0" cy="0" r="6" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.8" />
      <path d="M0 -6 L0 6M-6 0 L6 0M-4.2 -4.2 L4.2 4.2M4.2 -4.2 L-4.2 4.2" stroke="#9ca3af" strokeWidth="0.6" opacity="0.5" />
      <polygon points="0,-2 1.8,1.5 -1.8,1.5" fill="#9ca3af" opacity="0.4" />
      <polygon points="3,0 0.2,-3.5 -0.2,-3.5" fill="#9ca3af" opacity="0.3" />
      <polygon points="-3,0 -0.2,3.5 0.2,3.5" fill="#9ca3af" opacity="0.3" />
      <circle cx="-0.8" cy="-0.8" r="1.2" fill="white" opacity="0.4" />
    </g>
  );
}

/* ── Prop: cake slice ── */
function Cake() {
  return (
    <g transform="translate(40, 50)">
      <path d="M-5 0 L5 0 L7 -4 L-7 -4 Z" fill="#fca5a5" stroke="#f43f5e" strokeWidth="0.6" />
      <path d="M-7 -3 L7 -3 L6 -6 L-6 -6 Z" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.6" />
      <path d="M-6 -5 L6 -5 L4 -8 L-4 -8 Z" fill="#fbcfe8" stroke="#f472b6" strokeWidth="0.6" />
      <circle cx="2.5" cy="-7" r="1.2" fill="#ef4444" />
      <rect x="-1.5" y="-10" width="0.6" height="3" rx="0.3" fill="#fbbf24" />
      <path d="M-1.5 -10 Q0 -12 1.5 -10" stroke="#f59e0b" strokeWidth="0.5" fill="none" />
    </g>
  );
}

/* ── Prop: phone ── */
function Phone() {
  return (
    <g transform="translate(40, 48)">
      <rect x="-3.5" y="-7" width="7" height="12" rx="1.2" fill="#1f2937" stroke="#374151" strokeWidth="0.6" />
      <rect x="-2.5" y="-5.5" width="5" height="8" rx="0.5" fill="#60a5fa" />
      <rect x="-2" y="-4.5" width="4" height="3" rx="0.3" fill="#93c5fd" opacity="0.6" />
      <circle cx="0" cy="4.5" r="0.6" fill="#4b5563" />
      <circle cx="-1.2" cy="-1" r="0.3" fill="white" opacity="0.8" />
      <circle cx="1" cy="-1" r="0.3" fill="white" opacity="0.6" />
      <circle cx="-1.2" cy="0.2" r="0.3" fill="white" opacity="0.6" />
      <circle cx="1" cy="0.2" r="0.3" fill="white" opacity="0.4" />
    </g>
  );
}

/* ── Prop: sparkle ── */
function Sparkle({ cx, cy, accent }: { cx: number; cy: number; accent: string }) {
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <path
        d="M0 -4 L1 -1 L4 0 L1 1 L0 4 L-1 1 L-4 0 L-1 -1 Z"
        fill={accent}
      />
    </g>
  );
}

export default function SproutSvg({
  variant = "idle",
  size = "default",
  className,
  glow = false,
  blinking = false,
  eyeOffsetX = 0,
  tone = "original",
  gradientId = "spr",
}: SproutSvgProps) {
  const px = SIZE_MAP[size];
  const h = Math.round(px * 1.25);
  const p = TONES[tone];

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
        <radialGradient id={`${gradientId}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.glow} stopOpacity="0.18" />
          <stop offset="60%" stopColor={p.glow} stopOpacity="0.06" />
          <stop offset="100%" stopColor={p.glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${gradientId}-body`} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor={p.body[0]} />
          <stop offset="100%" stopColor={p.body[1]} />
        </linearGradient>
        <linearGradient id={`${gradientId}-backpack`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.backpack[0]} />
          <stop offset="100%" stopColor={p.backpack[1]} />
        </linearGradient>
      </defs>

      {glow && <circle cx="40" cy="46" r="42" fill={`url(#${gradientId}-glow)`} />}

      {/* ── Shadow ── */}
      <ellipse cx="40" cy="96" rx="24" ry="6" fill="var(--color-text-tertiary)" opacity="0.08" />
      <ellipse cx="40" cy="95" rx="18" ry="4.5" fill="var(--color-text-tertiary)" opacity="0.12" />
      <ellipse cx="40" cy="94" rx="12" ry="3" fill="var(--color-text-tertiary)" opacity="0.15" />

      {/* ── Backpack ── */}
      <g>
        <path d="M52 22 Q62 18 64 26 Q66 34 58 38 Q50 36 50 30 Z" fill={`url(#${gradientId}-backpack)`} stroke={p.backpackStroke} strokeWidth="1" />
        <path d="M53 24 Q60 21 62 26 Q64 30 58 33 Q52 32 52 27 Z" fill={p.backpackLight} stroke={p.backpackStroke} strokeWidth="0.6" />
        <rect x="56" y="25" width="3" height="2.5" rx="0.8" fill={p.accent} />
      </g>

      {/* ── Backpack (mirrored to left) ── */}
      <g>
        <path d="M28 22 Q18 18 16 26 Q14 34 22 38 Q30 36 30 30 Z" fill={`url(#${gradientId}-backpack)`} stroke={p.backpackStroke} strokeWidth="1" />
        <path d="M27 24 Q20 21 18 26 Q16 30 22 33 Q28 32 28 27 Z" fill={p.backpackLight} stroke={p.backpackStroke} strokeWidth="0.6" />
        <rect x="21" y="25" width="3" height="2.5" rx="0.8" fill={p.accent} />
      </g>

      {/* ── Legs + shoes ── */}
      <rect x="30" y="72" width="8" height="14" rx="4" fill={`url(#${gradientId}-body)`} stroke={p.bodyStroke} strokeWidth="1" />
      <rect x="42" y="72" width="8" height="14" rx="4" fill={`url(#${gradientId}-body)`} stroke={p.bodyStroke} strokeWidth="1" />
      <ellipse cx="33" cy="87" rx="7" ry="3.5" fill={p.backpack[0]} stroke={p.backpackStroke} strokeWidth="0.8" />
      <ellipse cx="47" cy="87" rx="7" ry="3.5" fill={p.backpack[0]} stroke={p.backpackStroke} strokeWidth="0.8" />

      {/* ── Arms + hands ── */}
      <g transform={armTransform(variant, "left")}>
        <ellipse cx="15" cy="46" rx="4" ry="7" fill={`url(#${gradientId}-body)`} stroke={p.bodyStroke} strokeWidth="1" />
        <ellipse cx="13" cy="53" rx="4" ry="3.5" fill={`url(#${gradientId}-body)`} stroke={p.bodyStroke} strokeWidth="1" />
      </g>
      <g transform={armTransform(variant, "right")}>
        <ellipse cx="65" cy="46" rx="4" ry="7" fill={`url(#${gradientId}-body)`} stroke={p.bodyStroke} strokeWidth="1" />
        <ellipse cx="67" cy="53" rx="4" ry="3.5" fill={`url(#${gradientId}-body)`} stroke={p.bodyStroke} strokeWidth="1" />
      </g>

      {/* ── Pill body ── */}
      <path
        d="M40 14 C26 14 20 20 20 30 L20 52 C20 64 26 72 40 72 C54 72 60 64 60 52 L60 30 C60 20 54 14 40 14 Z"
        fill={`url(#${gradientId}-body)`}
        stroke={p.bodyStroke}
        strokeWidth="1.5"
      />

      {/* ── Scarf ── */}
      <g>
        <path d="M24 30 Q40 26 56 30 Q60 34 56 38 Q40 34 24 38 Q20 34 24 30 Z" fill={p.scarf[0]} stroke={p.scarf[1]} strokeWidth="0.8" />
        <path d="M25 32 Q40 28 55 32" stroke={p.scarf[1]} strokeWidth="0.6" fill="none" opacity="0.3" />
        <path d="M25 31 Q22 34 24 44" stroke={p.scarf[0]} strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M24 33 L25 42" stroke={p.scarf[1]} strokeWidth="0.6" fill="none" opacity="0.3" />
        <ellipse cx="24" cy="44" rx="2" ry="1.5" fill={p.scarf[0]} />
      </g>

      {/* ── Blush ── */}
      <g opacity={BLUSH_OPACITY[variant]}>
        <ellipse cx="28" cy="44" rx="4.5" ry="2.5" fill={p.blush} />
        <ellipse cx="52" cy="44" rx="4.5" ry="2.5" fill={p.blush} />
      </g>

      {/* ── Props ── */}
      {variant === "playing" && <Ball />}
      {variant === "eating" && <Cake />}
      {variant === "laughing" && <TearDrops accent={p.accent} />}
      {variant === "sleepy" && <ZzzDoodles accent={p.accent} />}
      {variant === "confused" && <QuestionMark accent={p.accent} />}
      {variant === "scrolling" && <Phone />}
      {(variant === "excited" || variant === "celebrating") && (
        <>
          <Sparkle cx={22} cy={28} accent={p.accent} />
          <Sparkle cx={58} cy={24} accent={p.accent} />
          <Sparkle cx={18} cy={34} accent={p.accent} />
          <Sparkle cx={62} cy={30} accent={p.accent} />
        </>
      )}

      {/* ── Leaf hair-tuft ── */}
      <g transform={leafTransform(variant)}>
        <path d="M40 14V7" stroke={p.leaf} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M40 7 C37 3.5 38 0.5 50 1.5 C54 3.5 52 9 40 7 Z" fill={p.leaf} />
        <path d="M40 7 Q44 4 50 1.5" stroke={p.leafDark} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.5" />
        <path d="M42 5.5 L39 5" stroke={p.leafDark} strokeWidth="0.5" strokeLinecap="round" fill="none" opacity="0.4" />
        <path d="M42 5.5 L44.5 4.5" stroke={p.leafDark} strokeWidth="0.5" strokeLinecap="round" fill="none" opacity="0.4" />
        <path d="M44 4 L41.5 3.5" stroke={p.leafDark} strokeWidth="0.5" strokeLinecap="round" fill="none" opacity="0.4" />
        <path d="M44 4 L46.5 3" stroke={p.leafDark} strokeWidth="0.5" strokeLinecap="round" fill="none" opacity="0.4" />
      </g>

      {/* ── Eyes ── */}
      <EyeRenderer variant={variant} side="left" blinking={blinking} eyeOffsetX={eyeOffsetX} eyes={p.eyes} accent={p.accent} />
      <EyeRenderer variant={variant} side="right" blinking={blinking} eyeOffsetX={eyeOffsetX} eyes={p.eyes} accent={p.accent} />

      {/* ── Mouth ── */}
      {mouthPath(variant) && (
        <path
          d={mouthPath(variant)!}
          stroke={p.mouth}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}
