"use client";

import Image from "next/image";
import avatarPlaceholder from "@/app/assets/avatarPlaceholder.png";
import { MoreHorizontal } from "lucide-react";
import Respond from "./Respond";
import { User } from "lucia";
import Save from "./Save";
import Clap from "./Clap";
import PublishedContentPreview from "./PublishedContentPreview";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { getContentH1WithoutTag } from "@/lib/utils";
import { StoryData } from "@/lib/types";
import FollowButton from "@/components/FollowButton";
import { useFollowInfo } from "@/hooks/useFollowInfo";

interface RenderStoryProps {
  user: User;
  PublishedStory: StoryData;
}

export default function RenderStory({
  user,
  PublishedStory,
}: RenderStoryProps) {
  const { data } = useFollowInfo(PublishedStory.authorId);

  return (
    <div className="mx-auto my-10 mt-6 flex max-w-[900px] items-center justify-center">
      <div>
        <h1 className="my-8 text-4xl font-bold">
          {getContentH1WithoutTag(PublishedStory.content!)}
        </h1>
        <div className="flex items-center space-x-5">
          <Image
            src={user.avatar || avatarPlaceholder}
            className="rounded-full"
            width={44}
            height={44}
            alt="User"
          />
          <div className="text-sm">
            <p>{user.displayName} </p>
            <p className="opacity-60">
              Published on{" "}
              {new Date(PublishedStory.updatedAt)
                .toDateString()
                .split(" ")
                .slice(1, 4)
                .join(" ")}
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between border-y-[1px] border-neutral-200 px-3 py-3">
          <div className="flex items-center space-x-4">
            <Clap publishedStory={PublishedStory} currentUserId={user.id} />
            <Respond story={PublishedStory} currentUserId={user.id} />
          </div>
          <div className="flex items-center space-x-4">
            <Save story={PublishedStory} currentUserId={user.id} />
            <button>
              <MoreHorizontal size={24} className="text-green-800 opacity-80" />
            </button>
          </div>
        </div>
        <PublishedContentPreview content={PublishedStory.content} />
        <div className="flex items-center gap-3">
          {PublishedStory.topics.map((a) => (
            <span key={a} className="rounded-full bg-slate-200 p-3">
              {a}
            </span>
          ))}
        </div>
        <div className="mt-8 flex justify-between border-b border-t py-16">
          <div className="flex gap-4">
            <UserAvatar src={user.avatar!} size={48} />
            <div className="space-y-5">
              <div className="text-2xl font-semibold">
                Written By {user.displayName}
              </div>
              <span className="mr-2 text-muted-foreground">
                {data ? data.followersCount : "--"} Followers ·
              </span>
              <span className="text-muted-foreground">
                {data ? data.followingCount : "--"} Following
              </span>
            </div>
          </div>
          {PublishedStory.authorId !== user.id ? (
            <FollowButton userId={PublishedStory.authorId} />
          ) : (
            <Button>Edit Profile</Button>
          )}
        </div>
      </div>
    </div>
  );
}
