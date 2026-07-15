"use client"

import { useState, useEffect, useCallback } from "react"
import { Bell, Check, CheckCheck } from "lucide-react"
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/data/notifications"
import type { Notification } from "@/types/db"

const ICONS: Record<string, typeof Bell> = {
  THREAD_REPLY: Bell,
  ANSWER_ACCEPTED: Check,
  CERTIFICATE_ISSUED: Bell,
  PAYMENT_CONFIRMED: Bell,
  PAYMENT_FAILED: Bell,
  CONTENT_REPORTED: Bell,
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const data = await getNotifications()
      setNotifications(data)
    } catch {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleMarkRead(id: string) {
    try {
      await markNotificationRead(id)
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
    } catch { /* noop */ }
  }

  async function handleMarkAll() {
    try {
      await markAllNotificationsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch { /* noop */ }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div>
      {/* Page Header */}
      <div className="mb-7 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-brand-text-mid">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            className="cursor-pointer text-xs font-medium text-brand-green hover:text-brand-green-dark"
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-brand-text-light">
          <Bell className="mb-3 h-10 w-10" />
          <p className="text-sm">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = ICONS[n.type] || Bell
            return (
              <button
                key={n.id}
                onClick={() => !n.isRead && handleMarkRead(n.id)}
                className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                  n.isRead
                    ? "border-brand-border bg-brand-card"
                    : "border-brand-green/20 bg-brand-green-light/40"
                }`}
              >
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  n.isRead ? "bg-brand-bg text-brand-text-light" : "bg-brand-green-light text-brand-green"
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm ${n.isRead ? "text-brand-text-mid" : "font-medium text-brand-text"}`}>
                    {String(n.payload?.message || n.type.replace(/_/g, " "))}
                  </p>
                  <p className="mt-0.5 text-xs text-brand-text-light">
                    {new Date(n.createdAt).toLocaleDateString()} · {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {n.isRead ? (
                  <CheckCheck className="mt-1 h-3.5 w-3.5 shrink-0 text-brand-text-light" />
                ) : (
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-green" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
