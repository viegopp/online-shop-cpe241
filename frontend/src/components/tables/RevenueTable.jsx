import React from "react";

const RevenueTable = ({ products = [] }) => {
  const defaultProducts = [
    { name: "เพียวริคุ ลาบ", unitsSold: 475, revenue: 5040.0, percent: "30%" },
    { name: "เพียวริคุ มิกซ์เบอร์รี่", unitsSold: 314, revenue: 3340.0, percent: "20%" },
    { name: "เพียวริคุ บลูเบอร์รี่", unitsSold: 22, revenue: 400.0, percent: "10%" },
    { name: "เพียวริคุ กล้วย", unitsSold: 12, revenue: 100.0, percent: "4%" },
    { name: "เพียวริคุ ปลาดอลลี่", unitsSold: 0, revenue: 0.0, percent: "0%" },
  ];

  const data = products.length > 0 ? products : defaultProducts;

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-900 text-[14px] font-bold">
          <tr>
            <th className="px-6 py-3">Product Name</th>
            <th className="px-6 py-3">Units Sold</th>
            <th className="px-6 py-3">Revenue</th>
            <th className="px-6 py-3">% of Total</th>
          </tr>
        </thead>
        <tbody className="text-slate-700 text-[14px] font-medium">
          {data.map((item, idx) => (
            <tr
              key={idx}
              className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <td className="px-6 py-3">{item.name}</td>
              <td className="px-6 py-3">{item.unitsSold}</td>
              <td className="px-6 py-3">{item.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td className="px-6 py-3">{item.percent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RevenueTable;
