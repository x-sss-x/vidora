import { api, HydrateClient } from "@/trpc/server";
import { DataTableClient } from "./data-table.client";

export default async function Page() {
  await api.video.listMine.prefetch();

  return (
    <HydrateClient>
      <DataTableClient />
    </HydrateClient>
  );
}
