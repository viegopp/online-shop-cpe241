import React from "react";
import { ChevronFirstIcon, ChevronDown } from "lucide-react";

const Topbar = ({
  userName = "Mooham Chugra",
  userRole = "Super Admin",
  userAvatar = "https://i.pravatar.cc/200",
  onBack,
  onUserMenuToggle,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white h-20 ${className}`}
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="w-[46px] h-[46px] rounded-lg border border-slate-200 bg-white flex items-center justify-center"
      >
        <ChevronFirstIcon className="text-slate-500" size={24} />
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
            className="w-11.5 h-11.5 rounded-full object-cover"
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
