import { useEffect, useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import OrderTrackingTable from "../../components/tables/OrderTrackingTable";
import apiClient from "../../api/AxiosInterceptor";

const TrackOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    payment: "all",
  });

  const fetchOrders = async (page = 1, search = "", filters = {}) => {
    try {
      const res = await apiClient.get("/admin/order", {
        params: {
          search,
          payment: filters.payment === "all" ? "" : filters.payment,
          status: filters.status === "all" ? "" : filters.status,
          start_date: "",
          end_date: "",
          page,
          per_page: itemsPerPage,
        },
      });

      if (res.data.success) {
        setOrders(res.data.data);
        setTotalItems(res.data.pagination.total);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, searchTerm, filters);
  }, [currentPage, searchTerm, filters]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
    setCurrentPage(1);
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Orders", href: "/admin/orders" },
    { label: "Track Orders", href: "/admin/orders/track" },
  ];

  return (
    <MainLayout breadcrumbs={breadcrumbItems} title="Orders Tracking">
      <div className="flex items-center flex-col w-full h-full min-h-[400px]">
        <OrderTrackingTable
          orders={orders}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          searchTerm={searchTerm}
          filters={filters}
          onPageChange={setCurrentPage}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
        />
      </div>
    </MainLayout>
  );
};

export default TrackOrderPage;
