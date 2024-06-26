import React from "react";

const Paginate = ({ totalPages, currentPage, onPageChange }) => {
  const getPageNumbers = () => {
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > totalPages) {
      const HALF_PAGES_TO_SHOW = Math.floor(totalPages / 2);

      if (currentPage <= HALF_PAGES_TO_SHOW + 1) {
        endPage = totalPages;
      } else if (currentPage >= totalPages - HALF_PAGES_TO_SHOW) {
        startPage = totalPages - totalPages + 1;
      } else {
        startPage = currentPage - HALF_PAGES_TO_SHOW;
        endPage = currentPage + HALF_PAGES_TO_SHOW;
      }
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex justify-center py-5">
      <ul className="pagination flex">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link font-bold"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage == 1}
          >
            Previous
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${currentPage === number ? "active" : ""}`}
          >
            <button
              className="page-link inline-block px-2 font-semibold"
              onClick={() => onPageChange(number)}
              style={{ marginRight: "5px" }}
            >
              {number}
            </button>
          </li>
        ))}
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link font-bold"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Paginate;
