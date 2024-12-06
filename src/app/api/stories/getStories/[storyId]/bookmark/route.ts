import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { GetBookmark } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storyId: string }> },
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorize" }, { status: 401 });
    }

    const { storyId } = await params;

    const story = await prisma.story.findFirst({
      where: { id: storyId },
      include: {
        bookmarks: {
          where: { userId: user.id },
          select: { userId: true },
        },
      },
    });

    if (!story) {
      return Response.json({ error: "Story not found" }, { status: 404 });
    }

    const result: GetBookmark = {
      isBookmarkedByUser: !!story.bookmarks.length,
    };

    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storyId: string }> },
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorize" }, { status: 401 });
    }

    const { storyId } = await params;

    await prisma.bookmark.create({
      data: {
        storyId,
        userId: user.id,
      },
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storyId: string }> },
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorize" }, { status: 401 });
    }

    const { storyId } = await params;

    await prisma.bookmark.deleteMany({
      where: {
        storyId,
        userId: user.id,
      },
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
