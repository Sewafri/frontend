import { api, apiMutate } from "@/lib/api/client"
import type { ForumThread, ForumPost } from "@/types/db"

export async function getForumThreads(courseId: string): Promise<ForumThread[]> {
  const data = await api<{ threads: ForumThread[] }>(`/courses/${courseId}/forum/threads`)
  return data.threads
}

export async function createForumThread(
  courseId: string,
  title: string,
  body?: string,
): Promise<ForumThread> {
  const data = await apiMutate<{ thread: ForumThread }>(
    `/courses/${courseId}/forum/threads`,
    { method: "POST", body: JSON.stringify({ title, body: body || title }) },
    "Thread created",
  )
  return data.thread
}

export async function createForumPost(
  threadId: string,
  body: string,
): Promise<ForumPost> {
  const data = await apiMutate<{ post: ForumPost }>(
    `/forum/threads/${threadId}/posts`,
    { method: "POST", body: JSON.stringify({ body }) },
    "Post created",
  )
  return data.post
}

export async function getForumThread(
  threadId: string,
): Promise<{ thread: ForumThread & { posts: ForumPost[] } }> {
  const data = await api<{ thread: ForumThread & { posts: ForumPost[] } }>(
    `/forum/threads/${threadId}`,
    { silent: true },
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

export async function togglePinThread(threadId: string): Promise<{ thread: ForumThread }> {
  return apiMutate<{ thread: ForumThread }>(
    `/forum/threads/${threadId}/pin`,
    { method: "PATCH" },
    "Thread pin toggled",
  )
}

export async function toggleLockThread(threadId: string): Promise<{ thread: ForumThread }> {
  return apiMutate<{ thread: ForumThread }>(
    `/forum/threads/${threadId}/lock`,
    { method: "PATCH" },
    "Thread lock toggled",
  )
}

export async function acceptPostAnswer(postId: string): Promise<{ post: ForumPost }> {
  return apiMutate<{ post: ForumPost }>(
    `/forum/posts/${postId}/accept`,
    { method: "PATCH" },
    "Answer accepted",
  )
}

export async function editForumPost(postId: string, body: string): Promise<{ post: ForumPost }> {
  return apiMutate<{ post: ForumPost }>(
    `/forum/posts/${postId}`,
    { method: "PATCH", body: JSON.stringify({ body }) },
    "Post updated",
  )
}

export async function deleteForumPost(postId: string): Promise<void> {
  await apiMutate(`/forum/posts/${postId}`, { method: "DELETE" }, "Post deleted")
}

export async function toggleUpvotePost(postId: string): Promise<{ upvoted: boolean }> {
  return apiMutate<{ upvoted: boolean }>(
    `/forum/posts/${postId}/upvote`,
    { method: "PUT" },
  )
}

export async function removeUpvotePost(postId: string): Promise<{ upvoted: boolean }> {
  return apiMutate<{ upvoted: boolean }>(
    `/forum/posts/${postId}/upvote`,
    { method: "DELETE" },
  )
}
