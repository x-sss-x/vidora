"use client";

import { isEmpty } from "lodash";
import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "./ui/empty";
import { Skeleton } from "./ui/skeleton";
import { VideoCard } from "./video-card";

export function RecommendationList() {
  const vid = useSearchParams().get("vid");
  const { data: videos, isLoading } = api.video.recommendationList.useQuery({
    // biome-ignore lint/style/noNonNullAssertion: <Already verifying it in the server>
    currentVideoId: vid!,
  });

  if (isLoading)
    return (
      <div className="col-span-4 flex flex-col gap-4">
        {Array.from({ length: 20 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <Just for this>
          <Skeleton className="h-24 w-full" key={i + 1} />
        ))}
      </div>
    );

  if (isEmpty(videos))
    return (
      <div>
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No Recommended Videos</EmptyTitle>
            <EmptyDescription>
              There are not much content we could recommend to you
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );

  return (
    <div className="col-span-4 flex flex-col gap-4">
      <div className="font-semibold text-lg">Recommended Videos</div>
      {videos?.map((v) => (
        <VideoCard key={v.id} {...v} orientation="horizontal" size="sm" />
      ))}
    </div>
  );
}
