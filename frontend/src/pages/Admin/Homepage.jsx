import React from "react";
import StockManageTable from "../../components/tables/StockManageTable";
import Breadcrumbs from "../../components/ui/Breadcrumbs";

const Homepage = () => {
  const breadcrumbItems = [
    { label: "Home", path: "/admin" },
    { label: "Stock Management", path: "/admin/stock-management" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>

      <Breadcrumbs items={breadcrumbItems} title="Stock Management" />

      <StockManageTable />
    </div>
  );
};

export default Homepage;
