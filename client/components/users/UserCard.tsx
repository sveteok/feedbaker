import { UserPayload } from "@/types/users";
import { DefaultLink } from "../Ui";

const UserCard = ({ user }: { user: UserPayload }) => {
  return (
    <div className="flex flex-col gap-1 p-4 px-6  bg-gray-50">
      <div className="font-bold flex gap-2 justify-between items-center">
        <div className="flex-1 flex gap-1">
          {user.name} {user.email} {user.is_admin}
          <DefaultLink href={`/sites?owner_id=${user.user_id}`}>
            sites
          </DefaultLink>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
