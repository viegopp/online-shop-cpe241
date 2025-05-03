import MainLayout from "../../components/layouts/MainLayout";
import OrderTrackingTable from "../../components/tables/OrderTrackingTable";

const TrackOrderPage = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Orders", href: "/inventory" },
    { label: "Track Orders", href: "/stock-management" },
  ];

  return (
    <MainLayout breadcrumbs={breadcrumbItems} title="Orders Tracking">
      <div className="flex items-center flex-col w-full h-full min-h-[400px]">
        <OrderTrackingTable />
      </div>
    </MainLayout>
  );
};

export default TrackOrderPage;
