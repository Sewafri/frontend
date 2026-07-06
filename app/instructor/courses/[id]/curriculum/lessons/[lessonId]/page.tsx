"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { ArrowLeft, Save } from "lucide-react";

export default function EditLessonPage() {
  const params = useParams();

  return (
    <div className="">
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/instructor/courses/${params.id}/curriculum`} className="flex items-center gap-1 text-sm text-text-secondary hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to Curriculum
        </Link>
      </div>

      <PageHeader
        title="Edit Lesson"
        description={`Lesson ${params.lessonId}`}
      />

      <GlassCard>
        <div className="space-y-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Lesson Title</label>
            <input type="text" defaultValue="Welcome to the Course" className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2.5 text-sm text-white outline-none focus:border-brand-orange/50" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Duration</label>
              <input type="text" defaultValue="12 min" className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2.5 text-sm text-white outline-none focus:border-brand-orange/50" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Type</label>
              <select className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2.5 text-sm text-white outline-none focus:border-brand-orange/50">
                <option>video</option>
                <option>article</option>
                <option>quiz</option>
                <option>exercise</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Video URL (if applicable)</label>
            <input type="url" placeholder="https://..." className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2.5 text-sm text-white placeholder-text-secondary outline-none focus:border-brand-orange/50" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Lesson Content</label>
            <textarea rows={10} placeholder="Write the lesson content here..." className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2.5 text-sm text-white placeholder-text-secondary outline-none focus:border-brand-orange/50" />
          </div>

          <div className="flex justify-end gap-3 border-t border-border-glass pt-6">
            <Link href={`/instructor/courses/${params.id}/curriculum`} className="rounded-lg border border-border-glass px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-white">Cancel</Link>
            <button className="cursor-pointer flex items-center gap-2 rounded-lg bg-brand-orange px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-orange/90">
              <Save className="h-4 w-4" /> Save Lesson
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
