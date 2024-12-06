import { Prisma } from "@prisma/client";

export const UserDataSelect = {
  id: true,
  avatar: true,
  displayName: true,
  googleId: true,
  username: true,
  followers: true,
  createdAt: true,
  stories: true,
  about: true,
  shortBio: true,
  pronouns: true,
} satisfies Prisma.UserSelect;

export type UserData = Prisma.UserGetPayload<{
  select: typeof UserDataSelect;
}>;

export const StoryDataInclude = {
  user: {
    select: UserDataSelect,
  },
  comments: true,
  claps: {
    select: {
      senderId: true,
    },
  },
} satisfies Prisma.StoryInclude;

export type StoryData = Prisma.StoryGetPayload<{
  include: typeof StoryDataInclude;
}>;

export type StoryPage = {
  nextCursor: string | null;
  stories: StoryData[];
};

export const CommentDataInclude = {
  user: {
    select: {
      displayName: true,
      avatar: true,
    },
  },
  claps: {
    select: {
      senderId: true,
    },
  },
} satisfies Prisma.CommentInclude;

export type CommentData = Prisma.CommentGetPayload<{
  include: typeof CommentDataInclude;
}>;

export type CommentPage = {
  nextCursor: string | null;
  comments: CommentData[];
};

export type StoryClapCount = {
  clapCount: number;
};

export type GetBookmark = {
  isBookmarkedByUser: boolean;
};

export type FollowInfo = {
  isFollowedByUser: boolean;
  followersCount: number;
  followingCount: number;
};

export type CommentInfo = {
  isClappedByUser: boolean;
  amountOfClap: number;
};
