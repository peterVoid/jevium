import Navbar from "@/app/(main)/Navbar";
import { getPublishedStoryById } from "./actions";
import RenderStory from "../RenderStory";
import { validateRequest } from "@/lib/auth";

export default async function Page({
  params,
}: {
  params: Promise<{ storyId: string }>;
}) {
  const { storyId } = await params;

  const { user } = await validateRequest();

  if (!user) {
    return null;
  }

  const publishedStory = await getPublishedStoryById(storyId);

  if (!publishedStory?.response) {
    return <div>No stories found</div>;
  }

  return (
    <div>
      <Navbar />
      <RenderStory user={user} PublishedStory={publishedStory.response} />
    </div>
  );
}
