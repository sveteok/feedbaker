import { PaginatedUsers, UserPayload } from "@/types/users";
import UserCard from "./UserCard";

export default function UserList({ users }: { users: PaginatedUsers }) {
  return (
    <>
      <div className="flex flex-col gap-1 bg-gray-200">
        {users.users.map((user: UserPayload) => (
          <UserCard key={user.user_id} user={user} />
        ))}
        {users.totalCount === 0 && (
          <div className="p-6 text-center text-black/50 text-xs bg-gray-50">
            no users found
          </div>
        )}
      </div>
    </>
  );
}
