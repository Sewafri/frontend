"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MessageSquare, Plus, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

const FORUM_THREADS: Record<string, { id: string; title: string; author: string; replies: number; lastActive: string; pinned: boolean }[]> = {
  "web-dev-101": [
    { id: "t1", title: "Welcome to Web Development 101!", author: "Dr. Sarah Wilson", replies: 24, lastActive: "2 hours ago", pinned: true },
    { id: "t2", title: "HTML/CSS Assignment Help", author: "Alex J.", replies: 12, lastActive: "5 hours ago", pinned: false },
    { id: "t3", title: "JavaScript Basics Question", author: "Maria G.", replies: 8, lastActive: "1 day ago", pinned: false },
  ],
  default: [
    { id: "t1", title: "General Discussion", author: "Admin", replies: 5, lastActive: "3 days ago", pinned: true },
    { id: "t2", title: "Assignment Queries", author: "Student", replies: 3, lastActive: "1 week ago", pinned: false },
  ],
};

const COURSE_TITLES: Record<string, string> = {
  "web-dev-101": "Web Development 101",
  "data-science": "Data Science Fundamentals",
};

export default function ForumThreadListPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const threads = FORUM_THREADS[courseId] ?? FORUM_THREADS.default;
  const courseTitle = COURSE_TITLES[courseId] ?? "Course Forum";

  return (
    <div className="">
      <PageHeader
        title={`${courseTitle} Forum`}
        description="Discuss course material, ask questions, and collaborate"
      />

      <div className="mb-6 flex items-center justify-between">
        <Link href="/my-learning" className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to courses
        </Link>
        <button className="cursor-pointer flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-brand-orange/90">
          <Plus className="h-4 w-4" /> New Thread
        </button>
      </div>

      <div className="rounded-xl border border-border-glass">
        {threads.map((thread) => (
          <button
            key={thread.id}
            onClick={() => router.push(`/forum/c/${courseId}/t/${thread.id}`)}
            className="flex w-full cursor-pointer items-center justify-between border-b border-border-glass px-5 py-4 text-left last:border-0 hover:bg-surface-card-hover/50"
          >
            <div className="flex items-start gap-3">
              <MessageSquare className={`mt-0.5 h-5 w-5 ${thread.pinned ? "text-brand-orange" : "text-text-secondary"}`} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-text-primary">{thread.title}</span>
                  {thread.pinned && <span className="rounded bg-brand-orange/10 px-1.5 py-0.5 text-[10px] text-brand-orange">Pinned</span>}
                </div>
                <p className="mt-0.5 text-xs text-text-secondary">
                  {thread.author} &middot; {thread.replies} replies
                </p>
              </div>
            </div>
            <span className="shrink-0 text-xs text-text-secondary">{thread.lastActive}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
