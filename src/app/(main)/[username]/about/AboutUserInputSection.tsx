"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUpdateAbout } from "./mutations";

interface AboutUserInputSectionProps {
  userAbout: string | null | undefined;
}

export default function AboutUserInputSection({
  userAbout,
}: AboutUserInputSectionProps) {
  const [openAboutInput, setOpenAboutInput] = useState<boolean>(!!userAbout);
  const [inputText, setTextInput] = useState<string>(userAbout || "");
  const [showEditButton, setShowEditButton] = useState<boolean>(!!userAbout);
  const [enableTextarea, setEnableTextArea] = useState<boolean>(false);

  const { mutate, isPending } = useUpdateAbout();

  const handleSave = () => {
    mutate(inputText, {
      onSuccess: () => {
        setOpenAboutInput(false);
        setShowEditButton(true);
        setEnableTextArea(false);
      },
    });
  };

  return (
    <div>
      {openAboutInput || inputText ? (
        <div>
          <textarea
            disabled={!openAboutInput && !enableTextarea}
            rows={4}
            className="w-full max-w-[600px] resize-none bg-transparent focus:outline-none"
            value={inputText}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <div className="flex items-center justify-end">
            <div className="flex gap-2 self-end">
              {showEditButton ? (
                <Button
                  variant={"outline"}
                  size={"lg"}
                  onClick={() => {
                    setEnableTextArea(true);
                    setShowEditButton(false);
                  }}
                >
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    variant={"outline"}
                    size={"lg"}
                    onClick={() => setOpenAboutInput(false)}
                  >
                    Cancel
                  </Button>
                  <Button size={"lg"} onClick={handleSave} disabled={isPending}>
                    Save
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="my-32 flex flex-col items-center justify-center text-center">
          <h3 className="mb-4 text-2xl font-bold">
            Tell the world about yourself
          </h3>
          <p className="mb-8 max-w-[600px] text-muted-foreground">
            {"Here's"} where you can share more about yourself: your history,
            work experience, accomplishments, interests, dreams, and more. You
            can even add images and use rich text to personalize your bio.
          </p>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setOpenAboutInput(true)}
          >
            Get started
          </Button>
        </div>
      )}
    </div>
  );
}
