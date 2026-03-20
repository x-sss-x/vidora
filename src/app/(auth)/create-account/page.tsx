import { SignUpForm } from "@/components/forms/sign-up";
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
				<CardTitle className="text-center">
					Create an account to be VIDORA
				</CardTitle>
				<CardDescription className="text-center">
					Fill the details to get started
				</CardDescription>
			</CardHeader>
			<CardContent>
				<SignUpForm />
			</CardContent>
			<CardFooter className="sm:justify-center">
				<span className="text-center text-muted-foreground text-xs">
					Already have an account?{" "}
					<a className="text-blue-500 hover:text-blue-600" href={"/sign-in"}>
						Sign in
					</a>
				</span>
			</CardFooter>
		</Card>
	);
}
