import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import OrderDetailHeader from "../../components/tables/OrderDetailHeader";
import CustomerInfo from "../../components/forms/CustomerInfo";
import ShippingInfo from "../../components/forms/ShippingInfo";
import OrdersTime from "../../components/forms/OrdersTime";
import OrderItems from "../../components/forms/OrderItems";
import apiClient from "../../api/AxiosInterceptor";

const TrackOrderDetailPage = () => {
  const { orderId: id } = useParams();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await apiClient.get(`/admin/order/${id}`);
        if (res.data.success) {
          setOrderData(res.data);
        }
      } catch (error) {
        console.error("Error fetching order detail:", error);
      }
    };
    fetchOrder();
  }, [id]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Orders", href: "/admin/orders" },
    { label: "Track Orders", href: "/admin/orders/track" },
    { label: `${id}`, href: `/admin/orders/track/${id}` },
  ];

  if (!orderData) return <div className="p-6">Loading...</div>;

  const { order, items, summary } = orderData;

  return (
    <MainLayout breadcrumbs={breadcrumbItems} title="Orders Tracking">
      <div className="flex flex-col gap-4">
        <OrderDetailHeader
          orderId={`${order.order_id}`}
          currentStatus={order.order_status}
          onUpdate={(status) => console.log("New status:", status)}
        />
        <div className="flex flex-wrap justify-between gap-6">
          <div className="w-full md:w-[550px]">
            <CustomerInfo
              data={{
                customerId: order.customer_id,
                customerName: order.customer_name,
                email: order.email,
                phone: order.phone,
              }}
            />
          </div>
          <div className="w-full md:w-[550px]">
            <ShippingInfo
              data={{
                address: order.address,
                zip: order.zip_code,
                district: order.district,
                province: order.province,
              }}
            />
          </div>
        </div>

        <OrdersTime
          data={{
            orderDate: order.order_date,
            paymentDate: order.payment_date,
            paymentMethod: order.payment_method,
          }}
        />

        <OrderItems
          items={items.map((item) => ({
            id: item.product_id,
            name: item.product_name,
            unitPrice: parseFloat(item.unit_price),
            quantity: item.quantity,
            total: parseFloat(item.total),
          }))}
          shipping={parseFloat(summary.shipping_fee)}
          discountRate={(+summary.discount / +summary.subtotal) * 100}
        />
      </div>
    </MainLayout>
  );
};

export default TrackOrderDetailPage;
