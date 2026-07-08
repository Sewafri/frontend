import { ArrowUpRight } from "lucide-react";

interface ExplorerLinkProps {
  network: string;
  txHash: string;
  children?: React.ReactNode;
}

const LOCAL_NETWORKS = new Set(["hardhat", "localhost", "ganache"]);

function getExplorerUrl(network: string, txHash: string): string | null {
  const lower = network.toLowerCase();

  if (LOCAL_NETWORKS.has(lower)) return null;

  const explorers: Record<string, string> = {
    "ethereum-mainnet": "https://etherscan.io",
    "ethereum-mainnet-1": "https://etherscan.io",
    "eth-mainnet": "https://etherscan.io",
    "goerli": "https://goerli.etherscan.io",
    "sepolia": "https://sepolia.etherscan.io",
    "polygon-mainnet": "https://polygonscan.com",
    "polygon-amoy": "https://amoy.polygonscan.com",
    "polygon-mumbai": "https://mumbai.polygonscan.com",
    "base-mainnet": "https://basescan.org",
    "base-sepolia": "https://sepolia.basescan.org",
    "optimism-mainnet": "https://optimistic.etherscan.io",
    "arbitrum-mainnet": "https://arbiscan.io",
    "avalanche-mainnet": "https://snowtrace.io",
    "celo-mainnet": "https://celoscan.io",
  };

  const baseUrl = explorers[lower];
  if (!baseUrl) return null;

  return `${baseUrl}/tx/${txHash}`;
}

export function ExplorerLink({ network, txHash, children }: ExplorerLinkProps) {
  const url = getExplorerUrl(network, txHash);
  const label = network.charAt(0).toUpperCase() + network.slice(1);

  if (!url) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-surface-card px-2 py-0.5 text-xs text-text-tertiary">
        {label} — no explorer available
      </span>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs font-medium text-accent-500 transition-colors hover:text-accent-600"
    >
      {children ?? `View on ${label}`}
      <ArrowUpRight className="h-3 w-3" />
    </a>
  );
}
