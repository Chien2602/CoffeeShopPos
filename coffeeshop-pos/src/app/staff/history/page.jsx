"use client"

import { useState } from "react"
import {
  Calendar,
  Eye,
  Filter,
  MoreHorizontal,
  Printer,
  Search,
  Download,
  BarChart,
  PieChart,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PrintInvoice } from "@/components/print-invoice"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useEffect } from "react"
import { toast } from "@/components/ui/use-toast"

export default function HistoryPage() {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState(null)
  const [viewMode, setViewMode] = useState("list")
  const [customer, setCustomer] = useState(null)
  const [table, setTable] = useState(null)
  const [products, setProducts] = useState(null)
  const [cart, setCart] = useState([])
  const token = sessionStorage.getItem("authToken");
  const decodedToken = JSON.parse(atob(token.split('.')[1]))
  const employeeId = decodedToken.id

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:3001/orders/employee/${employeeId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }
        const data = await response.json()
        console.log(data)
        const ordersArray = data.data || []
        setOrders(Array.isArray(ordersArray) ? ordersArray : [])
      } catch (error) {
        console.error('Error fetching orders:', error)
        setOrders([])
      }
    }
    fetchOrders()
  }, [token, employeeId])

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customers = await Promise.all(
          orders.map(order =>
            fetch(`http://localhost:3001/customers/${order.customerId._id}`, {
              headers: { "Authorization": `Bearer ${token}` }
            }).then(res => res.json())
          )
        )
        setCustomer(customers)
      } catch (error) {
        console.error('Error fetching customers:', error)
        setCustomer([])
      }
    }
    fetchCustomers()
  }, [token, orders])

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const tables = await Promise.all(
          orders.map(order =>
            fetch(`http://localhost:3001/tables/${order.tableId._id}`, {
              headers: { "Authorization": `Bearer ${token}` }
            })
              .then(res => {
                // console.log('Fetch response:', res.json());
                return res.json();
              })
          )
        );
        setTable(tables);
      } catch (error) {
        console.error('Error fetching tables:', error);
        setTable([]);
      }
    };
    if (orders.length > 0 && token) {
      fetchTables();
    }
  }, [token, orders]);
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Get all unique product IDs from all orders
        const allProductIds = [...new Set(orders.flatMap(order => order.items || []))]
        console.log(allProductIds)
        // Fetch product details for each unique product ID
        const products = await Promise.all(
          allProductIds.map(async productId => {
            try {
              const response = await fetch(`http://localhost:3001/products/${productId}`)
              if (!response.ok) {
                return {
                  _id: productId,
                  title: 'Sản phẩm không tồn tại',
                  price: 0
                }
              }
              const data = await response.json()
              console.log(data)
              return response.json()
            } catch (error) {
              console.error(`Error fetching product ${productId}:`, error)
              return {
                _id: productId,
                title: 'Sản phẩm không tồn tại',
                price: 0
              }
            }
          })
        )
        setProducts(products)
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      }
    }
    fetchProducts()
  }, [token, orders])

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Lọc đơn hàng theo từ khóa tìm kiếm, ngày và phương thức thanh toán
  const filteredOrders = orders?.filter((order) => {
    if (!order) return false;

    const matchesSearch =
      (order._id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.customerId?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.tableId?.tableNumber?.toString() || '').includes(searchTerm.toLowerCase())

    const matchesDate = dateFilter === "all" || (order.createdAt || '').includes(dateFilter)

    const matchesPayment = paymentFilter === "all" || order.paymentMethod === paymentFilter

    return matchesSearch && matchesDate && matchesPayment
  }) || []

  // Tính tổng doanh thu từ các đơn hàng đã lọc
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)

  // Tính thuế (10%)
  const totalTax = totalRevenue * 0.1

  // Tính tổng tiền hàng (chưa bao gồm thuế)
  const totalSubtotal = totalRevenue - totalTax

  // Dữ liệu cho hóa đơn
  const getInvoiceData = (order) => {
    return {
      orderNumber: order._id || '',
      date: formatDate(order.createdAt) || '',
      table: table?.find(t => t._id === order.tableId)?.tableNumber || 'N/A',
      staff: order.employeeId?.name || 'N/A',
      customer: { 
        name: customer?.find(c => c._id === order.customerId)?.name || 'N/A'
      },
      items: order.items?.map(productId => {
        const product = products?.find(p => p._id === productId)
        return {
          name: product?.title || 'N/A',
          quantity: 1,
          price: product?.price || 0
        }
      }) || [],
      subtotal: ((order.totalAmount || 0) - (order.totalAmount || 0) * 0.1) || 0,
      tax: ((order.totalAmount || 0) * 0.1) || 0,
      total: order.totalAmount || 0,
      paymentMethod: order.paymentMethod || 'N/A',
    }
  }

  // Lấy danh sách các phương thức thanh toán duy nhất
  const paymentMethods = ["all", ...Array.from(new Set(orders.map((order) => order.paymentMethod)))]

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

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id)
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item,
        ),
      )
    } else {
      setCart([...cart, { 
        _id: product._id,
        productId: product._id, // Thêm productId để đảm bảo khi tạo order
        title: product.title,
        price: product.price,
        quantity: 1,
        total: product.price,
        thumbnail: product.thumbnail
      }])
    }
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: product.title,
    })
  }

  return (
    <div className="flex-1 space-y-6 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-800">Lịch sử đơn hàng</h2>
          <p className="mt-1 text-gray-500">Xem và quản lý lịch sử các đơn hàng đã hoàn thành</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className={`border-gray-200 ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
            onClick={() => setViewMode("list")}
          >
            <BarChart className="mr-2 h-4 w-4 text-blue-600" />
            Danh sách
          </Button>
          <Button
            variant="outline"
            className={`border-gray-200 ${viewMode === "stats" ? "bg-white shadow-sm" : ""}`}
            onClick={() => setViewMode("stats")}
          >
            <PieChart className="mr-2 h-4 w-4 text-blue-600" />
            Thống kê
          </Button>
          <Button
            variant="outline"
            className="border-gray-200"
            onClick={() => {
              // Xử lý xuất báo cáo
              alert("Đang xuất báo cáo...")
            }}
          >
            <Download className="mr-2 h-4 w-4 text-blue-600" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Tổng doanh thu</p>
                <p className="mt-1 text-3xl font-bold text-blue-600">{totalRevenue.toLocaleString()} đ</p>
                <p className="mt-1 text-xs text-gray-400">
                  {filteredOrders.length} đơn hàng • {dateFilter === "all" ? "Tất cả ngày" : dateFilter}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Tổng tiền hàng</p>
                <p className="mt-1 text-3xl font-bold text-green-600">{totalSubtotal.toLocaleString()} đ</p>
                <p className="mt-1 text-xs text-gray-400">Chưa bao gồm thuế</p>
              </div>
              <div className="rounded-full bg-green-100 p-3 text-green-600">
                <BarChart className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Tổng thuế</p>
                <p className="mt-1 text-3xl font-bold text-purple-600">{totalTax.toLocaleString()} đ</p>
                <p className="mt-1 text-xs text-gray-400">Thuế VAT (10%)</p>
              </div>
              <div className="rounded-full bg-purple-100 p-3 text-purple-600">
                <PieChart className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {viewMode === "list" ? (
        <Card className="border-0 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Danh sách đơn hàng</CardTitle>
            <CardDescription>Xem lịch sử các đơn hàng đã hoàn thành</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2">
                <Search className="h-4 w-4 text-blue-500" />
                <Input
                  placeholder="Tìm kiếm đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="border-none shadow-none focus:ring-0">
                      <SelectValue placeholder="Lọc theo ngày" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả ngày</SelectItem>
                      <SelectItem value="2023-05-15">15/05/2023</SelectItem>
                      <SelectItem value="2023-05-16">16/05/2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2">
                  <Filter className="h-4 w-4 text-blue-500" />
                  <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                    <SelectTrigger className="border-none shadow-none focus:ring-0">
                      <SelectValue placeholder="Phương thức thanh toán" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method === "all" ? "Tất cả phương thức" : method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-100">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Mã đơn hàng</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Bàn</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Tổng tiền (VNĐ)</TableHead>
                    <TableHead>Thanh toán</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <Search className="mb-2 h-8 w-8 text-gray-300" />
                          <p className="font-medium">Không tìm thấy đơn hàng nào</p>
                          <p className="mt-1 text-sm">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order._id} className="hover:bg-blue-50">
                        <TableCell className="font-medium text-blue-600">{order._id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {formatDate(order.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>{order.tableId?.tableNumber || 'N/A'}</TableCell>
                        <TableCell>{order.customerId?.name || 'N/A'}</TableCell>
                        <TableCell className="font-medium">{(order.totalAmount || 0).toLocaleString()} đ</TableCell>
                        <TableCell>
                          <Badge className={`${getPaymentMethodColor(order.paymentMethod)}`}>
                            {order.paymentMethod}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
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
                              <DropdownMenuItem
                                onClick={() => {
                                  setCurrentOrder(order)
                                  setIsPrintDialogOpen(true)
                                }}
                              >
                                <Printer className="mr-2 h-4 w-4" />
                                In hóa đơn
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
          <CardFooter className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-3">
            <div className="text-sm text-gray-500">
              Hiển thị {filteredOrders.length} trong tổng số {orders.length} đơn hàng
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 border-gray-200">
                Trước
              </Button>
              <Button variant="outline" size="sm" className="h-8 border-gray-200">
                Tiếp
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card className="border-0 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Thống kê đơn hàng</CardTitle>
            <CardDescription>Phân tích doanh thu và đơn hàng theo thời gian</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="revenue">
              <TabsList className="w-full justify-start gap-1 bg-gray-100/80 p-1">
                <TabsTrigger
                  value="revenue"
                  className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white"
                >
                  Doanh thu
                </TabsTrigger>
                <TabsTrigger
                  value="payment"
                  className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white"
                >
                  Phương thức thanh toán
                </TabsTrigger>
                <TabsTrigger
                  value="products"
                  className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white"
                >
                  Sản phẩm bán chạy
                </TabsTrigger>
              </TabsList>

              <TabsContent value="revenue" className="mt-4">
                <div className="rounded-lg border border-gray-100 bg-white p-6">
                  <div className="mb-4 text-center">
                    <h3 className="text-lg font-medium text-gray-800">Biểu đồ doanh thu</h3>
                    <p className="text-sm text-gray-500">Doanh thu theo thời gian</p>
                  </div>
                  <div className="flex h-64 items-center justify-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <BarChart className="mb-2 h-12 w-12 text-gray-300" />
                      <p className="font-medium">Biểu đồ doanh thu</p>
                      <p className="mt-1 text-sm">Dữ liệu thống kê sẽ hiển thị ở đây</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payment" className="mt-4">
                <div className="rounded-lg border border-gray-100 bg-white p-6">
                  <div className="mb-4 text-center">
                    <h3 className="text-lg font-medium text-gray-800">Phương thức thanh toán</h3>
                    <p className="text-sm text-gray-500">Tỷ lệ các phương thức thanh toán được sử dụng</p>
                  </div>
                  <div className="flex h-64 items-center justify-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <PieChart className="mb-2 h-12 w-12 text-gray-300" />
                      <p className="font-medium">Biểu đồ phương thức thanh toán</p>
                      <p className="mt-1 text-sm">Dữ liệu thống kê sẽ hiển thị ở đây</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="products" className="mt-4">
                <div className="rounded-lg border border-gray-100 bg-white p-6">
                  <div className="mb-4 text-center">
                    <h3 className="text-lg font-medium text-gray-800">Sản phẩm bán chạy</h3>
                    <p className="text-sm text-gray-500">Top sản phẩm được bán nhiều nhất</p>
                  </div>
                  <div className="flex h-64 items-center justify-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <BarChart className="mb-2 h-12 w-12 text-gray-300" />
                      <p className="font-medium">Biểu đồ sản phẩm bán chạy</p>
                      <p className="mt-1 text-sm">Dữ liệu thống kê sẽ hiển thị ở đây</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Dialog xem chi tiết đơn hàng */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-800">Chi tiết đơn hàng</DialogTitle>
            <DialogDescription>Thông tin chi tiết về đơn hàng</DialogDescription>
          </DialogHeader>
          {currentOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Mã đơn hàng</p>
                  <p className="font-medium text-gray-800">{currentOrder._id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Ngày</p>
                  <p className="text-gray-800">{formatDate(currentOrder.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Bàn</p>
                  <p className="text-gray-800">{currentOrder.tableId?.tableNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Khách hàng</p>
                  <p className="text-gray-800">{currentOrder.customerId?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phương thức thanh toán</p>
                  <Badge className={`${getPaymentMethodColor(currentOrder.paymentMethod)}`}>
                    {currentOrder.paymentMethod}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">Các sản phẩm</p>
                <div className="rounded-lg border border-gray-100">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead className="text-right">SL</TableHead>
                        <TableHead className="text-right">Đơn giá</TableHead>
                        <TableHead className="text-right">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentOrder.items?.map((item, index) => {
                        const product = products?.find(p => p._id === item.productId)
                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item?.title || 'N/A'}</TableCell>
                            <TableCell className="text-right">{item.quantity || 1}</TableCell>
                            <TableCell className="text-right">{(item.price || 0).toLocaleString()} đ</TableCell>
                            <TableCell className="text-right font-medium">
                              {(item.total || 0).toLocaleString()} đ
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-between rounded-lg bg-blue-50 p-4 text-blue-800">
                <p className="font-medium">Tổng cộng:</p>
                <p className="text-lg font-bold">{(currentOrder.totalAmount || 0).toLocaleString()} đ</p>
              </div>

              <div className="flex justify-end">
                <Button
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    setIsPrintDialogOpen(true)
                  }}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  In hóa đơn
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog in hóa đơn */}
      {currentOrder && (
        <PrintInvoice
          open={isPrintDialogOpen}
          onOpenChange={setIsPrintDialogOpen}
          orderData={getInvoiceData(currentOrder)}
        />
      )}
    </div>
  )
}
