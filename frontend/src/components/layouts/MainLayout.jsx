import Sidebar from "../ui/Sidebar";
import Topbar from "../ui/Topbar";
import Breadcrumbs from "../ui/Breadcrumbs";

const MainLayout = ({ children, breadcrumbs = [] }) => {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="flex-1 px-11 flex flex-col">
          <Breadcrumbs items={breadcrumbs} className="mb-6" />
          <div className="mx-auto w-full flex-grow">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
