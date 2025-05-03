// src/pages/Admin/StockManagement.jsx

import React from "react";
import MainLayout from "../../components/layouts/MainLayout";
import StockManageTable from "../../components/tables/StockManageTable";

const StockManagement = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Stock Management", href: "/admin/inventory/stock" },
  ];

  return (
    <MainLayout breadcrumbs={breadcrumbItems}>
      <div className="w-full max-w-screen-xl mx-auto flex flex-col gap-6">
        <StockManageTable />
      </div>
    </MainLayout>
  );
};

export default StockManagement;
