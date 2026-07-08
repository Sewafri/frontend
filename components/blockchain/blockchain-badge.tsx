import { ShieldCheck } from "lucide-react";
import type { AnchorStatus, BlockchainRecord } from "@/types/db";

interface BlockchainBadgeProps {
  record: BlockchainRecord | null;
  anchorStatus?: AnchorStatus | null;
}

const statusConfig = {
  ANCHORED: {
    label: "On-chain",
    className: "bg-accent-green/10 text-accent-green border-accent-green/20",
  },
  PENDING_ANCHOR: {
    label: "Pending anchor",
    className: "bg-accent-amber/10 text-accent-amber border-accent-amber/20",
  },
  FAILED: {
    label: "Anchor failed",
    className: "bg-accent-red/10 text-accent-red border-accent-red/20",
  },
};

export function BlockchainBadge({ record, anchorStatus }: BlockchainBadgeProps) {
  const status = record?.anchorStatus ?? anchorStatus;
  const config = status ? statusConfig[status] : null;

  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-tight ${config.className}`}
      title={
        status === "ANCHORED"
          ? "This certificate is anchored on the blockchain — tamper-proof and independently verifiable"
          : status === "PENDING_ANCHOR"
            ? "This certificate is waiting to be anchored on-chain"
            : "On-chain anchoring failed for this certificate"
      }
    >
      <ShieldCheck className="h-3 w-3" />
      {config.label}
    </span>
  );
}
