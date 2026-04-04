import { range } from "lodash-es";

const Pagination = ({ itemCount, pageSize, onPageChange, currentPage }) => {
  const pagesCount = Math.ceil(itemCount / pageSize);
  const pages = range(1, pagesCount + 1);
  if (pagesCount === 1) return null;
  return (
    <nav>
      <ul className="pagination">
        {pages.map((page) => (
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
