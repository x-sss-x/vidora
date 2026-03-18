"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, Form, useForm } from "react-hook-form";
import { z } from "zod/v4";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Required"),
});

export default function SignInForm() {
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {}

  return (
    <div className="space-y-4">
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
          form="sign-in-form"
          size={"lg"}
          type="submit"
        >
          Sign in
        </Button>
      </Field>
    </div>
  );
}
