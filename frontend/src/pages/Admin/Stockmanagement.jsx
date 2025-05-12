import { useEffect, useState } from "react";
import apiClient from "../../api/AxiosInterceptor"; // ใช้ Axios client ที่แนบ token
import MainLayout from "../../components/layouts/MainLayout";
import StockManageTable from "../../components/tables/StockManageTable";
import { useNavigate } from "react-router-dom";

const StackManagementPage = () => {
  const navigate = useNavigate();

  const handleEdit = (productId) => {
    navigate(`/admin/inventory/stock-management/${productId}`);
  };

  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    availability: "all",
    stockLevel: "all",
  });

  const fetchInventory = async (page = 1, search = "", filters) => {
    const availability = filters.availability === "available"
      ? "true"
      : filters.availability === "unavailable"
      ? "false"
      : "";

    const stock_min = filters.stockLevel === "low" ? 0 : filters.stockLevel === "medium" ? 10 : 51;
    const stock_max = filters.stockLevel === "low" ? 9 : filters.stockLevel === "medium" ? 50 : 9999;

    const res = await apiClient.get(`/admin/inventory`, {
      params: {
        search: search || "",
        category: "", // ต้องเป็น string ไม่ใช่ undefined/null
        is_available: availability || "",
        stock_min: stock_min ?? 0,
        stock_max: stock_max ?? 9999,
        page: page ?? 1,
        per_page: itemsPerPage ?? 5,
      }
    });

    const rawData = res.data?.data || [];
    const formatted = rawData.map((item) => ({
      id: item.product_id,
      name: item.name,
      available: item.is_available === 1,
      category: item.category_name,
      stock: parseInt(item.stock_quantity, 10),
    }));

    setProducts(formatted);
    setTotalItems(res.data?.pagination?.total || 0);
  };

  useEffect(() => {
    fetchInventory(currentPage, searchTerm, filters);
  }, [currentPage, searchTerm, filters]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // reset page
  };

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
    setCurrentPage(1); // reset page
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Inventory", href: "/inventory" },
    { label: "Stock Management", href: "/stock-management" },
  ];

  return (
    <MainLayout breadcrumbs={breadcrumbItems} title="Stock Management">
      <div className="flex items-center flex-col w-full h-full min-h-[400px]">
        <StockManageTable
          products={products}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          searchTerm={searchTerm}
          filters={filters}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
        />
      </div>
    </MainLayout>
  );
};

export default StackManagementPage;
