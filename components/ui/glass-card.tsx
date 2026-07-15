"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "bordered";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
}

const variantClasses: Record<CardVariant, string> = {
  default:
    "bg-surface-card shadow-sm",
  bordered: [
    "bg-surface-card",
    "border border-border-default",
  ].join(" "),
};

export default function Card({
  children,
  className = "",
  variant = "default",
}: CardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      whileHover={reduced ? {} : { y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className={cn(
        "rounded-xl p-6",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
