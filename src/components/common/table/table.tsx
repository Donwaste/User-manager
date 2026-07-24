import { UserType, SortBy, ColumnDefinition } from "../../../types";
import { TableBody, TableHeader } from ".";

interface TableProps {
  selectedSort: SortBy;
  onSort: (sort: SortBy) => void;
  columns: Record<string, ColumnDefinition>;
  data: UserType[];
}

const Table = ({ selectedSort, onSort, columns, data }: TableProps) => {
  return (
    <table className="table">
      <TableHeader {...{ selectedSort, onSort, columns }} />
      <TableBody {...{ columns, data }} />
    </table>
  );
};

export default Table;
