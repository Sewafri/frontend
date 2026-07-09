"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { Save, ArrowLeft, Trash2 } from "lucide-react";
import { getCourseById, updateCourse, deleteCourse } from "@/lib/data/courses";
import type { Course } from "@/types/db";

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (params.id) {
      getCourseById(params.id as string)
        .then((c) => {
          setCourse(c);
          setTitle(c.title);
          setDescription(c.description ?? "");
          setCategory(c.category ?? "");
          setPrice(c.price?.toString() ?? "");
        })
        .catch(() => setCourse(null))
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  async function handleSave() {
    if (!title.trim() || !params.id) return;
    setSaving(true);
    try {
      await updateCourse(params.id as string, {
        title: title.trim(),
        description: description.trim(),
        category,
        price: price ? Number(price) : undefined,
      });
      setSaving(false);
    } catch {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!params.id) return;
    setDeleting(true);
    try {
      await deleteCourse(params.id as string);
      router.push("/instructor/courses");
    } catch {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-text-primary">Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-text-primary">Course not found</p>
        <Link href="/instructor/courses" className="mt-2 text-sm text-accent-500 hover:underline">Back to courses</Link>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/instructor/courses" className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Courses
        </Link>
      </div>

      <PageHeader title="Edit Course" description={`Editing: ${course.title}`} />

      <GlassCard>
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Course Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent-500/50" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent-500/50" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent-500/50">
                <option>Web Development</option>
                <option>Data Science</option>
                <option>UI/UX Design</option>
                <option>Mobile Development</option>
                <option>DevOps</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Price ($)</label>
              <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent-500/50" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Status</label>
              <select defaultValue={course.status} className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent-500/50">
                <option>Draft</option>
                <option>Published</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border-default pt-6">
            <button onClick={handleDelete} disabled={deleting} className="cursor-pointer flex items-center gap-2 rounded-lg border border-accent-red/30 px-4 py-2 text-sm font-medium text-accent-red transition-colors hover:bg-accent-red/10 disabled:opacity-50">
              <Trash2 className="h-4 w-4" /> {deleting ? "Deleting..." : "Delete Course"}
            </button>
            <div className="flex items-center gap-3">
              <Link href={`/instructor/courses/${params.id}/curriculum`} className="rounded-lg border border-border-default px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">Manage Curriculum</Link>
              <button onClick={handleSave} disabled={saving} className="cursor-pointer flex items-center gap-2 rounded-lg bg-accent-500 px-6 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-accent-500/90 disabled:opacity-50">
                <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
