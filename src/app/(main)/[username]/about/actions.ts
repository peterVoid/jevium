"use server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function updateAbout(text: string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorize");

  if (!text) return;

  const userAbout = await prisma.user.update({
    where: { id: user.id },
    data: {
      about: text,
    },
    select: {
      about: true,
    },
  });

  return userAbout;
}
