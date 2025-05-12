import React, { useRef } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "./TableElements";
import Pagination from "./Pagination";
import TableToolbar from "./TableToolbar";
import { PackageSearchIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

const OrderTrackingTable = ({
  orders = [],
  currentPage,
  itemsPerPage,
  totalItems,
  searchTerm,
  filters,
  onSearchChange,
  onFilterChange,
  onPageChange,
}) => {
  const filterRef = useRef(null);
  const toolbarRef = useRef(null);
  const [filterOpen, setFilterOpen] = React.useState(false);

  const handleSearch = (value) => onSearchChange(value);
  const handleFilterToggle = () => setFilterOpen(!filterOpen);
  const handleFilterChange = (type, value) => onFilterChange(type, value);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered": return "text-green-600";
      case "pending": return "text-yellow-600";
      case "cancelled": return "text-red-600";
      case "shipped": return "text-cyan-600";
      default: return "text-slate-600";
    }
  };

  const getBackgroundStatus = (status) => {
    switch (status.toLowerCase()) {
      case "delivered": return "bg-green-100";
      case "pending": return "bg-yellow-100";
      case "cancelled": return "bg-red-100";
      case "shipped": return "bg-cyan-100";
      default: return "bg-slate-100";
    }
  };

  return (
    <div className="w-full mx-auto flex flex-col gap-2">
      <div className="relative" ref={toolbarRef}>
        <TableToolbar
          onSearch={handleSearch}
          searchPlaceHolder="Orders"
          onFilter={handleFilterToggle}
        />

        {filterOpen && (
          <div
            className="absolute right-0 top-8 bg-white border border-slate-200 rounded shadow-md z-10 p-3 w-64"
            ref={filterRef}
          >
            <div className="mb-3">
              <h3 className="text-sm font-medium text-slate-700 mb-1">สถานะคำสั่งซื้อ</h3>
              <div className="flex flex-wrap gap-2">
                {["all", "delivered", "pending"].map((status) => (
                  <button
                    key={status}
                    className={`px-2 py-1 text-xs rounded ${
                      filters.status === status ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"
                    }`}
                    onClick={() => handleFilterChange("status", status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-2">
              <h3 className="text-sm font-medium text-slate-700 mb-1">วิธีการชำระเงิน</h3>
              <div className="flex flex-wrap gap-2">
                {["all", "Bank Transfer", "Credit Card", "PayPal"].map((method) => (
                  <button
                    key={method}
                    className={`px-2 py-1 text-xs rounded ${
                      filters.payment === method ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"
                    }`}
                    onClick={() => handleFilterChange("payment", method)}
                  >
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border border-slate-200 rounded-md overflow-hidden font-satoshi">
        <div className="max-w-full overflow-x-auto">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="bg-slate-50">
                {["Orders ID", "Customer ID", "Payment", "Orders Date", "Payment Date", "Order Status", "Action"].map((label, idx) => (
                  <TableCell
                    key={idx}
                    isHeader
                    className="px-7 py-3 text-sm font-bold text-slate-900"
                  >
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order.order_id} className="border-t border-slate-200">
                    <TableCell className="px-7 py-3 text-sm text-slate-500">{order.order_id}</TableCell>
                    <TableCell className="px-7 py-3 text-sm text-slate-500">{order.customer_id}</TableCell>
                    <TableCell className="px-7 py-3 text-sm text-slate-500">{order.payment_method}</TableCell>
                    <TableCell className="px-7 py-3 text-sm text-slate-500">{order.order_date}</TableCell>
                    <TableCell className="px-7 py-3 text-sm text-slate-500">{order.payment_date}</TableCell>
                    <TableCell className="px-7 py-3 text-sm">
                      <div className="flex justify-start">
                        <div className={`${getBackgroundStatus(order.order_status)} rounded-full px-3`}>
                          <p className={`text-[12px] ${getStatusColor(order.order_status)}`}>{order.order_status}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-7 py-3 text-xs">
                      <div className="flex justify-start">
                        <NavLink to={`/admin/orders/track/${order.order_id}`}>
                          <button className="flex gap-1 text-slate-500 hover:text-slate-800 bg-slate-50 rounded-md p-1.5">
                            <PackageSearchIcon size={16} strokeWidth={1.4} />
                            <span>Details</span>
                          </button>
                        </NavLink>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                    ไม่พบข้อมูลคำสั่งซื้อที่ค้นหา
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default OrderTrackingTable;
