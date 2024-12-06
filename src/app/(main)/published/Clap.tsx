"use client";

import kyInstance from "@/lib/ky";
import { StoryClapCount, StoryData } from "@/lib/types";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { FaHandsClapping } from "react-icons/fa6";

interface ClapProps {
  publishedStory: StoryData;
  currentUserId: string;
}

export default function Clap({ publishedStory, currentUserId }: ClapProps) {
  const queryClient = useQueryClient();
  const [myCurrentClapsNumber, setMyCurrentClapsNumber] = useState<number>(
    publishedStory.claps.filter((u) => u.senderId === currentUserId).length,
  );
  const [showBubble, setShowBubble] = useState<boolean>(false);

  const isClapByUser = publishedStory.claps.some(
    (u) => u.senderId === currentUserId,
  );

  const queryKey: QueryKey = ["claps-count", publishedStory.id];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance
        .get(`/api/stories/getStories/${publishedStory.id}/clap/getCount`)
        .json<StoryClapCount>(),
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      kyInstance
        .post(`/api/stories/getStories/${publishedStory.id}/clap`)
        .json(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<StoryClapCount>(queryKey);

      setMyCurrentClapsNumber((prev) => prev + 1);

      queryClient.setQueryData<StoryClapCount>(queryKey, (oldData) => {
        if (!oldData) return;

        return { clapCount: oldData.clapCount + 1 };
      });

      return { previousData };
    },
    onSuccess: () => {
      setTimeout(() => {
        setShowBubble(false);
      }, 1000);
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousData);
    },
  });

  const handleClick = () => {
    mutate();
    setShowBubble(true);
  };

  return (
    <button
      disabled={publishedStory.authorId === currentUserId}
      title={
        publishedStory.authorId === currentUserId
          ? "You cannot applaud your own story"
          : "applaud"
      }
      className="relative flex items-center gap-3 disabled:cursor-not-allowed"
      onClick={() => publishedStory.authorId !== currentUserId && handleClick()}
    >
      <FaHandsClapping
        size={25}
        className={`text-muted-foreground ${isClapByUser ? "scale-110 animate-pulse fill-black" : ""} `}
      />
      <p>{data ? data.clapCount : "--"}</p>
      {showBubble && (
        <div className="animate-pulses absolute -top-12 size-10 rounded-full bg-black p-2 text-white transition-all duration-500">
          +{myCurrentClapsNumber}
        </div>
      )}
    </button>
  );
}
