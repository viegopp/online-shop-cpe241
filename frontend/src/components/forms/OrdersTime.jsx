import InputField from "./InputField";

const OrdersTime = ({ data }) => {
  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white p-6 flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-slate-900">Order Timeline</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <InputField
          label="Order Date"
          value={data?.orderDate || ""}
          disabled
        />
        <InputField
          label="Payment Date"
          value={data?.paymentDate || ""}
          disabled
        />
        <InputField
          label="Payment Method"
          value={data?.paymentMethod || ""}
          disabled
        />
      </div>
    </div>
  );
};

export default OrdersTime;
