import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { StoryDataInclude, StoryPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorize" }, { status: 401 });
    }

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 10;

    const { userId } = await params;

    const currentUserStoryData = await prisma.story.findMany({
      where: { authorId: userId },
      include: StoryDataInclude,
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      currentUserStoryData.length > pageSize
        ? currentUserStoryData[pageSize].id
        : null;

    const result: StoryPage = {
      nextCursor,
      stories: currentUserStoryData.slice(0, pageSize),
    };

    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
