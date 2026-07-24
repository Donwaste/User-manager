import _ from "lodash";
import { ColumnDefinition, UserType } from "../../../types";

interface TableBodyProps {
  data: UserType[];
  columns: Record<string, ColumnDefinition>;
}

const TableBody = ({ data, columns }: TableBodyProps) => {
  const renderContent = (item: UserType, column: string) => {
    const { component, path } = columns[column];
    if (component) {
      return component(item);
    }
    return path ? _.get(item, path) : null;67
  };

  return (
    <tbody>
      {data.map((item) => (
        <tr key={item._id}>
          {Object.keys(columns).map((column) => (
            <td key={column}>{renderContent(item, column)}</td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
