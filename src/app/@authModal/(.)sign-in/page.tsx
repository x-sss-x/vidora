import Link from "next/link";
import { AuthDialog } from "@/components/auth-dialog";
import SignInForm from "@/components/forms/sign-in";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Page() {
  return (
    <AuthDialog>
      <DialogHeader>
        <DialogTitle>Sign in to VIDORA</DialogTitle>
        <DialogDescription>
          Welcome back! please fill the details to continue
        </DialogDescription>
      </DialogHeader>
      <SignInForm />
      <DialogFooter className="sm:justify-center">
        <span className="text-center text-muted-foreground text-xs">
          Don't have an account?{" "}
          <Link
            className="text-blue-500 hover:text-blue-600"
            href={"/create-account"}
          >
            Create new account
          </Link>
        </span>
      </DialogFooter>
    </AuthDialog>
  );
}
