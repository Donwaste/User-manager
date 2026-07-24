import { UserType } from "./user";

export interface ColumnDefinition {
  path?: string;
  name?: string;
  component?: (user: UserType) => React.ReactNode;
}
