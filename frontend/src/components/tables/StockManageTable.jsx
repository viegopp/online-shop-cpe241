// src/components/tables/StockManageTable.jsx

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
import { MoreHorizontal, Trash, X } from "lucide-react";

const StockManageTable = ({ products = [] }) => {
  // Sample data
  const defaultProducts = useMemo(() => {
    const baseProducts = [
      {
        id: "000001",
        name: "เพียวริคุ มิกซ์เบอรรี่",
        available: true,
        category: "Beverage",
        stock: 72,
      },
      {
        id: "000002",
        name: "เพียวริคุ ปลาดอลลี่",
        available: false,
        category: "Beverage",
        stock: 0,
      },
      {
        id: "000003",
        name: "เพียวริคุ กล้วย",
        available: true,
        category: "Beverage",
        stock: 12,
      },
      {
        id: "000004",
        name: "เพียวริคุ ลาบ",
        available: true,
        category: "Beverage",
        stock: 95,
      },
      {
        id: "000005",
        name: "เพียวริคุ บลูเบอรรี่",
        available: true,
        category: "Beverage",
        stock: 8,
      },
    ];

    const extraProducts = Array(15)
      .fill(0)
      .map((_, index) => ({
        id: `00000${index + 6}`.slice(-6),
        name: `เพียวริคุ สินค้า ${index + 6}`,
        available: index % 3 !== 0,
        category: "Beverage",
        stock: 25 + ((index * 3) % 50),
      }));

    return [...baseProducts, ...extraProducts];
  }, []);

  const allProducts = useMemo(
    () => (products.length > 0 ? products : defaultProducts),
    [products, defaultProducts]
  );

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    availability: "all",
    stockLevel: "all",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    available: true,
    category: "Beverage",
    stock: 0,
  });
  const [productList, setProductList] = useState([]);
  const filterRef = useRef(null);
  const toolbarRef = useRef(null);
  const modalRef = useRef(null);
  const itemsPerPage = 5;

  // Initialize product list with sample data
  useEffect(() => {
    setProductList(allProducts);
  }, [allProducts]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
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

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowAddModal(false);
      }
    }

    if (showAddModal) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showAddModal]);

  // Filter products based on search and filter settings
  useEffect(() => {
    let filtered = productList.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply availability filter
    if (filters.availability !== "all") {
      filtered = filtered.filter(
        (product) =>
          (filters.availability === "available" && product.available) ||
          (filters.availability === "unavailable" && !product.available)
      );
    }

    // Apply stock level filter
    if (filters.stockLevel !== "all") {
      filtered = filtered.filter((product) => {
        if (filters.stockLevel === "low") return product.stock < 10;
        if (filters.stockLevel === "medium")
          return product.stock >= 10 && product.stock <= 50;
        if (filters.stockLevel === "high") return product.stock > 50;
        return true;
      });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, productList, filters]);

  // Pagination
  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setDisplayProducts(
      filteredProducts.slice(indexOfFirstItem, indexOfLastItem)
    );
  }, [currentPage, filteredProducts, itemsPerPage]);

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

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setNewProduct((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "stock"
          ? parseInt(value, 10) || 0
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate a new ID if empty
    const productId =
      newProduct.id || `00000${productList.length + 1}`.slice(-6);

    const productToAdd = {
      ...newProduct,
      id: productId,
    };

    setProductList((prev) => [productToAdd, ...prev]);
    setShowAddModal(false);
    setNewProduct({
      id: "",
      name: "",
      available: true,
      category: "Beverage",
      stock: 0,
    });
  };

  return (
    <div className="w-full max-w-[912px] mx-auto flex flex-col gap-2">
      <div className="relative" ref={toolbarRef}>
        <TableToolbar
          onSearch={handleSearch}
          searchPlaceHolder={"Products"}
          onFilter={handleFilter}
          onAddItem={handleAddProduct}
          itemName={"Product"}
        />

        {/* Filter Dropdown */}
        {filterOpen && (
          <div
            className="absolute left-0 top-8 bg-white border border-slate-200 rounded shadow-md z-10 p-3 w-64"
            ref={filterRef}
          >
            <div className="mb-3">
              <h3 className="text-sm font-medium text-slate-700 mb-1">
                สถานะสินค้า
              </h3>
              <div className="flex gap-2">
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    filters.availability === "all"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => handleFilterChange("availability", "all")}
                >
                  All
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    filters.availability === "available"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() =>
                    handleFilterChange("availability", "available")
                  }
                >
                  Available
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    filters.availability === "unavailable"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() =>
                    handleFilterChange("availability", "unavailable")
                  }
                >
                  Not Available
                </button>
              </div>
            </div>

            <div className="mb-2">
              <h3 className="text-sm font-medium text-slate-700 mb-1">
                ระดับสต็อก
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    filters.stockLevel === "all"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => handleFilterChange("stockLevel", "all")}
                >
                  All
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    filters.stockLevel === "low"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => handleFilterChange("stockLevel", "low")}
                >
                  &lt;10
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    filters.stockLevel === "medium"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => handleFilterChange("stockLevel", "medium")}
                >
                  10-50
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    filters.stockLevel === "high"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => handleFilterChange("stockLevel", "high")}
                >
                  &gt;50
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Table */}
      <div className="border border-slate-200 rounded-md overflow-hidden font-satoshi">
        <div className="max-w-full overflow-x-auto">
          <Table className="w-full table-fixed">
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
              {displayProducts.length > 0 ? (
                displayProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    className="border-t border-slate-200"
                  >
                    <TableCell className="w-[16%] px-8 py-3 text-sm text-slate-500">
                      {product.id}
                    </TableCell>
                    <TableCell className="w-[20%] px-8 py-3 text-sm text-slate-500">
                      {product.name}
                    </TableCell>
                    <TableCell className="w-[16%] px-8 py-3 text-sm">
                      <span
                        className={
                          product.available ? "text-green-600" : "text-red-600"
                        }
                      >
                        {product.available ? "Available" : "Not Available"}
                      </span>
                    </TableCell>
                    <TableCell className="w-[16%] px-8 py-3 text-sm text-slate-500">
                      {product.category}
                    </TableCell>
                    <TableCell className="w-[16%] px-8 py-3 text-sm text-slate-500">
                      {product.stock}
                    </TableCell>
                    <TableCell className="w-[16%] px-8 py-3 text-sm">
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
                    ไม่พบข้อมูลสินค้าที่ค้นหา
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
        totalItems={filteredProducts.length}
        onPageChange={handlePageChange}
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
