"use client";

import {
	FilmSlateIcon,
	MagnifyingGlassIcon,
	SignOutIcon,
	YoutubeLogoIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/server/better-auth/client";
import type { Session } from "@/server/better-auth/config";
import appPackage from "../../package.json";
import { AddVideoButton } from "./add-video-button";
import {
	InputGroup,
	InputGroupButton,
	InputGroupInput,
} from "./ui/input-group";

interface HeaderProps {
	user?: Session["user"] | null;
	variant?: "studio" | "default";
}

export function Header({ user, variant = "default" }: HeaderProps) {
	const [search, setSearch] = useState("");
	const router = useRouter();

	const handleSearch = (e: React.SubmitEvent) => {
		e.preventDefault();
		console.log("Search:", search);
		// TODO: route to search page
	};

	return (
		<header className="fixed top-0 z-40 h-14 w-full border-b bg-background px-6 py-2">
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					{/* LEFT - Logo */}
					<Link
						className="flex items-center gap-2 font-bold font-mono text-lg"
						href={variant === "studio" ? "/my-studio" : "/"}
					>
						{variant === "studio" ? (
							<FilmSlateIcon className="size-8 text-primary" weight="duotone" />
						) : (
							<YoutubeLogoIcon
								className="size-8 text-primary"
								weight="duotone"
							/>
						)}
						{variant === "studio" ? "VIDORA·STUDIO" : "VIDORA"}
					</Link>
				</div>

				{/* CENTER - Search */}
				<div className="flex flex-1 items-center justify-center">
					<form className="max-w-xl flex-1 gap-2" onSubmit={handleSearch}>
						<InputGroup className="h-10">
							<InputGroupInput
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search VIDORA ..."
								value={search}
							/>
							<InputGroupButton
								className={"size-10"}
								size={"sm"}
								type="submit"
								variant={"secondary"}
							>
								<MagnifyingGlassIcon />
							</InputGroupButton>
						</InputGroup>
					</form>
				</div>

				{/* RIGHT - Actions */}
				<div className="flex items-center gap-3">
					{/* Add Video */}
					{variant === "default" && <AddVideoButton />}
					{user ? (
						<>
							{/* Avatar Dropdown */}
							<DropdownMenu>
								<DropdownMenuTrigger>
									<Avatar className="cursor-pointer">
										<AvatarImage alt={user.name} src={user.image ?? ""} />
										<AvatarFallback>
											{user.name.charAt(0) ?? "U"}
										</AvatarFallback>
									</Avatar>
								</DropdownMenuTrigger>

								<DropdownMenuContent align="end" className={"min-w-2xs"}>
									<DropdownMenuGroup className={"flex gap-2 p-1.5"}>
										<Avatar className="cursor-pointer">
											<AvatarImage alt={user.name} src={user.image ?? ""} />
											<AvatarFallback>
												{user.name.charAt(0) ?? "U"}
											</AvatarFallback>
										</Avatar>
										<div className="text-xs">
											<p className="font-semibold">{user.name}</p>
											<p className="text-muted-foreground">{user.email}</p>
										</div>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										{variant === "studio" ? (
											<DropdownMenuItem
												className="cursor-pointer"
												onClick={() => router.push("/")}
											>
												<YoutubeLogoIcon /> VIDORA
											</DropdownMenuItem>
										) : (
											<DropdownMenuItem
												className="cursor-pointer"
												onClick={() => router.push("/my-studio")}
											>
												<FilmSlateIcon /> VIDORA STUDIO
											</DropdownMenuItem>
										)}
										<DropdownMenuItem
											className="cursor-pointer"
											onClick={() =>
												authClient.signOut({
													fetchOptions: {
														onSuccess: () => {
															router.refresh();
														},
													},
												})
											}
											variant="destructive"
										>
											<SignOutIcon /> Logout
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuGroup className={"p-2"}>
										<p className="text-center text-[10px] text-muted-foreground">
											App version {appPackage.version}
										</p>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					) : (
						<>
							<Link href="/sign-in">
								<Button variant="ghost">Sign In</Button>
							</Link>
							<Link href="/create-account">
								<Button>Create Account</Button>
							</Link>
						</>
					)}
				</div>
			</div>
		</header>
	);
}
