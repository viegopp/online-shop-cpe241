import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import {
  LayoutGrid,
  Package,
  ShoppingCart,
  Users,
  Zap,
  FileBarChart,
  LogOut,
  ChevronDown,
  ChevronFirstIcon,
} from "lucide-react";

const Sidebar = ({ isCollapsed = false, onToggle }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout: onSignOut } = useAuth();

  const sectionMap = {
    "admin/dashboard": "dashboard",
    "admin/inventory": "inventory",
    "admin/inventory/stock-management": "inventory",
    "admin/inventory/products-reviews": "inventory",
    "admin/orders": "orders",
    "admin/orders/track": "orders",
    "admin/users": "users",
    "admin/users/customers": "users",
    "admin/users/admins": "users",
    "admin/flash-sales": "flash-sales",
    "admin/report": "report",
  };

  const getCurrentSection = () => {
    const matchingPaths = Object.keys(sectionMap)
      .filter((path) => currentPath.startsWith(`/${path}`))
      .sort((a, b) => b.length - a.length);

    return matchingPaths.length > 0 ? sectionMap[matchingPaths[0]] : "";
  };

  const [openSections, setOpenSections] = useState({
    inventory: false,
    orders: false,
    users: false,
  });

  // Check if the current path is a submenu item
  const isSubmenuActive = (sectionKey) => {
    const section = getCurrentSection();
    return section === sectionKey && currentPath.split("/").length > 3;
  };

  // Effect to handle initial submenu open state and collapse changes
  useEffect(() => {
    const section = getCurrentSection();

    // If sidebar is collapsed, close all sections
    if (isCollapsed) {
      setOpenSections({
        inventory: false,
        orders: false,
        users: false,
      });
      return;
    }

    // When not collapsed, open the section of the current path
    if (section) {
      if (
        section !== "dashboard" &&
        section !== "flash-sales" &&
        section !== "report"
      ) {
        setOpenSections((prev) => ({ ...prev, [section]: true }));
      }
    }
  }, [currentPath, isCollapsed]);

  const toggleSection = (key) => {
    // If sidebar is collapsed, expand it first, then open the section
    if (isCollapsed) {
      onToggle(); // Expand sidebar
      // Set a timeout to allow the sidebar to expand before opening the section
      setTimeout(() => {
        setOpenSections((prev) => ({ ...prev, [key]: true }));
      }, 300); // Match this with the transition duration
    } else {
      // Normal toggle when sidebar is expanded
      setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const MenuItem = ({
    icon: Icon,
    label,
    to,
    hasSubmenu,
    isSubmenu,
    sectionKey,
  }) => {
    const isOpen = sectionKey ? openSections[sectionKey] : false;
    // Check if the current item is active (directly or via submenu)
    const isItemActive = hasSubmenu
      ? currentPath.startsWith(`/${to}`) || isSubmenuActive(sectionKey)
      : currentPath === `/${to}`;

    if (hasSubmenu) {
      return (
        <div
          className={`flex items-center rounded-lg px-4 py-2.5 
            ${isItemActive ? "bg-slate-100" : "hover:bg-slate-50"} 
            cursor-pointer transition-colors duration-200 ${
              isCollapsed ? "justify-center" : ""
            }`}
          onClick={() => toggleSection(sectionKey)}
        >
          {Icon && <Icon size={20} className={isCollapsed ? "" : "mr-2.5"} />}
          {!isCollapsed && (
            <>
              <span
                className={`font-medium ${
                  isItemActive ? "text-slate-900" : "text-slate-700"
                }`}
              >
                {label}
              </span>
              <ChevronDown
                size={20}
                className={`ml-auto transition-transform duration-200 ${
                  isOpen ? "transform rotate-180" : ""
                }`}
              />
            </>
          )}
        </div>
      );
    }

    return (
      <NavLink
        to={`/${to}`}
        className={({ isActive }) => `
          flex items-center rounded-lg ${
            isSubmenu
              ? isCollapsed
                ? "py-1.5 justify-center"
                : "pl-12 py-1.5"
              : isCollapsed
              ? "px-4 py-2.5 justify-center"
              : "px-4 py-2.5"
          }
          ${isActive ? "bg-slate-100" : "hover:bg-slate-50"}
          cursor-pointer transition-colors duration-200
        `}
      >
        {({ isActive }) => (
          <>
            {!isSubmenu && Icon && (
              <Icon size={20} className={isCollapsed ? "" : "mr-2.5"} />
            )}
            {!isCollapsed && (
              <span
                className={`
                ${isSubmenu ? "text-slate-500" : "text-slate-700"} 
                font-medium
                ${isActive ? "text-slate-900" : ""}
              `}
              >
                {label}
              </span>
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <aside
      className={`fixed top-0 left-0 ${
        isCollapsed ? "w-[80px]" : "w-[280px]"
      } h-screen border-r border-slate-200 bg-white z-10 flex flex-col transition-all duration-300`}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-center gap-3 px-4 py-8 cursor-pointer"
        onClick={() => (window.location.href = "/admin/homepage")}
      >
        <img src="/logo.svg" alt="OnlineShop Logo" className="w-8 h-8" />
        {!isCollapsed && (
          <h1 className="text-2xl font-bold leading-none text-slate-900 max-md:text-4xl">
            OnlineShop
          </h1>
        )}
      </div>

      {/* Menu Label */}
      {!isCollapsed && (
        <div className="px-6 mb-2">
          <span className="text-sm font-normal text-slate-400 uppercase">
            MENU
          </span>
        </div>
      )}

      {/* Menu Items */}
      <nav
        className={`flex-1 ${
          isCollapsed ? "px-3" : "px-6"
        } space-y-1 overflow-y-auto`}
      >
        {/* Dashboard */}
        <div className="py-1">
          <MenuItem icon={LayoutGrid} label="Dashboard" to="admin/dashboard" />
        </div>

        {/* Inventory */}
        <div className="py-1">
          <MenuItem
            icon={Package}
            label="Inventory"
            to="admin/inventory"
            hasSubmenu={true}
            sectionKey="inventory"
          />

          {openSections.inventory && !isCollapsed && (
            <div className="mt-1 space-y-1">
              <MenuItem
                isSubmenu
                label="Stock Management"
                to="admin/inventory/stock-management"
              />
              <MenuItem
                isSubmenu
                label="Products & Reviews"
                to="admin/inventory/products-reviews"
              />
            </div>
          )}
        </div>

        {/* Orders */}
        <div className="py-1">
          <MenuItem
            icon={ShoppingCart}
            label="Orders"
            to="admin/orders"
            hasSubmenu={true}
            sectionKey="orders"
          />

          {openSections.orders && !isCollapsed && (
            <div className="mt-1 space-y-1">
              <MenuItem
                isSubmenu
                label="Track Orders"
                to="admin/orders/track"
              />
            </div>
          )}
        </div>

        {/* User Manager */}
        <div className="py-1">
          <MenuItem
            icon={Users}
            label="User Manager"
            to="admin/user"
            hasSubmenu={true}
            sectionKey="users"
          />

          {openSections.users && !isCollapsed && (
            <div className="mt-1 space-y-1">
              <MenuItem isSubmenu label="Customers" to="admin/user/customers" />
              <MenuItem isSubmenu label="Admins" to="admin/user/admins" />
            </div>
          )}
        </div>

        {/* Flash Sales */}
        <div className="py-1">
          <MenuItem icon={Zap} label="Flash Sales" to="admin/flash-sales" />
        </div>

        {/* Report */}
        <div className="py-1">
          <MenuItem icon={FileBarChart} label="Report" to="admin/report" />
        </div>
      </nav>

      {/* Sign Out Button */}
      <div className={`${isCollapsed ? "px-3" : "px-6"} py-6`}>
        <button
          className={`flex items-center justify-center gap-2 w-full py-2 ${
            isCollapsed ? "px-2" : "px-4"
          } border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer`}
          onClick={onSignOut}
        >
          <LogOut size={18} />
          {!isCollapsed && (
            <span className="text-base font-medium">Sign out</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
