import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/UserAvatar";
import { Settings } from "lucide-react";
import Link from "next/link";
import { BsPerson } from "react-icons/bs";
import SignOutUserDropdown from "../(auth)/SignOutUserDropdown";
import { useSession } from "../SessionProvider";

export default function UserDropdown() {
  const { user } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar src={user.avatar!} size={57} className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-10 w-[300px]">
        <div className="flex flex-col px-3 py-4">
          <div className="space-y-5">
            <Link
              href={`/@${user.username}`}
              className="flex items-center gap-5 text-muted-foreground hover:text-slate-700"
            >
              <BsPerson size={30} />
              <span className="text-xl">Profile</span>
            </Link>
            <Link
              href={`/settings`}
              className="flex items-center gap-5 text-muted-foreground hover:text-slate-700"
            >
              <Settings size={30} />
              <span className="text-xl">Settings</span>
            </Link>
            <DropdownMenuSeparator />
            <SignOutUserDropdown />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
