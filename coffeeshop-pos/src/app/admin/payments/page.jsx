"use client"

import { useState } from "react"
import { Calendar, CreditCard, Download, Eye, Filter, MoreHorizontal, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Dữ liệu mẫu cho thanh toán
const initialPayments = [
  {
    id: "PAY-001",
    date: "2023-05-15 14:30",
    orderId: "ORD-001",
    customer: "Nguyễn Văn A",
    amount: 75000,
    method: "Tiền mặt",
    status: "Thành công",
  },
  {
    id: "PAY-002",
    date: "2023-05-15 15:45",
    orderId: "ORD-002",
    customer: "Trần Thị B",
    amount: 120000,
    method: "Thẻ ngân hàng",
    status: "Thành công",
  },
  {
    id: "PAY-003",
    date: "2023-05-15 16:20",
    orderId: "ORD-003",
    customer: "Lê Văn C",
    amount: 65000,
    method: "Ví điện tử",
    status: "Thành công",
  },
  {
    id: "PAY-004",
    date: "2023-05-15 17:10",
    orderId: "ORD-004",
    customer: "Phạm Thị D",
    amount: 90000,
    method: "Tiền mặt",
    status: "Thành công",
  },
  {
    id: "PAY-005",
    date: "2023-05-16 09:15",
    orderId: "ORD-005",
    customer: "Hoàng Văn E",
    amount: 110000,
    method: "Thẻ ngân hàng",
    status: "Thành công",
  },
  {
    id: "PAY-006",
    date: "2023-05-16 10:30",
    orderId: "ORD-006",
    customer: "Ngô Thị F",
    amount: 70000,
    method: "Tiền mặt",
    status: "Thành công",
  },
  {
    id: "PAY-007",
    date: "2023-05-16 11:45",
    orderId: "ORD-007",
    customer: "Đỗ Văn G",
    amount: 85000,
    method: "Ví điện tử",
    status: "Thành công",
  },
  {
    id: "PAY-008",
    date: "2023-05-16 13:20",
    orderId: "ORD-008",
    customer: "Vũ Thị H",
    amount: 95000,
    method: "Thẻ ngân hàng",
    status: "Thành công",
  },
]

export default function PaymentsPage() {
  const [payments, setPayments] = useState(initialPayments)
  const [searchTerm, setSearchTerm] = useState("")
  const [methodFilter, setMethodFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentPayment, setCurrentPayment] = useState(null)

  // Lọc thanh toán theo từ khóa tìm kiếm, phương thức và ngày
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesMethod = methodFilter === "all" || payment.method === methodFilter

    // Lọc theo ngày (đơn giản hóa cho demo)
    const matchesDate = dateFilter === "all" || payment.date.includes(dateFilter)

    return matchesSearch && matchesMethod && matchesDate
  })

  // Tính tổng doanh thu từ các thanh toán đã lọc
  const totalRevenue = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0)

  // Lấy danh sách các phương thức thanh toán duy nhất
  const paymentMethods = ["all", ...Array.from(new Set(payments.map((payment) => payment.method)))]

  // Hiển thị màu sắc dựa trên phương thức thanh toán
  const getPaymentMethodColor = (method) => {
    switch (method) {
      case "Tiền mặt":
        return "bg-green-100 text-green-800"
      case "Thẻ ngân hàng":
        return "bg-blue-100 text-blue-800"
      case "Ví điện tử":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex-1 space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý thanh toán</h2>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => {
            // Xử lý xuất báo cáo
            alert("Đang xuất báo cáo...")
          }}
        >
          <Download className="h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng doanh thu</p>
                <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} VNĐ</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tiền mặt</p>
                <p className="text-2xl font-bold">
                  {payments
                    .filter((p) => p.method === "Tiền mặt")
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()}{" "}
                  VNĐ
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Thẻ ngân hàng</p>
                <p className="text-2xl font-bold">
                  {payments
                    .filter((p) => p.method === "Thẻ ngân hàng")
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()}{" "}
                  VNĐ
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ví điện tử</p>
                <p className="text-2xl font-bold">
                  {payments
                    .filter((p) => p.method === "Ví điện tử")
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()}{" "}
                  VNĐ
                </p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lịch sử thanh toán</CardTitle>
          <CardDescription>Xem và quản lý tất cả các giao dịch thanh toán</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={methodFilter} onValueChange={setMethodFilter}>
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList className="flex-wrap">
                {paymentMethods.map((method) => (
                  <TabsTrigger key={method} value={method}>
                    {method === "all" ? "Tất cả" : method}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm thanh toán..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-[200px]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Lọc theo ngày" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả ngày</SelectItem>
                      <SelectItem value="2023-05-15">15/05/2023</SelectItem>
                      <SelectItem value="2023-05-16">16/05/2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <TabsContent value={methodFilter} className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã thanh toán</TableHead>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Mã đơn hàng</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Số tiền (VNĐ)</TableHead>
                      <TableHead>Phương thức</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          Không tìm thấy giao dịch thanh toán nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {payment.date}
                            </div>
                          </TableCell>
                          <TableCell>{payment.orderId}</TableCell>
                          <TableCell>{payment.customer}</TableCell>
                          <TableCell>{payment.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentMethodColor(
                                payment.method,
                              )}`}
                            >
                              {payment.method}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                payment.status === "Thành công"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {payment.status}
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
                                    setCurrentPayment(payment)
                                    setIsViewDialogOpen(true)
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    // Xử lý in hóa đơn
                                    alert(`Đang in hóa đơn cho ${payment.id}...`)
                                  }}
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Xuất hóa đơn
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog xem chi tiết thanh toán */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chi tiết thanh toán</DialogTitle>
            <DialogDescription>Thông tin chi tiết về giao dịch thanh toán</DialogDescription>
          </DialogHeader>
          {currentPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mã thanh toán</p>
                  <p className="font-medium">{currentPayment.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ngày</p>
                  <p>{currentPayment.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mã đơn hàng</p>
                  <p>{currentPayment.orderId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Khách hàng</p>
                  <p>{currentPayment.customer}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phương thức</p>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentMethodColor(
                      currentPayment.method,
                    )}`}
                  >
                    {currentPayment.method}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      currentPayment.status === "Thành công" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {currentPayment.status}
                  </span>
                </div>
              </div>

              <div className="rounded-md bg-muted/50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Chi tiết đơn hàng</p>
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                    <Eye className="h-3 w-3" />
                    Xem đơn hàng
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tổng tiền hàng:</span>
                    <span>{(currentPayment.amount * 0.9).toLocaleString()} VNĐ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuế (10%):</span>
                    <span>{(currentPayment.amount * 0.1).toLocaleString()} VNĐ</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-lg font-bold">
                    <span>Tổng thanh toán:</span>
                    <span>{currentPayment.amount.toLocaleString()} VNĐ</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    // Xử lý in hóa đơn
                    alert(`Đang xuất hóa đơn cho ${currentPayment.id}...`)
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Xuất hóa đơn
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
