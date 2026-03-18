import { YoutubeLogoIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
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
    <section className="flex h-svh flex-col items-center justify-center gap-6 bg-background">
      <Link
        className="flex items-center gap-2 font-bold font-mono text-lg"
        href="/"
      >
        <YoutubeLogoIcon className="size-8 text-primary" weight="duotone" />
        VIDORA
      </Link>
      {children}
    </section>
  );
}
