import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { commentStory } from "./actions";
import { CommentPage } from "@/lib/types";

export const useComment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: commentStory,
    onSuccess: async (newComment) => {
      const queryFilters: QueryFilters = { queryKey: ["comment-story-feed"] };

      await queryClient.cancelQueries();

      queryClient.setQueriesData<InfiniteData<CommentPage, string | null>>(
        queryFilters,
        (oldData) => {
          if (!oldData) return;

          const firstPage = oldData.pages[0];

          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                nextCursor: firstPage.nextCursor,
                comments: [newComment, ...firstPage.comments],
              },
              ...oldData.pages.slice(1),
            ],
          };
        },
      );
    },
  });

  return mutation;
};
