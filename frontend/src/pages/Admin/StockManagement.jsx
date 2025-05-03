import MainLayout from "../../components/layouts/MainLayout";
import StockManageTable from "../../components/tables/StockManageTable";

const StackManagementPage = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Inventory", href: "/inventory" },
    { label: "Stock Management", href: "/stock-management" },
  ];

  return (
    <MainLayout breadcrumbs={breadcrumbItems} title="Stock Management">
      <div className="flex items-center flex-col w-full h-full min-h-[400px]">
        <StockManageTable />
      </div>
    </MainLayout>
  );
};

export default StackManagementPage;
