import prisma from "@/lib/prisma";
import Navbar from "../../Navbar";
import ReadStoryContent from "../ReadStoryContent";
import { getContentH1WithoutTag } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storyId: string }>;
}) {
  const { storyId } = await params;

  const getStory = await prisma.story.findUnique({
    where: { id: storyId },
    select: {
      content: true,
    },
  });

  return {
    title: `${getContentH1WithoutTag(getStory?.content as string)}`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ storyId: string }>;
}) {
  const { storyId } = await params;

  return (
    <div>
      <Navbar />
      <ReadStoryContent storyId={storyId} />
    </div>
  );
}
