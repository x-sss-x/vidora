"use client";
import { useRouter } from "next/navigation";
import type React from "react";
import { Dialog, DialogContent } from "./ui/dialog";

export function AuthDialog({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	return (
		<Dialog
			onOpenChange={() => {
				router.back();
			}}
			open
		>
			<DialogContent>{children}</DialogContent>
		</Dialog>
	);
}
