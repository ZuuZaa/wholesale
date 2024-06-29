import { useState } from "react";
import "./pagination.scss";

const Pagination = ({ totalPages, activePage, setPages }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination flex justify-center py-3">
      <ul className="flex justify-center gap-3">
        <li>
          <button className="prev">&#8810;</button>
        </li>
        {pages.map((page) => (
          <li key={page}>
            <button
              onClick={() => setPages(page)}
              className={page === activePage ? "page-btn active" : "page-btn"}
            >
              {page}
            </button>
          </li>
        ))}
        <li>
          <button className="next"> &#x226B;</button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
