"use client"

import { useState, useEffect } from "react"
import { Calendar, Eye, Filter, MoreHorizontal, Search, CheckCircle2, Clock, AlertCircle, User, Table as TableIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// API endpoints
const API_URL = "http://localhost:3001"
const token = sessionStorage.getItem("authToken")

// API functions
const fetchOrders = async () => {
  const response = await fetch(`${API_URL}/orders`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  if (!response.ok) {
    throw new Error('Failed to fetch orders')
  }
  const result = await response.json()
  return result.data || []
}

const fetchCustomer = async (customerId) => {
  if (!customerId || typeof customerId === 'object') return null
  const response = await fetch(`${API_URL}/customers/${customerId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  if (!response.ok) {
    console.error('Failed to fetch customer:', customerId)
    return null
  }
  const result = await response.json()
  return result
}

const fetchTable = async (tableId) => {
  if (!tableId || typeof tableId === 'object') return null
  const response = await fetch(`${API_URL}/tables/${tableId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  if (!response.ok) {
    console.error('Failed to fetch table:', tableId)
    return null
  }
  const result = await response.json()
  return result
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState(null)
  const [customerDetails, setCustomerDetails] = useState({})
  const [tableDetails, setTableDetails] = useState({})

  // Fetch orders and related data on component mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true)
        const data = await fetchOrders()
        console.log('Orders data:', data) // Debug log
        
        // Fetch customer and table details for each order
        const customerPromises = data.map(order => {
          const customerId = order.customerId?._id || order.customerId
          return customerId ? fetchCustomer(customerId) : Promise.resolve(null)
        })
        
        const tablePromises = data.map(order => {
          const tableId = order.tableId?._id || order.tableId
          return tableId ? fetchTable(tableId) : Promise.resolve(null)
        })

        const [customers, tables] = await Promise.all([
          Promise.all(customerPromises),
          Promise.all(tablePromises)
        ])

        console.log('Customers:', customers) // Debug log
        console.log('Tables:', tables) // Debug log

        // Create lookup objects for customer and table details
        const customerLookup = {}
        const tableLookup = {}
        
        customers.forEach((customer, index) => {
          if (customer && data[index].customerId) {
            const customerId = data[index].customerId?._id || data[index].customerId
            customerLookup[customerId] = customer
          }
        })
        
        tables.forEach((table, index) => {
          if (table && data[index].tableId) {
            const tableId = data[index].tableId?._id || data[index].tableId
            tableLookup[tableId] = table
          }
        })

        setCustomerDetails(customerLookup)
        setTableDetails(tableLookup)
        setOrders(data)
        setError(null)
      } catch (err) {
        console.error('Error loading orders:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [])

  // Lọc đơn hàng theo từ khóa tìm kiếm và trạng thái
  const filteredOrders = orders.filter((order) => {
    const customerId = order.customerId?._id || order.customerId
    const tableId = order.tableId?._id || order.tableId
    const customerName = customerDetails[customerId]?.name || ''
    const tableName = tableDetails[tableId]?.name || ''
    
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tableName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Có lỗi xảy ra khi tải dữ liệu</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

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
                  <SelectItem value="Đã thanh toán">Đã thanh toán</SelectItem>
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
                  <TableHead>Bàn</TableHead>
                  <TableHead>Tổng tiền (VNĐ)</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Không tìm thấy đơn hàng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const customerId = order.customerId?._id || order.customerId
                    const tableId = order.tableId?._id || order.tableId
                    return (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">
                          {order._id.slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {customerDetails[customerId]?.name || 'Khách lẻ'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TableIcon className="h-4 w-4 text-muted-foreground" />
                            {tableDetails[tableId]?.tableNumber || '—'}
                          </div>
                        </TableCell>
                        <TableCell>{order.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {order.status === 'Đã thanh toán' ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                  {order.status}
                                </span>
                              </>
                            ) : order.status === 'Đang xử lý' ? (
                              <>
                                <Clock className="h-4 w-4 text-yellow-500" />
                                <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                                  {order.status}
                                </span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-4 w-4 text-gray-500" />
                                <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20">
                                  {order.status}
                                </span>
                              </>
                            )}
                          </div>
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
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog xem chi tiết đơn hàng */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
            <DialogDescription>Thông tin chi tiết về đơn hàng</DialogDescription>
          </DialogHeader>
          {currentOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mã đơn hàng</p>
                  <p className="font-medium">{currentOrder._id.slice(-6).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ngày</p>
                  <p>{new Date(currentOrder.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Khách hàng</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p>{customerDetails[currentOrder.customerId?._id || currentOrder.customerId]?.name || 'Khách lẻ'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bàn</p>
                  <div className="flex items-center gap-2">
                    <TableIcon className="h-4 w-4 text-muted-foreground" />
                    <p>{tableDetails[currentOrder.tableId?._id || currentOrder.tableId]?.tableNumber || '—'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                  <div className="flex items-center gap-2">
                    {currentOrder.status === 'Đã thanh toán' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          {currentOrder.status}
                        </span>
                      </>
                    ) : currentOrder.status === 'Đang xử lý' ? (
                      <>
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                          {currentOrder.status}
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-gray-500" />
                        <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20">
                          {currentOrder.status}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phương thức thanh toán</p>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                    {currentOrder.paymentMethod}
                  </span>
                </div>
              </div>

              <div>
                <p className="mb-4 text-sm font-medium text-muted-foreground">Các sản phẩm</p>
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
                          <TableCell>{item.title}</TableCell>
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
                <p className="font-bold">{currentOrder.totalAmount.toLocaleString()} VNĐ</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
