"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod/v4";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { authClient } from "@/server/better-auth/client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Required"),
});

export function SignInForm() {
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    await authClient.signIn.email({
      email: values.email,
      password: values.password,
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
            name="email"
            render={({ field }) => (
              <Field>
                <FieldLabel>Email address</FieldLabel>
                <Input
                  placeholder="youremail@domain.com"
                  type="email"
                  {...field}
                />
                <FieldError />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="password"
            render={({ field }) => (
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input type="password" {...field} />
                <FieldError />
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
              <Spinner /> Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </Field>
    </div>
  );
}
