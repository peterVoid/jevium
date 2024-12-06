"use server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UserDataSelect } from "@/lib/types";

export const commentStory = async (values: {
  content: string;
  storyId: string;
}) => {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorize");

  const newComment = await prisma.comment.create({
    data: {
      content: values.content,
      storyId: values.storyId,
      userId: user.id,
    },
    include: {
      user: {
        select: {
          avatar: true,
          displayName: true,
        },
      },
      claps: true,
    },
  });

  return newComment;
};
