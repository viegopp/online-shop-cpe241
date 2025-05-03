// src/components/tables/Pagination.jsx

import React from "react";

const Pagination = ({
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage * itemsPerPage < totalItems) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="w-full mx-auto flex justify-between items-center">
      <div className="text-slate-500 text-xs font-normal">
        Showing {startItem} - {endItem} of {totalItems}.
      </div>
      <div className="flex gap-1.5">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`flex items-center justify-center w-[54px] h-6 px-1.5 text-[10px] border border-slate-200 rounded bg-white text-slate-500 ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-slate-50"
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={endItem === totalItems}
          className={`flex items-center justify-center w-[54px] h-6 px-1.5 text-[10px] border border-slate-200 rounded bg-white text-slate-500 ${
            endItem === totalItems
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-slate-50"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;

/*
Example Usage:
<Pagination
  currentPage={1}
  itemsPerPage={10}
  totalItems={100}
  onPageChange={(page) => console.log("Page changed to:", page)}
/>
*/
