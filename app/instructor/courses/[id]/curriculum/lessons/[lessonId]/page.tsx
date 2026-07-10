"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { ArrowLeft, Save } from "lucide-react";
import { getLesson, updateLesson } from "@/lib/data/lessons";
import { LessonResources } from "@/components/lessons/lesson-resources";

export default function EditLessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;
  const courseId = params.id as string;
  const [title, setTitle] = useState("");
  const [contentBody, setContentBody] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!lessonId) return;
    getLesson(lessonId, courseId)
      .then((l) => {
        setTitle(l.title);
        setContentBody(l.contentBody ?? "");
        setVideoUrl(l.videoUrl ?? "");
      })
      .catch(() => router.push(`/instructor/courses/${courseId}/curriculum`))
      .finally(() => setLoading(false));
  }, [lessonId, courseId, router]);

  async function handleSave() {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await updateLesson(lessonId, {
        title: title.trim(),
        contentBody: contentBody.trim() || undefined,
        videoUrl: videoUrl.trim() || undefined,
      });
      router.push(`/instructor/courses/${courseId}/curriculum`);
    } catch {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex flex-col items-center justify-center py-20"><p className="text-sm text-text-secondary">Loading lesson...</p></div>;
  }

  return (
    <div className="">
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/instructor/courses/${courseId}/curriculum`} className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Curriculum
        </Link>
      </div>

      <PageHeader title="Edit Lesson" description={title || `Lesson ${lessonId}`} />

      <GlassCard>
        <div className="space-y-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Lesson Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent-500/50" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Video URL (if applicable)</label>
            <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} type="url" placeholder="https://..." className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent-500/50" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Lesson Content</label>
            <textarea value={contentBody} onChange={(e) => setContentBody(e.target.value)} rows={10} placeholder="Write the lesson content here..." className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent-500/50" />
          </div>

          <div className="flex justify-end gap-3 border-t border-border-default pt-6">
            <Link href={`/instructor/courses/${courseId}/curriculum`} className="rounded-lg border border-border-default px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">Cancel</Link>
            <button onClick={handleSave} disabled={saving || !title.trim()} className="cursor-pointer flex items-center gap-2 rounded-lg bg-accent-500 px-6 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-accent-500/90 disabled:opacity-50">
              <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Lesson"}
            </button>
          </div>
        </div>
      </GlassCard>

      <div className="mt-8">
        <LessonResources lessonId={lessonId} editable />
      </div>
    </div>
  );
}
