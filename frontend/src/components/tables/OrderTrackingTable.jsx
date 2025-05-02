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

const OrderTrackingTable = ({ orders = [] }) => {
  // Sample data
  const defaultOrders = useMemo(() => {
    const baseOrders = [
      {
        id: "000001",
        customerId: "123456789",
        payment: "Cash",
        orderDate: "Mar 09, 2050",
        paymentDate: "Mar 09, 2050",
        status: "Delivered",
      },
      {
        id: "000002",
        customerId: "234567891",
        payment: "TrueMoney",
        orderDate: "Mar 10, 2050",
        paymentDate: "Mar 10, 2050",
        status: "Cancelled",
      },
      {
        id: "000003",
        customerId: "345678912",
        payment: "Mobile Bank",
        orderDate: "Mar 11, 2050",
        paymentDate: "Mar 11, 2050",
        status: "Pending",
      },
      {
        id: "000004",
        customerId: "456789123",
        payment: "Mobile Bank",
        orderDate: "Mar 11, 2050",
        paymentDate: "Mar 13, 2050",
        status: "Returned",
      },
      {
        id: "000005",
        customerId: "567891234",
        payment: "TrueMoney",
        orderDate: "Mar 12, 2050",
        paymentDate: "Mar 13, 2050",
        status: "Shipped",
      },
    ];

    // เพิ่มข้อมูลอีก 15 รายการเพื่อการทดสอบ pagination
    const extraOrders = Array(15)
      .fill(0)
      .map((_, index) => ({
        id: `00000${index + 6}`.slice(-6),
        customerId: `${(index + 6) * 11111111}`.slice(0, 9),
        payment:
          index % 3 === 0
            ? "Cash"
            : index % 3 === 1
            ? "TrueMoney"
            : "Mobile Bank",
        orderDate: `Mar ${13 + Math.floor(index / 3)}, 2050`,
        paymentDate: `Mar ${14 + Math.floor(index / 3)}, 2050`,
        status: index % 2 === 0 ? "Delivered" : "Pending",
      }));

    return [...baseOrders, ...extraOrders];
  }, []);

  const allOrders = useMemo(
    () => (orders.length > 0 ? orders : defaultOrders),
    [orders, defaultOrders]
  );

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [displayOrders, setDisplayOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    payment: "all",
  });
  const [ordersList, setOrdersList] = useState([]);
  const filterRef = useRef(null);
  const toolbarRef = useRef(null);
  const itemsPerPage = 5;

  // Initialize orders list with sample data
  useEffect(() => {
    setOrdersList(allOrders);
  }, [allOrders]);

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

  // Filter orders based on search and filter settings
  useEffect(() => {
    let filtered = ordersList.filter(
      (order) =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.payment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(
        (order) => order.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Apply payment filter
    if (filters.payment !== "all") {
      filtered = filtered.filter(
        (order) => order.payment.toLowerCase() === filters.payment.toLowerCase()
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, ordersList, filters]);

  // Pagination
  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setDisplayOrders(filteredOrders.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage, filteredOrders, itemsPerPage]);

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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "cancelled":
        return "text-red-600";
      case "shipped":
        return "text-cyan-600";
      default:
        return "text-slate-600";
    }
  };

  const getBackgroundStatus = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100";
      case "pending":
        return "bg-yellow-100";
      case "cancelled":
        return "bg-red-100";
      case "shipped":
        return "bg-cyan-100";
      default:
        return "bg-slate-100";
    }
  };

  return (
    <div className="w-full max-w-[912px] mx-auto flex flex-col gap-2">
      <div className="relative" ref={toolbarRef}>
        <TableToolbar
          onSearch={handleSearch}
          searchPlaceHolder={"Orders"}
          onFilter={handleFilter}
        />

        {/* Filter Dropdown */}
        {filterOpen && (
          <div
            className="absolute right-0 top-8 bg-white border border-slate-200 rounded shadow-md z-10 p-3 w-64"
            ref={filterRef}
          >
            <div className="mb-3">
              <h3 className="text-sm font-medium text-slate-700 mb-1">
                สถานะคำสั่งซื้อ
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    filters.status === "all"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => handleFilterChange("status", "all")}
                >
                  All
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    filters.status === "delivered"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => handleFilterChange("status", "delivered")}
                >
                  Delivered
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    filters.status === "pending"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => handleFilterChange("status", "pending")}
                >
                  Pending
                </button>
              </div>
            </div>

            <div className="mb-2">
              <h3 className="text-sm font-medium text-slate-700 mb-1">
                วิธีการชำระเงิน
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    filters.payment === "all"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => handleFilterChange("payment", "all")}
                >
                  All
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    filters.payment === "cash"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => handleFilterChange("payment", "cash")}
                >
                  Cash
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    filters.payment === "truemoney"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => handleFilterChange("payment", "truemoney")}
                >
                  TrueMoney
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    filters.payment === "mobile bank"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => handleFilterChange("payment", "mobile bank")}
                >
                  Mobile Bank
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="border border-slate-200 rounded-md overflow-hidden font-satoshi">
        <div className="max-w-full overflow-x-auto">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableCell
                  isHeader
                  className="w-[16%] px-7 py-3 text-sm font-bold text-slate-900"
                >
                  Orders ID
                </TableCell>
                <TableCell
                  isHeader
                  className="w-[16%] px-7 py-3 text-sm font-bold text-slate-900"
                >
                  Customer ID
                </TableCell>
                <TableCell
                  isHeader
                  className="w-[16%] px-7 py-3 text-sm font-bold text-slate-900"
                >
                  Payment
                </TableCell>
                <TableCell
                  isHeader
                  className="w-[18%] px-7 py-3 text-sm font-bold text-slate-900"
                >
                  Orders Date
                </TableCell>
                <TableCell
                  isHeader
                  className="w-[18%] px-7 py-3 text-sm font-bold text-slate-900"
                >
                  Payment Date
                </TableCell>
                <TableCell
                  isHeader
                  className="w-[16%] px-7 py-3 text-sm font-bold text-slate-900"
                >
                  Order Status
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayOrders.length > 0 ? (
                displayOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="border-t border-slate-200"
                  >
                    <TableCell className="w-[16%] px-7 py-3 text-sm text-slate-500">
                      {order.id}
                    </TableCell>
                    <TableCell className="w-[16%] px-7 py-3 text-sm text-slate-500">
                      {order.customerId}
                    </TableCell>
                    <TableCell className="w-[16%] px-7 py-3 text-sm text-slate-500">
                      {order.payment}
                    </TableCell>
                    <TableCell className="w-[16%] px-7 py-3 text-sm text-slate-500">
                      {order.orderDate}
                    </TableCell>
                    <TableCell className="w-[16%] px-7 py-3 text-sm text-slate-500">
                      {order.paymentDate}
                    </TableCell>
                    <TableCell className="w-[20%] px-7 py-3 text-sm">
                      <div className={`flex justify-start`}>
                        <div
                          className={`${getBackgroundStatus(
                            order.status
                          )} rounded-full px-3`}
                        >
                          <p
                            className={`text-[12px] ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </p>
                        </div>
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
                    ไม่พบข้อมูลคำสั่งซื้อที่ค้นหา
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
        totalItems={filteredOrders.length}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default OrderTrackingTable;
