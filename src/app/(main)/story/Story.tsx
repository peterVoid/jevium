import UserAvatar from "@/components/UserAvatar";
import { StoryData } from "@/lib/types";
import { formatRelativeDate, getContentH1WithoutTag } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { FaHandsClapping } from "react-icons/fa6";
import { FcComments } from "react-icons/fc";
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";
import Save from "../published/Save";
import { useSession } from "@/app/SessionProvider";

interface StoryProps {
  story: StoryData;
  isProfileRender?: boolean;
}

function extractFirstParagraphTextAfterTitle(content: string): string | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");

  const firstParagraph = doc.querySelector("h1 ~ p");

  return firstParagraph?.textContent?.trim() || null;
}

function getFirstImageSrcWithRegex(content: string): string | null {
  const match = content.match(/<img[^>]+src="([^"]+)"/);

  return match ? match[1] : null;
}

export default function StoryFeed({
  story,
  isProfileRender = false,
}: StoryProps) {
  const { user } = useSession();

  return (
    <Link
      href={`/read-story/${story.id}`}
      className={`${!isProfileRender ? "mx-auto" : ""} border-b border-t border-slate-100 py-6`}
    >
      <div className="flex items-center gap-10">
        <div className="max-w-[510px] space-y-5">
          <div className="flex items-center gap-1">
            <UserAvatar src={story.user.avatar!} size={35} />
            <p>{story.user.username}</p>
          </div>
          <h1 className="text-3xl font-bold">
            {getContentH1WithoutTag(story.content!)}
          </h1>
          <p className="line-clamp-2 text-xl text-muted-foreground">
            {extractFirstParagraphTextAfterTitle(story.content!)}
          </p>
        </div>
        <img
          src={getFirstImageSrcWithRegex(story.content!) ?? undefined}
          alt="Preview"
          width={70}
          height={70}
          className="h-40 w-64 object-cover"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="mt-5 flex gap-7">
          <span className="text-lg text-muted-foreground">
            {formatRelativeDate(story.createdAt)}
          </span>
          <span className="flex items-center gap-3 text-lg text-muted-foreground">
            <FaHandsClapping size={25} className={`text-muted-foreground`} />
            {story.claps.length || "--"}
          </span>
          <span className="flex items-center gap-3 text-lg text-muted-foreground">
            <HiOutlineChatBubbleOvalLeft
              size={25}
              className="text-muted-foreground"
            />
            {story.comments.length}
          </span>
          <span className="flex items-center gap-3 text-lg text-muted-foreground">
            <Save currentUserId={user.id} story={story} />
          </span>
        </div>
      </div>
    </Link>
  );
}
