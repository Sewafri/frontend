"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PageHeader } from "@/components/ui/page-header";
import Companion from "@/components/companion/companion";
import GlassCard from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  initials: string;
}

const EXAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    lastMessage: "Great work on the assignment! Let me know if you have any questions about the next module.",
    timestamp: "2m ago",
    unread: 2,
    initials: "SJ",
  },
  {
    id: "2",
    name: "Mike Chen",
    lastMessage: "Did you finish the group project? I'm free to meet tomorrow.",
    timestamp: "1h ago",
    unread: 0,
    initials: "MC",
  },
  {
    id: "3",
    name: "Prof. Adebayo",
    lastMessage: "Reminder: Office hours are 2–4 PM tomorrow.",
    timestamp: "3h ago",
    unread: 1,
    initials: "PA",
  },
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const hasMessages = conversations.length > 0;
  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  const loadExample = useCallback(() => {
    setConversations(EXAMPLE_CONVERSATIONS);
  }, []);

  const reset = useCallback(() => {
    setConversations([]);
  }, []);

  return (
    <div>
      <PageHeader
        title="Messages"
        description={
          hasMessages
            ? `You have ${totalUnread} unread message${totalUnread !== 1 ? "s" : ""}`
            : "Your conversations and direct messages"
        }
      />

      <AnimatePresence mode="wait">
        {hasMessages ? (
          <motion.div
            key="messages"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="space-y-3"
          >
            {conversations.map((conv, i) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <GlassCard>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-500/10 text-sm font-semibold text-accent-500">
                      {conv.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate font-medium text-text-primary">{conv.name}</p>
                        <div className="flex shrink-0 items-center gap-2">
                          {conv.unread > 0 && (
                            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent-500 px-1.5 text-[11px] font-semibold text-white">
                              {conv.unread}
                            </span>
                          )}
                          <span className="text-xs text-text-tertiary">{conv.timestamp}</span>
                        </div>
                      </div>
                      <p className="mt-0.5 truncate text-sm text-text-secondary">{conv.lastMessage}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
            <div className="flex justify-center pt-2">
              <button
                onClick={reset}
                className="text-xs text-text-tertiary underline-offset-2 hover:text-text-secondary hover:underline"
              >
                Reset to empty state
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <GlassCard className="py-16">
              <div className="flex flex-col items-center">
                <Companion
                  message="Oops! No messages yet"
                  variant="scrolling"
                  size="lg"
                  bubblePosition="top"
                  animate
                  className="mb-4"
                />
                <p className="mb-6 max-w-md text-center text-sm text-text-secondary">
                  Start a conversation with your instructors or fellow students to get the most out of
                  your learning experience.
                </p>
                <Button
                  render={<Link href="/courses" />}
                  nativeButton={false}
                >
                  Browse Courses
                </Button>
                <button
                  onClick={loadExample}
                  className="mt-4 text-xs text-text-tertiary underline-offset-2 hover:text-text-secondary hover:underline"
                >
                  Show example messages
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
