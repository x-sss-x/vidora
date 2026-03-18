import Link from "next/link";
import SignInForm from "@/components/forms/sign-in";
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
        <CardTitle>Sign in to VIDORA</CardTitle>
        <CardDescription>
          Welcome back! please fill the details to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
      <CardFooter className="sm:justify-center">
        <span className="text-center text-muted-foreground text-xs">
          Don't have an account?{" "}
          <Link
            className="text-blue-500 hover:text-blue-600"
            href={"/create-account"}
          >
            Create new account
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}
