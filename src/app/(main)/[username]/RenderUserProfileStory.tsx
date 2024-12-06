"use client";

import InfiniteScrollContainer from "@/app/InfiniteScrollContainer";
import kyInstance from "@/lib/ky";
import { StoryPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import StoryFeed from "../story/Story";

interface RenderUserProfileStoryProps {
  userId: string;
}

export default function RenderUserProfileStory({
  userId,
}: RenderUserProfileStoryProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["my-story-feed"],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(`/api/users/${userId}/stories`, {
            searchParams: {
              ...(pageParam && { cursor: pageParam }),
            },
          })
          .json<StoryPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const stories = data?.pages.flatMap((p) => p.stories) || [];

  if (status == "pending") {
    return <Loader2 className="mx-auto size-20" />;
  }

  return (
    <div>
      <InfiniteScrollContainer
        className="mt-6 flex flex-col"
        fetchNextPage={() =>
          hasNextPage && !isFetchingNextPage && fetchNextPage()
        }
      >
        {stories.length > 0 &&
          stories.map((story) => (
            <StoryFeed isProfileRender key={story.id} story={story} />
          ))}
      </InfiniteScrollContainer>
    </div>
  );
}
