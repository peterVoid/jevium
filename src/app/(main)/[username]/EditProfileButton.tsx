"use client";

import { useSession } from "@/app/SessionProvider";
import FollowButton from "@/components/FollowButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EditProfileButtonProps {
  userId: string;
}

export default function EditProfileButton({ userId }: EditProfileButtonProps) {
  const { user } = useSession();

  return (
    <div>
      {user.id === userId ? (
        <Button variant="outline" asChild>
          <Link href={`/me/settings/account`}>Edit Profifle</Link>
        </Button>
      ) : (
        <FollowButton userId={userId} />
      )}
    </div>
  );
}
