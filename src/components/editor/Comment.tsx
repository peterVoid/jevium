import { CommentData } from "@/lib/types";
import UserAvatar from "../UserAvatar";
import CommentClap from "../CommentClap";

interface CommentProps {
  comment: CommentData;
  storyId: string;
}

export default function Comment({ comment, storyId }: CommentProps) {
  return (
    <div className="space-y-6 border-b border-slate-300 py-2">
      <div className="flex gap-3">
        <UserAvatar src={comment.user.avatar!} />
        <div>
          <p>{comment.user.displayName}</p>
          <p className="text-muted-foreground">2 months ago</p>
        </div>
      </div>
      <div
        className="text-md font-medium"
        dangerouslySetInnerHTML={{ __html: comment.content }}
      />
      <CommentClap comment={comment} storyId={storyId} />
    </div>
  );
}
