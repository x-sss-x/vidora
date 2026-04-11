import { and, eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod/v4";
import { getUploadthingFileKey } from "@/lib/uploadthing-url";
import { auth } from "@/server/better-auth";
import { db } from "@/server/db";
import { user, video } from "@/server/db/schema";

const f = createUploadthing();

export const uploadRouter = {
	profileImage: f({
		image: {
			maxFileCount: 1,
			maxFileSize: "4MB",
		},
	})
		.middleware(async ({ req }) => {
			const session = await auth.api.getSession({
				headers: req.headers,
			});

			if (!session?.user) {
				throw new Error("Unauthorized");
			}

			return {
				userId: session.user.id,
			};
		})
		.onUploadComplete(async ({ metadata, file }) => {
			const key =
				(file as { key?: string }).key ??
				getUploadthingFileKey(file.ufsUrl ?? file.url);
			if (!key) {
				throw new Error("Unable to resolve uploaded profile image key.");
			}

			await db
				.update(user)
				.set({ image: key })
				.where(eq(user.id, metadata.userId));

			return { key };
		}),

	videoThumbnail: f({
		image: {
			maxFileCount: 1,
			maxFileSize: "4MB",
		},
	})
		.input(z.object({ uploadId: z.string().min(1) }))
		.middleware(async ({ req, input }) => {
			const session = await auth.api.getSession({
				headers: req.headers,
			});

			if (!session?.user) {
				throw new Error("Unauthorized");
			}

			const selectedVideo = await db.query.video.findFirst({
				columns: { id: true },
				where: ({ uploadId, createdById }, { and, eq }) =>
					and(eq(uploadId, input.uploadId), eq(createdById, session.user.id)),
			});

			if (!selectedVideo) {
				throw new Error("Video not found.");
			}

			return {
				userId: session.user.id,
				videoId: selectedVideo.id,
			};
		})
		.onUploadComplete(async ({ metadata, file }) => {
			const key =
				(file as { key?: string }).key ??
				getUploadthingFileKey(file.ufsUrl ?? file.url);
			if (!key) {
				throw new Error("Unable to resolve uploaded thumbnail key.");
			}

			await db
				.update(video)
				.set({ thumbnailKey: key })
				.where(
					and(
						eq(video.id, metadata.videoId),
						eq(video.createdById, metadata.userId),
					),
				);

			return { key };
		}),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
