"use client";

import { ClockIcon } from "@phosphor-icons/react";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatTime } from "@/lib/utils";
import { AspectRatio } from "./ui/aspect-ratio";

interface VideoCardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  createdAt: Date | string;
  duration: number;
  orientation?: "vertical" | "horizontal";
}

export function VideoCard({
  id,
  title,
  thumbnailUrl,
  createdAt,
  duration,
  orientation = "vertical",
}: VideoCardProps) {
  return (
    <Link className="group block" href={`/watch/${id}`}>
      <Card
        className={cn(
          "overflow-hidden bg-card/10 p-0 shadow-none transition group-hover:bg-accent",
          orientation === "horizontal" && "flex-row",
        )}
      >
        {/* Thumbnail */}
        <AspectRatio
          className={cn(
            "relative h-52 w-full overflow-hidden",
            orientation === "horizontal" && "h-44 max-w-xs",
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
            "px-3 pb-4",
            orientation === "horizontal" && "px-0 py-2",
          )}
        >
          <div className="space-y-1">
            {/* Title */}
            <h3
              className={cn(
                "line-clamp-2 font-medium text-sm leading-tight",
                orientation === "horizontal" && "text-lg",
              )}
            >
              {title}
            </h3>

            {/* Meta */}
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <span suppressHydrationWarning>
                {formatDistanceToNowStrict(createdAt, { addSuffix: true })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
