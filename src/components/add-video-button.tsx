"use client";

import MuxUploader from "@mux/mux-uploader-react";
import { PlusCircleIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/server/better-auth/client";
import { api } from "@/trpc/react";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Spinner } from "./ui/spinner";

export function AddVideoButton({ onlyIcon }: { onlyIcon?: boolean }) {
	const [open, setOpen] = useState(false);
	const { isLoading, data, error } = api.video.getUploadEndpoint.useQuery(
		undefined,
		{
			enabled: open,
		},
	);
	const { data: session } = authClient.useSession();
	const router = useRouter();
	const utils = api.useUtils();

	return (
		<Dialog
			onOpenChange={(open) => {
				if (!session) {
					router.push("/sign-in");
					return;
				}
				setOpen(open);
			}}
			open={open}
		>
			<DialogTrigger
				render={
					<Button
						className="gap-2"
						size={onlyIcon ? "icon" : "default"}
						variant="outline"
					>
						<PlusCircleIcon className="h-4 w-4" />
						{!onlyIcon && "Add Video"}
					</Button>
				}
			/>
			<DialogContent className={"min-w-xl"}>
				<DialogHeader>
					<DialogTitle>New Video</DialogTitle>
				</DialogHeader>
				{isLoading ? (
					<div className="flex h-62 w-full items-center justify-center">
						<Spinner className="size-6" />
					</div>
				) : error ? (
					<div className="flex h-62 w-full items-center justify-center">
						<p>{error.message}</p>
					</div>
				) : (
					<MuxUploader
						className="h-72 bg-accent/40 text-2xl"
						endpoint={data?.uploadUrl}
						onSuccess={async () => {
							await utils.video.listMine.invalidate();
							router.push(`/my-studio/v/${data?.uploadId}`);
							setOpen(false);
						}}
						style={{
							"--progress-bar-fill-color": "var(--primary)",
							"--progress-radial-fill-color": "var(--primary)",
						}}
					>
						<Button size={"lg"} slot="file-select">
							Select new file
						</Button>
					</MuxUploader>
				)}
			</DialogContent>
		</Dialog>
	);
}
