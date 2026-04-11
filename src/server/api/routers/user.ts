import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { getUploadthingFileUrl } from "@/lib/uploadthing-url";
import { user } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
	me: protectedProcedure.query(async ({ ctx }) => {
		const currentUser = await ctx.db.query.user.findFirst({
			where: ({ id }, { eq }) => eq(id, ctx.session.user.id),
			columns: {
				id: true,
				name: true,
				email: true,
				image: true,
			},
		});

		if (!currentUser) return null;

		return {
			...currentUser,
			image: getUploadthingFileUrl(currentUser.image),
		};
	}),

	updateProfile: protectedProcedure
		.input(
			z.object({
				name: z.string().min(2).max(120),
				image: z.string().min(1).optional().nullable(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const [updatedUser] = await ctx.db
				.update(user)
				.set({
					name: input.name.trim(),
					image: input.image ?? null,
				})
				.where(eq(user.id, ctx.session.user.id))
				.returning({
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image,
				});

			if (!updatedUser) return updatedUser;

			return {
				...updatedUser,
				image: getUploadthingFileUrl(updatedUser.image),
			};
		}),
});
