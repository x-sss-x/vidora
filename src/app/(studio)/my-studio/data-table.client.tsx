"use client";

import { AddVideoButton } from "@/components/add-video-button";
import { DataTable } from "@/components/data-table";
import { api } from "@/trpc/react";
import { columns } from "./column";

export function DataTableClient() {
	const [videos] = api.video.listMine.useSuspenseQuery();

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="font-semibold text-lg">Your Videos</div>
				<AddVideoButton />
			</div>
			<DataTable columns={columns} data={videos} />
		</div>
	);
}
