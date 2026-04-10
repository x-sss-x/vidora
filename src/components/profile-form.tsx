"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

const profileSchema = z.object({
  name: z.string().min(2, "Minimum 2 characters required"),
});

export function ProfileForm() {
  const router = useRouter();
  const utils = api.useUtils();
  const { data: user, isLoading } = api.user.me.useQuery();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name ?? "",
    },
  });

  const previewImage = useMemo(
    () => imageUrl ?? user?.image ?? "",
    [imageUrl, user?.image],
  );

  const { mutate: updateProfile, isPending: isUpdating } =
    api.user.updateProfile.useMutation({
      onSuccess: async () => {
        await Promise.all([utils.user.invalidate(), utils.video.invalidate()]);
        toast.success("Profile updated.");
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleSubmit = (values: z.infer<typeof profileSchema>) => {
    updateProfile({
      name: values.name.trim(),
      image: imageUrl ?? user?.image ?? null,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-6"
            id="profile-form"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FieldGroup>
              <Field>
                <FieldLabel>Profile photo</FieldLabel>
                <div className="flex flex-wrap items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarImage
                      alt={user?.name ?? "User"}
                      src={previewImage}
                    />
                    <AvatarFallback>
                      {(form.watch("name") || user?.name || "U").charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "ut-allowed-content:hidden ut-button:h-8 ut-button:rounded-none ut-button:border ut-button:bg-secondary ut-button:ut-readying:bg-secondary/80 ut-button:ut-uploading:bg-secondary/80 ut-button:px-3 ut-button:text-secondary-foreground ut-button:text-xs",
                      "ut-label:text-xs",
                    )}
                  >
                    <UploadButton
                      endpoint="profileImage"
                      onClientUploadComplete={(res) => {
                        const uploaded = res[0];
                        const url = uploaded?.ufsUrl ?? uploaded?.url;
                        if (!url) {
                          toast.error("Upload failed.");
                          return;
                        }
                        setImageUrl(url);
                        toast.success("Profile photo uploaded.");
                      }}
                      onUploadError={(error) => {
                        toast.error(error.message);
                      }}
                    />
                  </div>
                  {(imageUrl ?? user?.image) && (
                    <Button
                      onClick={() => setImageUrl(null)}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      Reset photo
                    </Button>
                  )}
                </div>
                <FieldDescription>
                  Upload a square image for the best avatar preview.
                </FieldDescription>
              </Field>

              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Full name</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="Your full name"
                      {...field}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <p className="text-muted-foreground text-xs">
            Built by Shreesha & Team
          </p>
          <Button disabled={isUpdating} form="profile-form" type="submit">
            {isUpdating ? (
              <>
                <Spinner /> Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
