import { useEffect, useState } from "react";
import api from "../../../../api";
import UserCard from "../../../ui/userCard";
import QualitiesCard from "../../../ui/qualitiesCard";
import MeetingsCard from "../../../ui/meetingsCard";
import Comments from "../../../ui/comments";
import { UserType } from "../../../../types";

interface UserPageProps {
  userId: string;
}

const UserPage = ({ userId }: UserPageProps) => {
  const [user, setUser] = useState<UserType | undefined>(undefined);
  useEffect(() => {
    api.users.getById(userId).then((data) => setUser(data));
  }, [userId]);
  if (user) {
    return (
      <div className="container">
        <div className="row gutters-sm">
          <div className="col-md-4 mb-3">
            <UserCard user={user} />
            <QualitiesCard data={user.qualities} />
            <MeetingsCard value={user.completedMeetings} />
          </div>
          <div className="col-md-8">
            <Comments />
          </div>
        </div>
      </div>
    );
  } else {
    return <h1>Loading</h1>;
  }
};

export default UserPage;
