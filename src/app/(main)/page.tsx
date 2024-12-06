import prisma from "@/lib/prisma";
import HomePage from "./HomePage";
import { StoryDataInclude } from "@/lib/types";

type SearchParams = Promise<{ [key: string]: string | undefined }>;

async function getRandomStory(limit: number) {
  const count = await prisma.story.count();
  const randomOffset = Math.max(0, Math.floor(Math.random() * count - limit));
  return prisma.story.findMany({
    skip: randomOffset,
    take: limit,
    include: StoryDataInclude,
    orderBy: { createdAt: "desc" },
  });
}

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { tag } = await searchParams;

  const data = await getRandomStory(3);

  return <HomePage tag={tag} storyPicks={data} />;
}
