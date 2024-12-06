import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { FollowInfo } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorize" }, { status: 401 });
    }

    const { userId } = await params;

    const userToFollow = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        followers: {
          where: { followerId: user.id },
          select: { followerId: true },
        },
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!userToFollow) {
      return Response.json({ error: "Unauthorize" }, { status: 401 });
    }

    const result: FollowInfo = {
      isFollowedByUser: !!userToFollow.followers.length,
      followersCount: userToFollow._count.followers,
      followingCount: userToFollow._count.following,
    };

    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorize" }, { status: 401 });
    }

    const { userId } = await params;

    await prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: userId,
        },
      },
      create: {
        followerId: user.id,
        followingId: userId,
      },
      update: {},
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorize" }, { status: 401 });
    }

    const { userId } = await params;

    await prisma.follow.deleteMany({
      where: {
        followerId: user.id,
        followingId: userId,
      },
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
