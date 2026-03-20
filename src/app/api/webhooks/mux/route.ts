import type { UnwrapWebhookEvent } from "@mux/mux-node/resources/webhooks";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/server/db/";
import { video } from "@/server/db/schema";

export async function POST(req: Request) {
	const wbEvent = (await req.json()) as UnwrapWebhookEvent;

	try {
		switch (wbEvent.type) {
			case "video.asset.created": {
				const {
					id: asset_id,
					upload_id,
					passthrough,
					duration,
					status,
				} = wbEvent.data;

				if (!passthrough)
					return NextResponse.json(
						{ message: "No passthrough mentioned in the meta" },
						{ status: 400, statusText: "No Passthrough" },
					);

				if (!upload_id)
					return NextResponse.json(
						{ message: "No upload_id found" },
						{ status: 400, statusText: "No upload_id" },
					);

				await db.insert(video).values({
					assetId: asset_id,
					status,
					duration,
					title: "Untitled Video",
					createdById: passthrough,
					uploadId: upload_id,
				});

				return NextResponse.json(
					{ message: "Asset created" },
					{ status: 200, statusText: "Asset Created" },
				);
			}

			case "video.asset.ready": {
				const {
					id: assetId,
					playback_ids,
					duration,
					status,
					max_resolution_tier,
				} = wbEvent.data;
				const playbackId = playback_ids?.[0]?.id;

				await db
					.update(video)
					.set({
						status,
						playbackId,
						duration,
						maxResolutionTier: max_resolution_tier,
					})
					.where(eq(video.assetId, assetId));

				return NextResponse.json(
					{ message: "Asset ready to play" },
					{ status: 200, statusText: "Asset Ready to Play" },
				);
			}

			case "video.asset.errored": {
				const { id: assetId, status } = wbEvent.data;
				await db
					.update(video)
					.set({ status })
					.where(eq(video.assetId, assetId));

				return NextResponse.json(
					{ message: "Asset error occured" },
					{ status: 200, statusText: "Upload Asset Errored" },
				);
			}

			case "video.asset.deleted": {
				const { id: assetId } = wbEvent.data;

				await db.delete(video).where(eq(video.assetId, assetId));
				return NextResponse.json(
					{ message: "Asset deleted" },
					{ status: 200, statusText: "Asset Deleted" },
				);
			}

			default:
				return NextResponse.json(
					{ message: `Unhandled event: ${wbEvent.type}` },
					{ status: 204, statusText: "Unhandled Event" },
				);
		}
	} catch (err) {
		console.error("Webhook error:", err);
		return NextResponse.json(
			{ message: "failed", description: err },
			{ status: 500 },
		);
	}
}
