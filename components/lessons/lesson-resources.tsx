"use client"

import { useEffect, useState } from "react"
import { FileText, Download, Trash2, Upload, Loader2, ExternalLink } from "lucide-react"
import {
  getLessonResources,
  addLessonResource,
  deleteLessonResource,
  type LessonResource,
} from "@/lib/data/resources"
import { ApiError } from "@/lib/api/client"

interface LessonResourcesProps {
  lessonId: string
  editable?: boolean
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function LessonResources({ lessonId, editable }: LessonResourcesProps) {
  const [resources, setResources] = useState<LessonResource[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [adding, setAdding] = useState(false)
  const [formFileName, setFormFileName] = useState("")
  const [formFileUrl, setFormFileUrl] = useState("")
  const [formFileType, setFormFileType] = useState("")
  const [formFileSize, setFormFileSize] = useState(0)

  useEffect(() => {
    loadResources()
  }, [lessonId])

  async function loadResources() {
    setLoading(true)
    try {
      const result = await getLessonResources(lessonId)
      setResources(result.resources)
    } catch {
      setResources([])
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setAdding(true)
    try {
      await addLessonResource(lessonId, {
        fileName: formFileName,
        fileUrl: formFileUrl,
        fileType: formFileType,
        fileSize: formFileSize,
      })
      setShowAdd(false)
      setFormFileName("")
      setFormFileUrl("")
      setFormFileType("")
      setFormFileSize(0)
      await loadResources()
    } catch {
      // silently fail
    } finally {
      setAdding(false)
    }
  }

  async function handleDelete(resourceId: string) {
    setDeleting(resourceId)
    try {
      await deleteLessonResource(resourceId)
      setResources((prev) => prev.filter((r) => r.id !== resourceId))
    } catch {
      // silently fail
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="rounded-xl border border-border-default bg-surface-dark p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">
          Resources
          {resources.length > 0 && (
            <span className="ml-2 text-xs font-normal text-text-secondary">({resources.length})</span>
          )}
        </h3>
        {editable && (
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex cursor-pointer items-center gap-1 rounded-lg border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-card-hover"
          >
            <Upload className="h-3.5 w-3.5" />
            {showAdd ? "Cancel" : "Add Resource"}
          </button>
        )}
      </div>

      {showAdd && editable && (
        <form onSubmit={handleAdd} className="mb-4 rounded-lg border border-border-default p-4">
          <div className="mb-2">
            <label className="mb-1 block text-xs font-medium text-text-secondary">File Name</label>
            <input
              type="text"
              value={formFileName}
              onChange={(e) => setFormFileName(e.target.value)}
              placeholder="e.g., course-slides.pdf"
              maxLength={255}
              required
              className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2 text-xs text-text-primary placeholder-text-tertiary focus:border-accent-500 focus:outline-none"
            />
          </div>
          <div className="mb-2">
            <label className="mb-1 block text-xs font-medium text-text-secondary">File URL</label>
            <input
              type="url"
              value={formFileUrl}
              onChange={(e) => setFormFileUrl(e.target.value)}
              placeholder="https://..."
              required
              className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2 text-xs text-text-primary placeholder-text-tertiary focus:border-accent-500 focus:outline-none"
            />
          </div>
          <div className="mb-2 grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary">Type</label>
              <input
                type="text"
                value={formFileType}
                onChange={(e) => setFormFileType(e.target.value)}
                placeholder="e.g., pdf, mp4"
                maxLength={100}
                required
                className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2 text-xs text-text-primary placeholder-text-tertiary focus:border-accent-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary">Size (bytes)</label>
              <input
                type="number"
                value={formFileSize || ""}
                onChange={(e) => setFormFileSize(Number(e.target.value))}
                min={0}
                required
                className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2 text-xs text-text-primary placeholder-text-tertiary focus:border-accent-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={adding}
              className="cursor-pointer rounded-lg bg-accent-500 px-4 py-1.5 text-xs font-medium text-text-on-accent transition-colors hover:bg-accent-500/90 disabled:opacity-50"
            >
              {adding ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin text-text-tertiary" />
        </div>
      ) : resources.length === 0 ? (
        <p className="py-4 text-center text-xs text-text-secondary">
          {editable ? "No resources yet. Add files or links for your students." : "No resources for this lesson."}
        </p>
      ) : (
        <div className="space-y-2">
          {resources.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-3 rounded-lg border border-border-default p-3 transition-colors hover:border-border-strong"
            >
              <FileText className="h-4 w-4 shrink-0 text-accent-500" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary">{r.fileName}</p>
                <p className="text-xs text-text-tertiary">{formatFileSize(r.fileSize)}</p>
              </div>
              <div className="flex items-center gap-1">
                {r.signedDownloadUrl || r.fileUrl ? (
                  <a
                    href={r.signedDownloadUrl ?? r.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-surface-card-hover hover:text-text-primary"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                ) : null}
                {editable && (
                  <button
                    onClick={() => handleDelete(r.id)}
                    disabled={deleting === r.id}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-accent-red/5 hover:text-accent-red"
                    title="Delete resource"
                  >
                    {deleting === r.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
