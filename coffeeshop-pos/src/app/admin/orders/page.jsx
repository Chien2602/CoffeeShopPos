"use client"

import { useState } from "react"
import { Calendar, Eye, Filter, MoreHorizontal, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Dữ liệu mẫu cho đơn hàng
const initialOrders = [
  {
    id: "ORD-001",
    date: "2023-05-15 14:30",
    customer: "Nguyễn Văn A",
    total: 75000,
    status: "Hoàn thành",
    items: [
      { name: "Cà phê đen", quantity: 1, price: 25000 },
      { name: "Trà sữa trân châu", quantity: 1, price: 35000 },
      { name: "Bánh ngọt", quantity: 1, price: 15000 },
    ],
  },
  {
    id: "ORD-002",
    date: "2023-05-15 15:45",
    customer: "Trần Thị B",
    total: 120000,
    status: "Hoàn thành",
    items: [
      { name: "Sinh tố xoài", quantity: 2, price: 45000 },
      { name: "Nước ép cam", quantity: 1, price: 40000 },
      { name: "Bánh mì", quantity: 1, price: 20000 },
    ],
  },
  {
    id: "ORD-003",
    date: "2023-05-15 16:20",
    customer: "Lê Văn C",
    total: 65000,
    status: "Hoàn thành",
    items: [
      { name: "Cà phê sữa", quantity: 1, price: 30000 },
      { name: "Trà đào", quantity: 1, price: 35000 },
    ],
  },
  {
    id: "ORD-004",
    date: "2023-05-15 17:10",
    customer: "Phạm Thị D",
    total: 90000,
    status: "Hoàn thành",
    items: [
      { name: "Trà sữa matcha", quantity: 2, price: 35000 },
      { name: "Bánh quy", quantity: 1, price: 20000 },
    ],
  },
  {
    id: "ORD-005",
    date: "2023-05-16 09:15",
    customer: "Hoàng Văn E",
    total: 110000,
    status: "Hoàn thành",
    items: [
      { name: "Nước ép táo", quantity: 1, price: 40000 },
      { name: "Sinh tố dâu", quantity: 1, price: 45000 },
      { name: "Bánh ngọt", quantity: 1, price: 25000 },
    ],
  },
  {
    id: "ORD-006",
    date: "2023-05-16 10:30",
    customer: "Ngô Thị F",
    total: 70000,
    status: "Hoàn thành",
    items: [
      { name: "Cà phê sữa", quantity: 1, price: 30000 },
      { name: "Bánh mì", quantity: 2, price: 20000 },
    ],
  },
  {
    id: "ORD-007",
    date: "2023-05-16 11:45",
    customer: "Đỗ Văn G",
    total: 85000,
    status: "Hoàn thành",
    items: [
      { name: "Trà sữa trân châu", quantity: 1, price: 35000 },
      { name: "Nước ép cam", quantity: 1, price: 40000 },
      { name: "Bánh quy", quantity: 1, price: 10000 },
    ],
  },
  {
    id: "ORD-008",
    date: "2023-05-16 13:20",
    customer: "Vũ Thị H",
    total: 95000,
    status: "Hoàn thành",
    items: [
      { name: "Sinh tố xoài", quantity: 1, price: 45000 },
      { name: "Cà phê đen", quantity: 2, price: 25000 },
    ],
  },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState(null)

  // Lọc đơn hàng theo từ khóa tìm kiếm và trạng thái
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex-1 space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lịch sử đơn hàng</CardTitle>
          <CardDescription>Xem và quản lý tất cả các đơn hàng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm đơn hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                  <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                  <SelectItem value="Đã hủy">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn hàng</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Tổng tiền (VNĐ)</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Không tìm thấy đơn hàng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {order.date}
                        </div>
                      </TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            order.status === "Hoàn thành"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Đang xử lý"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Mở menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentOrder(order)
                                setIsViewDialogOpen(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog xem chi tiết đơn hàng */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
            <DialogDescription>Thông tin chi tiết về đơn hàng</DialogDescription>
          </DialogHeader>
          {currentOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mã đơn hàng</p>
                  <p className="font-medium">{currentOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ngày</p>
                  <p>{currentOrder.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Khách hàng</p>
                  <p>{currentOrder.customer}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      currentOrder.status === "Hoàn thành"
                        ? "bg-green-100 text-green-800"
                        : currentOrder.status === "Đang xử lý"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {currentOrder.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">Các sản phẩm</p>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead className="text-right">SL</TableHead>
                        <TableHead className="text-right">Đơn giá</TableHead>
                        <TableHead className="text-right">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{item.price.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{(item.quantity * item.price).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-between border-t pt-4">
                <p className="font-medium">Tổng cộng:</p>
                <p className="font-bold">{currentOrder.total.toLocaleString()} VNĐ</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
