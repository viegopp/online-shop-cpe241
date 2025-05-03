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

const AdminManageTable = ({ admins = [] }) => {
  // Sample data
  const defaultAdmins = useMemo(() => {
    const baseAdmins = [
      {
        id: "000001",
        name: "Mooham Chugra",
        email: "moohamChugra@gmail....",
        phone: "095-xxx-xxxx",
        role: "Super",
      },
      {
        id: "000002",
        name: "Feen Badboy",
        email: "feenBadboy@gmail.com",
        phone: "095-xxx-xxxx",
        role: "Staff",
      },
      {
        id: "000003",
        name: "Muay Kill",
        email: "muayKill@gmail.com",
        phone: "095-xxx-xxxx",
        role: "Super",
      },
      {
        id: "000004",
        name: "Pee Liquid",
        email: "peeLQ@gmail.com",
        phone: "095-xxx-xxxx",
        role: "Super",
      },
      {
        id: "000005",
        name: "Database Drop",
        email: "database.ez@mail.km...",
        phone: "095-xxx-xxxx",
        role: "Staff",
      },
    ];

    // เพิ่มข้อมูลอีก 15 รายการเพื่อการทดสอบ pagination
    const extraAdmins = Array(15)
      .fill(0)
      .map((_, index) => ({
        id: `00000${index + 6}`.slice(-6),
        name: `Admin ${index + 6}`,
        email: `admin${index + 6}@example.com`,
        phone: "095-xxx-xxxx",
        role: index % 3 === 0 ? "Super" : "Staff",
      }));

    return [...baseAdmins, ...extraAdmins];
  }, []);

  const allAdmins = useMemo(
    () => (admins.length > 0 ? admins : defaultAdmins),
    [admins, defaultAdmins]
  );

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [displayAdmins, setDisplayAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    role: "all",
  });
  const [adminsList, setAdminsList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "Staff",
  });
  const filterRef = useRef(null);
  const toolbarRef = useRef(null);
  const modalRef = useRef(null);
  const itemsPerPage = 5;

  // Initialize admins list with sample data
  useEffect(() => {
    setAdminsList(allAdmins);
  }, [allAdmins]);

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

  // Filter admins based on search and filter settings
  useEffect(() => {
    let filtered = adminsList.filter(
      (admin) =>
        admin.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply role filter
    if (filters.role !== "all") {
      filtered = filtered.filter(
        (admin) => admin.role.toLowerCase() === filters.role.toLowerCase()
      );
    }

    setFilteredAdmins(filtered);
    setCurrentPage(1);
  }, [searchTerm, adminsList, filters]);

  // Pagination
  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setDisplayAdmins(filteredAdmins.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage, filteredAdmins, itemsPerPage]);

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

  const handleAddAdmin = () => {
    setShowAddModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate a new ID if empty
    const adminId = newAdmin.id || `00000${adminsList.length + 1}`.slice(-6);

    const adminToAdd = {
      ...newAdmin,
      id: adminId,
    };

    setAdminsList((prev) => [adminToAdd, ...prev]);
    setShowAddModal(false);
    setNewAdmin({
      id: "",
      name: "",
      email: "",
      phone: "",
      role: "Staff",
    });
  };

  // Function to determine trash icon color based on role
  const getTrashIconColor = (role) => {
    return role.toLowerCase() === "super" ? "text-slate-400" : "text-red-500";
  };

  // Function to determine trash icon bg color based on role
  const getTrashIconBgColor = (role) => {
    return role.toLowerCase() === "super" ? "bg-slate-50" : "bg-red-50";
  };

  return (
    <div className="w-full mx-auto flex flex-col gap-2">
      <div className="relative" ref={toolbarRef}>
        <TableToolbar
          onSearch={handleSearch}
          searchPlaceHolder={"Admin"}
          onFilter={handleFilter}
          onAddItem={handleAddAdmin}
          itemName={"Admin"}
        />

        {/* Filter Dropdown */}
        {filterOpen && (
          <div
            className="absolute left-0 top-8 bg-white border border-slate-200 rounded shadow-md z-10 p-3 w-64"
            ref={filterRef}
          >
            <div className="mb-2">
              <h3 className="text-sm font-medium text-slate-700 mb-1">บทบาท</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    filters.role === "all"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => handleFilterChange("role", "all")}
                >
                  All
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    filters.role === "super"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => handleFilterChange("role", "super")}
                >
                  Super
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    filters.role === "staff"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => handleFilterChange("role", "staff")}
                >
                  Staff
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Admins Table */}
      <div className="border border-slate-200 rounded-md overflow-hidden font-satoshi">
        <div className="max-w-full overflow-x-auto">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableCell
                  isHeader
                  className="w-[16%] px-7 py-3 text-sm font-bold text-slate-900"
                >
                  Admin ID
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
                  Role
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
              {displayAdmins.length > 0 ? (
                displayAdmins.map((admin) => (
                  <TableRow
                    key={admin.id}
                    className="border-t border-slate-200"
                  >
                    <TableCell className="w-[16%] px-7 py-3 text-sm text-slate-500">
                      {admin.id}
                    </TableCell>
                    <TableCell className="w-[20%] px-7 py-3 text-sm text-slate-500">
                      {admin.name}
                    </TableCell>
                    <TableCell className="w-[20%] px-7 py-3 text-sm text-slate-500">
                      {admin.email}
                    </TableCell>
                    <TableCell className="w-[16%] px-7 py-3 text-sm text-slate-500">
                      {admin.phone}
                    </TableCell>
                    <TableCell className="w-[16%] px-7 py-3 text-sm text-slate-500">
                      {admin.role}
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
                        <button
                          className={`w-6 h-6 flex items-center justify-center ${getTrashIconBgColor(
                            admin.role
                          )} rounded cursor-pointer`}
                          disabled={admin.role.toLowerCase() === "super"}
                        >
                          <Trash
                            className={getTrashIconColor(admin.role)}
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
                    ไม่พบข้อมูลผู้ดูแลระบบที่ค้นหา
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
        totalItems={filteredAdmins.length}
        onPageChange={handlePageChange}
      />

      {/* Add Admin Modal */}
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

            <h2 className="text-lg font-medium mb-4">Add New Admin</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Admin ID (optional)
                </label>
                <input
                  type="text"
                  name="id"
                  value={newAdmin.id}
                  onChange={handleInputChange}
                  placeholder="Auto-generated if left empty"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={newAdmin.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  value={newAdmin.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={newAdmin.phone}
                  onChange={handleInputChange}
                  placeholder="e.g., 095-xxx-xxxx"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={newAdmin.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                >
                  <option value="Staff">Staff</option>
                  <option value="Super">Super</option>
                </select>
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
                  Add Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageTable;
