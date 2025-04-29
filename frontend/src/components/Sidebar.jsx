import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutGrid, Package, ShoppingCart, Users, Zap, FileChartColumnIncreasing, LogOut, ChevronUp } from 'lucide-react';

const Sidebar = () => {
  const [openSections, setOpenSections] = useState({});
  const location = useLocation();

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const Arrow = ({ open }) => (
    <ChevronUp
      className={`w-4 h-4 transition-transform duration-200 ${!open ? "rotate-180" : "rotate-0"}`}
    />
  );

  const navLinkClass = ({ isActive }) =>
    isActive ? "text-blue-600 font-medium" : "hover:text-blue-500";

  return (
    <div className="w-64 min-h-screen bg-white border-r px-6 py-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-center mb-6">
          <img src="/logo.svg" alt="OnlineShop Logo" className="w-10 h-10 mr-2" />
          <h1 className="text-xl font-semibold">OnlineShop</h1>
        </div>

        <p className="text-xs text-gray-400 mb-4">MENU</p>

        <ul className="space-y-2 text-gray-700">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 cursor-pointer ${isActive && location.pathname !== "/dashboard" ? "text-blue-600 font-medium" : "hover:text-blue-500"}`
              }
            >
              <LayoutGrid /> Dashboard
            </NavLink>
          </li>

          <li>
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("inventory")}> 
              <span className="flex items-center gap-2">
                <Package /> Inventory
              </span>
              <Arrow open={openSections.inventory} />
            </div>
            {openSections.inventory && (
              <ul className="ml-6 mt-1 space-y-1 text-sm">
                <li>
                  <NavLink to="/inventory/stock" className={navLinkClass}>Stock Management</NavLink>
                </li>
                <li>
                  <NavLink to="/inventory/products" className={navLinkClass}>Products & Reviews</NavLink>
                </li>
              </ul>
            )}
          </li>

          <li>
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("orders")}> 
              <span className="flex items-center gap-2">
                <ShoppingCart /> Orders
              </span>
              <Arrow open={openSections.orders} />
            </div>
            {openSections.orders && (
              <ul className="ml-6 mt-1 space-y-1 text-sm">
                <li>
                  <NavLink to="/orders/track" className={navLinkClass}>Track Orders</NavLink>
                </li>
              </ul>
            )}
          </li>

          <li>
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("users")}> 
              <span className="flex items-center gap-2">
                <Users /> User Manager
              </span>
              <Arrow open={openSections.users} />
            </div>
            {openSections.users && (
              <ul className="ml-6 mt-1 space-y-1 text-sm">
                <li>
                  <NavLink to="/users/customers" className={navLinkClass}>Customers</NavLink>
                </li>
                <li>
                  <NavLink to="/users/admins" className={navLinkClass}>Admins</NavLink>
                </li>
              </ul>
            )}
          </li>

          <li>
            <NavLink to="/flash-sales" className={({ isActive }) => `flex items-center gap-2 cursor-pointer ${navLinkClass({ isActive })}`}>
              <Zap /> Flash Sales
            </NavLink>
          </li>
          <li>
            <NavLink to="/report" className={({ isActive }) => `flex items-center gap-2 cursor-pointer ${navLinkClass({ isActive })}`}>
              <FileChartColumnIncreasing /> Report
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="text-sm">
        <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border hover:bg-gray-100 rounded">
          <LogOut /> Sign out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;