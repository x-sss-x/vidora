"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import MuxPlayer from "@mux/mux-player-react";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { formatDistanceToNowStrict } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod/v4";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const videoSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().optional(),
});

export function ClientPage() {
  const { uploadId } = useParams<{ uploadId: string }>();
  const [video, query] = api.video.getByUploadId.useSuspenseQuery({ uploadId });
  const form = useForm({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: video.title,
      description: video.description ?? "",
    },
  });
  const { mutateAsync: updateVideo } = api.video.update.useMutation({
    onSuccess(data) {
      form.reset({ title: data.title, description: data.description ?? "" });
      toast.info("Video details updated");
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof videoSchema>) {
    await updateVideo({
      title: values.title,
      description: values.description,
      uploadId,
    });
  }

  return (
    <section className="w-full">
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push(`/my-studio`)}
            size={"icon-lg"}
            variant={"outline"}
          >
            <ArrowLeftIcon />
          </Button>

          <div className="space-y-0.5">
            <div className="font-semibold text-sm">{video.title}</div>
            <p
              className="text-muted-foreground text-xs"
              suppressHydrationWarning
            >
              Your Video · Uploaded{" "}
              {formatDistanceToNowStrict(video.createdAt, {
                addSuffix: true,
              })}{" "}
              {video.updatedAt && (
                <>
                  · Last updated{" "}
                  {formatDistanceToNowStrict(video.updatedAt, {
                    addSuffix: true,
                  })}
                </>
              )}
            </p>
          </div>
        </div>
        <Field className="w-fit" orientation={"horizontal"}>
          <Button
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
            onClick={() => form.reset()}
            size={"lg"}
            type="button"
            variant={"secondary"}
          >
            Discard Changes
          </Button>
          <Button
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
            form="edit-video-form"
            size={"lg"}
            type="submit"
          >
            {form.formState.isSubmitting ? (
              <>
                <Spinner /> Saving..
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
          <Button size={"lg"} type="button" variant={"destructive"}>
            Delete Video
          </Button>
        </Field>
      </div>
      <div className="grid grid-cols-8 gap-6 py-6">
        <form
          className="col-span-4"
          id="edit-video-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Title</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      aria-invalid={fieldState.invalid}
                      className="resize-none"
                      placeholder="Title of the video"
                      {...field}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/100 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldError
                    aria-invalid={fieldState.invalid}
                    errors={[fieldState.error]}
                  />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea
                    className="min-h-40 resize-none"
                    placeholder="Describe about your content..."
                    {...field}
                  />
                  <FieldError />
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <div className="col-span-4">
          {query.isFetching ||
            (video.status === "preparing" && (
              <Skeleton className="aspect-video w-full">
                {video.status === "preparing" && "Preparing..."}
              </Skeleton>
            ))}
          {video.playbackId && (
            <MuxPlayer
              accentColor="var(--primary)"
              className="aspect-video w-full"
              playbackId={video.playbackId}
            />
          )}
        </div>
      </div>
    </section>
  );
}
