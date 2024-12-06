import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { StoryDataInclude, StoryPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorize" }, { status: 401 });
    }

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 10;

    const getBookmarkUser = await prisma.bookmark.findMany({
      where: { userId: user.id },
      select: {
        storyId: true,
      },
    });

    if (!getBookmarkUser) return;

    const currentUserStoryData = await prisma.story.findMany({
      where: {
        id: {
          in: getBookmarkUser.map((story) => story.storyId),
        },
      },
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
