import Link from "next/link";
import { AuthDialog } from "@/components/auth-dialog";
import { SignUpForm } from "@/components/forms/sign-up";
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
        <DialogTitle>Create an account to be VIDORA</DialogTitle>
        <DialogDescription>Fill the details to get started</DialogDescription>
      </DialogHeader>
      <SignUpForm />
      <DialogFooter className="sm:justify-center">
        <span className="text-center text-muted-foreground text-xs">
          Already have an account?{" "}
          <Link
            className="text-blue-500 hover:text-blue-600"
            href={"/sign-in"}
            replace
          >
            Sign in
          </Link>
        </span>
      </DialogFooter>
    </AuthDialog>
  );
}
