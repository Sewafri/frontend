"use client";

import Companion from "@/components/companion/companion";
import type { SproutVariant, Tone } from "@/components/companion/sprout-svg";
import { cn } from "@/lib/utils";

interface SproutConfig {
  variant: SproutVariant;
  size?: "sm" | "md" | "default" | "lg" | "xl" | "xxl" | "xxxl";
  tone?: Tone;
}

interface SproutSceneProps {
  sproots: SproutConfig[];
  message?: string;
  className?: string;
}

const OVERLAP: Record<number, string> = {
  1: "",
  2: "-space-x-2",
  3: "-space-x-3",
};

export default function SproutScene({ sproots, message, className }: SproutSceneProps) {
  return (
    <div className={cn("flex flex-col items-center py-8", className)}>
      <div className={cn("flex items-center", OVERLAP[sproots.length] ?? "-space-x-3")}>
        {sproots.map((s, i) => (
          <Companion
            key={i}
            variant={s.variant}
            size={s.size ?? "sm"}
            animate
            intensity="high"
            tone={s.tone}
          />
        ))}
      </div>
      {message && (
        <p className="mt-1 text-center text-xs text-text-tertiary italic sm:text-sm">
          {message}
        </p>
      )}
    </div>
  );
}
