import InputField from "./InputField";

const ShippingInfo = ({ data }) => {
  return (
    <div className="w-[550px] rounded-lg border border-slate-200 bg-white p-6 flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-slate-900">Shipping Information</h2>

      <InputField
        label="Address"
        value={data?.address || ""}
        disabled
      />

      <InputField
        label="Zip Code"
        value={data?.zip || ""}
        disabled
      />

      <div className="flex gap-3">
        <InputField
          label="District"
          value={data?.district || ""}
          disabled
        />
        <InputField
          label="Province"
          value={data?.province || ""}
          disabled
        />
      </div>
    </div>
  );
};

export default ShippingInfo;
