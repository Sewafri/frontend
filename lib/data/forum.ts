import { api } from "@/lib/api/client"
import type { ForumThread, ForumPost } from "@/types/db"

export async function getForumThreads(courseId: string): Promise<ForumThread[]> {
  const data = await api<{ threads: ForumThread[] }>(`/courses/${courseId}/forum/threads`)
  return data.threads
}

export async function createForumThread(
  courseId: string,
  title: string,
): Promise<ForumThread> {
  const data = await api<{ thread: ForumThread }>(`/courses/${courseId}/forum/threads`, {
    method: "POST",
    body: JSON.stringify({ title }),
  })
  return data.thread
}

export async function createForumPost(
  threadId: string,
  body: string,
): Promise<ForumPost> {
  const data = await api<{ post: ForumPost }>(`/forum/threads/${threadId}/posts`, {
    method: "POST",
    body: JSON.stringify({ body }),
  })
  return data.post
}

export async function getForumThread(
  threadId: string,
): Promise<{ thread: ForumThread & { posts: ForumPost[] } }> {
  const data = await api<{ thread: ForumThread & { posts: ForumPost[] } }>(
    `/forum/threads/${threadId}`,
  )
  return data
}

export async function searchForumThreads(
  query: string,
  courseId?: string,
): Promise<ForumThread[]> {
  const data = await api<{ threads: ForumThread[] }>("/forum/search", {
    params: {
      q: query,
      courseId: courseId || undefined,
    },
  })
  return data.threads
}
