import { useFollowInfo } from "@/hooks/useFollowInfo";
import { Button } from "./ui/button";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { FollowInfo } from "@/lib/types";
import { Loader2 } from "lucide-react";

interface FollowButtonProps {
  userId: string;
}

export default function FollowButton({ userId }: FollowButtonProps) {
  const { data, isLoading } = useFollowInfo(userId);

  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["follow-info", userId];

  const { mutate } = useMutation({
    mutationFn: () =>
      data?.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/follow`)
        : kyInstance.post(`/api/users/${userId}/follow`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<FollowInfo>(queryKey);

      queryClient.setQueryData<FollowInfo>(queryKey, (oldData) => {
        if (!oldData) return;

        return {
          isFollowedByUser: !oldData.isFollowedByUser,
          followersCount:
            oldData.followersCount + (oldData.isFollowedByUser ? -1 : 1),
          followingCount: oldData.followingCount,
        };
      });

      return { previousData };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousData);
    },
  });

  if (isLoading) {
    return <Loader2 className="size-5" />;
  }

  return (
    <Button size="lg" onClick={() => mutate()}>
      {data?.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
