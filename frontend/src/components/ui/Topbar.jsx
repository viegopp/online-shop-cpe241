import React from "react";
import { ChevronFirstIcon, ChevronDown, ChevronLastIcon } from "lucide-react";

const Topbar = ({
  userName = "Mooham Chugra",
  userRole = "Super Admin",
  userAvatar = "https://i.pravatar.cc/200",
  isSidebarCollapsed = false,
  onToggleSidebar,
  onUserMenuToggle,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white h-20 ${className}`}
    >
      {/* Toggle SideBar Button */}
      <button
        onClick={onToggleSidebar}
        className="w-[46px] h-[46px] rounded-lg border border-slate-200 bg-white flex items-center justify-center cursor-pointer hover:bg-slate-50/50"
      >
        {isSidebarCollapsed ? (
          <ChevronLastIcon className="text-slate-500" size={24} />
        ) : (
          <ChevronFirstIcon className="text-slate-500" size={24} />
        )}
      </button>

      {/* User Profile */}
      <div className="flex items-center">
        <div className="text-right mr-4">
          <div className="text-sm font-medium text-slate-900">{userName}</div>
          <div className="text-xs font-medium text-slate-500">{userRole}</div>
        </div>

        <div className="relative flex">
          <img
            src={userAvatar}
            alt={userName}
            className="w-11 h-11 rounded-full object-cover"
          />
          <button onClick={onUserMenuToggle} className="px-2">
            <ChevronDown className="text-slate-500" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
