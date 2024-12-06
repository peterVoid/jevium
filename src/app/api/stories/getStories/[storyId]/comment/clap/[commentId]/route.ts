import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CommentInfo } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storyId: string; commentId: string }> },
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorize" }, { status: 401 });
    }

    const { storyId, commentId } = await params;

    const commentClap = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        claps: {
          where: {
            senderId: user.id,
          },
          select: { senderId: true },
        },
        _count: {
          select: {
            claps: true,
          },
        },
      },
    });

    if (!commentClap) {
      return Response.json({ error: "Comment not found" }, { status: 404 });
    }

    const result: CommentInfo = {
      isClappedByUser: !!commentClap.claps.length,
      amountOfClap: commentClap._count.claps,
    };

    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storyId: string; commentId: string }> },
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorize" }, { status: 401 });
    }

    const { storyId, commentId } = await params;

    await prisma.clap.create({
      data: {
        storyId,
        commentId,
        senderId: user.id,
      },
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
