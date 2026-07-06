"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { Save, ArrowLeft } from "lucide-react";
import { ALL_COURSES } from "@/constants/dashboard";

export default function EditCoursePage() {
  const params = useParams();
  const course = ALL_COURSES.find((c) => c.id === params.id);

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-white">Course not found</p>
        <Link href="/instructor/courses" className="mt-2 text-sm text-brand-orange hover:underline">Back to courses</Link>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/instructor/courses" className="flex items-center gap-1 text-sm text-text-secondary hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to Courses
        </Link>
      </div>

      <PageHeader title="Edit Course" description={`Editing: ${course.title}`} />

      <GlassCard>
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Course Title</label>
              <input type="text" defaultValue={course.title} className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2.5 text-sm text-white outline-none focus:border-brand-orange/50" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Description</label>
              <textarea rows={4} defaultValue="A comprehensive course covering all the essential topics..." className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2.5 text-sm text-white outline-none focus:border-brand-orange/50" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Category</label>
              <select defaultValue={course.category} className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2.5 text-sm text-white outline-none focus:border-brand-orange/50">
                <option>Web Development</option>
                <option>Data Science</option>
                <option>UI/UX Design</option>
                <option>Mobile Development</option>
                <option>DevOps</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Price ($)</label>
              <input type="number" defaultValue={course.price} className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2.5 text-sm text-white outline-none focus:border-brand-orange/50" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Status</label>
              <select defaultValue={course.status} className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2.5 text-sm text-white outline-none focus:border-brand-orange/50">
                <option>Draft</option>
                <option>Published</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Duration</label>
              <input type="text" placeholder="e.g., 20 hours" className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2.5 text-sm text-white placeholder-text-secondary outline-none focus:border-brand-orange/50" />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-border-glass pt-6">
            <Link href={`/instructor/courses/${params.id}/curriculum`} className="rounded-lg border border-border-glass px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-white">Manage Curriculum</Link>
            <button className="cursor-pointer flex items-center gap-2 rounded-lg bg-brand-orange px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-orange/90">
              <Save className="h-4 w-4" /> Save Changes
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
