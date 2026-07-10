import { api, apiMutate } from "@/lib/api/client"

export interface CoursePricing {
  stablecoinPrice: string
  tokenPrice: string
  instructorTreasury: string
  exists: boolean
}

export interface TokenBalance {
  balance: string
  decimals: number
}

export interface TokenAllowance {
  allowance: string
}

export interface VaultRate {
  ratePerToken: string
}

export interface VaultReserve {
  reserveBalance: string
}

export interface ClaimNonce {
  claimNonce: string
}

export interface SigningMessage {
  message: string
  nonce: string
  expiresAt: number
}

export interface WalletLinkResult {
  linked: true
  walletAddress: string
}

export interface BuildTransactionResult {
  to: string
  data: string
  value: "0"
}

export interface VaultQuote {
  stablecoinPayout: string
}

export interface CertificateSignature {
  student: string
  courseId: number
  completedAt: number
  nonce: string
  expiry: string
  tokenUri: string
  signature: string
  typedData: {
    domain: {
      name: "Course Certificate"
      version: "1"
      chainId: number | string
      verifyingContract: string
    }
    types: {
      CertificateClaim: { name: string; type: string }[]
    }
    message: {
      student: string
      courseId: number
      completedAt: number
      nonce: string
      expiry: string
    }
  }
  signer: string
}

export interface MintDirectResult {
  transactionHash: string
  tokenId: string | null
  network: string
}

export async function getCoursePricing(courseId: number): Promise<CoursePricing> {
  return api<CoursePricing>(`/smart-contracts/courses/${courseId}/pricing`)
}

export async function checkCourseAccess(courseId: number, address: string): Promise<{ hasAccess: boolean }> {
  return api<{ hasAccess: boolean }>(`/smart-contracts/courses/${courseId}/access/${address}`)
}

export async function getTokenBalance(address: string): Promise<TokenBalance> {
  return api<TokenBalance>(`/smart-contracts/tokens/${address}/balance`)
}

export async function getTokenAllowance(address: string): Promise<TokenAllowance> {
  return api<TokenAllowance>(`/smart-contracts/tokens/${address}/allowance`)
}

export async function getVaultRate(): Promise<VaultRate> {
  return api<VaultRate>("/smart-contracts/vault/rate")
}

export async function getVaultReserve(): Promise<VaultReserve> {
  return api<VaultReserve>("/smart-contracts/vault/reserve")
}

export async function getCertificateNonce(address: string): Promise<ClaimNonce> {
  return api<ClaimNonce>(`/smart-contracts/certificate/nonce/${address}`)
}

export async function getWalletSigningMessage(address: string): Promise<SigningMessage> {
  return api<SigningMessage>(`/smart-contracts/wallet/signing-message/${address}`)
}

export async function linkWallet(walletAddress: string, signature: string): Promise<WalletLinkResult> {
  return apiMutate<WalletLinkResult>(
    "/smart-contracts/wallet/link",
    { method: "POST", body: JSON.stringify({ walletAddress, signature }) },
    "Wallet linked",
  )
}

export async function buildEnrollTransaction(courseId: number): Promise<BuildTransactionResult> {
  return apiMutate<BuildTransactionResult>("/smart-contracts/enroll/build-transaction", {
    method: "POST",
    body: JSON.stringify({ courseId }),
  })
}

export async function buildUnlockTransaction(courseId: number): Promise<BuildTransactionResult> {
  return apiMutate<BuildTransactionResult>("/smart-contracts/unlock/build-transaction", {
    method: "POST",
    body: JSON.stringify({ courseId }),
  })
}

export async function buildRedeemTransaction(tokenAmount: string): Promise<BuildTransactionResult> {
  return apiMutate<BuildTransactionResult>("/smart-contracts/redeem/build-transaction", {
    method: "POST",
    body: JSON.stringify({ tokenAmount }),
  })
}

export async function buildApproveTransaction(spender: string, amount: string): Promise<BuildTransactionResult> {
  return apiMutate<BuildTransactionResult>("/smart-contracts/approve/build-transaction", {
    method: "POST",
    body: JSON.stringify({ spender, amount }),
  })
}

export async function quoteRedemption(tokenAmount: string): Promise<VaultQuote> {
  return apiMutate<VaultQuote>("/smart-contracts/vault/quote", {
    method: "POST",
    body: JSON.stringify({ tokenAmount }),
  })
}

export async function getCertificateClaimSignature(certificateNumber: string): Promise<CertificateSignature> {
  return apiMutate<CertificateSignature>(`/smart-contracts/certificates/${certificateNumber}/signature`, {
    method: "POST",
  })
}

export async function mintCertificateDirect(certificateNumber: string): Promise<MintDirectResult> {
  return apiMutate<MintDirectResult>(
    "/smart-contracts/certificates/mint-direct",
    { method: "POST", body: JSON.stringify({ certificateNumber }) },
    "Certificate minted",
  )
}
