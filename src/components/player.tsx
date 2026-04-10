"use client";

import MuxPlayer from "@mux/mux-player-react";
import { BookmarkSimpleIcon } from "@phosphor-icons/react";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/server/better-auth/client";
import { api } from "@/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

export default function Player() {
  const vid = useSearchParams().get("vid");
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const utils = api.useUtils();
  // biome-ignore lint/style/noNonNullAssertion: <Already checking in the server side>
  const [video] = api.video.getById.useSuspenseQuery({ videoId: vid! });
  const { mutate: addToWatchList, isPending } =
    api.video.addToWatchList.useMutation({
      onSuccess: async () => {
        if (vid) {
          await utils.video.getById.invalidate({ videoId: vid });
        }
        await utils.video.listWatchList.invalidate();
        await utils.video.list.invalidate();
        await utils.video.recommendationList.invalidate();
        toast.success("Added to watch list.");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return (
    <div className="col-span-8">
      <div
        className={"flex aspect-video h-fit w-full items-center justify-center"}
      >
        {video.playbackId ? (
          <MuxPlayer
            accentColor="var(--primary)"
            autoPlay
            className="aspect-video w-full border"
            playbackId={video.playbackId}
            title={video.title}
            videoTitle={video.title}
          />
        ) : (
          <Spinner className="size-8" />
        )}
      </div>
      <div className="space-y-3 py-2">
        <div className="flex items-center justify-between gap-3">
          <div className="font-semibold text-xl">{video.title}</div>
          <Button
            disabled={video.isInWatchList || isPending}
            onClick={() => {
              if (!session) {
                router.push("/sign-in");
                return;
              }
              addToWatchList({ videoId: video.id });
            }}
            size="sm"
            variant={video.isInWatchList ? "secondary" : "default"}
          >
            <BookmarkSimpleIcon className="size-4" />
            {video.isInWatchList
              ? "Saved"
              : isPending
                ? "Saving..."
                : "Save to Watch List"}
          </Button>
        </div>

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
