import { useParams, Navigate } from "react-router-dom";
import UserPage from "../components/common/page/userPage";
import UsersListPage from "../components/common/page/usersListPage";
import EditUserPage from "../components/common/page/editUserPage";
import UserProvider from "../hooks/useUsers";
import { useAuth } from "../hooks/useAuth";

const Users = () => {
  const params = useParams();
  const { userId, edit } = params;
  const { currentUser } = useAuth();

  return (
    <div>
      <UserProvider>
        {userId ? (
          edit ? (
            userId === currentUser?._id ? (
              <EditUserPage />
            ) : (
              <Navigate to={`/users/${currentUser?._id}/edit`} replace />
            )
          ) : (
            <UserPage userId={userId} />
          )
        ) : (
          <UsersListPage />
        )}
      </UserProvider>
    </div>
  );
};

export default Users;
