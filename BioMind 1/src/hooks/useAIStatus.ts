"use client";

import { useEffect, useState } from "react";

export function useAIStatus() {
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/ai/status")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setAvailable(Boolean(data?.available));
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { available, loading: available === null };
}
