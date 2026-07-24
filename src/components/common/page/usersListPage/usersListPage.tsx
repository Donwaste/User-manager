import { useState, useEffect } from "react";
import _ from "lodash";
import API from "../../../../api";
import paginate from "../../../../utils/paginate";
import Pagination from "../../pagination";
import SearchStatus from "../../../ui/searchStatus";
import GroupList from "../../groupList";
import UserTable from "../../../ui/userTable";
import { UserType, ProfessionType, SortBy } from "../../../../types";

const UsersListPage = () => {
  const pageSize = 8;

  const [users, setUsers] = useState<UserType[] | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [professions, setProfessions] = useState<ProfessionType[] | undefined>(
    undefined,
  );
  const [selectedProf, setSelectedProf] = useState<ProfessionType | undefined>(
    undefined,
  );
  const [sortBy, setSortBy] = useState<SortBy>({ path: "name", order: "asc" });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    API.users.fetchAll().then((data) => setUsers(data));
  }, []);

  useEffect(() => {
    API.professions.fetchAll().then((data) => setProfessions(data));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedProf, searchQuery]);

  const handleDelete = (userId: string) => {
    setUsers((prev) => prev?.filter((user) => user._id !== userId));
  };

  const handleToggleBookmark = (id: string) => {
    setUsers((prev) =>
      prev?.map((user) =>
        user._id === id ? { ...user, bookmark: !user.bookmark } : user,
      ),
    );
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
    const filteredUsers = searchQuery
      ? users.filter((user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : selectedProf
        ? users.filter((user) => user.profession._id === selectedProf._id)
        : users;

    const count = filteredUsers.length;
    const sortedUsers = _.orderBy(filteredUsers, [sortBy.path], [sortBy.order]);
    const usersCrop = paginate(sortedUsers, currentPage, pageSize);

    return (
      <>
        <div className="d-flex">
          {professions && (
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
                onDelete={handleDelete}
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
