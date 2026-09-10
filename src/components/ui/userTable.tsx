import BookMark from "../common/bookMark";
import Table from "../common/table";
import { Link } from "react-router-dom";
import Qualities from "./qualities";
import { UserType, SortBy } from "../../types";
import Profession from "./profession";

interface UserTableProps {
  users: UserType[];
  onSort: (sort: SortBy) => void;
  selectedSort: SortBy;
  onToggleBookmark: (id: string) => void;
}

const UserTable = ({
  users,
  onSort,
  selectedSort,
  onToggleBookmark,
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
    professions: {
      name: "Professions",
      component: (user: UserType) => <Profession id={user.profession} />,
    },
    completedMeetings: { path: "completedMeetings", name: "Met times" },
    rate: { path: "rate", name: "Rating" },
    bookmark: {
      path: "bookmark",
      name: "Favorites",
      component: (user: UserType) => (
        <BookMark
          status={user.bookmark ?? false}
          onClick={() => onToggleBookmark(user._id)}
        />
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
