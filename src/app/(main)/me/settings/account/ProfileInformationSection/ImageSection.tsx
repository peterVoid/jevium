import UserAvatar from "@/components/UserAvatar";
import { ChangeEvent, useRef, useState } from "react";

interface ImageSectionProps {
  currentAvatar: string | null | undefined;
  setAvatarFile: (nnewAvatar: File) => void;
}

export default function ImageSection({
  currentAvatar,
  setAvatarFile,
}: ImageSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [newAvatar, setNewAvatar] = useState<File | null>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const file = files[0];
    setNewAvatar(file);
    setAvatarFile(file);
  };

  return (
    <div>
      <p className="text-muted-foregroun d">Photo</p>
      <input
        type="file"
        ref={inputRef}
        className="sr-only hidden"
        onChange={handleChange}
        accept="image/*"
      />
      <div className="flex gap-4">
        <UserAvatar
          src={
            (newAvatar && URL.createObjectURL(newAvatar as Blob)) ||
            currentAvatar!
          }
          size={100}
        />
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-green-500"
              onClick={() => inputRef.current?.click()}
            >
              Update
            </button>
          </div>
          <p className="text-muted-foreground">
            Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per
            side.
          </p>
        </div>
      </div>
    </div>
  );
}
