// src/components/tables/TableToolbar.jsx

import React from "react";
import { Settings2, Search, Plus } from "lucide-react";

const TableToolbar = ({
  onSearch,
  searchPlaceHolder,
  onFilter,
  onAddItem,
  itemName,
}) => {
  const handleSearchChange = (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="w-full mx-auto h-6.5 flex justify-between items-center">
      <div
        className={`flex gap-1.5 h-full ${
          !onAddItem ? "w-full justify-between" : ""
        }`}
      >
        <div className="flex-1 h-full max-w-[200px] flex gap-1 items-center bg-white border border-slate-200 rounded px-1.5 py-1">
          <Search size={12} className="text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${searchPlaceHolder} ...`}
            className="border-none outline-none text-[12px] text-slate-400 w-full"
            onChange={handleSearchChange}
          />
        </div>
        <button
          className="flex items-center gap-1 px-2 py-1 border border-slate-200 rounded hover:bg-slate-50 cursor-pointer bg-white text-slate-500 text-xs font-normal"
          onClick={onFilter}
        >
          <Settings2 size={12} className="text-slate-500" />
          <span className="text-xs text-slate-500">Filter</span>
        </button>
      </div>

      {onAddItem && (
        <button
          className="flex items-center h-full gap-1 px-2 py-1 rounded hover:bg-slate-700 cursor-pointer bg-slate-600 text-white text-xs font-normal"
          onClick={onAddItem}
        >
          <Plus size={12} className="text-white" />
          <span>Add {itemName}</span>
        </button>
      )}
    </div>
  );
};

export default TableToolbar;

/*
Example Usage:
<TableToolbar
  onSearch={(value) => console.log("Search:", value)}
  onFilter={() => console.log("Filter clicked")}
  onAddItem={() => console.log("Add Product clicked")}
/>
*/
