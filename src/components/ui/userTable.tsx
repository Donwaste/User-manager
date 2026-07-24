import BookMark from "../common/bookMark";
import Table from "../common/table";
import { Link } from "react-router-dom";
import Qualities from "./qualities";
import { UserType, SortBy } from "../../types";

interface UserTableProps {
  users: UserType[];
  onSort: (sort: SortBy) => void;
  selectedSort: SortBy;
  onToggleBookmark: (id: string) => void;
  onDelete: (id: string) => void;
}

const UserTable = ({
  users,
  onSort,
  selectedSort,
  onToggleBookmark,
  onDelete,
}: UserTableProps) => {
  const columns = {
    name: {
      path: "name",
      name: "Name",
      component: (user: UserType) => (
        <Link to={`/users/${user._id}`}>{user.name}</Link>
      ),
    },
    qualities: {
      name: "Qualities",
      component: (user: UserType) => <Qualities qualities={user.qualities} />,
    },
    professions: { path: "profession.name", name: "Professions" },
    completedMeetings: { path: "completedMeetings", name: "Met times" },
    rate: { path: "rate", name: "Rating" },
    bookmark: {
      path: "bookmark",
      name: "Favorites",
      component: (user: UserType) => (
        <BookMark
          status={user.bookmark}
          onClick={() => onToggleBookmark(user._id)}
        />
      ),
    },
    delete: {
      component: (user: UserType) => (
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
