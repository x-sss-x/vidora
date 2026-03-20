"use client";

import { DotsThreeIcon, PenNibIcon, TrashIcon } from "@phosphor-icons/react";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DeleteVideoDialog } from "@/components/delete-video-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/react";

export type Video = RouterOutputs["video"]["listMine"][number];

export const columns: ColumnDef<Video>[] = [
  {
    accessorKey: "video",
    header: "Video",
    cell(props) {
      const row = props.row.original;
      return (
        <div className="flex min-h-16 items-center">
          <AspectRatio className="realtive h-full min-w-[100px]" ratio={16 / 9}>
            <Image
              alt={`${row.title}'s Thumbnail`}
              fill
              priority
              sizes="100%"
              src={row.thumbnailUrl}
            />
          </AspectRatio>
          <div className="flex flex-col gap-2 px-2.5 py-1">
            <Link href={`/my-studio/v/${row.uploadId}`}>
              <div className="font-medium text-foreground/80 text-sm hover:text-foreground hover:underline">
                {row.title}
              </div>
            </Link>
            <p
              className="text-muted-foreground text-xs"
              suppressHydrationWarning
            >
              Uploaded{" "}
              {formatDistanceToNowStrict(row.createdAt, { addSuffix: true })}{" "}
              {row.updatedAt && (
                <>
                  · Last updated{" "}
                  {formatDistanceToNowStrict(row.updatedAt, {
                    addSuffix: true,
                  })}
                </>
              )}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell(props) {
      const row = props.row.original;

      return (
        <Badge
          className={cn(
            "capitalize",
            row.status === "preparing" &&
              "bg-yellow-200 text-yellow-600 dark:bg-yellow-950",
            row.status === "ready" &&
              "bg-green-200 text-green-600 dark:bg-green-950",
          )}
          variant={
            row.status === "ready"
              ? "secondary"
              : row.status === "preparing"
                ? "outline"
                : "ghost"
          }
        >
          {row.status === "ready" && "Published"}
          {row.status === "preparing" && "Preparing"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="pr-6 text-right">Actions</div>,
    cell(props) {
      const row = props.row.original;

      return (
        <div className="pr-6 text-right">
          <VideoMoreActionsDropdownMenu {...row} />
        </div>
      );
    },
  },
];

function VideoMoreActionsDropdownMenu({ id, uploadId }: Video) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button size={"icon"} variant={"outline"}>
            <DotsThreeIcon />
          </Button>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            render={
              <Link href={`/my-studio/v/${uploadId}`}>
                <PenNibIcon />
                Edit Video
              </Link>
            }
          />

          <DropdownMenuItem onClick={() => setOpen(true)} variant="destructive">
            <TrashIcon /> Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
      <DeleteVideoDialog
        alertDialogProps={{ open, onOpenChange: setOpen }}
        videoId={id}
      />
    </DropdownMenu>
  );
}
