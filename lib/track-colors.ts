const TRACK_COLOR_MAP: Record<string, string> = {
  "Web Development": "border-track-web-development text-track-web-development",
  "Data Science": "border-track-data text-track-data",
  "Design": "border-track-design text-track-design",
  "Blockchain": "border-track-blockchain text-track-blockchain",
  "Security": "border-track-security text-track-security",
  "DeFi": "border-track-defi text-track-defi",
  "NFTs": "border-track-nfts text-track-nfts",
  "Smart Contracts": "border-track-smart-contracts text-track-smart-contracts",
  "Mobile": "border-track-mobile text-track-mobile",
  "AI/ML": "border-track-ai-ml text-track-ai-ml",
}

export function getTrackClasses(category: string): string {
  return TRACK_COLOR_MAP[category] ?? "border-navy-700 text-navy-700"
}

export function getTrackBorder(category: string): string {
  const cls = getTrackClasses(category)
  return cls.split(" ")[0]
}
