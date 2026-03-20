"use client";

import type { DialogRootActions } from "@base-ui/react";
import { TrashIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useRef } from "react";
import { toast } from "sonner";
import { api } from "@/trpc/react";
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
import { Spinner } from "./ui/spinner";

export function DeleteVideoDialog({
  videoId,
  callbackURL,
  alertDialogProps,
  alertDialogTriggerProps,
}: {
  videoId: string;
  callbackURL?: string;
  alertDialogProps?: React.ComponentProps<typeof AlertDialog>;
  alertDialogTriggerProps?: React.ComponentProps<typeof AlertDialogTrigger>;
}) {
  const dialogRef = useRef<DialogRootActions | null>(null);
  const router = useRouter();
  const utils = api.useUtils();
  const { mutate, isPending } = api.video.delete.useMutation({
    async onSuccess() {
      await utils.video.listMine.invalidate();
      await utils.video.list.invalidate();
      toast.info("Video delted");
      if (callbackURL) router.replace(callbackURL);
      dialogRef.current?.close();
      dialogRef.current?.unmount();
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return (
    <AlertDialog {...alertDialogProps} actionsRef={dialogRef}>
      <AlertDialogTrigger {...alertDialogTriggerProps} />
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
