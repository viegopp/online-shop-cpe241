// src/components/Sidebar.jsx
import { useState } from "react";

const Sidebar = () => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const Arrow = ({ open }) => (
    <img
      src="/chevron-down.svg"
      alt="arrow"
      className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
    />
  );

  return (
    <div className="w-64 min-h-screen bg-white border-r px-6 py-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-center mb-6">
          <img src="/logo.svg" alt="OnlineShop Logo" className="w-10 h-10 mr-2" />
          <h1 className="text-xl font-semibold">OnlineShop</h1>
        </div>

        <p className="text-xs text-gray-400 mb-4">MENU</p>

        <ul className="space-y-2 text-gray-700">
          <li className="flex items-center gap-2 cursor-pointer">
            <img src="/layout-grid.svg" alt="dashboard" className="w-5 h-5" /> Dashboard
          </li>

          <li>
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("inventory")}> 
              <span className="flex items-center gap-2">
                <img src="/package.svg" alt="inventory" className="w-5 h-5" /> Inventory
              </span>
              <Arrow open={openSections.inventory} />
            </div>
            {openSections.inventory && (
              <ul className="ml-6 mt-1 space-y-1 text-sm">
                <li className="cursor-pointer">Stock Management</li>
                <li className="cursor-pointer">Products & Reviews</li>
              </ul>
            )}
          </li>

          <li>
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("orders")}> 
              <span className="flex items-center gap-2">
                <img src="/shopping-cart.svg" alt="orders" className="w-5 h-5" /> Orders
              </span>
              <Arrow open={openSections.orders} />
            </div>
            {openSections.orders && (
              <ul className="ml-6 mt-1 space-y-1 text-sm">
                <li className="cursor-pointer">Track Orders</li>
              </ul>
            )}
          </li>

          <li>
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("users")}> 
              <span className="flex items-center gap-2">
                <img src="/users.svg" alt="users" className="w-5 h-5" /> User Manager
              </span>
              <Arrow open={openSections.users} />
            </div>
            {openSections.users && (
              <ul className="ml-6 mt-1 space-y-1 text-sm">
                <li className="cursor-pointer">Customers</li>
                <li className="cursor-pointer">Admins</li>
              </ul>
            )}
          </li>

          <li className="flex items-center gap-2 cursor-pointer">
            <img src="/zap.svg" alt="flash sales" className="w-5 h-5" /> Flash Sales
          </li>
          <li className="flex items-center gap-2 cursor-pointer">
            <img src="/file-bar-chart.svg" alt="report" className="w-5 h-5" /> Report
          </li>
        </ul>
      </div>

      <div className="text-sm">
        <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border hover:bg-gray-100 rounded">
          <img src="/log-out.svg" alt="signout" className="w-5 h-5" /> Sign out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
