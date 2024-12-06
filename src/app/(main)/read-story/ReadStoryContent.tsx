"use client";

import kyInstance from "@/lib/ky";
import { StoryData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import RenderStory from "../published/RenderStory";
import { useSession } from "@/app/SessionProvider";

interface ReadStoryContent {
  storyId: string;
}

export default function ReadStoryContent({ storyId }: ReadStoryContent) {
  const { data, status } = useQuery({
    queryKey: ["story-feed", storyId],
    queryFn: () =>
      kyInstance.get(`/api/stories/getStories/${storyId}`).json<StoryData>(),
    staleTime: Infinity,
  });
  const { user } = useSession();

  if (status === "pending") {
    return <Loader2 className="mx-auto mt-52 animate-spin" size={30} />;
  }

  if (status === "error" && !data) {
    return <p>an Error occured while loading the Page!</p>;
  }

  return (
    <div className="px-10">
      <RenderStory PublishedStory={data} user={user} />
    </div>
  );
}
