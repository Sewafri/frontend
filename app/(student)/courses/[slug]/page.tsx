"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, User, ChevronDown, Play, Coins, Wallet, Loader2, Check, AlertCircle } from "lucide-react";
import { RatingStars } from "@/components/ui/rating-stars";
import { WishlistButton } from "@/components/courses/wishlist-button";
import { ReviewSection } from "@/components/courses/review-section";
import { CryptoEnroll } from "@/components/courses/crypto-enroll";
import { getCourseById, enrollInCourse } from "@/lib/data/courses";
import { getLessons, getCourseProgress } from "@/lib/data/lessons";
import { getRatingSummary } from "@/lib/data/ratings";
import { useAuth } from "@/lib/auth/auth-context";
import { ApiError } from "@/lib/api/client";
import { confirmCryptoTransaction } from "@/lib/data/payments";
import { connectWallet, sendTransaction, isMetaMaskInstalled } from "@/lib/web3/provider";
import { ethers } from "ethers";
import type { Course } from "@/types/db";
import type { Lesson } from "@/types/db";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [ratingSummary, setRatingSummary] = useState<{ averageRating: number | null; ratingCount: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Crypto payment state (MetaMask flow)
  const [cryptoPayment, setCryptoPayment] = useState<{
    paymentId: string;
    paymentAddress: string;
    expectedAmount: string;
    tokenSymbol: string;
    network: string;
  } | null>(null);
  const [cryptoStatus, setCryptoStatus] = useState<string>("idle");
  const [cryptoError, setCryptoError] = useState<string | null>(null);

  const courseId = params.slug as string;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getCourseById(courseId),
      getLessons(courseId).catch(() => [] as Lesson[]),
      getRatingSummary(courseId).catch(() => null),
      getCourseProgress(courseId).catch(() => ({ enrolled: false, completedLessonIds: [], progressPercent: 0 })),
    ])
      .then(([c, l, rs, progress]) => {
        setCourse(c);
        setLessons(l);
        setRatingSummary(rs);
        setIsEnrolled(progress.enrolled);
      })
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
  }, [courseId]);

  async function handleEnroll(method?: "CARD" | "CRYPTO") {
    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }
    setEnrolling(true);
    setError(null);
    setCryptoError(null);
    try {
      const result = await enrollInCourse(courseId, method);

      // FREE course → enrolled directly
      if (result.enrollment) {
        router.push(`/my-learning/${courseId}`);
        return;
      }

      // Paid course with Stripe Checkout → redirect
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }

      // Crypto payment → send via MetaMask
      if (result.payment?.method === "CRYPTO" && result.cryptoDetail) {
        const { paymentAddress, expectedAmount, tokenSymbol, network } = result.cryptoDetail;
        const paymentId = result.payment!.id;
        setCryptoPayment({ paymentId, paymentAddress, expectedAmount, tokenSymbol, network });
        setCryptoStatus("connecting");

        // Check MetaMask is installed
        if (!isMetaMaskInstalled()) {
          setCryptoStatus("error");
          setCryptoError("MetaMask not found. Please install MetaMask to pay with crypto.");
          return;
        }

        // Connect wallet
        const addr = await connectWallet();
        if (!addr) {
          setCryptoStatus("error");
          setCryptoError("Wallet connection failed or was rejected.");
          return;
        }

        setCryptoStatus("sending");

        // Send ETH transaction via MetaMask
        const valueWei = ethers.parseEther(expectedAmount).toString();
        const txHash = await sendTransaction(paymentAddress, "0x", valueWei);
        if (!txHash) {
          setCryptoStatus("error");
          setCryptoError("Transaction was rejected in MetaMask.");
          return;
        }

        setCryptoStatus("confirming");

        // Register the tx hash with backend and confirm enrollment
        await confirmCryptoTransaction(paymentId, txHash);

        setCryptoStatus("confirmed");
        setTimeout(() => router.push(`/my-learning/${courseId}`), 1500);
        return;
      }

      // Fallback
      router.push(`/my-learning/${courseId}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to enroll");
      }
    } finally {
      setEnrolling(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-brand-text-mid">Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <BookOpen className="mb-3 h-12 w-12 text-brand-text-mid" />
        <h2 className="text-xl font-semibold text-brand-text">Course not found</h2>
        <p className="mt-1 text-sm text-brand-text-mid">
          This course may have been removed or doesn&apos;t exist.
        </p>
        <Link href="/courses" className="mt-4 text-sm text-brand-green hover:underline">
          Back to catalog
        </Link>
      </div>
    );
  }

  const displayPrice =
    course.pricingModel === "FREE"
      ? "Free"
      : course.currency === "XAF"
        ? `${Number(course.price).toLocaleString()} FCFA`
        : `$${Number(course.price)}`;

  const instructorName = course.instructor?.fullName ?? "Instructor";

  return (
    <div>
      <div className="mb-8 overflow-hidden rounded-xl border border-brand-border bg-gradient-to-br from-neutral-800 to-neutral-700">
        <div className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center">
          <div className="flex-1">
            <span className="mb-3 inline-block rounded-full bg-brand-green-light px-3 py-1 text-xs font-medium text-brand-green">
              {course.category}
            </span>
            <h1 className="mb-2 text-2xl font-bold text-brand-text lg:text-3xl">{course.title}</h1>
            <p className="mb-4 text-brand-text-mid">{course.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-brand-text-mid">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {instructorName}
              </span>
              {ratingSummary && ratingSummary.averageRating != null && (
                <RatingStars
                  rating={ratingSummary.averageRating}
                  reviewCount={ratingSummary.ratingCount}
                  size="sm"
                />
              )}
              {course.skillTags.length > 0 && (
                <span className="text-xs text-brand-text-light">
                  {course.skillTags.join(", ")}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 lg:items-end">
            <span className="text-3xl font-bold text-brand-green">
              {displayPrice}
            </span>
            <div className="flex items-center gap-2">
              {isEnrolled ? (
                <Link
                  href={`/my-learning/${courseId}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-8 py-3 font-medium text-white transition-colors hover:bg-brand-green-dark"
                >
                  <Play className="h-4 w-4" />
                  Continue Learning
                </Link>
              ) : (
                <button
                  onClick={() => handleEnroll()}
                  disabled={enrolling}
                  className="cursor-pointer rounded-lg bg-brand-green px-8 py-3 font-medium text-white transition-colors hover:bg-brand-green-dark disabled:opacity-50"
                >
                  {enrolling ? "Enrolling..." : "Enroll Now"}
                </button>
              )}
              <WishlistButton courseId={courseId} variant="icon" size="md" />
            </div>
            {error && (
              <p className="text-xs text-accent-red">{error}</p>
            )}
            <CryptoEnroll courseId={course.id} onEnrolled={() => router.push(`/my-learning/${courseId}`)} />

            {/* Crypto Payment (ETH) — sends via MetaMask popup */}
            {course.pricingModel === "ONE_TIME_PURCHASE" && !cryptoPayment && !isEnrolled && (
              <div className="mt-2 w-full">
                <button
                  onClick={() => handleEnroll("CRYPTO")}
                  disabled={enrolling}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-brand-border px-4 py-2 text-xs text-brand-text-mid transition-colors hover:border-brand-green/30 hover:text-brand-text disabled:opacity-50"
                >
                  {enrolling ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Wallet className="h-3.5 w-3.5 text-brand-green" />
                  )}
                  {enrolling ? "Generating payment..." : "Pay with Crypto (ETH)"}
                </button>
              </div>
            )}

            {/* Crypto payment status — MetaMask flow indicator */}
            {cryptoPayment && (
              <div className="mt-3 w-full rounded-lg border border-brand-border bg-brand-card p-4">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-brand-green" />
                  <span className="text-xs font-medium text-brand-text">Crypto Payment</span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-brand-text-light">Amount</span>
                    <span className="font-medium text-brand-text">
                      {cryptoPayment.expectedAmount} {cryptoPayment.tokenSymbol}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-text-light">Network</span>
                    <span className="text-brand-text">{cryptoPayment.network}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-text-light">To</span>
                    <span className="max-w-[200px] truncate font-mono text-brand-text">
                      {cryptoPayment.paymentAddress}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 rounded-md bg-brand-bg px-3 py-2">
                  {cryptoStatus === "connecting" || cryptoStatus === "sending" || cryptoStatus === "confirming" ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-text-light" />
                  ) : cryptoStatus === "confirmed" ? (
                    <Check className="h-4 w-4 shrink-0 text-brand-green" />
                  ) : cryptoStatus === "error" ? (
                    <AlertCircle className="h-4 w-4 shrink-0 text-accent-red" />
                  ) : null}
                  <span className={`text-xs font-medium ${
                    cryptoStatus === "confirmed" ? "text-brand-green" :
                    cryptoStatus === "error" ? "text-accent-red" :
                    "text-brand-amber"
                  }`}>
                    {cryptoStatus === "idle" ? "Ready" :
                     cryptoStatus === "connecting" ? "Connecting to MetaMask..." :
                     cryptoStatus === "sending" ? `Sending ${cryptoPayment.expectedAmount} ${cryptoPayment.tokenSymbol} via MetaMask...` :
                     cryptoStatus === "confirming" ? "Confirming enrollment..." :
                     cryptoStatus === "confirmed" ? "Enrolled! Redirecting..." :
                     cryptoStatus === "error" ? "Payment failed" :
                     cryptoStatus}
                  </span>
                </div>

                {cryptoError && (
                  <div className="mt-2 flex items-center gap-1.5 rounded-md bg-accent-red/10 px-3 py-2 text-xs text-accent-red">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{cryptoError}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Curriculum */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-brand-text">Course Curriculum</h2>
          <div className="space-y-3">
            {lessons.length > 0 ? (
              <div className="rounded-xl border border-brand-border bg-brand-bg">
                {lessons.map((lesson, i) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-3 border-b border-brand-border px-5 py-3 last:border-b-0"
                  >
                    <Play className="h-3.5 w-3.5 shrink-0 text-brand-green" />
                    <span className="text-sm text-brand-text-mid">{lesson.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <details className="group rounded-xl border border-brand-border bg-brand-bg">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4">
                  <div>
                    <span className="text-sm font-medium text-brand-text">Course Content</span>
                    <span className="ml-3 text-xs text-brand-text-mid">
                      {lessons.length} lessons
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-brand-text-mid transition-transform group-open:rotate-180" />
                </summary>
                <div className="border-t border-brand-border px-5 py-3">
                  <p className="text-sm text-brand-text-mid">No lessons available yet.</p>
                </div>
              </details>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="rounded-xl border border-brand-border bg-brand-bg p-5">
            <h3 className="mb-3 text-sm font-semibold text-brand-text">This Course Includes</h3>
            <ul className="space-y-2 text-sm text-brand-text-mid">
              <li className="flex items-center gap-2">
                <Play className="h-4 w-4 text-brand-green" /> {lessons.length} lessons
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-brand-green" /> {course.skillTags.length > 0 ? `${course.skillTags.length} skill areas` : "Multiple skills"}
              </li>
              <li className="flex items-center gap-2">
                <User className="h-4 w-4 text-brand-green" /> Full lifetime access
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-brand-green" /> Certificate of completion
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ReviewSection courseId={courseId} isEnrolled={isEnrolled} />
      </div>
    </div>
  );
}
