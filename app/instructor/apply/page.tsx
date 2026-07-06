"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { GraduationCap, Send } from "lucide-react";

export default function InstructorApplyPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="">
        <PageHeader title="Application Submitted" description="We&apos;ll review your application and get back to you soon" />
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
    );
  }

  return (
    <div className="">
      <PageHeader title="Become an Instructor" description="Share your knowledge with thousands of students" />

      <GlassCard>
        <div className="space-y-6">
          <div>
            <h3 className="mb-4 text-sm font-semibold text-text-primary">Personal Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Full Name</label>
                <input type="text" placeholder="Dr. Sarah Wilson" className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2.5 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-brand-orange/50" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Email</label>
                <input type="email" placeholder="sarah@example.com" className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2.5 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-brand-orange/50" />
              </div>
            </div>
          </div>

          <div className="border-t border-border-glass pt-6">
            <h3 className="mb-4 text-sm font-semibold text-text-primary">Expertise &amp; Experience</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Area of Expertise</label>
                <select className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-brand-orange/50">
                  <option>Web Development</option>
                  <option>Data Science</option>
                  <option>UI/UX Design</option>
                  <option>Mobile Development</option>
                  <option>DevOps</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Years of Experience</label>
                <select className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-brand-orange/50">
                  <option>1-2 years</option>
                  <option>3-5 years</option>
                  <option>5-10 years</option>
                  <option>10+ years</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Bio / Teaching Philosophy</label>
              <textarea rows={5} placeholder="Tell us about your teaching experience and philosophy..." className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2.5 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-brand-orange/50" />
            </div>
          </div>

          <div className="flex justify-end border-t border-border-glass pt-6">
            <button onClick={() => setSubmitted(true)} className="cursor-pointer flex items-center gap-2 rounded-lg bg-brand-orange px-6 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-brand-orange/90">
              <Send className="h-4 w-4" /> Submit Application
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
