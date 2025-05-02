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
} from "lucide-react";

const Sidebar = ({ fixedOnScroll = true }) => {
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
      .filter((path) => currentPath.startsWith(path))
      .sort((a, b) => b.length - a.length);

    return matchingPaths.length > 0 ? sectionMap[matchingPaths[0]] : "";
  };

  const [openSections, setOpenSections] = useState({
    inventory: false,
    orders: false,
    users: false,
  });

  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const section = getCurrentSection();
    if (section) {
      if (
        section !== "dashboard" &&
        section !== "flash-sales" &&
        section !== "report"
      ) {
        setOpenSections((prev) => ({ ...prev, [section]: true }));
      }
    }

    const handleScroll = () => {
      if (!fixedOnScroll) return;

      if (window.scrollY > 80) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPath, fixedOnScroll]);

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
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

    if (hasSubmenu) {
      const isActive = currentPath.startsWith(to);

      return (
        <div
          className={`flex items-center rounded-lg px-4 py-2.5 
            ${isActive ? "bg-slate-100" : "hover:bg-slate-50"} 
            cursor-pointer transition-colors duration-200`}
          onClick={() => toggleSection(sectionKey)}
        >
          {Icon && <Icon size={20} className="mr-2.5" />}
          <span
            className={`font-medium ${
              isActive ? "text-slate-900" : "text-slate-700"
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
        </div>
      );
    }

    return (
      <NavLink
        to={to}
        className={({ isActive }) => `
          flex items-center rounded-lg ${
            isSubmenu ? "pl-12 py-1.5" : "px-4 py-2.5"
          }
          ${isActive ? "bg-slate-100" : "hover:bg-slate-50"}
          cursor-pointer transition-colors duration-200
        `}
      >
        {({ isActive }) => (
          <>
            {!isSubmenu && Icon && <Icon size={20} className="mr-2.5" />}
            <span
              className={`
              ${isSubmenu ? "text-slate-500" : "text-slate-700"} 
              font-medium
              ${isActive ? "text-slate-900" : ""}
            `}
            >
              {label}
            </span>
          </>
        )}
      </NavLink>
    );
  };

  return (
    <aside
      className={`w-[280px] border-r border-slate-200 bg-white ${
        isFixed ? "fixed top-0 left-0 h-screen z-10" : "h-screen"
      } flex flex-col`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center gap-3 px-4 py-8">
        <img src="/logo.svg" alt="OnlineShop Logo" className="w-8 h-8" />
        <h1 className="text-2xl font-bold leading-none text-slate-900 max-md:text-4xl">
          OnlineShop
        </h1>
      </div>

      {/* Menu Label */}
      <div className="px-6 mb-2">
        <span className="text-sm font-normal text-slate-400 uppercase">
          MENU
        </span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-6 space-y-1 overflow-y-auto">
        {/* Dashboard */}
        <div className="py-1">
          <MenuItem icon={LayoutGrid} label="Dashboard" to="/dashboard" />
        </div>

        {/* Inventory */}
        <div className="py-1">
          <MenuItem
            icon={Package}
            label="Inventory"
            to="/inventory"
            hasSubmenu={true}
            sectionKey="inventory"
          />

          {openSections.inventory && (
            <div className="mt-1 space-y-1">
              <MenuItem
                isSubmenu
                label="Stock Management"
                to="/inventory/stock-management"
              />
              <MenuItem
                isSubmenu
                label="Products & Reviews"
                to="/inventory/products-reviews"
              />
            </div>
          )}
        </div>

        {/* Orders */}
        <div className="py-1">
          <MenuItem
            icon={ShoppingCart}
            label="Orders"
            to="/orders"
            hasSubmenu={true}
            sectionKey="orders"
          />

          {openSections.orders && (
            <div className="mt-1 space-y-1">
              <MenuItem isSubmenu label="Track Orders" to="/orders/track" />
            </div>
          )}
        </div>

        {/* User Manager */}
        <div className="py-1">
          <MenuItem
            icon={Users}
            label="User Manager"
            to="/users"
            hasSubmenu={true}
            sectionKey="users"
          />

          {openSections.users && (
            <div className="mt-1 space-y-1">
              <MenuItem isSubmenu label="Customers" to="/users/customers" />
              <MenuItem isSubmenu label="Admins" to="/users/admins" />
            </div>
          )}
        </div>

        {/* Flash Sales */}
        <div className="py-1">
          <MenuItem icon={Zap} label="Flash Sales" to="/flash-sales" />
        </div>

        {/* Report */}
        <div className="py-1">
          <MenuItem icon={FileBarChart} label="Report" to="/report" />
        </div>
      </nav>

      {/* Sign Out Button */}
      <div className="p-6">
        <button
          className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          onClick={onSignOut}
        >
          <LogOut size={18} />
          <span className="text-base font-medium">Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
