import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const { storyId, topics } = await req.json();

  if (!storyId) {
    throw new Error("No storyId was found");
  }

  const story = await prisma.story.findUnique({
    where: {
      id: storyId,
    },
  });

  if (!story) {
    throw new Error("No Story were found");
  }

  try {
    const updatedStory = await prisma.story.update({
      where: { id: storyId },
      data: {
        topics,
        publish: true,
      },
    });

    return NextResponse.json(updatedStory);
  } catch (error) {
    console.error(error);
  }
}
