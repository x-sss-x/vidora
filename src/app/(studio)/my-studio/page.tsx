import { api, HydrateClient } from "@/trpc/server";
import { DataTableClient } from "./data-table.client";

export default async function Page() {
  void api.video.listMine.prefetch();
  return (
    <HydrateClient>
      <DataTableClient />
    </HydrateClient>
  );
}
