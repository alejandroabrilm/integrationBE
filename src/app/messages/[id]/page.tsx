"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Conversation } from "@/lib/types";
import ConversationList from "@/components/ConversationList";
import MessageThread from "@/components/MessageThread";
import { getConversation, getConversations } from "@/lib/api";
import { mergeConversationList, mergeConversationMessages } from "@/lib/client-simulation";

export default function MessageThreadPage() {
  const { id } = useParams<{ id: string }>();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadConversation() {
      setLoading(true);
      setError(null);

      try {
        const [conversationResponse, conversationsResponse] = await Promise.all([
          getConversation(id),
          getConversations(),
        ]);

        if (cancelled) return;

        setConversation(mergeConversationMessages(conversationResponse));
        setConversations(mergeConversationList(conversationsResponse));
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "No se pudo cargar la conversacion."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadConversation();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <div className="flex justify-center py-20 text-gray-400">Loading…</div>;
  if (error) return <div className="flex justify-center py-20 text-gray-400">{error}</div>;
  if (!conversation) return <div className="flex justify-center py-20 text-gray-400">Conversation not found.</div>;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] lg:h-screen max-w-4xl mx-auto border-x border-gray-200 bg-white">
      <div className="hidden md:block w-80 border-r border-gray-200 overflow-y-auto flex-shrink-0">
        <ConversationList conversations={conversations} activeId={id} />
      </div>
      <div className="flex-1 overflow-hidden">
        <MessageThread initialConversation={conversation} />
      </div>
    </div>
  );
}
