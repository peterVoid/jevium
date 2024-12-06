"use client";

import RespondSheet from "@/components/RespondSheet";
import { StoryData } from "@/lib/types";
import { useState } from "react";
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";

interface RespondType {
  story: StoryData;
  currentUserId: string;
}

export default function Respond({ currentUserId, story }: RespondType) {
  const [openSheet, setOpenSheet] = useState<boolean>(false);

  return (
    <RespondSheet story={story}>
      <button
        title="Respond"
        className="disabled:cursor-not-allowed"
        onClick={() => setOpenSheet(!openSheet)}
      >
        <HiOutlineChatBubbleOvalLeft
          size={25}
          className="text-muted-foreground"
        />
      </button>
    </RespondSheet>
  );
}
