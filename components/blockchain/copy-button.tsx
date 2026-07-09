"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  value: string;
  label?: string;
}

export function CopyButton({ value, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex cursor-pointer items-center gap-1 text-xs text-text-tertiary transition-colors hover:text-text-primary"
      title={`Copy ${label ?? "value"}`}
    >
      {copied ? (
        <Check className="h-3 w-3 text-accent-green" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </button>
  );
}
