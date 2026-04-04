import BookMark from "../common/bookMark";
import Table from "../common/table";
import { Link } from "react-router-dom";
import Qualities from "./qualities";

const UserTable = ({
  users,
  onSort,
  selectedSort,
  onToggleBookmark,
  onDelete,
}) => {
  const columns = {
    name: {
      path: "name",
      name: "Name",
      component: (user) => <Link to={`/users/${user._id}`}>{user.name}</Link>,
    },
    qualities: {
      name: "Qualities",
      component: (user) => <Qualities qualities={user.qualities} />,
    },
    professions: { path: "profession.name", name: "Professions" },
    completedMeetings: { path: "completedMeetings", name: "Met times" },
    rate: { path: "rate", name: "Rating" },
    bookmark: {
      path: "bookmark",
      name: "Favorites",
      component: (user) => (
        <BookMark
          status={user.bookmark}
          onClick={() => onToggleBookmark(user._id)}
        />
      ),
    },
    delete: {
      component: (user) => (
        <button onClick={() => onDelete(user._id)} className="btn btn-danger">
          delete
        </button>
      ),
    },
  };

  return (
    <Table
      selectedSort={selectedSort}
      onSort={onSort}
      columns={columns}
      data={users}
    />
  );
};

export default UserTable;
