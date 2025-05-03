import MainLayout from "../../components/layouts/MainLayout";
import AdminManageTable from "../../components/tables/AdminManageTable";

const AdminManagementPage = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Admins", href: "admin/user/admins" },
  ];

  return (
    <MainLayout breadcrumbs={breadcrumbItems} title="Admins Manager">
      <div className="flex items-center flex-col w-full h-full min-h-[400px]">
        <AdminManageTable />
      </div>
    </MainLayout>
  );
};

export default AdminManagementPage;
