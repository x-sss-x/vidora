"use client";

import { ClockIcon } from "@phosphor-icons/react";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatTime } from "@/lib/utils";
import { AspectRatio } from "./ui/aspect-ratio";

interface VideoCardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  createdAt: Date | string;
  duration: number;
}

export function VideoCard({
  id,
  title,
  thumbnailUrl,
  createdAt,
  duration,
}: VideoCardProps) {
  return (
    <Link className="group block" href={`/watch/${id}`}>
      <Card className="overflow-hidden rounded-xs border-none p-0 shadow-none transition group-hover:bg-accent">
        {/* Thumbnail */}
        <AspectRatio
          className="relative h-52 w-full overflow-hidden"
          ratio={16 / 9}
        >
          <Image
            alt={title}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
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
        <CardContent className="px-3 pb-4">
          <div className="space-y-1">
            {/* Title */}
            <h3 className="line-clamp-2 font-medium text-sm leading-tight">
              {title}
            </h3>

            {/* Meta */}
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <ClockIcon size={12} />
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
