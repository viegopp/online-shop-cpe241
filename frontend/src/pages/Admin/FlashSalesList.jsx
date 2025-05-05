"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import FlashSalesTable from "../../components/tables/FalshSalesTable"
import MainLayout from "../../components/layouts/MainLayout"

const FlashSalesList = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [flashSales, setFlashSales] = useState([
    {
      id: "15",
      promotionName: "พี่แฮมสั่งลด",
      discountPercent: "30",
      period: "Mar 16, 2050 00:00:00 AM - Mar 31, 2050 23:59:59 PM",
      status: true,
      productsCount: 3,
    },
    {
      id: "14",
      promotionName: "พี่แฮมถูกหวย",
      discountPercent: "25",
      period: "Jun 1, 2050 00:00:00 AM - Jun 30, 2050 23:59:59 PM",
      status: false,
      productsCount: 5,
    },
    {
      id: "13",
      promotionName: "เพียวริคุสักหน่อยมั้ย",
      discountPercent: "40",
      period: "Dec 1, 2050 00:00:00 AM - Dec 31, 2050 23:59:59 PM",
      status: false,
      productsCount: 8,
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handleOpenPopup = () => {
    setIsPopupOpen(true)
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false)
  }

  const handleSaveFlashSale = (flashSale) => {
    setFlashSales([
      ...flashSales,
      {
        ...flashSale,
        productsCount: flashSale.products.length,
      },
    ])
    setIsPopupOpen(false)
  }

  const handleDeleteFlashSale = (id) => {
    if (confirm("Are you sure you want to delete this flash sale?")) {
      setFlashSales(flashSales.filter((sale) => sale.id !== id))
    }
  }

  const filteredFlashSales = flashSales.filter(
    (sale) => sale.promotionName.toLowerCase().includes(searchTerm.toLowerCase()) || sale.id.includes(searchTerm),
  )

  const breadcrumbItems = [
    { label: "Home", path: "/admin/dashboard" },
    { label: "Flash Sales", path: "#" },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ${sidebarCollapsed ? "ml-[80px]" : "ml-[280px]"} transition-all duration-300`}
      >
        {/* Top Bar */}
        <Topbar
          isSidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          onUserMenuToggle={() => console.log("User menu toggled")}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs */}
            <Breadcrumbs items={breadcrumbItems} title="Flash Sales" />

            {/* Search and Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 mt-6">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search flash sales..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              <button
                onClick={handleOpenPopup}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Add Flash Sale
              </button>
            </div>

            {/* Flash Sales Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Promotion Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Discount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Products
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFlashSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {sale.promotionName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.discountPercent}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.period}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.productsCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              sale.status ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {sale.status ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <a
                              href={`/admin/flash-sales/edit/${sale.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit size={18} />
                            </a>
                            <button
                              onClick={() => handleDeleteFlashSale(sale.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredFlashSales.length === 0 && (
                <div className="text-center py-6 text-gray-500">No flash sales found</div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Flash Sale Popup */}
      <FlashSalePopup isOpen={isPopupOpen} onClose={handleClosePopup} onSave={handleSaveFlashSale} />
    </div>
  )
}

export default FlashSalesList


