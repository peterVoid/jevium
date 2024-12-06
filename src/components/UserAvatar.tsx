import Image from "next/image";
import avatarPlaceholder from "@/app/assets/avatarPlaceholder.png";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string;
  size?: number;
  className?: string;
}

export default function UserAvatar({ src, size, className }: UserAvatarProps) {
  return (
    <Image
      src={src || avatarPlaceholder}
      alt="User Avatar"
      width={size ?? 44}
      height={size ?? 44}
      className={cn(
        "aspect-square flex-none rounded-full object-cover",
        className,
      )}
    />
  );
}
