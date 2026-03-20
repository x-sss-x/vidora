"use client";

import MuxPlayer from "@mux/mux-player-react";
import { formatDistanceToNowStrict } from "date-fns";
import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Player() {
  const vid = useSearchParams().get("vid");
  // biome-ignore lint/style/noNonNullAssertion: <Already checking in the server side>
  const [video] = api.video.getById.useSuspenseQuery({ videoId: vid! });

  return (
    <div className="col-span-6">
      {video.playbackId && (
        <MuxPlayer
          accentColor="var(--primary)"
          autoPlay
          className="aspect-video w-full border"
          playbackId={video.playbackId}
          title={video.title}
          videoTitle={video.title}
        />
      )}
      <div className="space-y-3 py-2">
        <div className="font-semibold text-xl">{video.title}</div>

        <div className="flex items-center gap-2.5">
          <Avatar>
            <AvatarImage src={video.creator.image ?? ""} />
            <AvatarFallback>{video.creator.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="font-semibold">{video.creator.name}</div>
        </div>

        <div className="flex flex-col gap-2 bg-accent p-3">
          <time className="text-muted-foreground text-xs">
            Uploaded{" "}
            {formatDistanceToNowStrict(video.createdAt, { addSuffix: true })}
          </time>

          <p className="font-light text-accent-foreground text-sm">
            {video.description ? (
              video.description
            ) : (
              <i>no description for this video...</i>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
