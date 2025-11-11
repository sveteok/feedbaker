import { UserPayload } from "@/types/users";
import { LinkButton } from "../Ui";
import { SvgOwner } from "../Svg";

const UserCard = ({ user }: { user: UserPayload }) => {
  return (
    <div className="flex flex-col gap-1 p-4 px-6  bg-gray-50">
      <div className="font-bold flex gap-2 justify-between items-center">
        <div className="flex-1 flex gap-1">
          <SvgOwner />
          {user.name}
        </div>
        <LinkButton href={`/sites?owner_id=${user.user_id}`}>sites</LinkButton>
      </div>
      <div className="text-xs xitalic flex gap-2">
        <div className="bg-amber-100 ring-1 ring-amber-200 px-1">
          {user.is_admin ? "administrator" : "owner"}
        </div>
        {user.email}
      </div>
    </div>
  );
};

export default UserCard;
