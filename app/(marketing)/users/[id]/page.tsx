"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { ArrowLeft, User } from "lucide-react"
import { getPublicProfile, type PublicProfile } from "@/lib/data/users"
import { ApiError } from "@/lib/api/client"

export default function PublicProfilePage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params)
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getPublicProfile(id)
      .then((data) => setProfile(data.user))
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load profile"))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <User className="h-12 w-12 text-text-tertiary" />
        <p className="text-sm text-text-secondary">{error || "User not found"}</p>
        <Link href="/courses" className="text-sm text-accent-500 hover:text-accent-600">Browse courses</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <Link href="/courses" className="mb-6 inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="rounded-2xl border border-border-default bg-surface-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent-500/10">
          {profile.photoUrl ? (
            <img src={profile.photoUrl} alt="" className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-accent-500">{profile.fullName.charAt(0)}</span>
          )}
        </div>

        <h1 className="font-display text-xl font-bold text-text-primary">{profile.fullName}</h1>
        <p className="mt-1 text-sm capitalize text-text-secondary">{profile.role.toLowerCase()}</p>

        {profile.expertise && (
          <p className="mt-2 text-sm text-text-tertiary">{profile.expertise}</p>
        )}

        {profile.bio && (
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">{profile.bio}</p>
        )}
      </div>
    </div>
  )
}
