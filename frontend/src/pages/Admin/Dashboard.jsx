import MainLayout from "../../components/layouts/MainLayout";
import BarChart from "../../components/charts/BarChart";
import StatCard from "../../components/charts/StatCard";
import { CheckCircle, User, Box } from "lucide-react";

const DashboardPage = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  const monthlySalesData = [
    352, 290, 450, 300, 280, 140, 200, 100, 150, 300, 400, 283,
  ];
  const monthlySalesCategories = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const stats = [
    {
      label: "Total Sales",
      value: "$40,923",
      icon: <CheckCircle size={28} />,
      changeType: "negative",
      changeValue: "2.76%",
    },
    {
      label: "Total Orders",
      value: "3,782",
      icon: <User size={28} />,
      changeType: "neutral",
      changeValue: "0.00%",
    },
    {
      label: "Total Customers",
      value: "5,314",
      icon: <Box size={28} />,
      changeType: "positive",
      changeValue: "11.01%",
    },
  ];

  return (
    <MainLayout breadcrumbs={breadcrumbItems} title="Dashboard">
      <div className="flex items-center gap-4.5 flex-col w-full h-full min-h-[400px]">
        <BarChart
          title="Monthly Sales"
          data={monthlySalesData}
          categories={monthlySalesCategories}
        />
        <div className="flex gap-4.5 w-full justify-center">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              title={stat.label}
              value={stat.value}
              changeType={stat.changeType}
              changeValue={stat.changeValue}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
