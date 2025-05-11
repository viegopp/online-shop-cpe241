import { useState } from "react"
import { Search, Filter } from "lucide-react"
import Button from "../../components/common/Button"
import MainLayout from "../../components/layouts/MainLayout"
import FlashSalesTable from "../../components/tables/FlashSalesTable";
import Input from "../../components/common/Input"

function FlashSalesListPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const totalItems = 1000
  const itemsPerPage = 3
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Sample data matching the screenshot
  const flashSalesData = [
    {
      id: 42,
      promotionName: "พี่แฮมสั่งลด",
      status: "Active",
      startDate: new Date("2050-03-01"),
      endDate: new Date("2050-03-16"),
      products: [
        "/placeholder.svg?height=60&width=30",
        "/placeholder.svg?height=60&width=30",
        "/placeholder.svg?height=60&width=30",
      ],
    },
    {
      id: 23,
      promotionName: "พี่แฮมถูกหวย",
      status: "Expired",
      startDate: new Date("2050-02-16"),
      endDate: new Date("2050-02-16"),
      products: [
        "/placeholder.svg?height=60&width=30",
        "/placeholder.svg?height=60&width=30",
        "/placeholder.svg?height=60&width=30",
      ],
    },
    {
      id: 156,
      promotionName: "เพียวริคุสักหน่อยมั้ย",
      status: "Expired",
      startDate: new Date("2050-01-21"),
      endDate: new Date("2050-01-31"),
      products: [
        "/placeholder.svg?height=60&width=30",
        "/placeholder.svg?height=60&width=30",
        "/placeholder.svg?height=60&width=30",
      ],
    },
  ]

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleAddFlashSale = () => {
    // Implement add flash sale functionality
    console.log("Add flash sale clicked")
  }

  const handleFilter = () => {
    // Implement filter functionality
    console.log("Filter clicked")
  }

  // Breadcrumb items for the Flash Sales page
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Flash Sales", href: "/flash-sales" },
  ]

  return (
    <MainLayout title="Flash Sales" breadcrumbItems={breadcrumbItems}>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search Promotions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleFilter}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button size="sm" onClick={handleAddFlashSale}>
              Add Flash Sale
            </Button>
          </div>
        </div>

        <FlashSalesTable initialData={flashSalesData} />

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
            {totalItems}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
export default FlashSalesListPage