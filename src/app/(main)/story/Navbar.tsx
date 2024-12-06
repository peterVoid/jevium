"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import UserDropdown from "../UserDropdown";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { Story } from "@prisma/client";
import Image from "next/image";
import Select from "react-select";

interface NewStoryNavbarProps {
  Story: Story;
  currentUserId: string;
  currentUserUsername: string;
  currentUserDisplayName: string;
}

export default function NewStoryNavbar({
  Story,
  currentUserDisplayName,
  currentUserId,
  currentUserUsername,
}: NewStoryNavbarProps) {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const PublishStory = async (topics: string[]) => {
    try {
      const response = await axios.patch("/api/publish-new-story", {
        storyId: Story.id,
        topics,
      });
      router.push(`/published/${response.data.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="border-b-2 border-black px-10 py-3">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between">
        <div className="flex items-center gap-9">
          <Link
            href="/"
            className="title-navbar-font-custom text-4xl font-bold"
          >
            Jevium
          </Link>
        </div>
        <nav className="flex items-center gap-10">
          <Button onClick={() => setShowPopup(!showPopup)}>Publish</Button>
          <UserDropdown />
        </nav>
      </div>
      {showPopup && (
        <SaveStoryPopUp
          Story={Story}
          publishStory={PublishStory}
          setShowPopup={setShowPopup}
          currentUserDisplayName={currentUserDisplayName}
          currentUserId={currentUserId}
          currentUserUsername={currentUserUsername}
        />
      )}
    </header>
  );
}

interface SaveStoryPopUptypes {
  Story: Story;
  publishStory: (topics: string[]) => void;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  currentUserId: string;
  currentUserUsername: string;
  currentUserDisplayName: string;
}

const SaveStoryPopUp = ({
  publishStory,
  Story,
  currentUserDisplayName,
  currentUserId,
  currentUserUsername,
  setShowPopup,
}: SaveStoryPopUptypes) => {
  const [selectedTopics, setSelectedTopic] = useState<string[]>([]);

  const topics: { value: string; label: string }[] = [
    { value: "Artificial Intelligence", label: "Artificial Intelligence" },
    { value: "Python", label: "Python" },
    { value: "Programming", label: "Programming" },
    { value: "Fashion", label: "Fashion" },
    { value: "World", label: "World" },
    { value: "Politics", label: "Politics" },
  ];

  if (!Story) return null;

  const matchImage = Story?.content?.match(/<img[^>]*src="([^"]*)"/) || "";

  const matchTitle = Story?.content?.match(/<h1[^>]*>(.*?)<\/h1>/) || "";

  const imgSrc = matchImage ? matchImage[1] : "";

  const h1Elem = matchTitle ? matchTitle[1] : "";

  const h1ElementWithoutTag = h1Elem.replace(/<\/?[^>]+(>|$)/g, "");

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-20 w-full overflow-auto bg-gray-50">
      <span
        onClick={() => setShowPopup(false)}
        className="absolute right-6 top-4 cursor-pointer text-3xl"
      >
        &times;
      </span>
      <div className="mx-auto mt-10 grid max-w-[900px] grid-cols-1 gap-1 md:mt-28 md:grid-cols-2">
        <div className="max-md:hidden">
          <p className="font-semibold">Story Preview</p>
          <div className="my-3 h-[250px] w-full rounded border-b-[1px] bg-gray-100">
            {imgSrc && (
              <Image
                src={imgSrc}
                alt="Preview Image"
                width={250}
                height={250}
                className="size-full object-cover"
              />
            )}
          </div>
          <h1 className="border-b-[1px] py-2 text-[18px] font-semibold">
            {h1ElementWithoutTag}
          </h1>
        </div>
        <div>
          <p className="py-2">
            Publishing to: <span>{currentUserDisplayName}</span>
          </p>
          <p className="pb-3 pt-1 text-sm">
            Add or change topics (up to 5) so readers know what your story is
            about
          </p>
          <Select
            placeholder="tags"
            isMulti
            onChange={(selectedValues) => {
              const values = selectedValues as {
                value: string;
                label: string;
              }[];

              const stringValue = values.map((value) => value.value);

              setSelectedTopic(stringValue);
            }}
            isOptionDisabled={() => selectedTopics.length >= 5}
            name="topics"
            options={topics}
            className="basic-multi-select"
            classNamePrefix="Add a topic"
          />
          <button
            onClick={() => publishStory(selectedTopics)}
            className="mt-8 rounded-full bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
          >
            Publish now
          </button>
        </div>
      </div>
    </div>
  );
};
