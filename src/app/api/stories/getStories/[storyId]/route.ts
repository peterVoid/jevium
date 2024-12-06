import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { StoryDataInclude } from "@/lib/types";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ storyId: string }>;
  },
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorize" }, { status: 401 });
    }

    const { storyId } = await params;

    const story = await prisma.story.findUnique({
      where: {
        id: storyId,
      },
      include: StoryDataInclude,
    });

    if (!story) {
      return Response.json({ error: "Story not found" }, { status: 404 });
    }

    return Response.json(story);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
