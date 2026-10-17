import { useParams, Navigate } from "react-router-dom";
import UserPage from "../components/common/page/userPage";
import UsersListPage from "../components/common/page/usersListPage";
import EditUserPage from "../components/common/page/editUserPage";
import { useAppSelector } from "../store/hooks";
import { getCurrentUserId } from "../store/users";

const Users = () => {
  const params = useParams<{ userId: string; edit: string }>();
  const { userId, edit } = params;

  const currentUserId = useAppSelector(getCurrentUserId());

  return (
    <div>
      {userId ? (
        edit ? (
          userId === currentUserId ? (
            <EditUserPage />
          ) : (
            <Navigate to={`/users/${currentUserId}/edit`} replace />
          )
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
