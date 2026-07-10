"use client"

import { useState, useRef } from "react"
import { Upload, X, Loader2, ImageIcon } from "lucide-react"
import { getPresignedUrl, uploadFile } from "@/lib/data/uploads"
import { updateCourse } from "@/lib/data/courses"
import { cn } from "@/lib/utils"

interface CourseCoverUploadProps {
  courseId: string
  currentUrl?: string | null
  onUpdated?: (url: string) => void
}

export function CourseCoverUpload({ courseId, currentUrl, onUpdated }: CourseCoverUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB")
      return
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPEG, PNG, WebP, and GIF images are allowed")
      return
    }

    setUploading(true)
    setError(null)

    try {
      const presign = await getPresignedUrl({
        purpose: "course-cover",
        contentType: file.type,
        fileName: file.name,
        courseId,
      })

      await uploadFile(presign, file)

      const publicUrl = presign.publicUrl ?? presign.path
      if (publicUrl) {
        await updateCourse(courseId, { coverImageUrl: publicUrl })
        setPreview(publicUrl)
        onUpdated?.(publicUrl)
      } else {
        setError("Upload succeeded but no public URL returned")
      }
    } catch {
      setError("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  function handleRemove() {
    setPreview(null)
    inputRef.current?.value && (inputRef.current.value = "")
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-text-secondary">Course Cover Image</label>
      <div
        className={cn(
          "relative flex h-40 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors",
          uploading
            ? "border-accent-500/50 bg-accent-500/5"
            : preview
              ? "border-border-default"
              : "border-border-default hover:border-accent-500/50 hover:bg-accent-500/5",
        )}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-accent-500" />
            <span className="text-xs text-text-secondary">Uploading...</span>
          </div>
        ) : preview ? (
          <>
            <img
              src={preview}
              alt="Course cover"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemove() }}
              className="absolute right-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-surface-card/80 text-text-secondary backdrop-blur-sm transition-colors hover:bg-surface-card hover:text-text-primary"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="h-8 w-8 text-text-tertiary" />
            <span className="text-xs text-text-tertiary">Click to upload cover image</span>
            <span className="text-[10px] text-text-tertiary">JPEG, PNG, WebP · Max 5MB</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileSelect}
      />

      {error && (
        <p className="mt-1 text-xs text-accent-red">{error}</p>
      )}
    </div>
  )
}
