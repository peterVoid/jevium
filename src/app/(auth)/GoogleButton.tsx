import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function GoogleButton() {
  return (
    <Button
      className="relative rounded-full border border-black"
      variant="outline"
      asChild
    >
      {/* // eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/login/google">
        <FcGoogle />
        Login With Google
      </a>
    </Button>
  );
}
