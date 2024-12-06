import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CommentDataInclude, CommentPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ storyId: string }> },
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorize" }, { status: 401 });
    }

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 10;

    const { storyId } = await params;

    const comments = await prisma.comment.findMany({
      where: { storyId },
      include: CommentDataInclude,
      take: pageSize + 1,
      orderBy: { createdAt: "desc" },
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      comments.length > pageSize ? comments[pageSize].id : null;

    const result: CommentPage = {
      nextCursor,
      comments: comments.slice(0, pageSize),
    };

    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
