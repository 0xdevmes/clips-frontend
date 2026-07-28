"use client";

import { useEffect, useState } from "react";
import type { SearchResponse } from "@/app/api/search/route";
import type { ApiResponse } from "@/app/api/types";

const DEBOUNCE_MS = 300;

export interface UseGlobalSearchResult {
  results: SearchResponse | null;
  loading: boolean;
  error: string | null;
}

const EMPTY: SearchResponse = { clips: [], projects: [], earnings: [] };

/**
 * Debounced global search across clips, projects, and earnings (issue
 * #798), backing the command palette's search mode. Returns null results
 * (not an empty state) for a blank query so callers can distinguish "no
 * query yet" from "query returned nothing".
 */
export function useGlobalSearch(query: string): UseGlobalSearchResult {
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}&types=clips,projects,earnings`,
        );
        if (!res.ok) {
          throw new Error(`Search failed (HTTP ${res.status})`);
        }
        const body = (await res.json()) as ApiResponse<SearchResponse>;
        if (cancelled) return;
        setResults(body.data ?? EMPTY);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Search failed");
        setResults(EMPTY);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return { results, loading, error };
}
