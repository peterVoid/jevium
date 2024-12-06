import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UserAvatar from "@/components/UserAvatar";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UserDataSelect } from "@/lib/types";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import Navbar from "../Navbar";
import EditProfileButton from "./EditProfileButton";
import FollowersCount from "@/components/FollowersCount";
import RenderUserProfileStory from "./RenderUserProfileStory";

export const getUserData = cache(async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: UserDataSelect,
  });

  if (!user) notFound();

  return user;
});

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { user } = await validateRequest();

  if (!user) notFound();

  let { username } = await params;

  username = username.replace("%40", "");

  const currentUserData = await getUserData(username);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <UserAvatar src={user.avatar!} size={100} />
            <div>
              <h1 className="text-3xl font-bold">{user.displayName}</h1>
              <FollowersCount userId={currentUserData.id} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <EditProfileButton userId={currentUserData.id} />
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mb-8 border-b">
          <div className="flex gap-6">
            <Button variant="link" className="text-foreground">
              Home
            </Button>
            <Button variant="link" className="text-muted-foreground" asChild>
              <Link href={`/@${currentUserData.username}/about`}>About</Link>
            </Button>
          </div>
        </nav>

        {/* Reading List */}
        {user.id === currentUserData.id ? (
          <Link href={`/@${username}/list/reading-list`}>
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-emerald-600 text-white">
                    H
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">Haikalpraseya Alhakim</h2>
              </CardHeader>
              <CardContent>
                <h3 className="text-2xl font-bold">Reading list</h3>
                <p className="text-sm text-muted-foreground">1 story</p>
              </CardContent>
            </Card>
          </Link>
        ) : (
          <RenderUserProfileStory userId={currentUserData.id} />
        )}

        {/* Footer */}
        <footer className="mt-20 border-t pt-8">
          <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">
              Help
            </a>
            <a href="#" className="hover:text-foreground">
              Status
            </a>
            <a href="#" className="hover:text-foreground">
              About
            </a>
            <a href="#" className="hover:text-foreground">
              Careers
            </a>
            <a href="#" className="hover:text-foreground">
              Blog
            </a>
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground">
              Terms
            </a>
            <a href="#" className="hover:text-foreground">
              Text to speech
            </a>
            <a href="#" className="hover:text-foreground">
              Teams
            </a>
          </nav>
        </footer>
      </main>
    </div>
  );
}
