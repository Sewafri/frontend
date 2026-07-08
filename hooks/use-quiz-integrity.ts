"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { IntegrityReport, IntegrityEvent } from "@/types/db";

const TAB_SWITCH_WARNING_THRESHOLD = 2;
const QUIZ_CHANNEL_NAME_PREFIX = "sewafri-quiz-lock-";

const STORAGE_KEY_PREFIX = "sewafri_quiz_active_";

interface UseQuizIntegrityOptions {
  quizId: string;
  studentName: string;
  requireFullscreen?: boolean;
  durationMinutes?: number | null;
  enabled?: boolean;
}

interface WarningState {
  type: "tab-switch" | "fullscreen-exit";
  count: number;
  visible: boolean;
}

export interface QuizIntegrityReturn {
  /** Container ref — attach to the quiz root element for copy/paste prevention */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Current warnings to display (or null) */
  warning: WarningState | null;
  /** Dismiss the current warning */
  dismissWarning: () => void;
  /** The accumulated integrity report to send with submission */
  report: IntegrityReport;
  /** Call when entering fullscreen (pass the element ref) */
  enterFullscreen: () => Promise<void>;
  /** Whether the quiz requires fullscreen mode */
  isFullscreenRequired: boolean;
  /** Whether the student is currently in fullscreen mode */
  isFullscreen: boolean;
  /** Whether another tab already has this quiz open */
  tabConflict: boolean;
  /** Stop tracking — call before navigating away */
  cleanup: () => void;
}

