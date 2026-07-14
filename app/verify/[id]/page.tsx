"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  Award,
  ArrowLeft,
  Loader2,
  RefreshCw,
  WifiOff,
  Calendar,
  ScrollText,
  User,
  Building2,
} from "lucide-react";
import { verifyCertificate } from "@/lib/data/verify";
import { ApiError } from "@/lib/api/client";
import { BlockchainProof } from "@/components/blockchain/blockchain-proof";
import type { VerifyResult, AnchorStatus } from "@/types/db";

type VerificationState =
  | { status: "loading" }
  | { status: "network-error"; message: string }
  | { status: "not-found" }
  | { status: "done"; result: VerifyResult };

export default function VerifyResultPage() {
  const params = useParams();
  const certId = params.id as string;
  const [state, setState] = useState<VerificationState>({ status: "loading" });
  const [retrying, setRetrying] = useState(false);

  const verify = useCallback(async (id: string) => {
    setRetrying(true);
    try {
      const result = await verifyCertificate(id);
      setState({ status: "done", result });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 0) {
          setState({
            status: "network-error",
            message: "Unable to reach the verification server. Please check your connection and try again.",
          });
        } else if (err.statusCode === 404) {
          setState({ status: "not-found" });
        } else {
          setState({
            status: "network-error",
            message: err.message || "Verification failed due to a server error.",
          });
        }
      } else {
        setState({
          status: "network-error",
          message: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setRetrying(false);
    }
  }, []);

  useEffect(() => {
    setState({ status: "loading" });
    verify(certId);
  }, [certId, verify]);

  return (
    <div className="w-full max-w-xl">
      <Link
        href="/verify"
        className="mb-6 inline-flex items-center gap-1 text-sm text-brand-text-mid transition-colors hover:text-brand-text"
      >
        <ArrowLeft className="h-4 w-4" /> Verify another certificate
      </Link>

      {state.status === "loading" && (
        <div className="rounded-xl border border-brand-border bg-brand-card p-10 text-center">
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-brand-green" />
          <p className="text-sm font-medium text-brand-text">Verifying certificate</p>
          <p className="mt-1 text-xs text-brand-text-light">Checking authenticity and blockchain anchor</p>
        </div>
      )}

      {state.status === "network-error" && (
        <div className="rounded-xl border border-brand-border bg-brand-card p-10 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-amber/10">
            <WifiOff className="h-10 w-10 text-brand-amber" />
          </div>
          <h2 className="mb-1 text-xl font-bold text-brand-text">Verification Unavailable</h2>
          <p className="mb-4 text-sm text-brand-text-mid">{state.message}</p>
          <p className="mb-6 text-xs text-brand-text-light">
            This is not a verdict on the certificate — the verification service could not be reached.
          </p>
          <button
            type="button"
            disabled={retrying}
            onClick={() => {
              setState({ status: "loading" });
              verify(certId);
            }}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green-dark disabled:opacity-50"
          >
            {retrying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Try Again
          </button>
        </div>
      )}

      {state.status === "not-found" && (
        <div className="rounded-xl border border-brand-border bg-brand-card p-10 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent-red/10">
            <ShieldX className="h-10 w-10 text-accent-red" />
          </div>
          <h2 className="mb-1 text-xl font-bold text-brand-text">Certificate Not Found</h2>
          <p className="mb-2 text-sm text-brand-text-mid">
            No certificate matches the identifier &ldquo;{certId}&rdquo;
          </p>
          <p className="text-xs text-brand-text-light">
            Double-check the certificate ID or QR code and try again
          </p>
        </div>
      )}

      {state.status === "done" && state.result.result === "INVALID" && (
        <div className="rounded-xl border border-brand-border bg-brand-card p-10 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent-red/10">
            <ShieldX className="h-10 w-10 text-accent-red" />
          </div>
          <h2 className="mb-1 text-xl font-bold text-brand-text">Verification Failed</h2>
          <p className="mb-2 text-sm text-accent-red">
            This certificate could not be verified
          </p>
          {state.result.reason && (
            <p className="mb-1 text-xs text-brand-text-mid">
              Reason: {state.result.reason}
            </p>
          )}
          <p className="text-xs text-brand-text-light">
            The certificate data does not match the original issuance record.
            Contact the issuing institution for clarification.
          </p>
        </div>
      )}

      {state.status === "done" && state.result.result === "REVOKED" && (
        <div className="rounded-xl border border-brand-border bg-brand-card p-10 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-amber/10">
            <ShieldAlert className="h-10 w-10 text-brand-amber" />
          </div>
          <h2 className="mb-1 text-xl font-bold text-brand-text">Certificate Revoked</h2>
          <p className="mb-2 text-sm text-brand-amber">
            This certificate was originally issued but has been revoked
          </p>
          <p className="text-xs text-brand-text-light">
            The certificate ID &ldquo;{certId}&rdquo; matches a record that has been
            invalidated by the issuing institution. Contact them for more information.
          </p>
        </div>
      )}

      {state.status === "done" && state.result.result === "VALID" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-brand-green/20 bg-brand-card p-10 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-green/10">
              <ShieldCheck className="h-10 w-10 text-brand-green" />
            </div>
            <h2 className="mb-1 text-xl font-bold text-brand-text">Certificate Verified</h2>
            <p className="mb-6 text-sm text-brand-green">
              This certificate is authentic and valid
            </p>

            <div className="rounded-lg border border-brand-border bg-brand-bg p-5 text-left">
              <div className="mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-brand-green" />
                <span className="font-semibold text-brand-text">{state.result.courseTitle}</span>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 shrink-0 text-brand-text-light" />
                  <span className="text-sm text-brand-text-mid">
                    Issued to:{" "}
                    <span className="font-medium text-brand-text">{state.result.studentName}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 shrink-0 text-brand-text-light" />
                  <span className="text-sm text-brand-text-mid">
                    Issuer:{" "}
                    <span className="font-medium text-brand-text">{state.result.issuerName}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0 text-brand-text-light" />
                  <span className="text-sm text-brand-text-mid">
                    Issued:{" "}
                    <span className="font-medium text-brand-text">
                      {new Date(state.result.issueDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ScrollText className="h-4 w-4 shrink-0 text-brand-text-light" />
                  <span className="text-sm text-brand-text-mid">
                    ID:{" "}
                    <span className="font-mono font-medium text-brand-text">{certId}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {state.result.network && state.result.txHash ? (
            <BlockchainProof
              record={{
                id: "",
                network: state.result.network,
                txHash: state.result.txHash,
                tokenId: state.result.tokenId,
                contractAddress: "",
                anchorStatus: (state.result.anchorStatus ?? "PENDING_ANCHOR") as AnchorStatus,
                anchoredAt: null,
                createdAt: "",
                updatedAt: "",
              }}
            />
          ) : state.result.anchorStatus === "PENDING_ANCHOR" ? (
            <div className="rounded-xl border border-brand-amber/20 bg-brand-amber/[0.03] p-5 text-center">
              <p className="text-sm text-brand-text-mid">
                This certificate is awaiting on-chain anchoring. The blockchain proof will appear here once confirmed.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-brand-border bg-brand-card p-5 text-center">
              <p className="text-sm text-brand-text-mid">
                This certificate was verified against SewAfri&rsquo;s internal records.
                Blockchain anchoring provides an additional layer of independent,
                tamper-proof verification.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
