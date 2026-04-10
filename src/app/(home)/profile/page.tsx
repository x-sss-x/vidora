import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile-form";
import { getSession } from "@/server/better-auth/server";

export default async function ProfilePage() {
	const session = await getSession();

	if (!session?.user) {
		redirect("/sign-in");
	}

	return (
		<div className="space-y-4">
			<div>
				<h1 className="font-semibold text-lg">My Profile</h1>
				<p className="text-muted-foreground text-xs">
					Update your full name and profile image.
				</p>
			</div>
			<ProfileForm />
		</div>
	);
}
