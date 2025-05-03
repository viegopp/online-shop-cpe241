import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "./TableElements";
import Pagination from "./Pagination";
import TableToolbar from "./TableToolbar";
import { MoreHorizontal, Trash } from "lucide-react";

const CustomerManageTable = ({ customers = [] }) => {
  // Sample data
  const defaultCustomers = useMemo(() => {
    const baseCustomers = [
      {
        id: "000001",
        name: "Phoorin Chinphuad",
        email: "phoorin.chin@mail.kmut...",
        phone: "095-xxx-xxxx",
        totalOrders: 72,
      },
      {
        id: "000002",
        name: "Skibidi Toilet",
        email: "skibidi_Toilet@gmail.com",
        phone: "095-xxx-xxxx",
        totalOrders: 34,
      },
      {
        id: "000003",
        name: "Moodeng Auan",
        email: "moodengDUSIT@gmail...",
        phone: "095-xxx-xxxx",
        totalOrders: 23,
      },
      {
        id: "000004",
        name: "Mooham Zamlam",
        email: "moohamZL@gmail.com",
        phone: "095-xxx-xxxx",
        totalOrders: 156,
      },
      {
        id: "000005",
        name: "Drop Database",
        email: "database.hard@mail.km...",
        phone: "095-xxx-xxxx",
        totalOrders: 599,
      },
    ];

    // เพิ่มข้อมูลอีก 15 รายการเพื่อการทดสอบ pagination
    const extraCustomers = Array(15)
      .fill(0)
      .map((_, index) => ({
        id: `00000${index + 6}`.slice(-6),
        name: `Customer ${index + 6}`,
        email: `customer${index + 6}@example.com`,
        phone: "095-xxx-xxxx",
        totalOrders: Math.floor(Math.random() * 500) + 1,
      }));

    return [...baseCustomers, ...extraCustomers];
  }, []);

  const allCustomers = useMemo(
    () => (customers.length > 0 ? customers : defaultCustomers),
    [customers, defaultCustomers]
  );

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [displayCustomers, setDisplayCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    orderCount: "all",
  });
  const [customersList, setCustomersList] = useState([]);
  const filterRef = useRef(null);
  const toolbarRef = useRef(null);
  const itemsPerPage = 5;

  // Initialize customers list with sample data
  useEffect(() => {
    setCustomersList(allCustomers);
  }, [allCustomers]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        toolbarRef.current &&
        !toolbarRef.current.contains(event.target)
      ) {
        setFilterOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter customers based on search and filter settings
  useEffect(() => {
    let filtered = customersList.filter(
      (customer) =>
        customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply order count filter
    if (filters.orderCount !== "all") {
      filtered = filtered.filter((customer) => {
        if (filters.orderCount === "low") return customer.totalOrders < 50;
        if (filters.orderCount === "medium")
          return customer.totalOrders >= 50 && customer.totalOrders <= 200;
        if (filters.orderCount === "high") return customer.totalOrders > 200;
        return true;
      });
    }

    setFilteredCustomers(filtered);
    setCurrentPage(1);
  }, [searchTerm, customersList, filters]);

  // Pagination
  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setDisplayCustomers(
      filteredCustomers.slice(indexOfFirstItem, indexOfLastItem)
    );
  }, [currentPage, filteredCustomers, itemsPerPage]);

  // Event handlers
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full mx-auto flex flex-col gap-2">
      <div className="relative" ref={toolbarRef}>
        <TableToolbar
          onSearch={handleSearch}
          onFilter={handleFilter}
          onAddProduct={() => console.log("Add Customer")}
        />

        {/* Filter Dropdown */}
        {filterOpen && (
          <div
            className="absolute left-0 top-8 bg-white border border-slate-200 rounded shadow-md z-10 p-3 w-64"
            ref={filterRef}
          >
            <div className="mb-2">
              <h3 className="text-sm font-medium text-slate-700 mb-1">
                จำนวนคำสั่งซื้อ
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    filters.orderCount === "all"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => handleFilterChange("orderCount", "all")}
                >
                  All
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    filters.orderCount === "low"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => handleFilterChange("orderCount", "low")}
                >
                  &lt;50
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    filters.orderCount === "medium"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => handleFilterChange("orderCount", "medium")}
                >
                  50-200
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    filters.orderCount === "high"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => handleFilterChange("orderCount", "high")}
                >
                  &gt;200
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customers Table */}
      <div className="border border-slate-200 rounded-md overflow-hidden font-satoshi">
        <div className="max-w-full overflow-x-auto">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableCell
                  isHeader
                  className="w-[16%] px-7 py-3 text-sm font-bold text-slate-900"
                >
                  Customer ID
                </TableCell>
                <TableCell
                  isHeader
                  className="w-[20%] px-7 py-3 text-sm font-bold text-slate-900"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="w-[20%] px-7 py-3 text-sm font-bold text-slate-900"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="w-[16%] px-7 py-3 text-sm font-bold text-slate-900"
                >
                  Phone
                </TableCell>
                <TableCell
                  isHeader
                  className="w-[16%] px-7 py-3 text-sm font-bold text-slate-900"
                >
                  Total Orders
                </TableCell>
                <TableCell
                  isHeader
                  className="w-[12%] px-7 py-3 text-sm font-bold text-slate-900"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayCustomers.length > 0 ? (
                displayCustomers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="border-t border-slate-200"
                  >
                    <TableCell className="w-[16%] px-7 py-3 text-sm text-slate-500">
                      {customer.id}
                    </TableCell>
                    <TableCell className="w-[20%] px-7 py-3 text-sm text-slate-500">
                      {customer.name}
                    </TableCell>
                    <TableCell className="w-[20%] px-7 py-3 text-sm text-slate-500">
                      {customer.email}
                    </TableCell>
                    <TableCell className="w-[16%] px-7 py-3 text-sm text-slate-500">
                      {customer.phone}
                    </TableCell>
                    <TableCell className="w-[16%] px-7 py-3 text-sm text-slate-500">
                      {customer.totalOrders}
                    </TableCell>
                    <TableCell className="w-[12%] px-7 py-3 text-sm">
                      <div className="flex gap-2">
                        <button className="w-6 h-6 flex items-center justify-center bg-slate-50 rounded cursor-pointer">
                          <MoreHorizontal
                            className="text-slate-500"
                            size={16}
                            strokeWidth={1.8}
                          />
                        </button>
                        <button className="w-6 h-6 flex items-center justify-center bg-red-50 rounded cursor-pointer">
                          <Trash
                            className="text-red-500"
                            size={16}
                            strokeWidth={1.8}
                          />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    ไม่พบข้อมูลลูกค้าที่ค้นหา
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredCustomers.length}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CustomerManageTable;
