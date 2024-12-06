import { CommentPage, StoryData } from "@/lib/types";
import CommentEditor from "./editor/CommentEditor";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useInfiniteQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import Comment from "./editor/Comment";
import InfiniteScrollContainer from "@/app/InfiniteScrollContainer";
import { Loader2 } from "lucide-react";

export default function RespondSheet({
  children,
  story,
}: {
  children: React.ReactNode;
  story: StoryData;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["comment-story-feed", story.id],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(`/api/stories/getStories/${story.id}/comment`, {
            searchParams: pageParam ? { id: pageParam } : {},
          })
          .json<CommentPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const comments = data?.pages.flatMap((p) => p.comments) || [];

  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold">Responses</SheetTitle>
        </SheetHeader>
        <CommentEditor storyId={story.id} />
        <InfiniteScrollContainer
          fetchNextPage={() =>
            hasNextPage && !isFetchingNextPage && fetchNextPage()
          }
          className="mt-5 flex min-h-screen flex-col gap-5 border-t border-slate-200 py-5"
        >
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} storyId={story.id} />
          ))}
          {isFetchingNextPage && <Loader2 className="mx-auto animate-spin" />}
        </InfiniteScrollContainer>
      </SheetContent>
    </Sheet>
  );
}
