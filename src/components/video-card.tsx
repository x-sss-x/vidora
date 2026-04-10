"use client";

import { BookmarkSimpleIcon } from "@phosphor-icons/react";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatTime } from "@/lib/utils";
import { authClient } from "@/server/better-auth/client";
import type { RouterOutputs } from "@/trpc/react";
import { api } from "@/trpc/react";
import { AspectRatio } from "./ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

type VideoCardProps = {
  orientation?: "vertical" | "horizontal";
  size?: "default" | "sm";
  showWatchListButton?: boolean;
} & RouterOutputs["video"]["list"][number];

export function VideoCard({
  id,
  title,
  thumbnailUrl,
  createdAt,
  duration,
  creator,
  description,
  isInWatchList = false,
  orientation = "vertical",
  size = "default",
  showWatchListButton = false,
}: VideoCardProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const utils = api.useUtils();
  const { mutate: addToWatchList, isPending: isAddingToWatchList } =
    api.video.addToWatchList.useMutation({
      onSuccess: async () => {
        await utils.video.invalidate();
        toast.info("Added to watch list.");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: removeFromWatchList, isPending: isRemovingFromWatchList } =
    api.video.removeFromWatchList.useMutation({
      onSuccess: async () => {
        await utils.video.invalidate();
        toast.info("Removed from watch list.");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return (
    <div className="relative">
      {showWatchListButton && (
        <Button
          className={cn(
            "absolute top-2 right-2 z-10",
            orientation === "horizontal" &&
              size === "sm" &&
              "top-1.5 right-1.5",
          )}
          disabled={isAddingToWatchList || isRemovingFromWatchList}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!session) {
              router.push("/sign-in");
              return;
            }

            if (isInWatchList) {
              removeFromWatchList({ videoId: id });
              return;
            }

            addToWatchList({ videoId: id });
          }}
          size="icon"
          variant={isInWatchList ? "default" : "secondary"}
        >
          {isAddingToWatchList || isRemovingFromWatchList ? (
            <Spinner />
          ) : (
            <BookmarkSimpleIcon className="size-4" />
          )}
        </Button>
      )}
      <Link className="group block" href={`/watch?vid=${id}`}>
        <Card
          className={cn(
            "gap-0 overflow-hidden bg-card/10 p-0 shadow-none transition group-hover:bg-accent",
            orientation === "horizontal" && "flex-row",
          )}
        >
          {/* Thumbnail */}
          <AspectRatio
            className={cn(
              "relative h-52 w-full overflow-hidden",
              orientation === "horizontal" && "h-44 min-w-xs max-w-xs border-r",
              orientation === "vertical" && "border-b",
              size === "sm" && "h-20 min-w-[140px] max-w-[140px]",
            )}
            ratio={16 / 9}
          >
            <Image
              alt={title}
              className="object-cover transition-transform duration-300"
              fill
              priority
              sizes="100%"
              src={thumbnailUrl}
            />

            {/* Duration */}
            {duration && (
              <div className="absolute right-2 bottom-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] text-white">
                {formatTime(duration)}
              </div>
            )}
          </AspectRatio>

          {/* Content */}
          <CardContent
            className={cn(
              "p-3",
              orientation === "horizontal" && "flex-1 truncate pr-6",
            )}
          >
            <div className="space-y-4">
              <div className="flex gap-3">
                <Avatar
                  className={cn(orientation === "horizontal" && "hidden")}
                >
                  <AvatarImage src={creator.image ?? ""} />
                  <AvatarFallback className={"text-xs"}>
                    {creator.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {/** Title & Timestamp */}
                <div className="space-y-0.5 overflow-hidden">
                  {/* Title */}
                  <h3
                    className={cn(
                      "line-clamp-2 max-w-full truncate font-medium text-sm leading-tight",
                      orientation === "horizontal" && "text-lg",
                      size === "sm" && "text-sm",
                    )}
                  >
                    {title}
                  </h3>

                  <p className="text-muted-foreground text-xs">
                    <strong>{creator.name}</strong>
                    {" · "}
                    <span suppressHydrationWarning>
                      {formatDistanceToNowStrict(createdAt, {
                        addSuffix: true,
                      })}
                    </span>
                  </p>
                </div>
              </div>

              {description && orientation === "horizontal" && size !== "sm" && (
                <p className="truncate text-muted-foreground text-xs">
                  {description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
