import { UserType, SortBy, ColumnDefinition } from "../../../types";

interface TableProps {
  selectedSort: SortBy;
  onSort: (sort: SortBy) => void;
  columns: Record<string, ColumnDefinition>;
}

const TableHeader = ({ selectedSort, onSort, columns }: TableProps) => {
  const handleSort = (item: string) => {
    if (selectedSort.path === item) {
      onSort({
        ...selectedSort,
        order: selectedSort.order === "asc" ? "desc" : "asc",
      });
    } else {
      onSort({ path: item, order: "asc" });
    }
  };

  const renderSortArrow = (currentPath: string) => {
    if (selectedSort.path === currentPath) {
      if (selectedSort.order === "asc") {
        return <i className="bi bi-caret-up-fill"></i>;
      } else {
        return <i className="bi bi-caret-down-fill"></i>;
      }
    }

    return null;
  };

  return (
    <thead>
      <tr>
        {Object.keys(columns).map((column) => (
          <th
            key={column}
            onClick={
              columns[column].path
                ? () => handleSort(String(columns[column].path))
                : undefined
            }
            scope="col"
          >
            {columns[column].name}{" "}
            {renderSortArrow(String(columns[column].path))}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
