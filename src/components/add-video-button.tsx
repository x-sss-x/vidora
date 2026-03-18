"use client";

import MuxUploader, {
  MuxUploaderDrop,
  MuxUploaderFileSelect,
} from "@mux/mux-uploader-react";
import { PlusCircleIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { api } from "@/trpc/react";
import { Button, buttonVariants } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Spinner } from "./ui/spinner";

export function AddVideoButton() {
  const [open, setOpen] = useState(false);
  const { isLoading, data, error } = api.video.getUploadEndpoint.useQuery(
    undefined,
    {
      enabled: open,
    },
  );

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          <Button className="gap-2" size="sm" variant="outline">
            <PlusCircleIcon className="h-4 w-4" />
            Add Video
          </Button>
        }
      />
      <DialogContent className={"min-w-xl"}>
        <DialogHeader>
          <DialogTitle>New Video</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex h-62 w-full items-center justify-center">
            <Spinner className="size-6" />
          </div>
        ) : error ? (
          <div className="flex h-62 w-full items-center justify-center">
            <p>{error.message}</p>
          </div>
        ) : (
          <MuxUploader
            className="h-72 bg-accent/40 text-2xl"
            endpoint={data?.uploadUrl}
            style={{
              "--progress-bar-fill-color": "var(--primary)",
              "--progress-radial-fill-color": "var(--primary)",
            }}
          >
            <Button size={"lg"} slot="file-select">
              Select new file
            </Button>
          </MuxUploader>
        )}
      </DialogContent>
    </Dialog>
  );
}
