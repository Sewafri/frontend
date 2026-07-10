"use client"

import { useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import GlassCard from "@/components/ui/glass-card"
import { GraduationCap, Send, AlertCircle } from "lucide-react"
import { applyAsInstructor } from "@/lib/data/instructor-applications"
import { ApiError } from "@/lib/api/client"

export default function InstructorApplyPage() {
  const [submitted, setSubmitted] = useState(false)
  const [expertise, setExpertise] = useState("")
  const [bio, setBio] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!expertise.trim() || !bio.trim()) {
      setError("Please fill in all required fields")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await applyAsInstructor({ bio: bio.trim(), expertise: expertise.trim() })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to submit application")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div>
        <PageHeader title="Application Submitted" description="We'll review your application and get back to you soon" />
        <GlassCard>
          <div className="flex flex-col items-center py-10 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-green/10">
              <GraduationCap className="h-8 w-8 text-accent-green" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary">Thank You!</h2>
            <p className="mt-2 max-w-md text-sm text-text-secondary">
              Your application to become an instructor has been submitted successfully. Our team will review your qualifications and get back to you within 3-5 business days.
            </p>
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Become an Instructor" description="Share your knowledge with thousands of students" />

      <GlassCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="mb-4 text-sm font-semibold text-text-primary">Tell Us About Yourself</h3>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                Area of Expertise <span className="text-accent-red">*</span>
              </label>
              <input
                type="text"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                placeholder="e.g., Web Development, Data Science, UI/UX Design"
                maxLength={500}
                required
                className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/10"
              />
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                Bio / Teaching Philosophy <span className="text-accent-red">*</span>
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                placeholder="Tell us about your teaching experience, qualifications, and philosophy..."
                minLength={10}
                maxLength={5000}
                required
                className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/10"
              />
              <p className="mt-1 text-right text-xs text-text-tertiary">{bio.length}/5000</p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-accent-red/20 bg-accent-red/5 px-4 py-3 text-xs text-accent-red">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex justify-end border-t border-border-default pt-6">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-accent-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-500/90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}
