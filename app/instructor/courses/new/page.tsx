import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateCoursePage() {
  return (
    <div className="">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/instructor/courses" className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Courses
        </Link>
      </div>

      <PageHeader
        title="Create New Course"
        description="Fill in the details to create a new course"
      />

      <GlassCard>
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Course Title</label>
              <input type="text" placeholder="e.g., Advanced React Patterns" className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2.5 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-brand-orange/50" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Description</label>
              <textarea rows={4} placeholder="Describe what students will learn..." className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2.5 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-brand-orange/50" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Category</label>
              <select className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-brand-orange/50">
                <option>Web Development</option>
                <option>Data Science</option>
                <option>UI/UX Design</option>
                <option>Mobile Development</option>
                <option>DevOps</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Price ($)</label>
              <input type="number" placeholder="49" className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2.5 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-brand-orange/50" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Difficulty</label>
              <select className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-brand-orange/50">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Duration</label>
              <input type="text" placeholder="e.g., 20 hours" className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2.5 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-brand-orange/50" />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-border-glass pt-6">
            <Link href="/instructor/courses" className="rounded-lg border border-border-glass px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">Cancel</Link>
            <button className="cursor-pointer flex items-center gap-2 rounded-lg bg-brand-orange px-6 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-brand-orange/90">
              <Save className="h-4 w-4" /> Save Course
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
