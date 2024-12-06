import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorize" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: {
            equals: user.id,
          },
        },
      },
      take: 3,
    });

    return Response.json(users);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
