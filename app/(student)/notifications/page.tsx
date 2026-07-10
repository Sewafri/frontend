"use client"

import { useState, useEffect, useCallback } from "react"
import { Bell, Check, CheckCheck } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
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
      <PageHeader
        title="Notifications"
        description={unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
        actions={
          unreadCount > 0 ? (
            <button onClick={handleMarkAll} className="cursor-pointer text-xs text-accent-500 hover:text-accent-600">
              Mark all as read
            </button>
          ) : undefined
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-text-tertiary">
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
                className={`flex w-full cursor-pointer items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                  n.isRead
                    ? "border-border-default bg-surface-card"
                    : "border-accent-500/20 bg-accent-500/5"
                }`}
              >
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  n.isRead ? "bg-surface-sunken text-text-tertiary" : "bg-accent-500/10 text-accent-500"
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm ${n.isRead ? "text-text-secondary" : "font-medium text-text-primary"}`}>
                    {String(n.payload?.message || n.type.replace(/_/g, " "))}
                  </p>
                  <p className="mt-0.5 text-xs text-text-tertiary">
                    {new Date(n.createdAt).toLocaleDateString()} · {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {n.isRead ? (
                  <CheckCheck className="mt-1 h-3.5 w-3.5 shrink-0 text-text-quaternary" />
                ) : (
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent-500" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
