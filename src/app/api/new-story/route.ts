import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("No user is signed in");
  }

  try {
    const newStory = await prisma.story.create({
      data: {
        authorId: user.id,
      },
    });

    return Response.json(newStory);
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { storyId, content } = body;

  if (!storyId || !content) {
    throw new Error("Missing fields");
  }

  const Story = await prisma.story.findUnique({
    where: {
      id: storyId,
    },
  });

  if (!Story) {
    throw new Error("No story were found");
  }

  try {
    await prisma.story.update({
      where: {
        id: storyId,
      },
      data: {
        content,
      },
    });

    return Response.json({ message: "Successfully saved the story" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
