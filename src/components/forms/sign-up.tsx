"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod/v4";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { authClient } from "@/server/better-auth/client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

export const signUpSchema = z.object({
  name: z.string().min(2, "Minimum 2 characters required"),
  email: z.email(),
  password: z.string().min(1, "Required"),
});

export function SignUpForm() {
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
      fetchOptions: {
        onSuccess() {
          window.location.href = "/";
        },
        onError(context) {
          form.setError("root", {
            message: context.error.message || "Something went wrong",
          });
        },
      },
    });
  }

  return (
    <div className="space-y-4">
      {form.formState.errors.root && (
        <p className="text-center text-destructive text-xs">
          {form.formState.errors.root.message}
        </p>
      )}
      <form id="sign-in-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Full name</FieldLabel>
                <Input
                  aria-invalid={fieldState.invalid}
                  placeholder="Jhon Wick"
                  {...field}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Email address</FieldLabel>
                <Input
                  aria-invalid={fieldState.invalid}
                  placeholder="youremail@domain.com"
                  type="email"
                  {...field}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Password</FieldLabel>
                <Input
                  aria-invalid={fieldState.invalid}
                  type="password"
                  {...field}
                />
                <FieldDescription>
                  Create a strong password to be secure.
                </FieldDescription>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </FieldGroup>
      </form>

      <Field>
        <Button
          className={"w-full"}
          disabled={form.formState.isSubmitting}
          form="sign-in-form"
          size={"lg"}
          type="submit"
        >
          {form.formState.isSubmitting ? (
            <>
              <Spinner /> Creating...
            </>
          ) : (
            "Create"
          )}
        </Button>
      </Field>
    </div>
  );
}
