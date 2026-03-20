import { SignInForm } from "@/components/forms/sign-in";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function Page() {
	return (
		<Card className="min-w-sm">
			<CardHeader>
				<CardTitle className="text-center">Sign in</CardTitle>
				<CardDescription className="text-center">
					Welcome back! please fill the details to continue
				</CardDescription>
			</CardHeader>
			<CardContent>
				<SignInForm />
			</CardContent>
			<CardFooter className="sm:justify-center">
				<span className="text-center text-muted-foreground text-xs">
					Don't have an account?{" "}
					<a
						className="text-blue-500 hover:text-blue-600"
						href={"/create-account"}
					>
						Create new account
					</a>
				</span>
			</CardFooter>
		</Card>
	);
}
