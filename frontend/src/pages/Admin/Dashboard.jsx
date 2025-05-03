import React from "react";
import MainLayout from "../../components/layouts/MainLayout";
import BarChart from "../../components/charts/BarChart";
import StatCard from "../../components/charts/StatCard";
import { CheckCircle, Users, Package } from "lucide-react";

const Dashboard = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/admin/homepage" },
  ];

  return (
    <MainLayout breadcrumbs={breadcrumbItems}>
      <div className="flex flex-col gap-6">
        {/* Section: Bar Chart */}
        <BarChart />

        {/* Section: Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={<CheckCircle className="w-6 h-6 text-slate-700" />}
            title="Total Sales"
            value="$40,923"
            changeType="negative"
            changeValue="2.76%"
          />
          <StatCard
            icon={<Users className="w-6 h-6 text-slate-700" />}
            title="Total Customer"
            value="3,782"
            changeType="neutral"
            changeValue="0.00%"
          />
          <StatCard
            icon={<Package className="w-6 h-6 text-slate-700" />}
            title="Total Order"
            value="5,314"
            changeType="positive"
            changeValue="11.01%"
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
