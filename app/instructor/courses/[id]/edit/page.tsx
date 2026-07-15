"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Save, ArrowLeft, Trash2 } from "lucide-react";
import { CourseCoverUpload } from "@/components/courses/course-cover-upload";
import { getCourseById, updateCourse, deleteCourse, publishCourse, unpublishCourse } from "@/lib/data/courses";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
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
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);

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
      setDeleteOpen(false);
    }
  }

  async function handlePublish() {
    if (!params.id) return;
    setPublishing(true);
    try {
      const updated = await publishCourse(params.id as string);
      setCourse(updated);
    } catch { /* noop */ }
    finally { setPublishing(false); }
  }

  async function handleUnpublish() {
    if (!params.id) return;
    setPublishing(true);
    try {
      const updated = await unpublishCourse(params.id as string);
      setCourse(updated);
    } catch { /* noop */ }
    finally { setPublishing(false); }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-brand-text">Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-brand-text">Course not found</p>
        <Link href="/instructor/courses" className="mt-2 text-sm text-brand-green hover:underline">Back to courses</Link>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/instructor/courses" className="flex items-center gap-1 text-sm text-brand-text-mid hover:text-brand-text">
          <ArrowLeft className="h-4 w-4" /> Back to Courses
        </Link>
      </div>

      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">Edit Course</h1>
        <p className="mt-1 text-sm text-brand-text-mid">Editing: {course.title}</p>
      </div>

      <div className="rounded-xl border border-brand-border bg-brand-card p-5">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">Course Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2.5 text-sm text-brand-text outline-none focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2.5 text-sm text-brand-text outline-none focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2.5 text-sm text-brand-text outline-none focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]">
                <option>Web Development</option>
                <option>Data Science</option>
                <option>UI/UX Design</option>
                <option>Mobile Development</option>
                <option>DevOps</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">Price ($)</label>
              <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2.5 text-sm text-brand-text outline-none focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]" />
            </div>
            <div className="sm:col-span-2">
              <CourseCoverUpload
                courseId={course.id}
                currentUrl={course.coverImageUrl}
                onUpdated={(url) => setCourse((prev) => prev ? { ...prev, coverImageUrl: url } : prev)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">Status</label>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${course.status === "PUBLISHED" ? "text-brand-green" : "text-brand-amber"}`}>
                  {course.status === "PUBLISHED" ? "Published" : course.status === "DRAFT" ? "Draft" : "Unpublished"}
                </span>
                {course.status === "PUBLISHED" ? (
                  <button onClick={handleUnpublish} disabled={publishing} className="cursor-pointer text-xs text-accent-red hover:text-accent-red/80 disabled:opacity-50">
                    {publishing ? "..." : "Unpublish"}
                  </button>
                ) : (
                  <button onClick={handlePublish} disabled={publishing} className="cursor-pointer text-xs text-brand-green hover:text-brand-green/80 disabled:opacity-50">
                    {publishing ? "..." : "Publish"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-brand-border pt-6">
            <button onClick={() => setDeleteOpen(true)} disabled={deleting} className="cursor-pointer flex items-center gap-2 rounded-lg border border-accent-red/30 px-4 py-2 text-sm font-medium text-accent-red transition-colors hover:bg-accent-red/10 disabled:opacity-50">
              <Trash2 className="h-4 w-4" /> {deleting ? "Deleting..." : "Delete Course"}
            </button>
            <div className="flex items-center gap-3">
              <Link href={`/instructor/courses/${params.id}/curriculum`} className="rounded-lg border border-brand-border px-4 py-2 text-sm font-medium text-brand-text-mid transition-colors hover:text-brand-text">Manage Curriculum</Link>
              <button onClick={handleSave} disabled={saving} className="cursor-pointer flex items-center gap-2 rounded-lg bg-brand-green px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-green-dark disabled:opacity-50">
                <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Course"
        description="Are you sure you want to delete this course? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
