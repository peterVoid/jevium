"use server";

import prisma from "@/lib/prisma";
import { StoryDataInclude } from "@/lib/types";

export const getPublishedStoryById = async (storyId: string) => {
  if (!storyId) {
    throw new Error("Do not have story id");
  }

  try {
    const storyById = await prisma.story.findUnique({
      where: {
        id: storyId,
        publish: true,
      },
      include: StoryDataInclude,
    });

    return { response: storyById };
  } catch (error) {
    console.error(error);
  }
};
