"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import CodeBlock from "@/components/courses/code-block";
import VideoPlayer from "@/components/lessons/video-player";
import type { Lesson } from "@/types/db";

interface LessonContentProps {
  lesson: Lesson;
  onComplete?: () => void;
  completing?: boolean;
}

export default function LessonContent({
  lesson,
  onComplete,
  completing,
}: LessonContentProps) {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();

  const defaultCode = `// Write your solution here
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("SewAfri"));
`;

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
          <CodeBlock
            code={defaultCode}
            language="javascript"
            readOnly={false}
            className=""
          />
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
