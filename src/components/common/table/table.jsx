import { TableBody, TableHeader } from "../table";
const Table = ({ selectedSort, onSort, columns, data }) => {
  return (
    <table className="table">
      <TableHeader {...{ selectedSort, onSort, columns }} />
      <TableBody {...{ columns, data }} />
    </table>
  );
};

export default Table;
