import { redirect } from "next/navigation";
import { getSession } from "@/server/better-auth/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (session) redirect("/");

  return (
    <section className="flex h-svh items-center justify-center">
      {children}
    </section>
  );
}
