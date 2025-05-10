"use client"

import { useState } from "react"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHead, TableRow } from "lucide-react"
import { Button } from "frontend/src/components/common/Button"
import { Badge } from "frontend/src/components/common/Badge"

const FlashSalesTable = ({ initialData = [] }) => {
  const [flashSales, setFlashSales] = useState(initialData)

  const formatDate = (date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const month = months[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()
    return `${month} ${day},${year}`
  }

  const handleDelete = (id) => {
    setFlashSales(flashSales.filter((sale) => sale.id !== id))
  }

  return (
    <div className="w-full overflow-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[80px] font-semibold">ID</TableHead>
            <TableHead className="font-semibold">Promotions Name</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Start</TableHead>
            <TableHead className="font-semibold">End</TableHead>
            <TableHead className="font-semibold">Product</TableHead>
            <TableHead className="w-[100px] text-right font-semibold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flashSales.map((sale) => (
            <TableRow key={sale.id} className="border-t border-dashed">
              <TableCell className="font-medium">{sale.id}</TableCell>
              <TableCell>{sale.promotionName}</TableCell>
              <TableCell>
                <Badge
                  variant={sale.status === "Active" ? "success" : "destructive"}
                  className={`
                    ${
                      sale.status === "Active"
                        ? "bg-green-100 text-green-600 hover:bg-green-100 hover:text-green-600"
                        : "bg-red-100 text-red-600 hover:bg-red-100 hover:text-red-600"
                    }
                  `}
                >
                  {sale.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(sale.startDate)}</TableCell>
              <TableCell>{formatDate(sale.endDate)}</TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  {sale.products.map((product, index) => (
                    <div
                      key={index}
                      className={`
                        relative h-[60px] w-[30px] overflow-hidden rounded-md border
                        ${index === sale.products.length - 1 ? "bg-black/10" : ""}
                      `}
                    >
                      <img
                        src={product || "/placeholder.svg"}
                        alt={`Product ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(sale.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default FlashSalesTable
