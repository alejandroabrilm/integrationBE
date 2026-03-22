"use client";

import { useEffect, useState } from "react";
import { Conversation } from "@/lib/types";
import ConversationList from "@/components/ConversationList";
import { getConversations } from "@/lib/api";
import { mergeConversationList } from "@/lib/client-simulation";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadConversations() {
      setLoading(true);
      setError(null);

      try {
        const response = await getConversations();
        if (!cancelled) setConversations(mergeConversationList(response));
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "No se pudieron cargar las conversaciones."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadConversations();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="flex justify-center py-20 text-gray-400">Loading messages…</div>;
  if (error) return <div className="flex justify-center py-20 text-gray-400">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-3.5rem)] lg:h-screen border-x border-gray-200 bg-white">
      <ConversationList conversations={conversations} />
    </div>
  );
}
