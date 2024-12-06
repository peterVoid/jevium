import FollowButton from "@/components/FollowButton";
import UserAvatar from "@/components/UserAvatar";
import kyInstance from "@/lib/ky";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export default function WhoToFollow() {
  const { data } = useQuery({
    queryKey: ["whoToFollow"],
    queryFn: () => kyInstance.get("/api/users/whoToFollow").json<User[]>(),
  });

  return (
    <div className="space-y-5">
      <div className="font-semibold">Who to follow</div>
      <div className="flex flex-col gap-2">
        {data?.map((user) => (
          <div key={user.id} className="flex justify-between">
            <div className="flex gap-1">
              <UserAvatar src={user.avatar!} className="h-fit" />
              <div className="flex flex-col">
                <h1 className="font-bold">{user.displayName}</h1>
                <p className="line-clamp-2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptas eum, odit obcaecati nam accusamus excepturi iusto
                  doloribus ad aut libero sunt consequatur, odio, neque
                  dignissimos quia praesentium ratione. Magnam saepe nesciunt
                  facilis, perferendis quidem cumque ex. Rem qui ullam ea atque
                  perferendis autem modi beatae cum debitis, quod possimus
                  aliquam.
                </p>
              </div>
            </div>
            <FollowButton userId={user.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
