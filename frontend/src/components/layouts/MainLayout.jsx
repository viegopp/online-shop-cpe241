import { useState } from "react";
import Sidebar from "../ui/Sidebar";
import Topbar from "../ui/Topbar";
import Breadcrumbs from "../ui/Breadcrumbs";

const MainLayout = ({ children, breadcrumbs = [], title = "" }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      {/* Sidebar (fixed position) */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main content area with dynamic left margin based on sidebar state */}
      <div
        className={`flex flex-col flex-1 ${
          isSidebarCollapsed ? "ml-[80px]" : "ml-[280px]"
        } transition-all duration-300 overflow-hidden`}
      >
        <Topbar
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />
        <main className="flex-1 px-11 py-4 flex flex-col overflow-x-hidden">
          <Breadcrumbs items={breadcrumbs} title={title} className="mb-6" />
          <div className="mx-auto w-full flex-grow max-w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
