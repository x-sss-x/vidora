import { api, HydrateClient } from "@/trpc/server";
import { ClientPage } from "./page.client";

export default async function Page({
  params,
}: {
  params: Promise<{ uploadId: string }>;
}) {
  const { uploadId } = await params;

  await api.video.getByUploadId.prefetch({ uploadId });

  return (
    <HydrateClient>
      <ClientPage />
    </HydrateClient>
  );
}
