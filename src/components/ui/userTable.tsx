import BookMark from "../common/bookMark";
import Table from "../common/table";
import { Link } from "react-router-dom";
import Qualities from "./qualities";
import { UserType, SortBy } from "../../types";
import Profession from "./profession";
import { useAppSelector } from "../../store/hooks";
import { getCurrentUserData } from "../../store/users";

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
  const currentUser = useAppSelector(getCurrentUserData());

  const columns = {
    name: {
      path: "name",
      name: "Name",
      component: (user: UserType) => {
        const initial = user.name ? user.name[0].toUpperCase() : "U";

        return (
          <div className="d-flex align-items-center gap-2 py-1">
            <div
              className="rounded-circle bg-primary-subtle text-primary fw-semibold d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 34, height: 34, fontSize: "0.85rem" }}
            >
              {initial}
            </div>
            <Link
              to={`/users/${user._id}`}
              className="fw-medium text-body text-decoration-none link-primary text-truncate"
              style={{ maxWidth: 220 }}
            >
              {user.name}
            </Link>
          </div>
        );
      },
    },

    qualities: {
      name: "Qualities",
      component: (user: UserType) => <Qualities qualities={user.qualities} />,
    },

    professions: {
      name: "Professions",
      component: (user: UserType) => (
        <span className="text-secondary fw-normal">
          <Profession id={user.profession} />
        </span>
      ),
    },

    completedMeetings: {
      path: "completedMeetings",
      name: "Met times",
      component: (user: UserType) => (
        <span className="badge rounded-pill bg-light text-dark border px-2 py-1 fw-normal">
          {user.completedMeetings}
        </span>
      ),
    },

    rate: {
      path: "rate",
      name: "Rating",
      component: (user: UserType) => (
        <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1 d-inline-flex align-items-center gap-1">
          <span>★</span>
          <span>{user.rate} / 5</span>
        </span>
      ),
    },

    bookmark: {
      path: "bookmark",
      name: "Favorites",
      component: (user: UserType) => (
        <div className="d-flex justify-content-center">
          <BookMark
            status={Boolean(currentUser?.bookmarks?.[user._id])}
            onClick={() => onToggleBookmark(user._id)}
          />
        </div>
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
