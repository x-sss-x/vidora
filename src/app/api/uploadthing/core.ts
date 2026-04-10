import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/server/better-auth";

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
		.onUploadComplete(async ({ file }) => ({
			url: file.ufsUrl ?? file.url,
		})),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
