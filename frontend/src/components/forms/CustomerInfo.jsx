import { useState } from "react";
import InputField from "./InputField";

const CustomerInfo = ({ data }) => {
  const [form, setForm] = useState({
    customerId: data?.customerId || "",
    customerName: data?.customerName || "",
    email: data?.email || "",
    phone: data?.phone || "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <div className="w-[550px] rounded-lg border border-slate-200 bg-white p-6 flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-slate-900">Customer Information</h2>
      <div className="flex gap-3">
        <InputField
          label="Customer ID"
          value={form.customerId}
          onChange={handleChange("customerId")}
          disabled
        />
        <InputField
          label="Customer Name"
          value={form.customerName}
          onChange={handleChange("customerName")}
        />
      </div>

      <InputField
        label="Email"
        value={form.email}
        onChange={handleChange("email")}
      />

      <InputField
        label="Phone"
        value={form.phone}
        onChange={handleChange("phone")}
      />
    </div>
  );
};

export default CustomerInfo;
