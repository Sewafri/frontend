"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
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
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Type</label>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-surface-card px-3 py-2 text-sm text-text-secondary">
                {contentType === "VIDEO" ? "Video" : contentType === "TEXT" ? "Text" : contentType === "CODE" ? "Code" : "Mixed"}
              </span>
              {contentType === "CODE" && <Code className="h-4 w-4 text-accent-500" />}
              <span className="text-xs text-text-secondary">(set at creation, cannot be changed)</span>
            </div>
          </div>

          {contentType === "CODE" && (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Programming Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent-500/50"
                >
                  {CODE_LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Starter Code</label>
                <textarea
                  value={starterCode}
                  onChange={(e) => setStarterCode(e.target.value)}
                  rows={12}
                  placeholder="// Write starter code for students here..."
                  className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2.5 font-mono text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent-500/50"
                  spellCheck={false}
                />
              </div>
            </>
          )}

          {contentType !== "CODE" && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Video</label>
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
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-border-default px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary disabled:opacity-50"
                >
                  <Upload className={`h-4 w-4 ${uploadingVideo ? "animate-pulse" : ""}`} />
                  {uploadingVideo ? "Uploading..." : "Upload Video"}
                </button>
                <span className="text-xs text-text-tertiary">or paste a URL</span>
                <input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  type="url"
                  placeholder="https://..."
                  className="flex-1 rounded-lg border border-border-default bg-surface-card px-3 py-2 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent-500/50"
                />
              </div>
              {videoUrl && (
                <p className="mt-1.5 text-xs text-text-tertiary break-all">{videoUrl}</p>
              )}
            </div>
          )}

          {contentType !== "CODE" && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Lesson Content</label>
              <textarea value={contentBody} onChange={(e) => setContentBody(e.target.value)} rows={10} placeholder="Write the lesson content here..." className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent-500/50" />
            </div>
          )}

          {contentType === "CODE" && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Lesson Content (description / instructions)</label>
              <textarea value={contentBody} onChange={(e) => setContentBody(e.target.value)} rows={6} placeholder="Write instructions for the coding exercise..." className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent-500/50" />
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-border-default pt-6">
            <Link href={`/instructor/courses/${courseId}/curriculum`} className="rounded-lg border border-border-default px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">Cancel</Link>
            <button
              onClick={handleRegenerateQuiz}
              disabled={regenerating || !contentBody.trim()}
              className="cursor-pointer flex items-center gap-2 rounded-lg border border-border-default px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
              {regenerating ? "Regenerating..." : "Regenerate Quiz"}
            </button>
            <button onClick={handleSave} disabled={saving || !title.trim()} className="cursor-pointer flex items-center gap-2 rounded-lg bg-accent-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-500/90 disabled:opacity-50">
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
