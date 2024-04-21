import { AvatarImage, AvatarFallback, Avatar } from "./ui/avatar";

const Comment = () => {
  return (
    <div className="flex items-start gap-4">
      <Avatar>
        <AvatarImage alt="@commenter1" />
        <AvatarFallback>C1</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-medium">Commenter 1</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This typewriter looks amazing! I'd love to add it to my collection.
        </p>
      </div>
    </div>
  );
};

export default Comment;
