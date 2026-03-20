"use client";

import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatTime } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/react";
import { AspectRatio } from "./ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type VideoCardProps = {
  orientation?: "vertical" | "horizontal";
} & RouterOutputs["video"]["list"][number];

export function VideoCard({
  id,
  title,
  thumbnailUrl,
  createdAt,
  duration,
  creator,
  description,
  orientation = "vertical",
}: VideoCardProps) {
  return (
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
              <Avatar className={cn(orientation === "horizontal" && "hidden")}>
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
                  )}
                >
                  {title}
                </h3>

                <p className="text-muted-foreground text-xs">
                  <strong>{creator.name}</strong>
                  {" · "}
                  <span suppressHydrationWarning>
                    {formatDistanceToNowStrict(createdAt, { addSuffix: true })}
                  </span>
                </p>
              </div>
            </div>

            {description && orientation === "horizontal" && (
              <p className="truncate text-muted-foreground text-xs">
                {description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
