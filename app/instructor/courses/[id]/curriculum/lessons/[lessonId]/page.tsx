"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Save, Code, RefreshCw, Upload } from "lucide-react";
import { getLesson, updateLesson, regenerateQuiz } from "@/lib/data/lessons";
import { getPresignedUrl, uploadFile } from "@/lib/data/uploads";
import { LessonResources } from "@/components/lessons/lesson-resources";

const CODE_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "jsx", label: "JSX (React)" },
  { value: "tsx", label: "TSX (React)" },
];

export default function EditLessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;
  const courseId = params.id as string;
  const [title, setTitle] = useState("");
  const [contentBody, setContentBody] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [contentType, setContentType] = useState<string>("TEXT");
  const [language, setLanguage] = useState("javascript");
  const [starterCode, setStarterCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!lessonId) return;
    getLesson(lessonId, courseId)
      .then((l) => {
        setTitle(l.title);
        setContentBody(l.contentBody ?? "");
        setVideoUrl(l.videoUrl ?? "");
        setContentType(l.contentType);
        setLanguage(l.language ?? "javascript");
        setStarterCode(l.starterCode ?? "");
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
        ...(contentType === "CODE" ? {
          language,
          starterCode: starterCode.trim() || undefined,
        } : {}),
      });
      router.push(`/instructor/courses/${courseId}/curriculum`);
    } catch {
      setSaving(false);
    }
  }

  async function handleRegenerateQuiz() {
    setRegenerating(true);
    try {
      await regenerateQuiz(lessonId);
      toast.success("Quiz regenerated from lesson content");
    } catch {
      toast.error("Failed to regenerate quiz. Check that the lesson has content and AI is configured.");
    } finally {
      setRegenerating(false);
    }
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    // Validate file size (500MB max)
    if (file.size > 500 * 1024 * 1024) {
      toast.error("Video must be under 500MB");
      return;
    }

    setUploadingVideo(true);
    try {
      const presign = await getPresignedUrl({
        purpose: "lesson-video",
        contentType: file.type,
        fileName: file.name,
        courseId,
        lessonId,
      });

      await uploadFile(presign, file);

      if (presign.publicUrl) {
        setVideoUrl(presign.publicUrl);
        toast.success("Video uploaded successfully");
      } else {
        toast.error("Upload succeeded but no public URL returned");
      }
    } catch {
      toast.error("Failed to upload video");
    } finally {
      setUploadingVideo(false);
      // Reset input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  if (loading) {
    return <div className="flex flex-col items-center justify-center py-20"><p className="text-sm text-brand-text-mid">Loading lesson...</p></div>;
  }

  return (
    <div className="">
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/instructor/courses/${courseId}/curriculum`} className="flex items-center gap-1 text-sm text-brand-text-mid hover:text-brand-text">
          <ArrowLeft className="h-4 w-4" /> Back to Curriculum
        </Link>
      </div>

      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">Edit Lesson</h1>
        <p className="mt-1 text-sm text-brand-text-mid">{title || `Lesson ${lessonId}`}</p>
      </div>

      <div className="rounded-xl border border-brand-border bg-brand-card p-5">
        <div className="space-y-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">Lesson Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2.5 text-sm text-brand-text outline-none focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">Type</label>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-brand-card px-3 py-2 text-sm text-brand-text-mid">
                {contentType === "VIDEO" ? "Video" : contentType === "TEXT" ? "Text" : contentType === "CODE" ? "Code" : "Mixed"}
              </span>
              {contentType === "CODE" && <Code className="h-4 w-4 text-brand-green" />}
              <span className="text-xs text-brand-text-mid">(set at creation, cannot be changed)</span>
            </div>
          </div>

          {contentType === "CODE" && (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">Programming Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2.5 text-sm text-brand-text outline-none focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]"
                >
                  {CODE_LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">Starter Code</label>
                <textarea
                  value={starterCode}
                  onChange={(e) => setStarterCode(e.target.value)}
                  rows={12}
                  placeholder="// Write starter code for students here..."
                  className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2.5 font-mono text-sm text-brand-text placeholder-text-brand-text-mid outline-none focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]"
                  spellCheck={false}
                />
              </div>
            </>
          )}

          {contentType !== "CODE" && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">Video</label>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingVideo}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-brand-border px-4 py-2 text-sm text-brand-text-mid transition-colors hover:text-brand-text disabled:opacity-50"
                >
                  <Upload className={`h-4 w-4 ${uploadingVideo ? "animate-pulse" : ""}`} />
                  {uploadingVideo ? "Uploading..." : "Upload Video"}
                </button>
                <span className="text-xs text-brand-text-light">or paste a URL</span>
                <input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  type="url"
                  placeholder="https://..."
                  className="flex-1 rounded-lg border border-brand-border bg-brand-card px-3 py-2 text-sm text-brand-text placeholder-text-brand-text-mid outline-none focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]"
                />
              </div>
              {videoUrl && (
                <p className="mt-1.5 text-xs text-brand-text-light break-all">{videoUrl}</p>
              )}
            </div>
          )}

          {contentType !== "CODE" && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">Lesson Content</label>
              <textarea value={contentBody} onChange={(e) => setContentBody(e.target.value)} rows={10} placeholder="Write the lesson content here..." className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2.5 text-sm text-brand-text placeholder-text-brand-text-mid outline-none focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]" />
            </div>
          )}

          {contentType === "CODE" && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">Lesson Content (description / instructions)</label>
              <textarea value={contentBody} onChange={(e) => setContentBody(e.target.value)} rows={6} placeholder="Write instructions for the coding exercise..." className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2.5 text-sm text-brand-text placeholder-text-brand-text-mid outline-none focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(10,124,66,0.08)]" />
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-brand-border pt-6">
            <Link href={`/instructor/courses/${courseId}/curriculum`} className="rounded-lg border border-brand-border px-4 py-2 text-sm font-medium text-brand-text-mid transition-colors hover:text-brand-text">Cancel</Link>
            <button
              onClick={handleRegenerateQuiz}
              disabled={regenerating || !contentBody.trim()}
              className="cursor-pointer flex items-center gap-2 rounded-lg border border-brand-border px-4 py-2 text-sm font-medium text-brand-text-mid transition-colors hover:text-brand-text disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
              {regenerating ? "Regenerating..." : "Regenerate Quiz"}
            </button>
            <button onClick={handleSave} disabled={saving || !title.trim()} className="cursor-pointer flex items-center gap-2 rounded-lg bg-brand-green px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-green-dark disabled:opacity-50">
              <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Lesson"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <LessonResources lessonId={lessonId} editable />
      </div>
    </div>
  );
}
