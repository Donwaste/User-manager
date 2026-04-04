import { useParams } from "react-router-dom";
import UserPage from "../components/common/page/userPage";
import UsersListPage from "../components/common/page/usersListPage";

const Users = () => {
  const params = useParams();
  const userId = params.userId;
  return <div>{userId ? <UserPage userId={userId} /> : <UsersListPage />}</div>;
};

export default Users;
