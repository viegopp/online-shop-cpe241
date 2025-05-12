import { useState } from "react";

const OrderDetailHeader = ({ orderId = "000000", currentStatus = "Pending" }) => {
  const [status, setStatus] = useState(currentStatus);
  const [newStatus, setNewStatus] = useState(currentStatus);

  const handleUpdate = () => {
    setStatus(newStatus); // Update the current status display
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-cyan-100 text-cyan-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusClass = statusColors[status.toLowerCase()] || "bg-slate-100 text-slate-800";

  return (
    <div className="w-full mx-auto h-6.5 flex justify-between items-center">
      <h1 className="text-lg font-semibold text-slate-900">
        Order #{orderId} Details
      </h1>

      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusClass}`}>
          {status}
        </span>

        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="text-sm px-3 py-2 border border-slate-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <button
          onClick={handleUpdate}
          className="bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-md"
        >
          Update Status
        </button>
      </div>
    </div>
  );
};

export default OrderDetailHeader;
