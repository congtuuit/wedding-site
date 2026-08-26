"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getActiveWeddingStage, ActiveWeddingStage } from "@/lib/wedding-timeline";

export function useActiveWeddingStage(initialStage?: ActiveWeddingStage): ActiveWeddingStage {
  const searchParams = useSearchParams();
  const eventParam = searchParams.get("event") || searchParams.get("type");

  // Compute stage based on search param or current system clock
  const stage = useMemo(() => {
    return getActiveWeddingStage(eventParam);
  }, [eventParam]);

  const [activeStage, setActiveStage] = useState<ActiveWeddingStage>(
    initialStage || stage
  );

  useEffect(() => {
    setActiveStage(stage);
  }, [stage]);

  return activeStage;
}
