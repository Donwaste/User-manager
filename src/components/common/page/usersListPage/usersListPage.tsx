import { useState, useEffect } from "react";
import _ from "lodash";
import paginate from "../../../../utils/paginate";
import Pagination from "../../pagination";
import SearchStatus from "../../../ui/searchStatus";
import GroupList from "../../groupList";
import UserTable from "../../../ui/userTable";
import { ProfessionType, SortBy, UserType } from "../../../../types";
import { useUsers } from "../../../../hooks/useUsers";
import { useProfessions } from "../../../../hooks/useProfession";
import { useAuth } from "../../../../hooks/useAuth";

const UsersListPage = () => {
  const pageSize = 8;
  const { currentUser } = useAuth();
  const { users } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProf, setSelectedProf] = useState<ProfessionType | undefined>(
    undefined,
  );
  const [sortBy, setSortBy] = useState<SortBy>({ path: "name", order: "asc" });
  const { professions, isLoading: professionsLoading } = useProfessions();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedProf, searchQuery]);

  const handleToggleBookmark = (id: string) => {
    // setUsers((prev) =>
    //   prev?.map((user) =>
    //     user._id === id ? { ...user, bookmark: !user.bookmark } : user,
    //   ),
    // );
  };

  const handlePageChange = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  const handleProfessionSelect = (item: ProfessionType) => {
    if (searchQuery !== "") setSearchQuery("");
    setSelectedProf(item);
  };

  const handleSort = (item: SortBy) => {
    setSortBy(item);
  };

  const handleSearchQuery = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedProf(undefined);
    setSearchQuery(target.value);
  };

  const clearFilter = () => {
    setSelectedProf(undefined);
  };

  if (users) {
    function filterUsers(data: UserType[]) {
      const filteredUsers = searchQuery
        ? data.filter((user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : selectedProf
          ? data.filter((user) => user.profession === selectedProf._id)
          : data;
      return filteredUsers.filter((u) => u._id !== currentUser!._id);
    }
    const filteredUsers = filterUsers(users);

    const count = filteredUsers.length;
    const sortedUsers = _.orderBy(filteredUsers, [sortBy.path], [sortBy.order]);
    const usersCrop = paginate(sortedUsers, currentPage, pageSize);

    return (
      <>
        <div className="d-flex">
          {professions && !professionsLoading && (
            <div className="d-flex flex-column flex-shrink-0 p-3">
              <GroupList
                selectedItem={selectedProf}
                items={professions}
                valueProperty="_id"
                contentProperty="name"
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
              value={searchQuery}
              onChange={handleSearchQuery}
              placeholder="Search..."
            />

            {count > 0 && (
              <UserTable
                users={usersCrop}
                onSort={handleSort}
                selectedSort={sortBy}
                onToggleBookmark={handleToggleBookmark}
              />
            )}
            <div className="d-flex justify-content-center">
              <Pagination
                itemCount={count}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  return "Loading...";
};

export default UsersListPage;
