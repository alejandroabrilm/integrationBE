"use client";

import { useEffect, useState } from "react";
import { Reel } from "@/lib/types";
import ReelCard from "@/components/ReelCard";
import { getReels } from "@/lib/api";
import { mergeSimulatedReels } from "@/lib/client-simulation";

export default function ReelsPage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadReels() {
      setLoading(true);
      setError(null);

      try {
        const response = await getReels();
        if (!cancelled) setReels(mergeSimulatedReels(response));
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "No se pudieron cargar los reels.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadReels();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="flex justify-center py-20 text-gray-400">Loading reels…</div>;
  if (error) return <div className="flex justify-center py-20 text-gray-400">{error}</div>;

  return (
    <div className="flex flex-col items-center py-6 px-4">
      <h1 className="text-xl font-bold mb-6 self-start lg:self-center">Reels</h1>
      <div className="flex flex-col gap-6 items-center w-full">
        {reels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </div>
    </div>
  );
}
