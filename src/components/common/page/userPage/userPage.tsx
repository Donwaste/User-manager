import UserCard from "../../../ui/userCard";
import QualitiesCard from "../../../ui/qualitiesCard";
import MeetingsCard from "../../../ui/meetingsCard";
import Comments from "../../../ui/comments";
import { useAppSelector } from "../../../../store/hooks";
import { getUserById } from "../../../../store/users";

interface UserPageProps {
  userId: string;
}

const UserPage = ({ userId }: UserPageProps) => {
  const user = useAppSelector(getUserById(userId));

  if (user) {
    return (
      <div className="container">
        <div className="row gutters-sm">
          <div className="col-md-4 mb-3">
            <UserCard user={user} />
            <QualitiesCard data={user.qualities || []} />
            <MeetingsCard value={user.completedMeetings} />
          </div>
          <div className="col-md-8">
            <Comments />
          </div>
        </div>
      </div>
    );
  }
  return <h1>Loading</h1>;
};

export default UserPage;
