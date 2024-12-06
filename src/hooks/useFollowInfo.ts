import kyInstance from "@/lib/ky";
import { FollowInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export function useFollowInfo(userId: string) {
  const query = useQuery({
    queryKey: ["follow-info", userId],
    queryFn: () =>
      kyInstance.get(`/api/users/${userId}/follow`).json<FollowInfo>(),
    staleTime: Infinity,
  });

  return query;
}
