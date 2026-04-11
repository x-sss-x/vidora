import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod/v4";
import { getUploadthingFileUrl } from "@/lib/uploadthing-url";
import { video, watchList } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const getThumbnailUrl = (
	customThumbnailUrl: string | null,
	playbackId: string | null,
) =>
	getUploadthingFileUrl(customThumbnailUrl) ||
	`https://image.mux.com/${playbackId}/thumbnail.png?fit_mode=smartcrop&time=35`;

const withCreatorImageUrl = <
	T extends {
		creator?: {
			image: string | null;
		};
	},
>(
	payload: T,
) => ({
	...payload,
	creator: payload.creator
		? {
				...payload.creator,
				image: getUploadthingFileUrl(payload.creator.image),
			}
		: payload.creator,
});

export const videoRouter = createTRPCRouter({
	getUploadEndpoint: protectedProcedure.query(async ({ ctx }) => {
		const upload = await ctx.mux.video.uploads.create({
			new_asset_settings: {
				playback_policy: ["public"],
				video_quality: "basic",
				passthrough: ctx.session.session.userId,
			},
			cors_origin: "*",
		});

		return {
			uploadUrl: upload.url,
			uploadId: upload.id,
		};
	}),

	list: publicProcedure
		.input(z.object({ q: z.string().min(1).optional().nullable() }).optional())
		.query(async ({ ctx, input }) => {
			const videos = await ctx.db.query.video.findMany({
				orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
				where: ({ status, title, description }, { eq, and, or, ilike }) =>
					and(
						eq(status, "ready"),
						input?.q
							? or(
									ilike(title, `%${input.q}%`),
									ilike(description, `%${input.q}%`),
								)
							: undefined,
					),
				with: {
					creator: { columns: { id: true, name: true, image: true } },
				},
			});

			const currentUserId = ctx.session?.session?.userId;
			if (!currentUserId) {
				return videos.map((v) => ({
					...withCreatorImageUrl(v),
					isInWatchList: false,
					thumbnailUrl: getThumbnailUrl(v.thumbnailKey, v.playbackId),
				}));
			}

			const savedVideos = await ctx.db.query.watchList.findMany({
				columns: { videoId: true },
				where: ({ userId, videoId }, { eq, and, inArray }) =>
					and(
						eq(userId, currentUserId),
						inArray(
							videoId,
							videos.map((v) => v.id),
						),
					),
			});
			const savedVideoIds = new Set(savedVideos.map((v) => v.videoId));

			return videos.map((v) => ({
				...withCreatorImageUrl(v),
				isInWatchList: savedVideoIds.has(v.id),
				thumbnailUrl: getThumbnailUrl(v.thumbnailKey, v.playbackId),
			}));
		}),

	recommendationList: publicProcedure
		.input(z.object({ currentVideoId: z.string().min(1) }))
		.query(async ({ ctx, input }) => {
			const videos = await ctx.db.query.video.findMany({
				orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
				where: ({ status, id }, { eq, and, not }) =>
					and(eq(status, "ready"), not(eq(id, input.currentVideoId))),
				with: {
					creator: { columns: { id: true, name: true, image: true } },
				},
			});

			const currentUserId = ctx.session?.session?.userId;
			if (!currentUserId) {
				return videos.map((v) => ({
					...withCreatorImageUrl(v),
					isInWatchList: false,
					thumbnailUrl: getThumbnailUrl(v.thumbnailKey, v.playbackId),
				}));
			}

			const savedVideos = await ctx.db.query.watchList.findMany({
				columns: { videoId: true },
				where: ({ userId, videoId }, { eq, and, inArray }) =>
					and(
						eq(userId, currentUserId),
						inArray(
							videoId,
							videos.map((v) => v.id),
						),
					),
			});
			const savedVideoIds = new Set(savedVideos.map((v) => v.videoId));

			return videos.map((v) => ({
				...withCreatorImageUrl(v),
				isInWatchList: savedVideoIds.has(v.id),
				thumbnailUrl: getThumbnailUrl(v.thumbnailKey, v.playbackId),
			}));
		}),

	listMine: protectedProcedure.query(async ({ ctx }) => {
		const videos = await ctx.db.query.video.findMany({
			orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
			where: ({ createdById }, { eq }) =>
				eq(createdById, ctx.session.session.userId),
		});

		return videos.map((v) => ({
			...v,
			thumbnailUrl: getThumbnailUrl(v.thumbnailKey, v.playbackId),
		}));
	}),

	listWatchList: protectedProcedure.query(async ({ ctx }) => {
		const savedVideos = await ctx.db.query.watchList.findMany({
			orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
			where: ({ userId }, { eq }) => eq(userId, ctx.session.session.userId),
			with: {
				video: {
					with: {
						creator: { columns: { id: true, name: true, image: true } },
					},
				},
			},
		});

		return savedVideos
			.map((entry) => entry.video)
			.filter((v) => v.status === "ready")
			.map((v) => ({
				...withCreatorImageUrl(v),
				isInWatchList: true,
				thumbnailUrl: getThumbnailUrl(v.thumbnailKey, v.playbackId),
			}));
	}),

	getByUploadId: protectedProcedure
		.input(z.object({ uploadId: z.string().min(1) }))
		.query(async ({ ctx, input }) => {
			const video = await ctx.db.query.video.findFirst({
				where: ({ createdById, uploadId }, { eq, and }) =>
					and(
						eq(createdById, ctx.session.session.userId),
						eq(uploadId, input.uploadId),
					),
			});

			if (!video)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "No resource found!",
				});

			return {
				...video,
				thumbnailUrl: getThumbnailUrl(video.thumbnailKey, video.playbackId),
			};
		}),

	getById: publicProcedure
		.input(z.object({ videoId: z.string().min(1) }))
		.query(async ({ ctx, input }) => {
			const video = await ctx.db.query.video.findFirst({
				where: ({ id }, { eq }) => eq(id, input.videoId),
				with: {
					creator: {
						columns: {
							id: true,
							name: true,
							image: true,
						},
					},
				},
			});

			if (!video)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "No resource found!",
				});

			const currentUserId = ctx.session?.session?.userId;
			const saved = currentUserId
				? await ctx.db.query.watchList.findFirst({
						where: ({ userId, videoId }, { and, eq }) =>
							and(eq(userId, currentUserId), eq(videoId, video.id)),
					})
				: null;

			return {
				...withCreatorImageUrl(video),
				isInWatchList: Boolean(saved),
				thumbnailUrl: getThumbnailUrl(video.thumbnailKey, video.playbackId),
			};
		}),

	update: protectedProcedure
		.input(
			z.object({
				uploadId: z.string().min(1),
				title: z.string().min(1),
				description: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const updatedVideo = await ctx.db
				.update(video)
				.set({ title: input.title, description: input.description ?? null })
				.where(eq(video.uploadId, input.uploadId))
				.returning();

			if (!updatedVideo[0])
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Couldn't able to update the video!",
				});

			return updatedVideo[0];
		}),

	addToWatchList: protectedProcedure
		.input(
			z.object({
				videoId: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const singleVideo = await ctx.db.query.video.findFirst({
				where: ({ id, status }, { eq, and }) =>
					and(eq(id, input.videoId), eq(status, "ready")),
			});

			if (!singleVideo)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Couldn't find this video.",
				});

			await ctx.db
				.insert(watchList)
				.values({
					userId: ctx.session.session.userId,
					videoId: input.videoId,
				})
				.onConflictDoNothing();

			return { success: true };
		}),

	removeFromWatchList: protectedProcedure
		.input(
			z.object({
				videoId: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const singleVideo = await ctx.db.query.video.findFirst({
				where: ({ id, status }, { eq, and }) =>
					and(eq(id, input.videoId), eq(status, "ready")),
			});

			if (!singleVideo)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Couldn't find this video.",
				});

			await ctx.db
				.delete(watchList)
				.where(
					and(
						eq(watchList.videoId, input.videoId),
						eq(watchList.userId, ctx.session.session.userId),
					),
				);
		}),

	delete: protectedProcedure
		.input(z.object({ videoId: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			const singleVideo = await ctx.db.query.video.findFirst({
				where: ({ createdById, id }, { eq, and }) =>
					and(
						eq(createdById, ctx.session.session.userId),
						eq(id, input.videoId),
					),
			});

			if (!singleVideo)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Couldn't able to find the video to delete it!",
				});

			if (singleVideo.assetId) {
				try {
					await ctx.mux.video.assets.delete(singleVideo.assetId);
				} catch (e) {
					console.error(e);
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "Couldn't able to delete the video in the MUX!",
					});
				}
			}

			const deletedVideo = await ctx.db
				.delete(video)
				.where(eq(video.id, input.videoId))
				.returning();

			if (!deletedVideo[0])
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Couldn't able to delete the video!",
				});

			return deletedVideo[0];
		}),
});
