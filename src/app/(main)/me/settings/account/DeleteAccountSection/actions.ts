"use server";

import { lucia, validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function deleteUser(): Promise<{ error: string }> {
  const { session, user } = await validateRequest();

  if (!session) {
    return {
      error: "Unauthorize",
    };
  }

  await prisma.user.delete({
    where: { id: user.id },
  });

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/");
}
