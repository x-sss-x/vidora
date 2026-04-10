"use client";

import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { VideoCard } from "./video-card";

export function SearchList() {
  const q = useSearchParams().get("q");
  const [videos] = api.video.list.useSuspenseQuery({ q });

  return (
    <div className="flex flex-col gap-4">
      {videos.map((v) => (
        <VideoCard key={v.id} {...v} orientation="horizontal" showWatchListButton />
      ))}
    </div>
  );
}
