interface GroupListProps<T> {
  items: T[];
  valueProperty: keyof T;
  contentProperty: keyof T;
  selectedItem?: T;
  onItemSelect: (item: T) => void;
}

function GroupList<T>({
  items,
  valueProperty,
  contentProperty,
  onItemSelect,
  selectedItem,
}: GroupListProps<T>) {
  return (
    <ul className="list-group">
      {items.map((item) => (
        <li
          key={String(item[valueProperty])}
          className={
            "list-group-item" + (item === selectedItem ? " active" : "")
          }
          onClick={() => onItemSelect(item)}
          role="button"
        >
          {String(item[contentProperty])}
        </li>
      ))}
    </ul>
  );
}

export default GroupList;
