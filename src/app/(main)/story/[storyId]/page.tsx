import { validateRequest } from "@/lib/auth";
import { getStoryById } from "../actions";
import NewStoryNavbar from "../Navbar";
import NewStory from "../NewStory";
import { notFound } from "next/navigation";
import { Story } from "@prisma/client";

export default async function Page({
  params,
}: {
  params: Promise<{ storyId: string }>;
}) {
  const { storyId } = await params;

  const story = await getStoryById(storyId);

  const { user } = await validateRequest();

  if (!user) {
    return notFound();
  }

  return (
    <div className="mx-auto max-w-[1000px]">
      <NewStoryNavbar
        Story={story?.response!}
        currentUserId={user.id}
        currentUserUsername={user.username}
        currentUserDisplayName={user.displayName}
      />
      <NewStory
        storyId={storyId}
        storyRender={story?.response?.content || ""}
      />
    </div>
  );
}
