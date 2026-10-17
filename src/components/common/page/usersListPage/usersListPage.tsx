import { useState, useMemo } from "react";
import _ from "lodash";
import paginate from "../../../../utils/paginate";
import Pagination from "../../pagination";
import SearchStatus from "../../../ui/searchStatus";
import GroupList from "../../groupList";
import UserTable from "../../../ui/userTable";
import { ProfessionType, SortBy, UserType } from "../../../../types";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  getProfessions,
  getProfessionsLoadingStatus,
} from "../../../../store/professions";
import {
  getCurrentUserData,
  getUsersList,
  updateUser,
} from "../../../../store/users";

const PAGE_SIZE = 8;

const UsersListPage = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(getCurrentUserData());
  const users = useAppSelector(getUsersList());
  const professions = useAppSelector(getProfessions());
  const professionsLoading = useAppSelector(getProfessionsLoadingStatus());

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProf, setSelectedProf] = useState<
    ProfessionType | undefined
  >();
  const [sortBy, setSortBy] = useState<SortBy>({ path: "name", order: "asc" });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    const query = searchQuery.trim().toLowerCase();

    return users.filter((user) => {
      if (
        user._id === currentUser?._id ||
        user._id === import.meta.env.VITE_ADMIN_ID
      )
        return false;
      if (query && !user.name.toLowerCase().includes(query)) return false;
      if (selectedProf && user.profession !== selectedProf._id) return false;
      return true;
    });
  }, [users, currentUser?._id, searchQuery, selectedProf]);

  const sortedUsers = useMemo(() => {
    if (!sortBy.path) return filteredUsers;
    const iteratee = (user: UserType) => {
      if (sortBy.path === "bookmark") {
        return currentUser?.bookmarks?.[user._id] ? 1 : 0;
      }
      const value = _.get(user, sortBy.path);
      return typeof value === "string" ? value.toLowerCase() : value;
    };

    return _.orderBy(filteredUsers, [iteratee], [sortBy.order]);
  }, [filteredUsers, sortBy, currentUser?.bookmarks]);

  if (!users) return <>Loading...</>;

  const count = filteredUsers.length;
  const pageCount = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const usersCrop = paginate(sortedUsers, safePage, PAGE_SIZE);

  const handleToggleBookmark = (id: string) => {
    if (!currentUser) return;
    const bookmarks = { ...(currentUser.bookmarks || {}) };
    bookmarks[id] = !bookmarks[id];
    dispatch(updateUser({ ...currentUser, bookmarks }));
  };

  const handleProfessionSelect = (item: ProfessionType) => {
    setSelectedProf(item);
    setCurrentPage(1);
  };

  const handleSearchQuery = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(target.value);
    setCurrentPage(1);
  };

  const clearFilter = () => {
    setSelectedProf(undefined);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSort = (item: SortBy) => {
    setSortBy(item);
    setCurrentPage(1);
  };

  return (
    <div className="d-flex">
      {professions && !professionsLoading && (
        <div className="d-flex flex-column flex-shrink-0 p-3">
          <GroupList
            selectedItem={selectedProf}
            items={professions}
            valueProperty={"_id"}
            contentProperty={"name"}
            onItemSelect={handleProfessionSelect}
          />
          <button className="btn btn-secondary mt-2" onClick={clearFilter}>
            Clear
          </button>
        </div>
      )}

      <div className="d-flex flex-column">
        <SearchStatus length={count} />
        <input
          type="text"
          name="searchQuery"
          aria-label="Search users by name"
          value={searchQuery}
          onChange={handleSearchQuery}
          placeholder="Search..."
        />

        {count > 0 ? (
          <UserTable
            users={usersCrop}
            onSort={handleSort}
            selectedSort={sortBy}
            onToggleBookmark={handleToggleBookmark}
          />
        ) : (
          <p className="text-muted mt-3">Nothing found</p>
        )}

        <div className="d-flex justify-content-center">
          <Pagination
            itemCount={count}
            pageSize={PAGE_SIZE}
            currentPage={safePage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default UsersListPage;
