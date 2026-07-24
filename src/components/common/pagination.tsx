import { range } from "lodash-es";

interface PaginationProps {
  itemCount: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  currentPage: number;
}

const Pagination = ({
  itemCount,
  pageSize,
  onPageChange,
  currentPage,
}: PaginationProps) => {
  const pagesCount = Math.ceil(itemCount / pageSize);
  const pages = range(1, pagesCount + 1);
  if (pagesCount === 1) return null;
  return (
    <nav>
      <ul className="pagination">
        {pages.map((page: number) => (
          <li
            key={"page_" + page}
            className={"page-item" + (page === currentPage ? " active" : "")}
          >
            <a className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
