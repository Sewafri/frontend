"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
        <Link href="/instructor/courses" className="flex items-center gap-1 text-sm text-brand-text-mid hover:text-brand-text">
          <ArrowLeft className="h-4 w-4" /> Back to Courses
        </Link>
      </div>

      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">Create New Course</h1>
        <p className="mt-1 text-sm text-brand-text-mid">Fill in the details to create a new course</p>
      </div>

      <div className="rounded-xl border border-brand-border bg-brand-card p-5">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">Course Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="e.g., Advanced React Patterns" className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2.5 text-sm text-brand-text placeholder-text-brand-text-light outline-none transition-colors focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Describe what students will learn..." className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2.5 text-sm text-brand-text placeholder-text-brand-text-light outline-none transition-colors focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2.5 text-sm text-brand-text outline-none transition-colors focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]">
                <option>Web Development</option>
                <option>Data Science</option>
                <option>UI/UX Design</option>
                <option>Mobile Development</option>
                <option>DevOps</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">Price ($)</label>
              <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="49" className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2.5 text-sm text-brand-text placeholder-text-brand-text-light outline-none transition-colors focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]" />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-brand-border pt-6">
            <Link href="/instructor/courses" className="rounded-lg border border-brand-border px-4 py-2 text-sm font-medium text-brand-text-mid transition-colors hover:bg-brand-bg hover:text-brand-text">Cancel</Link>
            <button onClick={handleSave} disabled={saving || !title.trim()} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand-green px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-green-dark disabled:opacity-50">
              <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Course"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
