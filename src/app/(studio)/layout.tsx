import { Header } from "@/components/header";
import { getSession } from "@/server/better-auth/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <section className="flex min-h-svh flex-col">
      <Header user={session?.user} variant="studio" />
      <main className="pt-20 px-72">{children}</main>
    </section>
  );
}
