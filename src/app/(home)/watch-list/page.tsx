import { redirect } from "next/navigation";
import { WatchListVideos } from "@/components/watch-list-videos";
import { getSession } from "@/server/better-auth/server";
import { api, HydrateClient } from "@/trpc/server";

export default async function Page() {
	const session = await getSession();

	if (!session) redirect("/sign-in");

	await api.video.listWatchList.prefetch();

	return (
		<HydrateClient>
			<WatchListVideos />
		</HydrateClient>
	);
}
