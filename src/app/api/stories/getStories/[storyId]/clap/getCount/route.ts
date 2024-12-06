import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { StoryClapCount } from "@/lib/types";

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
      select: {
        _count: {
          select: {
            claps: {
              where: {
                commentId: null,
              },
            },
          },
        },
      },
    });

    if (!story) {
      return Response.json({ error: "Story not found" }, { status: 404 });
    }

    const result: StoryClapCount = {
      clapCount: story._count.claps,
    };

    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
