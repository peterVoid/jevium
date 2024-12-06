"use client";

import kyInstance from "@/lib/ky";
import { GetBookmark, StoryData } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Bookmark } from "lucide-react";

interface RespondType {
  story: StoryData;
  currentUserId: string;
}

export default function Save({ currentUserId, story }: RespondType) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["story-feed", "bookmarks", story.id];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance
        .get(`/api/stories/getStories/${story.id}/bookmark`)
        .json<GetBookmark>(),
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data?.isBookmarkedByUser
        ? kyInstance.delete(`/api/stories/getStories/${story.id}/bookmark`)
        : kyInstance.post(`/api/stories/getStories/${story.id}/bookmark`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<GetBookmark>(queryKey);

      queryClient.setQueryData<GetBookmark>(queryKey, (oldData) => {
        if (!oldData) return;

        return { isBookmarkedByUser: !oldData.isBookmarkedByUser };
      });

      return { previousData };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousData);
    },
  });

  const handleClick = () => {
    mutate();
  };

  return (
    <button
      title="Save"
      className="disabled:cursor-not-allowed"
      onClick={handleClick}
    >
      <Bookmark
        size={25}
        className={cn(
          "text-muted-foreground",
          data?.isBookmarkedByUser ? "fill-cyan-400" : "",
        )}
      />
    </button>
  );
}
