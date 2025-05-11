import MainLayout from "../../components/layouts/MainLayout";
import BarChart from "../../components/charts/BarChart";
import PieChart from "../../components/charts/PieChart";
import ReviewsBox from "../../components/review/ReviewsBox";
import RevenueTable from "../../components/tables/RevenueTable";

const ReportPage = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Report", href: "/admin/report" },
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

  return (
    <MainLayout breadcrumbs={breadcrumbItems} title="Reports">
      <div className="flex flex-col gap-6">
        <BarChart
          title="Monthly Sales"
          data={monthlySalesData}
          categories={monthlySalesCategories}
        />
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-bold text-2xl text-slate-900 mb-4 font-satoshi">
              Best-Selling Products
            </h2>
            <RevenueTable />
          </div>
          
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <ReviewsBox />
          <PieChart />
        </div>
      </div>
    </MainLayout>
  );
};

export default ReportPage;