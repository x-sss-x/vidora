import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { getSession } from "@/server/better-auth/server";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSession();
	if (!session) redirect("/sign-in");
	return (
		<section className="flex min-h-svh flex-col">
			<Header user={session?.user} variant="studio" />
			<main className="px-72 pt-20">{children}</main>
		</section>
	);
}
