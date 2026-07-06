"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface StateSkeletonProps {
  title: string;
  message: string;
  button?: {
    text: string;
    href: string;
  };
}

export function StateSkeleton({ title, message, button }: StateSkeletonProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange/10">
        <span className="text-2xl">📚</span>
      </div>
      <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
      <p className="max-w-md text-sm text-text-secondary">{message}</p>
      {button && (
        <Button
          render={<Link href={button.href} />}
          nativeButton={false}
          className="mt-2 bg-brand-orange text-white hover:bg-brand-orange/90"
        >
          {button.text}
        </Button>
      )}
    </div>
  );
}
