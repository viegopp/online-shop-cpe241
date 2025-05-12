const OrderItems = ({ items = [], shipping = 0, discountRate = 10}) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discount = +(subtotal * (discountRate/100)).toFixed(2);
    const total = +(subtotal + shipping - discount).toFixed(2);
  
    return (
      <div className="w-full rounded-lg border border-slate-200 bg-white p-6 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-slate-900">Order Items</h2>
        <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
                <tr className="text-left text-sm text-slate-500 bg-slate-50">
                    <th className="px-4 py-2">Product ID</th>
                    <th className="px-4 py-2">Product Name</th>
                    <th className="px-4 py-2 text-right">Unit Price</th>
                    <th className="px-4 py-2 text-right">Quantity</th>
                    <th className="px-4 py-2 text-right">Total</th>
                </tr>
            </thead>  
            <tbody className="text-slate-700 text-sm">
            {items.map((item, index) => (
                <tr
                    key={index}
                    className="bg-white border border-slate-200 rounded-md"
                >
                    <td className="px-4 py-2">{item.id}</td>
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2 text-right">{item.unitPrice.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">{item.quantity}</td>
                    <td className="px-4 py-2 text-right">{item.total.toFixed(2)}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
        <div className="flex flex-col gap-1 text-sm text-slate-700 mt-2 w-full">
            <div className="flex justify-between w-full">
                <span className="text-left">Subtotal</span>
                <span className="text-right">{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-full">
                <span className="text-left">Shipping Free</span>
                <span className="text-right">{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-full">
                <span className="text-left">Discount {discountRate}%</span>
                <span className="text-right">{discount.toFixed(2)}</span>
            </div>
            <hr className="w-full border-t border-slate-200 my-2" />
            <div className="flex justify-between w-full font-semibold text-base">
                <span className="text-left">Total</span>
                <span className="text-right">{total.toFixed(2)}</span>
            </div>
        </div>
      </div>
    );
  };
  
  export default OrderItems;