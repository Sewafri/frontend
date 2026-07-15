"use client"

import { useState } from "react"
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
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">Application Submitted</h1>
          <p className="mt-1 text-sm text-brand-text-mid">We'll review your application and get back to you soon</p>
        </div>
        <div className="rounded-xl border border-brand-border bg-brand-card p-5">
          <div className="flex flex-col items-center py-10 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10">
              <GraduationCap className="h-8 w-8 text-brand-green" />
            </div>
            <h2 className="text-xl font-semibold text-brand-text">Thank You!</h2>
            <p className="mt-2 max-w-md text-sm text-brand-text-mid">
              Your application to become an instructor has been submitted successfully. Our team will review your qualifications and get back to you within 3-5 business days.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">Become an Instructor</h1>
        <p className="mt-1 text-sm text-brand-text-mid">Share your knowledge with thousands of students</p>
      </div>

      <div className="rounded-xl border border-brand-border bg-brand-card p-5">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="mb-4 text-sm font-semibold text-brand-text">Tell Us About Yourself</h3>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">
                Area of Expertise <span className="text-accent-red">*</span>
              </label>
              <input
                type="text"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                placeholder="e.g., Web Development, Data Science, UI/UX Design"
                maxLength={500}
                required
                className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2.5 text-sm text-brand-text placeholder-text-brand-text-light outline-none transition-colors focus:border-brand-green/50 focus:ring-2 focus:ring-brand-green/10"
              />
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-medium text-brand-text-mid">
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
                className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2.5 text-sm text-brand-text placeholder-text-brand-text-light outline-none transition-colors focus:border-brand-green/50 focus:ring-2 focus:ring-brand-green/10"
              />
              <p className="mt-1 text-right text-xs text-brand-text-light">{bio.length}/5000</p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-accent-red/20 bg-accent-red/5 px-4 py-3 text-xs text-accent-red">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex justify-end border-t border-brand-border pt-6">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand-green px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-green-dark disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
