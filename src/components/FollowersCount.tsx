"use client";

import { useFollowInfo } from "@/hooks/useFollowInfo";

interface FollowersCountProps {
    userId: string;
}

export default function FollowersCount({userId}: FollowersCountProps) {
  const { data } = useFollowInfo(userId);

  return (
    <p className="text-muted-foreground">{data?.followersCount} Followers</p>
  );
}
