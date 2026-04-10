import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { user } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
	me: protectedProcedure.query(async ({ ctx }) => {
		return ctx.db.query.user.findFirst({
			where: ({ id }, { eq }) => eq(id, ctx.session.user.id),
			columns: {
				id: true,
				name: true,
				email: true,
				image: true,
			},
		});
	}),

	updateProfile: protectedProcedure
		.input(
			z.object({
				name: z.string().min(2).max(120),
				image: z.string().url().optional().nullable(),
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

			return updatedUser;
		}),
});
