"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import Navbar from "./Navbar";
import TopicsHeader from "./TopicsHeader";
import kyInstance from "@/lib/ky";
import { StoryData, StoryPage } from "@/lib/types";
import Story from "./story/Story";
import InfiniteScrollContainer from "../InfiniteScrollContainer";
import { Loader2 } from "lucide-react";
import WhoToFollow from "./WhoToFollow";
import { useSession } from "../SessionProvider";
import UserAvatar from "@/components/UserAvatar";
import { formatRelativeDate, getContentH1WithoutTag } from "@/lib/utils";
import Link from "next/link";

interface HomePageProps {
  tag: string | undefined;
  storyPicks: StoryData[];
}

export default function HomePage({ tag, storyPicks }: HomePageProps) {
  const { user } = useSession();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["stories-feed", tag],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get("/api/stories/getStories", {
            searchParams: {
              ...(pageParam && { cursor: pageParam }),
              ...(tag && { tag }),
            },
          })
          .json<StoryPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const stories = data?.pages.flatMap((p) => p.stories) || [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto mt-10 flex max-w-[1700px] gap-10 px-10">
        <div className="w-full border-r border-slate-300 px-4 md:w-[100%]">
          <TopicsHeader />
          {status === "pending" && (
            <Loader2 className="mx-auto mt-10 animate-spin" size={30} />
          )}
          {status == "success" && stories.length === 0 && (
            <p className="mx-auto mt-9 text-center text-3xl font-bold">
              No story Found!
            </p>
          )}
          <InfiniteScrollContainer
            className="mt-6 flex flex-col"
            fetchNextPage={() =>
              hasNextPage && !isFetchingNextPage && fetchNextPage()
            }
          >
            {stories.length > 0 &&
              status !== "pending" &&
              stories.map((story) => <Story key={story.id} story={story} />)}
          </InfiniteScrollContainer>
        </div>
        <div className="sticky mt-5 hidden w-[400px] lg:block">
          <StaffPicks storyPicks={storyPicks} />
          <WhoToFollow />
        </div>
      </div>
    </div>
  );
}

interface StaffPicksProps {
  storyPicks: StoryData[];
}

function StaffPicks({ storyPicks }: StaffPicksProps) {
  return (
    <div className="mb-10 space-y-5">
      <div className="font-semibold">Staff Picks</div>
      <div className="mt-3 flex flex-col gap-5">
        {storyPicks.map((story) => (
          <Link
            href={`/read-story/${story.id}`}
            key={story.id}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              <UserAvatar src={story.user.avatar!} size={35} />
              <span className="text-sm text-muted-foreground">
                {story.user.displayName}
              </span>
            </div>
            <h1 className="text-lg font-bold">
              {getContentH1WithoutTag(story.content!)}
            </h1>
            <span className="text-sm text-muted-foreground">
              {formatRelativeDate(story.createdAt)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
