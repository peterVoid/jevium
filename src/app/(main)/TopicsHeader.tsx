"use client";

import { topics } from "@/lib/staticTopic";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TopicsHeader() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<string>("For You");

  const handleClick = (value: string) => {
    setSelectedTopic(value);
    router.push(value ? `/?tag=${value}` : "/");
  };

  return (
    <div className="relative flex flex-wrap items-center justify-center gap-6 py-3">
      {topics.map((topic) => (
        <button
          onClick={() => handleClick(topic.value)}
          className={cn(
            "text-md text-muted-foreground hover:text-black",
            selectedTopic === topic.label ? "text-black" : "",
          )}
          key={topic.value}
        >
          {topic.label}
          {selectedTopic === topic.label && (
            <div className="absolute bottom-0 mx-auto h-1 w-14 border-b border-black" />
          )}
        </button>
      ))}
    </div>
  );
}