export function useQuizIntegrity({
  quizId,
  studentName,
  requireFullscreen = false,
  enabled = true,
}: UseQuizIntegrityOptions): QuizIntegrityReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [warning, setWarning] = useState<WarningState | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabConflict, setTabConflict] = useState(false);

  const reportRef = useRef<IntegrityReport>({
    tabSwitches: [],
    fullscreenExits: [],
    copyAttempts: [],
    pasteAttempts: [],
    navigationAttempts: [],
    totalTabSwitches: 0,
    totalFullscreenExits: 0,
  });

  const tabSwitchCountRef = useRef(0);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const addEvent = useCallback(
    (
      field: keyof IntegrityReport,
      detail?: string,
    ) => {
      if (!enabled) return;
      const event: IntegrityEvent = {
        type: field === "tabSwitches"
          ? "TAB_SWITCH"
          : field === "fullscreenExits"
            ? "FULLSCREEN_EXIT"
            : field === "copyAttempts"
              ? "COPY_ATTEMPT"
              : field === "pasteAttempts"
                ? "PASTE_ATTEMPT"
                : "NAVIGATION_ATTEMPT",
        timestamp: new Date().toISOString(),
        detail,
      };

      const report = reportRef.current;
      (report[field] as IntegrityEvent[]).push(event);

      if (field === "tabSwitches") report.totalTabSwitches++;
      if (field === "fullscreenExits") report.totalFullscreenExits++;
    },
    [enabled],
  );

  const dismissWarning = useCallback(() => {
    setWarning(null);
  }, []);

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.postMessage("inactive");
      channelRef.current.close();
      channelRef.current = null;
    }
    try {
      localStorage.removeItem(STORAGE_KEY_PREFIX + quizId);
    } catch { /* noop */ }
  }, [quizId]);

  // ── Tab/window focus tracking ──
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCountRef.current++;
        addEvent("tabSwitches", "visibility-change");

        if (tabSwitchCountRef.current > TAB_SWITCH_WARNING_THRESHOLD) {
          setWarning({
            type: "tab-switch",
            count: tabSwitchCountRef.current,
            visible: true,
          });
        }
      }
    };

    const handleBlur = () => {
      tabSwitchCountRef.current++;
      addEvent("tabSwitches", "window-blur");

      if (tabSwitchCountRef.current > TAB_SWITCH_WARNING_THRESHOLD) {
        setWarning({
          type: "tab-switch",
          count: tabSwitchCountRef.current,
          visible: true,
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [enabled, addEvent]);

  // ── Fullscreen detection ──
  useEffect(() => {
    if (!enabled || !requireFullscreen) return;

    const handleFsChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      if (!fs && document.hasFocus()) {
        addEvent("fullscreenExits", "fullscreen-change");
        setWarning({
          type: "fullscreen-exit",
          count: reportRef.current.totalFullscreenExits,
          visible: true,
        });
      }
    };

    document.addEventListener("fullscreenchange", handleFsChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
    };
  }, [enabled, requireFullscreen, addEvent]);

  // ── Copy/paste/contextmenu prevention on quiz area ──
  useEffect(() => {
    if (!enabled) return;

    const el = containerRef.current;
    if (!el) return;

    const preventDefault = (e: Event) => {
      e.preventDefault();
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      addEvent("copyAttempts");
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      addEvent("pasteAttempts");
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      addEvent("copyAttempts", "context-menu");
    };

    // CSS-based selection prevention via style
    el.style.userSelect = "none";
    el.style.webkitUserSelect = "none";

    el.addEventListener("copy", handleCopy);
    el.addEventListener("paste", handlePaste);
    el.addEventListener("contextmenu", handleContextMenu);

    return () => {
      el.removeEventListener("copy", handleCopy);
      el.removeEventListener("paste", handlePaste);
      el.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [enabled, addEvent]);

  // ── Navigation prevention ──
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      addEvent("navigationAttempts", "beforeunload");
      e.preventDefault();
    };

    const handlePopState = () => {
      addEvent("navigationAttempts", "popstate");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [enabled, addEvent]);

  // ── BroadcastChannel tab lock ──
  useEffect(() => {
    if (!enabled) return;

    const channelName = QUIZ_CHANNEL_NAME_PREFIX + quizId;
    let channel: BroadcastChannel;

    try {
      channel = new BroadcastChannel(channelName);
      channelRef.current = channel;

      const lockKey = STORAGE_KEY_PREFIX + quizId;
      const existingLock = localStorage.getItem(lockKey);

      if (existingLock) {
        // Another tab might be open — signal check
        channel.postMessage("ping");
        const timeout = setTimeout(() => {
          // No response means stale lock — take it over
          localStorage.setItem(lockKey, Date.now().toString());
          setTabConflict(false);
        }, 300);

        channel.onmessage = (msg) => {
          clearTimeout(timeout);
          if (msg.data === "active") {
            setTabConflict(true);
          } else if (msg.data === "inactive") {
            localStorage.setItem(lockKey, Date.now().toString());
            setTabConflict(false);
          }
        };
      } else {
        localStorage.setItem(lockKey, Date.now().toString());
        setTabConflict(false);
      }

      channel.onmessage = (msg) => {
        if (msg.data === "ping") {
          channel.postMessage("active");
        }
      };

      channel.postMessage("active");
    } catch {
      // BroadcastChannel may not be available in all environments
      // Fall back to localStorage only
      const lockKey = STORAGE_KEY_PREFIX + quizId;
      try {
        localStorage.setItem(lockKey, Date.now().toString());
      } catch { /* noop */ }
    }

    return () => {
      if (channelRef.current) {
        channelRef.current.postMessage("inactive");
        channelRef.current.close();
        channelRef.current = null;
      }
      try {
        localStorage.removeItem(STORAGE_KEY_PREFIX + quizId);
      } catch { /* noop */ }
    };
  }, [enabled, quizId]);

  const enterFullscreen = useCallback(async () => {
    try {
      if (requireFullscreen && !document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch {
      // Fullscreen may be blocked by browser policy
    }
  }, [requireFullscreen]);

  return {
    containerRef,
    warning,
    dismissWarning,
    report: reportRef.current,
    enterFullscreen,
    isFullscreenRequired: requireFullscreen,
    isFullscreen,
    tabConflict,
    cleanup,
  };
}
