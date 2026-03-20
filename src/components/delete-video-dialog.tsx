"use client";

import type React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@phosphor-icons/react";

export function DeleteVideoDialog({
  render,
  videoId,
  callbackURL,
}: {
  render: React.ReactElement;
  videoId: string;
  callbackURL?: string;
}) {
  const router = useRouter();
  const utils = api.useUtils();
  const { mutate, isPending } = api.video.delete.useMutation({
    async onSuccess() {
      await utils.video.list.invalidate();
      await utils.video.listMine.invalidate();
      toast.info("Video delted");
      if (callbackURL) router.replace(callbackURL);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger render={render} />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <TrashIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete Video?</AlertDialogTitle>
          <AlertDialogDescription>
            Once you deleted the video you can't undo this action or restore the
            video.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} variant={"secondary"}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() => mutate({ videoId })}
            variant={"destructive"}
          >
            {isPending ? (
              <>
                <Spinner /> Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
