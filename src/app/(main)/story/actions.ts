"use server";

import prisma from "@/lib/prisma";

export const getStoryById = async (storyId: string) => {
  if (!storyId) {
    throw new Error("Do not have story id");
  }

  try {
    const storyById = await prisma.story.findUnique({
      where: {
        id: storyId,
      },
    });

    return { response: storyById };
  } catch (error) {
    console.error(error);
  }
};
