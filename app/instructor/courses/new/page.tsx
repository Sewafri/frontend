"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createCourse } from "@/lib/data/courses";

export default function CreateCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const course = await createCourse({
        title: title.trim(),
        description: description.trim(),
        category,
        pricingModel: price ? "ONE_TIME_PURCHASE" : "FREE",
        price: price ? Number(price) : undefined,
      });
      router.push(`/instructor/courses/${course.id}/edit`);
    } catch {
      setSaving(false);
    }
  }

  return (
    <div>
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
              <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="e.g., Advanced React Patterns" className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/10" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Describe what students will learn..." className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/10" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/10">
                <option>Web Development</option>
                <option>Data Science</option>
                <option>UI/UX Design</option>
                <option>Mobile Development</option>
                <option>DevOps</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Price ($)</label>
              <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="49" className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/10" />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-border-default pt-6">
            <Link href="/instructor/courses" className="rounded-lg border border-border-default px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-card-hover hover:text-text-primary">Cancel</Link>
            <button onClick={handleSave} disabled={saving || !title.trim()} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-accent-500 px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-500/90 disabled:opacity-50">
              <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Course"}
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
