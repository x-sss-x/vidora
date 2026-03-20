import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { video } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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

	list: publicProcedure.query(async ({ ctx }) => {
		const videos = await ctx.db.query.video.findMany({
			orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
			where: ({ status }, { eq }) => eq(status, "ready"),
		});

		return videos.map((v) => ({
			...v,
			thumbnailUrl: `https://image.mux.com/${v.playbackId}/thumbnail.png?fit_mode=smartcrop&time=35`,
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
			thumbnailUrl: `https://image.mux.com/${v.playbackId}/thumbnail.png?fit_mode=smartcrop&time=35`,
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
				thumbnailUrl: `https://image.mux.com/${video.playbackId}/thumbnail.png?fit_mode=smartcrop&time=35`,
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
});
