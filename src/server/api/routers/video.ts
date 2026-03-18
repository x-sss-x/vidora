import { createTRPCRouter, protectedProcedure } from "../trpc";

export const videoRouter = createTRPCRouter({
  getUploadEndpoint: protectedProcedure.query(async ({ ctx }) => {
    const upload = await ctx.mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ["public"],
        video_quality: "basic",
      },
      cors_origin: "*",
    });

    return {
      uploadUrl: upload.url,
      uploadId: upload.id,
    };
  }),
});
