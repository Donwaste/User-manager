import { useParams } from "react-router-dom";
import UserPage from "../components/common/page/userPage";
import UsersListPage from "../components/common/page/usersListPage";
import EditUserPage from "../components/common/page/editUserPage";

const Users = () => {
  const params = useParams();
  const { userId, edit } = params;
  return (
    <div>
      {userId ? (
        edit ? (
          <EditUserPage userId={userId} />
        ) : (
          <UserPage userId={userId} />
        )
      ) : (
        <UsersListPage />
      )}
    </div>
  );
};

export default Users;
