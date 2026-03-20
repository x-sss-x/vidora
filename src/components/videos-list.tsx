"use client";

import { FilmReelIcon } from "@phosphor-icons/react";
import { isEmpty } from "lodash";
import { api } from "@/trpc/react";
import { AddVideoButton } from "./add-video-button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "./ui/empty";
import { VideoCard } from "./video-card";

export function VideosList() {
	const [videos] = api.video.list.useSuspenseQuery();

	if (isEmpty(videos))
		return (
			<section className="flex min-h-[calc(100svh-160px)] items-center justify-center">
				<Empty>
					<EmptyMedia variant={"icon"}>
						<FilmReelIcon className="size-6" weight="duotone" />
					</EmptyMedia>
					<EmptyHeader>
						<EmptyTitle>Our Platform is Empty</EmptyTitle>
						<EmptyDescription>
							Be the one to upload the first content on the VIDORA and help the
							community.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<AddVideoButton />
					</EmptyContent>
				</Empty>
			</section>
		);

	return (
		<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{videos.map((v) => (
				<VideoCard
					createdAt={v.createdAt}
					duration={v.duration}
					id={v.id}
					key={v.id}
					thumbnailUrl={v.thumbnailUrl}
					title={v.title}
				/>
			))}
		</div>
	);
}
