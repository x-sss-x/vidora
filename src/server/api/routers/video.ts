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
});
