import { useState } from "react"
import { Calendar, Plus, Trash2 } from "lucide-react"
import MainLayout from "../../components/layouts/MainLayout"
import FlashSalePopup from "../../components/FlashSalePopup"

const FlashSalesAdd = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [currentFlashSale, setCurrentFlashSale] = useState({
    id: "15",
    promotionName: "สุดหล่อมาแย้วววว",
    discountPercent: 20,
    period: "2024-06-01 to 2024-06-10",
    status: true,
    products: [
      {
        id: "P001",
        name: "Product 1",
        price: 100,
        promotionPrice: 80,
        image: "",
      },
      {
        id: "P002",
        name: "Product 2",
        price: 200,
        promotionPrice: 160,
        image: "",
      },
    ],
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentFlashSale((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleToggleStatus = () => {
    setCurrentFlashSale((prev) => ({
      ...prev,
      status: !prev.status,
    }))
  }

  const handleRemoveProduct = (index) => {
    setCurrentFlashSale((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }))
  }

  const handleAddProduct = () => {
    // This would typically open another modal to select products
    alert("Add product functionality would be implemented here")
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false)
  }

  const handleSaveFlashSale = () => {
    // Save logic here
    setIsPopupOpen(false)
    alert("Flash sale saved!")
  }

  const breadcrumbItems = [
    { label: "Home", path: "/admin/dashboard" },
    { label: "Flash Sales", path: "/admin/flash-sales" },
    { label: "Edit Flash Sale", path: "/admin/flash-sales/Edit-Flash-Sales" },
  ]

  return (
    <MainLayout title="Flash Sales" breadcrumbItems={breadcrumbItems}>
      {/* Flash Sale Form */}
      <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
        <div className="p-6">
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Flash sales</label>
              <input
                type="text"
                name="id"
                value={currentFlashSale.id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Promotions Name</label>
              <input
                type="text"
                name="promotionName"
                value={currentFlashSale.promotionName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount percent</label>
              <div className="relative">
                <input
                  type="text"
                  name="discountPercent"
                  value={currentFlashSale.discountPercent}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md pr-8"
                />
                <span className="absolute right-3 top-2 text-gray-500">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
              <div className="relative">
                <input
                  type="text"
                  name="period"
                  value={currentFlashSale.period}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md pr-10"
                  readOnly
                />
                <button className="absolute right-2 top-2 text-gray-400">
                  <Calendar size={18} />
                </button>
              </div>
            </div>
          </div>
          {/* Status Toggle */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm font-medium text-gray-700">Status</div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={currentFlashSale.status}
                onChange={handleToggleStatus}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                {currentFlashSale.status ? "ON" : "OFF"}
              </span>
            </label>
          </div>
          {/* Products Table */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Items in this promotion</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Promotion Price
                    </th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentFlashSale.products.map((product, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="h-16 w-12 object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.promotionPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveProduct(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Footer Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleAddProduct}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus size={16} className="mr-2" /> Add Product
            </button>
            <div className="space-x-2">
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => alert("Flash sale saved!")}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-700 hover:bg-slate-800"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Flash Sale Popup */}
      <FlashSalePopup isOpen={isPopupOpen} onClose={handleClosePopup} onSave={handleSaveFlashSale} />
    </MainLayout>
  )
}

export default FlashSalesAdd
