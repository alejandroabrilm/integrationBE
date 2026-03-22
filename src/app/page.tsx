"use client";

import { useEffect, useState } from "react";
import { Post, User } from "@/lib/types";
import PostCard from "@/components/PostCard";
import StoriesBar from "@/components/StoriesBar";
import { getPosts, getSuggestions } from "@/lib/api";
import { getCurrentUserSnapshot, mergeSimulatedPosts } from "@/lib/client-simulation";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState(getCurrentUserSnapshot());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadFeed() {
      setLoading(true);
      setError(null);

      try {
        const [postsResponse, suggestionsResponse] = await Promise.all([
          getPosts(),
          getSuggestions(),
        ]);

        if (cancelled) return;

        setPosts(mergeSimulatedPosts(postsResponse));
        setSuggestions(suggestionsResponse);
        setCurrentUser(getCurrentUserSnapshot());
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "No se pudo cargar el feed.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadFeed();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="flex justify-center py-20 text-gray-400">Loading feed…</div>;
  if (error) return <div className="flex justify-center py-20 text-gray-400">{error}</div>;

  return (
    <div className="flex justify-center gap-8 px-4 py-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-6 w-full max-w-[468px]">
        <StoriesBar />
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <aside className="hidden xl:block w-72 flex-shrink-0 pt-4">
        <div className="sticky top-6">
          <div className="flex items-center gap-3 mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentUser.avatar}
              alt="Your avatar"
              className="w-11 h-11 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold">{currentUser.username}</p>
              <p className="text-xs text-gray-400">{currentUser.name}</p>
            </div>
          </div>
          <p className="text-xs font-semibold text-gray-400 mb-3">Suggested for you</p>
          {suggestions.map((user) => (
            <div key={user.id} className="flex items-center gap-3 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatar}
                alt={user.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{user.username}</p>
                <p className="text-xs text-gray-400">Suggested</p>
              </div>
              <button className="text-xs font-semibold text-blue-500 hover:text-blue-700">Follow</button>
            </div>
          ))}
          <p className="text-xs text-gray-300 mt-4">© 2025 Fakestagram · Teaching Project</p>
        </div>
      </aside>
    </div>
  );
}
