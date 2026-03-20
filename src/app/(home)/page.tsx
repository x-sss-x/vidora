import { VideosList } from "@/components/videos-list";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  void api.video.list.prefetch();

  return (
    <HydrateClient>
      <VideosList />
    </HydrateClient>
  );
}
