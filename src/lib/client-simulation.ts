import { CURRENT_USER } from "@/lib/mock-data";
import { Conversation, DirectMessage, Post, Reel, User } from "@/lib/types";

const KEYS = {
  posts: "fakestagram.sim.posts",
  reels: "fakestagram.sim.reels",
  profile: "fakestagram.sim.profile",
  messages: "fakestagram.sim.messages",
};

type CurrentUserProfileOverride = Pick<User, "name" | "bio" | "website" | "avatar">;
type MessageStore = Record<string, DirectMessage[]>;

function canUseStorage() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures in this teaching project simulation.
  }
}

function dedupeById<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function sortByDateDesc<T extends { createdAt: string }>(items: T[]) {
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getCurrentUserSnapshot(): User {
  const override = readJson<Partial<CurrentUserProfileOverride>>(KEYS.profile, {});
  return {
    ...CURRENT_USER,
    ...override,
  };
}

export function saveCurrentUserProfile(
  profile: Pick<User, "name" | "bio" | "website" | "avatar">
) {
  writeJson(KEYS.profile, profile);
}

export function addSimulatedPost(post: Post) {
  const stored = readJson<Post[]>(KEYS.posts, []);
  writeJson(KEYS.posts, dedupeById([post, ...stored]));
}

export function mergeSimulatedPosts(posts: Post[]) {
  const simulated = readJson<Post[]>(KEYS.posts, []);
  return dedupeById(sortByDateDesc([...simulated, ...posts]));
}

export function addSimulatedReel(reel: Reel) {
  const stored = readJson<Reel[]>(KEYS.reels, []);
  writeJson(KEYS.reels, dedupeById([reel, ...stored]));
}

export function mergeSimulatedReels(reels: Reel[]) {
  const simulated = readJson<Reel[]>(KEYS.reels, []);
  return dedupeById(sortByDateDesc([...simulated, ...reels]));
}

export function addSimulatedMessage(conversationId: string, message: DirectMessage) {
  const store = readJson<MessageStore>(KEYS.messages, {});
  const existing = store[conversationId] ?? [];
  store[conversationId] = dedupeById([...existing, message]);
  writeJson(KEYS.messages, store);
}

export function mergeConversationMessages(conversation: Conversation): Conversation {
  const store = readJson<MessageStore>(KEYS.messages, {});
  const simulated = store[conversation.id] ?? [];
  const messages = dedupeById(
    [...conversation.messages, ...simulated].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
  );

  return {
    ...conversation,
    messages,
    lastMessage: messages[messages.length - 1] ?? conversation.lastMessage,
  };
}

export function mergeConversationList(conversations: Conversation[]) {
  return conversations
    .map(mergeConversationMessages)
    .sort(
      (a, b) =>
        new Date(b.lastMessage.createdAt).getTime() -
        new Date(a.lastMessage.createdAt).getTime()
    );
}
