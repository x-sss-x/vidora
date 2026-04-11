"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { env } from "@/env";
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

  const form = useForm({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name ?? "",
    },
  });

  const previewImage = useMemo(() => user?.image ?? "", [user?.image]);

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
                  <div className="flex items-center gap-2.5">
                    <UploadButton
                      appearance={{
                        button: cn(
                          buttonVariants({ size: "sm", className: "h-7!" }),
                        ),
                        allowedContent: "hidden",
                      }}
                      endpoint="profileImage"
                      onClientUploadComplete={async (res) => {
                        const uploaded = res[0];
                        const key =
                          uploaded?.key ?? uploaded?.ufsUrl ?? uploaded?.url;
                        if (!key) {
                          toast.error("Upload failed.");
                          return;
                        }
                        try {
                          await Promise.all([
                            utils.user.invalidate(),
                            utils.video.invalidate(),
                          ]);
                          toast.success(
                            "Profile photo uploaded and saved successfully.",
                          );
                          router.refresh();
                        } catch {
                          toast.error(
                            "Profile photo uploaded, but refreshing data failed.",
                          );
                        }
                      }}
                      onUploadError={(error) => {
                        toast.error(error.message);
                      }}
                    />
                    {user?.image && (
                      <Button
                        disabled={isUpdating}
                        onClick={() =>
                          updateProfile({
                            name: (form.getValues("name") || user.name).trim(),
                            image: null,
                          })
                        }
                        size="sm"
                        type="button"
                        variant="outline"
                      >
                        Remove photo
                      </Button>
                    )}
                  </div>
                </div>
                <FieldDescription>
                  Upload a square image for the best avatar preview.
                  Re-uploading replaces your current profile photo instantly.
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
            {env.NEXT_PUBLIC_TEAM_CREDITS_LINE ?? "Built by Shreesha & Team"}
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
