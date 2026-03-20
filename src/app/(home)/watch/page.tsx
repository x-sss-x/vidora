import { redirect } from "next/navigation";
import { api, HydrateClient } from "@/trpc/server";
import Player from "@/components/player";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ vid: string | null }>;
}) {
  const { vid } = await searchParams;

  if (!vid) redirect("/");

  await api.video.getById.prefetch({ videoId: vid });

  return (
    <HydrateClient>
      <section className="grid w-full px-14 grid-cols-8">
        <Player />
      </section>
    </HydrateClient>
  );
}
