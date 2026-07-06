import { cn } from "@/lib/utils";

function LineChartSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 150" className={cn("h-full w-full", className)} style={{ '--brand': 'var(--color-brand-500)' } as React.CSSProperties}>
      <defs>
        <linearGradient id="line-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 120 Q50 100 100 60 T200 40 T300 80 T400 30"
        fill="none"
        stroke="var(--brand)"
        strokeWidth="2.5"
        className="drop-shadow-[0_0_6px_rgba(255,112,0,0.3)]"
      />
      <path
        d="M0 120 Q50 100 100 60 T200 40 T300 80 T400 30 L400 150 L0 150 Z"
        fill="url(#line-grad)"
        opacity="0.5"
      />
      <circle cx="400" cy="30" r="4" fill="var(--brand)" className="drop-shadow-[0_0_4px_rgba(255,112,0,0.5)]" />
    </svg>
  );
}

function BarChartSVG({ className }: { className?: string }) {
  const bars = [
    { x: 18, h: 80 }, { x: 58, h: 120 }, { x: 98, h: 60 },
    { x: 138, h: 140 }, { x: 178, h: 100 }, { x: 218, h: 50 },
    { x: 258, h: 110 }, { x: 298, h: 90 }, { x: 338, h: 70 },
    { x: 378, h: 130 },
  ];
  return (
    <svg viewBox="0 0 400 150" className={cn("h-full w-full", className)} style={{ '--brand': 'var(--color-brand-500)' } as React.CSSProperties}>
      <defs>
        <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {bars.map((bar, i) => (
        <rect
          key={i}
          x={bar.x}
          y={150 - bar.h}
          width="16"
          height={bar.h}
          rx="4"
          fill="url(#bar-grad)"
          className="transition-all duration-300"
        />
      ))}
    </svg>
  );
}

export default function ChartPlaceholder({
  title,
  subtitle,
  height = 250,
  type = "line",
  className,
}: {
  title: string;
  subtitle?: string;
  height?: number;
  type?: "line" | "bar";
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl bg-surface-card p-5 shadow-sm ring-1 ring-border-subtle", className)}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        {subtitle && (
          <p className="mt-0.5 text-xs text-text-tertiary">{subtitle}</p>
        )}
      </div>
      <div
        className="flex items-center justify-center overflow-hidden rounded-lg bg-surface-sunken"
        style={{ height: `${height}px` }}
      >
        {type === "line" ? (
          <LineChartSVG className="opacity-60" />
        ) : (
          <BarChartSVG className="opacity-60" />
        )}
      </div>
    </div>
  );
}
