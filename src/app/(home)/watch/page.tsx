import { redirect } from "next/navigation";
import Player from "@/components/player";
import { RecommendationList } from "@/components/recommendation-list";
import { api, HydrateClient } from "@/trpc/server";

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
      <section className="grid w-full grid-cols-12 gap-4 px-14">
        <Player />
        <RecommendationList />
      </section>
    </HydrateClient>
  );
}
