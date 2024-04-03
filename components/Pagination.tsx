import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const paginationRange = () => {
    if (totalPages === 0) {
      return []; // No page numbers to display
    }

    const delta = 1; // how many pages to show around the current page
    const range = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }

    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages !== 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="flex justify-center items-center">
      {totalPages > 0 && (
        <>
          <button
            className="px-4 py-2 border bg-white"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          {paginationRange().map((page, idx) => (
            <button
              key={idx}
              className={`px-4 py-2 border ${
                currentPage === page ? "bg-[#0E6431] text-white" : "bg-white"
              }`}
              onClick={() => typeof page === "number" && onPageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="px-4 py-2 border bg-white"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
        </>
      )}
      {totalPages === 0 && (
        <>
          <button className="px-4 py-2 border bg-white" disabled>
            {"<"}
          </button>
          <button className="px-4 py-2 border bg-white" disabled>
            {">"}
          </button>
        </>
      )}
    </div>
  );
};

export default Pagination;
