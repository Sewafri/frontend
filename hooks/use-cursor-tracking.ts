"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useReducedMotion } from "./use-reduced-motion";

interface CursorTrackingOptions {
  maxTilt?: number;
  enabled?: boolean;
}

interface CursorTrackingResult {
  tiltX: number;
  tiltY: number;
  ref: React.RefObject<HTMLDivElement | null>;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseLeave: () => void;
  handleTap: () => void;
  isNear: boolean;
  tapped: boolean;
}

export function useCursorTracking(opts: CursorTrackingOptions = {}): CursorTrackingResult {
  const reduced = useReducedMotion();
  const maxTilt = opts.maxTilt ?? 3;
  const enabled = (opts.enabled ?? true) && !reduced;

  const ref = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number>(0);

  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [isNear, setIsNear] = useState(false);
  const [tapped, setTapped] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled || !ref.current) return;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);

      frameRef.current = requestAnimationFrame(() => {
        const rect = ref.current!.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);

        setTiltX(clamp(-maxTilt, maxTilt, Math.round(dx * maxTilt)));
        setTiltY(clamp(-maxTilt, maxTilt, Math.round(dy * maxTilt)));
        setIsNear(true);
      });
    },
    [enabled, maxTilt],
  );

  const handleMouseLeave = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    setTiltX(0);
    setTiltY(0);
    setIsNear(false);
  }, []);

  const handleTap = useCallback(() => {
    if (!enabled) return;
    setTapped(true);
    const bounce = () => {
      setTiltX(0);
      setTiltY(0);
    };
    setTimeout(bounce, 600);
    setTimeout(() => setTapped(false), 700);
  }, [enabled]);

  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return { tiltX, tiltY, ref, handleMouseMove, handleMouseLeave, handleTap, isNear, tapped };
}

function clamp(min: number, max: number, val: number): number {
  return Math.max(min, Math.min(max, val));
}
