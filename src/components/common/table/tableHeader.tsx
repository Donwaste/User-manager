import { SortBy, ColumnDefinition } from "../../../types";

interface TableProps {
  selectedSort: SortBy;
  onSort: (sort: SortBy) => void;
  columns: Record<string, ColumnDefinition>;
}

const TableHeader = ({ selectedSort, onSort, columns }: TableProps) => {
  const handleSort = (itemPath: string) => {
    if (selectedSort.path === itemPath) {
      if (selectedSort.order === "asc") {
        onSort({ ...selectedSort, order: "desc" });
      } else if (selectedSort.order === "desc") {
        onSort({ path: "", order: "asc" });
      }
    } else {
      onSort({ path: itemPath, order: "asc" });
    }
  };

  const renderSortArrow = (currentPath?: string) => {
    if (!currentPath || selectedSort.path !== currentPath) return null;

    const iconClass =
      selectedSort.order === "asc"
        ? "bi bi-caret-up-fill"
        : "bi bi-caret-down-fill";

    return <i className={`${iconClass} ms-1`} aria-hidden="true" />;
  };

  return (
    <thead>
      <tr>
        {Object.entries(columns).map(([key, column]) => {
          const isSortable = Boolean(column.path);

          return (
            <th
              key={key}
              onClick={isSortable ? () => handleSort(column.path!) : undefined}
              role={isSortable ? "button" : undefined}
              style={{ cursor: isSortable ? "pointer" : "default" }}
              scope="col"
            >
              {column.name}
              {isSortable && renderSortArrow(column.path)}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHeader;
