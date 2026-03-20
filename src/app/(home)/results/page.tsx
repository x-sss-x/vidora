import { SearchList } from "@/components/search-list";
import { api, HydrateClient } from "@/trpc/server";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  await api.video.list.prefetch({ q });

  return (
    <HydrateClient>
      <div className="px-72">
        <SearchList />
      </div>
    </HydrateClient>
  );
}
