"use client";

import { ShieldCheck, Link as LinkIcon, Hash, Calendar, FileText } from "lucide-react";
import type { BlockchainRecord } from "@/types/db";
import { ExplorerLink } from "./explorer-link";
import { CopyButton } from "./copy-button";

interface BlockchainProofProps {
  record: BlockchainRecord;
  compact?: boolean;
}

function truncateHash(hash: string): string {
  if (hash.length <= 16) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-4)}`;
}

export function BlockchainProof({ record, compact = false }: BlockchainProofProps) {
  const networkDisplay = record.network
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  if (compact) {
    return (
      <div className="rounded-lg border border-border-default bg-surface-card p-3">
        <div className="mb-2 flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-accent-green" />
          <span className="text-xs font-medium text-accent-green">Blockchain Verified</span>
        </div>
        <div className="space-y-1 text-xs text-text-tertiary">
          <div className="flex items-center gap-2">
            <FileText className="h-3 w-3 shrink-0" />
            <span>{networkDisplay}</span>
          </div>
          {record.txHash && (
            <div className="flex items-center gap-2">
              <Hash className="h-3 w-3 shrink-0" />
              <span className="font-mono text-text-secondary">{truncateHash(record.txHash)}</span>
              <CopyButton value={record.txHash} label="transaction hash" />
            </div>
          )}
          {record.txHash && (
            <div className="flex items-center gap-2">
              <LinkIcon className="h-3 w-3 shrink-0" />
              <ExplorerLink network={record.network} txHash={record.txHash}>
                View transaction
              </ExplorerLink>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-accent-500/20 bg-accent-500/[0.03] p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-green/10">
          <ShieldCheck className="h-4 w-4 text-accent-green" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Blockchain Verification</h3>
          <p className="text-xs text-text-tertiary">
            This certificate is cryptographically anchored and independently verifiable
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <span className="text-xs text-text-tertiary">Network</span>
          <span className="text-xs font-medium text-text-primary">{networkDisplay}</span>
        </div>

        {record.contractAddress && (
          <div className="flex items-start justify-between">
            <span className="text-xs text-text-tertiary">Contract</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs text-text-secondary">
                {truncateHash(record.contractAddress)}
              </span>
              <CopyButton value={record.contractAddress} label="contract address" />
            </div>
          </div>
        )}

        {record.txHash && (
          <div className="flex items-start justify-between">
            <span className="text-xs text-text-tertiary">Transaction</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs text-text-secondary">
                {truncateHash(record.txHash)}
              </span>
              <CopyButton value={record.txHash} label="transaction hash" />
            </div>
          </div>
        )}

        {record.tokenId && (
          <div className="flex items-start justify-between">
            <span className="text-xs text-text-tertiary">Token ID</span>
            <span className="font-mono text-xs text-text-secondary">#{record.tokenId}</span>
          </div>
        )}

        {record.anchoredAt && (
          <div className="flex items-start justify-between">
            <span className="text-xs text-text-tertiary">Anchored on</span>
            <span className="flex items-center gap-1 text-xs text-text-secondary">
              <Calendar className="h-3 w-3" />
              {new Date(record.anchoredAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        )}

        {record.txHash && (
          <div className="border-t border-border-default pt-3">
            <ExplorerLink network={record.network} txHash={record.txHash}>
              View on block explorer
            </ExplorerLink>
          </div>
        )}
      </div>
    </div>
  );
}
