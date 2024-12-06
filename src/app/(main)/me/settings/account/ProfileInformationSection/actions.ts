"use server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function updateUserInformation(values: {
  displayName: string;
  pronouns: string[] | undefined;
  shortBio: string | undefined;
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorize");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      displayName: values.displayName,
      pronouns: values.pronouns,
      shortBio: values.shortBio,
    },
  });

  return;
}
