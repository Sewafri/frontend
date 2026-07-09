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
    name: "Amara Okafor",
    lastMessage: "Professor, I'm struggling with the calculus assignment. Could we schedule a quick meeting?",
    timestamp: "10m ago",
    unread: 1,
    initials: "AO",
  },
  {
    id: "2",
    name: "Chidi Eze",
    lastMessage: "Thank you for the feedback on my essay! I've incorporated your suggestions.",
    timestamp: "2h ago",
    unread: 0,
    initials: "CE",
  },
  {
    id: "3",
    name: "Fatima Ibrahim",
    lastMessage: "Will the workshop recording be available? I had a conflict and couldn't attend.",
    timestamp: "1d ago",
    unread: 3,
    initials: "FI",
  },
];

export default function InstructorMessagesPage() {
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
            ? `You have ${totalUnread} unread conversation${totalUnread !== 1 ? "s" : ""}`
            : "Conversations with your students"
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
                  message="No conversations yet"
                  variant="scrolling"
                  size="lg"
                  bubblePosition="top"
                  animate
                  className="mb-4"
                />
                <p className="mb-6 max-w-md text-center text-sm text-text-secondary">
                  When students reach out, their messages will appear here. You can also start
                  conversations from your course pages.
                </p>
                <Button
                  render={<Link href="/instructor/courses" />}
                  nativeButton={false}
                >
                  View Courses
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
