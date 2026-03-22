import { Conversation, Post, Reel, User } from "@/lib/types";

interface ProfileResponse {
  user: User;
  posts: Post[];
}

async function fetchJson<T>(input: string): Promise<T> {
  const res = await fetch(input, { cache: "no-store" });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;

    try {
      const payload = (await res.json()) as { error?: string };
      if (payload?.error) message = payload.error;
    } catch {
      // Ignore parse failures and keep the generic message.
    }

    throw new Error(message);
  }

  return (await res.json()) as T;
}

export function getPosts() {
  return fetchJson<Post[]>("/api/posts");
}

export function getReels() {
  return fetchJson<Reel[]>("/api/reels");
}

export function getConversations() {
  return fetchJson<Conversation[]>("/api/messages");
}

export function getConversation(id: string) {
  return fetchJson<Conversation>(`/api/messages/${id}`);
}

export function getSuggestions() {
  return fetchJson<User[]>("/api/suggestions");
}

export function getProfile(username: string) {
  return fetchJson<ProfileResponse>(`/api/profile/${username}`);
}
