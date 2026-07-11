"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import CodeBlock from "@/components/courses/code-block";
import VideoPlayer from "@/components/lessons/video-player";
import { executeCode, saveStudentCode, getStudentCode } from "@/lib/data/lessons";
import type { Lesson, CodeLanguage } from "@/types/db";

interface LessonContentProps {
  lesson: Lesson;
  onComplete?: () => void;
  completing?: boolean;
}

const defaultCode = `// Write your solution here
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("SewAfri"));
`;

export default function LessonContent({
  lesson,
  onComplete,
  completing,
}: LessonContentProps) {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const [code, setCode] = useState(lesson.starterCode ?? defaultCode);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [outputExpanded, setOutputExpanded] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  // Load saved code on mount
  useEffect(() => {
    if (lesson.contentType !== "CODE") return;
    getStudentCode(lesson.id).then((saved) => {
      if (saved.code) setCode(saved.code);
    }).catch(() => {});
  }, [lesson.id, lesson.contentType]);

  // Auto-save with debounce
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveStudentCode(lesson.id, newCode, lesson.language ?? "javascript").catch(() => {});
    }, 2000);
  }, [lesson.id, lesson.language]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  async function handleRun() {
    setRunning(true);
    setOutput("");
    setError("");
    try {
      const result = await executeCode(lesson.id, code, lesson.language ?? "javascript");
      if (result.clientSide) {
        // Client-side JS/TS: try eval in browser
        const logs: string[] = [];
        const mockConsole = { log: (...args: unknown[]) => logs.push(args.map(String).join(" ")) };
        try {
          const fn = new Function("console", code);
          fn(mockConsole);
          setOutput(logs.join("\n"));
        } catch (e) {
          setError((e as Error).toString());
        }
      } else {
        setOutput(result.output);
        if (result.error) setError(result.error);
      }
      setOutputExpanded(true);
    } catch (e) {
      setError((e as Error).toString());
    } finally {
      setRunning(false);
    }
  }

  // Auto-scroll to output when it appears
  useEffect(() => {
    if (outputExpanded && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [outputExpanded]);

  return (
    <motion.div
      ref={sectionRef}
      initial={reduced ? {} : { opacity: 0, y: 16 }}
      animate={reduced || inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
    >
      {lesson.contentType === "VIDEO" && lesson.videoUrl && (
        <div className="mb-6">
          <VideoPlayer
            src={lesson.videoUrl}
            title={lesson.title}
            onComplete={onComplete}
          />
        </div>
      )}

      {(lesson.contentType === "TEXT" || lesson.contentType === "MIXED") &&
        lesson.contentBody && (
          <div className="mb-6 rounded-xl border border-border-default bg-surface-card p-6 sm:p-8">
            <div className="prose prose-sm max-w-none text-text-secondary prose-headings:text-text-primary prose-a:text-accent-500 prose-strong:text-text-primary">
              {lesson.contentBody.split("\n").map((line, i) => {
                if (line.startsWith("## ")) {
                  return (
                    <h2 key={i} className="mt-6 mb-3 text-lg font-semibold">
                      {line.slice(3)}
                    </h2>
                  );
                }
                if (line.startsWith("### ")) {
                  return (
                    <h3 key={i} className="mt-4 mb-2 text-base font-medium">
                      {line.slice(4)}
                    </h3>
                  );
                }
                if (line.trim() === "") {
                  return <div key={i} className="h-3" />;
                }
                return (
                  <p key={i} className="mb-2 leading-relaxed">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        )}

      {lesson.contentType === "CODE" && (
        <div className="mb-6">
          <div className="mb-4 rounded-xl border border-border-default bg-surface-card p-5 sm:p-6">
            <h3 className="mb-2 text-sm font-semibold text-text-primary">
              Instructions
            </h3>
            <div className="text-sm leading-relaxed text-text-secondary">
              {lesson.contentBody ? (
                lesson.contentBody.split("\n").map((line, i) => {
                  if (line.trim() === "") return <div key={i} className="h-2" />;
                  return <p key={i} className="mb-1">{line}</p>;
                })
              ) : (
                <p>Write your code in the editor below.</p>
              )}
            </div>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded bg-accent-500/10 px-2 py-0.5 text-[10px] font-mono uppercase text-accent-500">
              {lesson.language ?? "javascript"}
            </span>
          </div>
          <CodeBlock
            code={code}
            language={(lesson.language ?? "javascript") as "javascript" | "typescript" | "python" | "html" | "css" | "jsx" | "tsx"}
            readOnly={false}
            className=""
            onChange={handleCodeChange}
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={handleRun}
              disabled={running}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-text-on-accent transition-colors hover:bg-accent-500/90 disabled:opacity-50"
            >
              {running ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Running...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                  Run Code
                </>
              )}
            </button>
            {error && (
              <span className="text-xs text-accent-red">Runtime error</span>
            )}
          </div>
          {(output || error) && outputExpanded && (
            <div ref={outputRef} className="mt-3 rounded-xl border border-border-default bg-[#0d1117] p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase text-text-secondary">Output</span>
                <button
                  onClick={() => setOutputExpanded(false)}
                  className="cursor-pointer text-[10px] text-text-secondary hover:text-text-primary"
                >
                  Close
                </button>
              </div>
              {output && (
                <pre className="overflow-x-auto whitespace-pre-wrap text-sm leading-relaxed text-green-400 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:rounded">
                  {output}
                </pre>
              )}
              {error && (
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-sm leading-relaxed text-red-400 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:rounded">
                  {error}
                </pre>
              )}
            </div>
          )}
        </div>
      )}

      {onComplete && (
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 12 }}
          animate={reduced || inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 100, damping: 22, delay: 0.2 }}
          className="flex justify-end"
        >
          <motion.button
            onClick={onComplete}
            disabled={completing}
            whileHover={reduced ? {} : { scale: 1.02 }}
            whileTap={reduced ? {} : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-accent-500 px-6 py-2.5 text-sm font-medium text-text-on-accent transition-colors hover:bg-accent-500/90 disabled:opacity-50"
          >
            {completing ? (
              "Marking..."
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <motion.path
                    d="M3 8.5L6.5 12L13 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ type: "spring", stiffness: 150, damping: 18, delay: 0.3 }}
                  />
                </svg>
                Mark as Complete
              </>
            )}
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
