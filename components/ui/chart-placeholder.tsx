import { TrendingUp } from "lucide-react";

function LineChartSVG() {
  return (
    <svg viewBox="0 0 400 150" className="h-full w-full opacity-40">
      <path
        d="M0 120 Q50 100 100 60 T200 40 T300 80 T400 30"
        fill="none"
        stroke="#ff7000"
        strokeWidth="2"
      />
      <path
        d="M0 140 Q50 130 100 100 T200 90 T300 110 T400 60"
        fill="none"
        stroke="#ff7000"
        strokeWidth="1"
        opacity="0.4"
      />
      <circle cx="100" cy="60" r="4" fill="#ff7000" />
      <circle cx="200" cy="40" r="4" fill="#ff7000" />
      <circle cx="400" cy="30" r="4" fill="#ff7000" />
    </svg>
  );
}

function BarChartSVG() {
  const bars = [
    { x: 20, h: 80 },
    { x: 60, h: 120 },
    { x: 100, h: 60 },
    { x: 140, h: 140 },
    { x: 180, h: 100 },
    { x: 220, h: 50 },
    { x: 260, h: 110 },
    { x: 300, h: 90 },
    { x: 340, h: 70 },
    { x: 380, h: 130 },
  ];
  const maxH = 140;
  return (
    <svg viewBox="0 0 400 150" className="h-full w-full opacity-40">
      {bars.map((bar, i) => (
        <rect
          key={i}
          x={bar.x}
          y={150 - bar.h}
          width="20"
          height={bar.h}
          rx="4"
          fill="#ff7000"
          opacity={0.4 + (bar.h / maxH) * 0.6}
        />
      ))}
    </svg>
  );
}

export default function ChartPlaceholder({
  title,
  height = 250,
  type = "line",
}: {
  title: string;
  height?: number;
  type?: "line" | "bar" | "pie";
}) {
  return (
    <div className="rounded-xl border border-border-glass bg-surface-dark p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <TrendingUp className="h-4 w-4 text-text-secondary" />
      </div>
      <div
        className="flex items-center justify-center rounded-lg bg-gray-800/50"
        style={{ height: `${height}px` }}
      >
        {type === "line" ? <LineChartSVG /> : <BarChartSVG />}
      </div>
    </div>
  );
}
