"use client";

import { BookmarkSimpleIcon } from "@phosphor-icons/react";
import { isEmpty } from "lodash";
import Link from "next/link";
import { api } from "@/trpc/react";
import { Button } from "./ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { VideoCard } from "./video-card";

export function WatchListVideos() {
  const [videos] = api.video.listWatchList.useSuspenseQuery();

  if (isEmpty(videos))
    return (
      <section className="flex min-h-[calc(100svh-160px)] items-center justify-center">
        <Empty>
          <EmptyMedia variant={"icon"}>
            <BookmarkSimpleIcon className="size-6" weight="duotone" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Your Watch List is Empty</EmptyTitle>
            <EmptyDescription>
              Save videos while watching and they will show up here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/">
              <Button>Browse Videos</Button>
            </Link>
          </EmptyContent>
        </Empty>
      </section>
    );

  return (
    <section className="space-y-4">
      <div className="font-semibold text-2xl">Your Watch List</div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {videos.map((video) => (
          <VideoCard key={video.id} {...video} showWatchListButton />
        ))}
      </div>
    </section>
  );
}
