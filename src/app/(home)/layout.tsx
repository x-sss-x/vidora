import { Header } from "@/components/header";
import { getSession } from "@/server/better-auth/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <section className="flex min-h-svh w-full flex-col py-14">
      <Header user={session?.user} />
      <main className="p-6">{children}</main>
    </section>
  );
}
