"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { useSession } from "@/app/SessionProvider";
import UserAvatar from "../UserAvatar";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BoldIcon } from "lucide-react";
import Placeholder from "@tiptap/extension-placeholder";
import { useComment } from "./mutations";

interface CommentEditorProps {
  storyId: string;
}

export default function CommentEditor({ storyId }: CommentEditorProps) {
  const { user } = useSession();
  const { mutate, isPending } = useComment();
  const [openEditor, setOpenEditor] = useState<boolean>(false);
  const [getHTMLEditor, setGetHTMLEditor] = useState<string>("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      Placeholder.configure({
        placeholder: "What are you thoughts?",
      }),
    ],
    onUpdate: ({ editor }) => {
      setGetHTMLEditor(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "border-none outline-none ring-0 w-[350px] p-4 h-[200px] relative overflow-scroll bg-white shadow-2xl rounded-lg",
      },
    },
  });

  if (!editor) return null;

  return (
    <div>
      <div
        className={`${!openEditor ? "relative mt-5 flex w-full flex-col rounded-md p-3 shadow-2xl" : "relative"}`}
      >
        {openEditor && (
          <div className="flex items-center gap-2">
            <UserAvatar src={user.avatar!} />
            <span>{user.displayName}</span>
          </div>
        )}
        <div className="mt-5 flex justify-between">
          {!openEditor ? (
            <textarea
              placeholder="What are you thoughts?"
              className="resize-none border-none bg-transparent focus:outline-none"
              onFocus={() => setOpenEditor(true)}
              rows={openEditor ? 6 : 1}
            />
          ) : (
            <EditorContent
              editor={editor}
              className="h-[200px] focus:border-none focus:outline-none focus:ring-0"
              autoFocus
            />
          )}

          {openEditor && (
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`absolute bottom-2 rounded-lg p-2 ${editor.isActive("bold") ? "bg-slate-200" : ""}`}
            >
              <BoldIcon />
            </button>
          )}

          {openEditor && (
            <Button
              onClick={() => setOpenEditor(false)}
              className="absolute bottom-2 right-28 rounded-full"
            >
              Cancel
            </Button>
          )}
          <Button
            className="absolute bottom-2 right-2 rounded-full"
            disabled={!openEditor || isPending}
            onClick={() => mutate({ storyId, content: getHTMLEditor })}
          >
            Respond
          </Button>
        </div>
      </div>
    </div>
  );
}
