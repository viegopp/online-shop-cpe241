import React, { useRef, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "./TableElements";
import Pagination from "./Pagination";
import TableToolbar from "./TableToolbar";
import apiClient from "../../api/AxiosInterceptor";
import { MoreHorizontal, Trash, X } from "lucide-react";

const StockManageTable = ({
  products = [],
  currentPage = 1,
  itemsPerPage = 5,
  totalItems = 0,
  searchTerm = "",
  filters = { availability: "all", stockLevel: "all" },
  onPageChange,
  onSearchChange,
  onFilterChange,
  onEdit,
}) => {

    const handleDelete = async (productId) => {
    const confirm = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?");
    if (!confirm) return;

    try {
      const res = await apiClient.delete(`/admin/inventory/${productId}`);
      if (res.data.success) {
        alert("ลบสินค้าเรียบร้อยแล้ว");
        window.location.reload(); // หรือจะเรียก onRefresh() จาก props แทนก็ได้
      } else {
        alert("ไม่สามารถลบสินค้าได้");
      }
    } catch (err) {
      console.error("ลบไม่สำเร็จ:", err);
      alert("เกิดข้อผิดพลาดในการลบสินค้า");
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    available: true,
    category: "Beverage",
    stock: 0,
  });

  const filterRef = useRef(null);
  const toolbarRef = useRef(null);
  const modalRef = useRef(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      product_id: newProduct.id || undefined, // optional
      name: newProduct.name,
      price: 1,
      description: "N/A",
      stock_quantity: parseInt(newProduct.stock, 10),
      is_available: newProduct.available,
      manufacturer_name: "บริษัท ที.ซี.ฟาร์มาซูติคอล อุตสาหกรรม จำกัด",
      category_name: newProduct.category,
      images: ["/images/placeholder.jpg"],
    };

    console.log("POST payload:", payload);
    const res = await apiClient.post("/admin/inventory", payload);

    if (res.data.success) {
      alert("✅ เพิ่มสินค้าเรียบร้อยแล้ว");
      setShowAddModal(false);
      window.location.reload(); // หรือเรียก fetch ใหม่
    } else {
      alert("❌ ไม่สามารถเพิ่มสินค้าได้");
    }

  console.log("API response:", error?.response?.data);
  } catch (error) {
    console.error("❌ เพิ่มสินค้าไม่สำเร็จ:", error);
    alert("⚠️ เกิดข้อผิดพลาดในการเพิ่มสินค้า");
  }
};


  return (
    <div className="w-full mx-auto flex flex-col gap-2">
      <div className="relative" ref={toolbarRef}>
        <TableToolbar
          onSearch={onSearchChange}
          searchPlaceHolder="Products"
          onFilter={() => setFilterOpen(!filterOpen)}
          onAddItem={() => setShowAddModal(true)}
          itemName="Product"
        />

        {filterOpen && (
          <div
            className="absolute left-0 top-8 bg-white border border-slate-200 rounded shadow-md z-10 p-3 w-64"
            ref={filterRef}
          >
            <div className="mb-3">
              <h3 className="text-sm font-medium text-slate-700 mb-1">สถานะสินค้า</h3>
              <div className="flex gap-2">
                {["all", "available", "unavailable"].map((val) => (
                  <button
                    key={val}
                    className={`px-2 py-1 text-xs rounded ${
                      filters.availability === val
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                    onClick={() => onFilterChange("availability", val)}
                  >
                    {val === "all"
                      ? "All"
                      : val === "available"
                      ? "Available"
                      : "Not Available"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-2">
              <h3 className="text-sm font-medium text-slate-700 mb-1">ระดับสต็อก</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "all", label: "All" },
                  { key: "low", label: "<10" },
                  { key: "medium", label: "10-50" },
                  { key: "high", label: ">50" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    className={`px-2 py-1 text-xs rounded ${
                      filters.stockLevel === key
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                    onClick={() => onFilterChange("stockLevel", key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border border-slate-200 rounded-md overflow-hidden font-satoshi">
        <div className="max-w-full overflow-x-auto">
          <Table className="w-full table-fixed border-collapse">
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableCell
                  isHeader
                  className="w-[16%] px-8 py-3 text-sm font-bold text-slate-900"
                >
                  Product ID
                </TableCell>
                <TableCell
                  isHeader
                  className="w-[20%] px-8 py-3 text-sm font-bold text-slate-900"
                >
                  Product Name
                </TableCell>
                <TableCell
                  isHeader
                  className="w-[16%] px-8 py-3 text-sm font-bold text-slate-900"
                >
                  Available
                </TableCell>
                <TableCell
                  isHeader
                  className="w-[16%] px-8 py-3 text-sm font-bold text-slate-900"
                >
                  Category
                </TableCell>
                <TableCell
                  isHeader
                  className="w-[16%] px-8 py-3 text-sm font-bold text-slate-900"
                >
                  Stock
                </TableCell>
                <TableCell
                  isHeader
                  className="w-[16%] px-8 py-3 text-sm font-bold text-slate-900"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    className="border-t border-slate-200"
                  >
                    <TableCell className="px-8 py-3 text-sm text-slate-700">{product.id}</TableCell>
                    <TableCell className="px-8 py-3 text-sm text-slate-700">{product.name}</TableCell>
                    <TableCell className="px-8 py-3 text-sm">
                      <span className={product.available ? "text-green-600" : "text-red-600"}>
                        {product.available ? "Available" : "Not Available"}
                      </span>
                    </TableCell>
                    <TableCell className="px-8 py-3 text-sm text-slate-700">{product.category}</TableCell>
                    <TableCell className="px-8 py-3 text-sm text-slate-700">{product.stock}</TableCell>
                    <TableCell className="px-8 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          className="w-6 h-6 flex items-center justify-center bg-slate-50 rounded cursor-pointer"
                          onClick={() => onEdit(product.id)}
                        >
                          <MoreHorizontal className="text-slate-500" size={16} strokeWidth={1.8} />
                        </button>
                        <button
                          className="w-6 h-6 flex items-center justify-center bg-red-50 border border-red-100 rounded hover:bg-red-100"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash className="text-red-500" size={16} strokeWidth={1.8} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    ไม่พบข้อมูลสินค้าที่ค้นหา
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

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-6 w-full max-w-md relative"
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-medium mb-4">Add New Product</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Product ID (optional)
                </label>
                <input
                  type="text"
                  name="id"
                  value={newProduct.id}
                  onChange={handleInputChange}
                  placeholder="Auto-generated if left empty"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Product Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                >
                  <option value="Beverage">Beverage</option>
                  <option value="Accessory">Accessory</option>
                  <option value="Merchandise">Merchandise</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  value={newProduct.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="available"
                    checked={newProduct.available}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-slate-700">
                    Available for Sale
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-600 rounded-md hover:bg-slate-700"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManageTable;

/*
Example Usage:
<StockManageTable
  products={[
    {
      id: "000001",
      name: "Product 1",
      available: true,
      category: "Beverage",
      stock: 50,
    },
    {
      id: "000002",
      name: "Product 2",
      available: false,
      category: "Accessory",
      stock: 0,
    },
  ]}
/>
*/
