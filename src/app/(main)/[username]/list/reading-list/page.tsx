import Navbar from "@/app/(main)/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { validateRequest } from "@/lib/auth";
import { MoreHorizontal, Bookmark, MessageCircle } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getUserData } from "../../page";
import UserAvatar from "@/components/UserAvatar";
import { formatDate } from "date-fns";
import CurrentUserStories from "./CurrentUserStories";

export default async function ReadingList({
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
      <main className="mx-auto max-w-[1200px] px-6 py-8">
        {/* Author Header */}
        <div className="mb-12 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <UserAvatar src={currentUserData.avatar!} size={70} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">
                  {currentUserData.displayName}
                </h1>
                <span className="text-sm text-muted-foreground">
                  · {formatDate(new Date(), "MMM d, yyyy")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {currentUserData.stories.length}{" "}
                {currentUserData.stories.length > 1 ? "stories" : "story"}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Reading List Title */}
        <h2 className="mb-8 text-3xl font-bold">Reading list</h2>

        {/* Article Card */}
        <CurrentUserStories />

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
              Press
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
