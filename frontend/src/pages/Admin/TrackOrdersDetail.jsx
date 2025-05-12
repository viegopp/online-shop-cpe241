import { useParams } from "react-router-dom";
import MainLayout from "../../components/layouts/MainLayout";
import OrderDetailHeader from "../../components/tables/OrderDetailHeader";
import CustomerInfo from "../../components/forms/CustomerInfo";
import ShippingInfo from "../../components/forms/ShippingInfo";
import OrdersTime from "../../components/forms/OrdersTime";
import OrderItems from "../../components/forms/OrderItems";

const TrackOrderDetailPage = () => {
  const { id } = useParams();

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Orders", href: "/admin/orders" },
    { label: "Track Orders", href: "/admin/orders/track" },
    { label: `${id}`, href: `/admin/orders/track/${id}` },
  ];

  return (
    <MainLayout breadcrumbs={breadcrumbItems} title="Orders Tracking">
      <div className="flex flex-col gap-4">
        <OrderDetailHeader
          orderId={`${id}`}
          currentStatus="Pending"
          onUpdate={(status) => console.log("New status:", status)}
        />
      <div className="flex flex-wrap justify-between gap-6">
        <div className="w-full md:w-[550px]">
          <CustomerInfo
            data={{
              customerId: "345678912",
              customerName: "Mooham Chugra",
              email: "sarah.johnson@email.com",
              phone: "+66 87 654 3210",
            }}
          />
        </div>
        <div className="w-full md:w-[550px]">
          <ShippingInfo
            data={{
              address: "789 Park Avenue, Suite 302",
              zip: "10110",
              district: "Pathum Wan",
              province: "Bangkok",
            }}
          />
        </div>
      </div>

        <OrdersTime
          data={{
            orderDate: "Mar 11, 2050 10:23",
            paymentDate: "Mar 11, 2050 10:30",
            paymentMethod: "Mobile Bank",
          }}
        />

        <OrderItems
          items={[
            {
              id: "000001",
              name: "เพียวริคุ มิกซ์เบอร์รี่",
              unitPrice: 15.0,
              quantity: 1,
              total: 15.0,
            },
            {
              id: "000003",
              name: "เพียวริคุ กล้วย",
              unitPrice: 20.0,
              quantity: 1,
              total: 20.0,
            },
            {
              id: "000004",
              name: "เพียวริคุ ลาบ",
              unitPrice: 99.5,
              quantity: 1,
              total: 99.5,
            },
          ]}
          shipping={0}
          discountRate={20}
        />
      </div>
    </MainLayout>
  );
};

export default TrackOrderDetailPage;
