import { useSession } from "@/app/SessionProvider";
import kyInstance from "@/lib/ky";
import { CommentData, CommentInfo } from "@/lib/types";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { FaHandsClapping } from "react-icons/fa6";

interface CommentClapProps {
  comment: CommentData;
  storyId: string;
}

export default function CommentClap({ comment, storyId }: CommentClapProps) {
  const { user: currentUser } = useSession();
  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["comment-clap", comment.id];

  const [myCurrentClapsNumber, setMyCurrentClapsNumber] = useState<number>(
    comment.claps.filter((u) => u.senderId === currentUser.id).length,
  );

  const [showBubble, setShowBubble] = useState<boolean>(false);

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance
        .get(`/api/stories/getStories/${storyId}/comment/clap/${comment.id}`)
        .json<CommentInfo>(),
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      kyInstance.post(
        `/api/stories/getStories/${storyId}/comment/clap/${comment.id}`,
      ),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<CommentInfo>(queryKey);

      setMyCurrentClapsNumber((prev) => prev + 1);

      queryClient.setQueryData<CommentInfo>(queryKey, (oldData) => {
        if (!oldData) return;

        return { ...oldData, amountOfClap: oldData.amountOfClap + 1 };
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

  const handleCLick = () => {
    setShowBubble(true);
    mutate();
  };

  return (
    <button
      className="relative flex items-center gap-3 disabled:cursor-not-allowed"
      onClick={handleCLick}
    >
      <FaHandsClapping
        size={25}
        className={`text-muted-foreground ${data?.isClappedByUser ? "scale-110 animate-pulse fill-black" : ""} `}
      />
      <p>{data ? data.amountOfClap : "--"}</p>
      {showBubble && (
        <div className="animate-pulses absolute -top-12 size-10 rounded-full bg-black p-2 text-white transition-all duration-500">
          +{myCurrentClapsNumber}
        </div>
      )}
    </button>
  );
}
