import MainLayout from "../../components/layouts/MainLayout";
import CustomerManageTable from "../../components/tables/CustomerManageTable";

const CustomerManagementPage = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Customers", href: "admin/user/customers" },
  ];

  return (
    <MainLayout breadcrumbs={breadcrumbItems} title="Customers Manager">
      <div className="flex items-center flex-col w-full h-full min-h-[400px]">
        <CustomerManageTable />
      </div>
    </MainLayout>
  );
};

export default CustomerManagementPage;
