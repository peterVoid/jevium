"use server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { updateUsernameSchema } from "@/lib/validation";

export async function updateUsername(values: { username: string }) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorize");

  const { username: safeNewUsername } = updateUsernameSchema.parse(values);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      username: safeNewUsername,
    },
  });

  return;
}
