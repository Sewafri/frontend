"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Shield, ShieldAlert, ShieldCheck, ChevronDown, ChevronRight, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { getQuizAttempts } from "@/lib/data/quiz";
import { ApiError } from "@/lib/api/client";
import type { QuizAttempt, IntegrityReport } from "@/types/db";

function countFlags(report: IntegrityReport | null | undefined): number {
  if (!report) return 0;
  return report.totalTabSwitches + report.totalFullscreenExits + report.copyAttempts.length + report.pasteAttempts.length + report.navigationAttempts.length;
}

function flagLevel(count: number): "clean" | "minor" | "flagged" {
  if (count === 0) return "clean";
  if (count < 5) return "minor";
  return "flagged";
}

function FlagIcon({ level }: { level: "clean" | "minor" | "flagged" }) {
  if (level === "clean") return <ShieldCheck className="h-4 w-4 text-green-600" />;
  if (level === "minor") return <Shield className="h-4 w-4 text-amber-600" />;
  return <ShieldAlert className="h-4 w-4 text-red-600" />;
}

function IntegrityEventList({ events, label }: { events: { type: string; timestamp: string; detail?: string }[]; label: string }) {
  if (!events.length) return null;
  return (
    <div className="mb-3">
      <h4 className="mb-1 text-xs font-medium text-text-secondary">{label} ({events.length})</h4>
      <div className="space-y-0.5">
        {events.map((e, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px] text-text-tertiary">
            <span>{new Date(e.timestamp).toLocaleTimeString()}</span>
            {e.detail && <span className="text-text-quaternary">·</span>}
            {e.detail && <span>{e.detail}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function AttemptRow({ attempt }: { attempt: QuizAttempt & { user: { id: string; fullName: string; email: string } } }) {
  const [expanded, setExpanded] = useState(false);
  const report = attempt.integrityReport as IntegrityReport | null;
  const flags = countFlags(report);
  const level = flagLevel(flags);

  return (
    <div className="rounded-lg border border-border-default">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-hover"
      >
        <FlagIcon level={level} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">{attempt.user.fullName}</span>
            <span className="text-[11px] text-text-tertiary">({attempt.user.email})</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-text-tertiary">
            <span>Attempt {attempt.attemptNumber}</span>
            <span>Score: {attempt.score}%</span>
            <span>{attempt.passed ? "Passed" : "Failed"}</span>
            {flags > 0 && <span className="text-amber-600">{flags} integrity flag{flags !== 1 ? "s" : ""}</span>}
          </div>
        </div>
        {expanded ? <ChevronDown className="h-4 w-4 text-text-tertiary" /> : <ChevronRight className="h-4 w-4 text-text-tertiary" />}
      </button>

      {expanded && report && (
        <div className="border-t border-border-default px-4 py-3">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="rounded-md bg-surface-card px-3 py-2">
              <span className="text-[11px] text-text-tertiary">Tab Switches</span>
              <p className="text-sm font-medium text-text-primary">{report.totalTabSwitches}</p>
            </div>
            <div className="rounded-md bg-surface-card px-3 py-2">
              <span className="text-[11px] text-text-tertiary">Fullscreen Exits</span>
              <p className="text-sm font-medium text-text-primary">{report.totalFullscreenExits}</p>
            </div>
            <div className="rounded-md bg-surface-card px-3 py-2">
              <span className="text-[11px] text-text-tertiary">Copy Attempts</span>
              <p className="text-sm font-medium text-text-primary">{report.copyAttempts.length}</p>
            </div>
            <div className="rounded-md bg-surface-card px-3 py-2">
              <span className="text-[11px] text-text-tertiary">Paste Attempts</span>
              <p className="text-sm font-medium text-text-primary">{report.pasteAttempts.length}</p>
            </div>
            <div className="rounded-md bg-surface-card px-3 py-2">
              <span className="text-[11px] text-text-tertiary">Navigation Attempts</span>
              <p className="text-sm font-medium text-text-primary">{report.navigationAttempts.length}</p>
            </div>
          </div>

          <IntegrityEventList events={report.tabSwitches} label="Tab Switches" />
          <IntegrityEventList events={report.fullscreenExits} label="Fullscreen Exits" />
          <IntegrityEventList events={report.copyAttempts} label="Copy Attempts" />
          <IntegrityEventList events={report.pasteAttempts} label="Paste Attempts" />
          <IntegrityEventList events={report.navigationAttempts} label="Navigation Attempts" />
        </div>
      )}

      {expanded && !report && (
        <div className="border-t border-border-default px-4 py-3 text-sm text-text-tertiary">
          No integrity data recorded for this attempt.
        </div>
      )}
    </div>
  );
}

export default function IntegrityReviewPage() {
  const params = useParams();
  const quizId = params.quizId as string;
  const courseId = params.id as string;

  const [attempts, setAttempts] = useState<(QuizAttempt & { user: { id: string; fullName: string; email: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getQuizAttempts(quizId);
        setAttempts(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load attempts");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [quizId]);

  const totalFlags = attempts.reduce((sum, a) => sum + countFlags(a.integrityReport as IntegrityReport | null), 0);
  const flaggedAttempts = attempts.filter((a) => countFlags(a.integrityReport as IntegrityReport | null) > 0).length;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/instructor/courses/${courseId}/quiz/${quizId}`} className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Quiz
        </Link>
      </div>

      <PageHeader
        title="Integrity Review"
        description={`${attempts.length} total submissions · ${flaggedAttempts} with flags · ${totalFlags} total flags`}
      />

      {error && (
        <div className="mb-4 rounded-lg bg-accent-red/10 p-3 text-sm text-accent-red">
          {error}
        </div>
      )}

      {attempts.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-text-tertiary">
          <Shield className="mb-3 h-10 w-10" />
          <p className="text-sm">No submissions yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {attempts.map((attempt) => (
            <AttemptRow key={attempt.id} attempt={attempt} />
          ))}
        </div>
      )}
    </div>
  );
}
