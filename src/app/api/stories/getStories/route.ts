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
    let tag = req.nextUrl.searchParams.get("tag") || undefined;
    if (tag) {
      tag = tag?.[0].toUpperCase() + tag.slice(1, tag.length);
    }

    const pageSize = 10;

    const stories = await prisma.story.findMany({
      where: {
        publish: true,
        ...(tag && {
          topics: {
            hasSome: [tag],
          },
        }),
      },
      include: StoryDataInclude,
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
    });

    const nextCursor = stories.length > pageSize ? stories[pageSize].id : null;

    const result: StoryPage = {
      nextCursor,
      stories: stories.slice(0, pageSize),
    };

    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
