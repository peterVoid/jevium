import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UserDataSelect } from "@/lib/types";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../Navbar";
import AboutUserInputSection from "./AboutUserInputSection";
import FollowersCount from "@/components/FollowersCount";
import { cache } from "react";

interface PageProps {
  params: Promise<{ username: string }>;
}

const getUserData = cache(async (username: string) => {
  const userData = await prisma.user.findUnique({
    where: { username },
    select: UserDataSelect,
  });

  if (!userData) notFound();

  return userData;
});

export async function generateMetadata({ params }: PageProps) {
  let { username } = await params;

  const usernameData = decodeURIComponent(username.replace("%40", ""));

  const user = await getUserData(usernameData);

  return {
    title: `About ${user.displayName} | Jevium`,
    description: user.shortBio || `Learn more about ${user.displayName}`,
  };
}

export default async function Page({ params }: PageProps) {
  const { user } = await validateRequest();

  if (!user) notFound();

  const { username } = await params;

  const usernameData = decodeURIComponent(username.replace("%40", ""));

  const currentUserData = await getUserData(usernameData);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <UserAvatar src={user.avatar!} size={100} />
            <div>
              <h1 className="text-3xl font-bold">{user.displayName}</h1>
              <p className="text-muted-foreground">
                {currentUserData.followers.length} Followers
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FollowersCount userId={currentUserData.id} />
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mb-8 border-b">
          <div className="flex gap-6">
            <Button variant="link" className="text-foreground" asChild>
              <Link href={`/@${currentUserData.username}`}>Home</Link>
            </Button>
            <Button variant="link" className="text-muted-foreground" asChild>
              <Link href={`/@${currentUserData.username}/about`}>About</Link>
            </Button>
          </div>
        </nav>

        {currentUserData.id === user.id ? (
          <AboutUserInputSection userAbout={currentUserData.about} />
        ) : (
          <div>
            {currentUserData.about || "The user has not set this section"}
          </div>
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
