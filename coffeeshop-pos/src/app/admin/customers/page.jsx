"use client"

import { useState, useEffect } from "react"
import { Edit, MoreHorizontal, Plus, Search, Trash2, User, Phone, Mail, Star, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// API endpoints
const API_URL = "http://localhost:3001"
const token = sessionStorage.getItem("authToken")

// API functions
const fetchCustomers = async () => {
  const response = await fetch(`${API_URL}/customers`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  if (!response.ok) {
    throw new Error('Failed to fetch customers')
  }
  return response.json()
}

const addCustomer = async (customerData) => {
  const response = await fetch(`${API_URL}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(customerData),
  })
  if (!response.ok) {
    throw new Error('Failed to add customer')
  }
  return response.json()
}

const updateCustomer = async (customerData) => {
  const { _id, ...data } = customerData
  console.log('Sending update data:', { _id, ...data }) // Debug log
  
  const response = await fetch(`${API_URL}/customers/${_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: data.name,
      phone: data.phone,
      address: data.address,
      points: parseInt(data.points),
      totalSpent: parseInt(data.totalSpent || 0),
      rank: data.rank,
      createdAt: data.createdAt
    }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update customer')
  }
  
  const result = await response.json()
  console.log('Update response:', result) // Debug log
  return result
}

const deleteCustomer = async (id) => {
  const response = await fetch(`${API_URL}/customers/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  if (!response.ok) {
    throw new Error('Failed to delete customer')
  }
  return response.json()
}

const fetchCustomerOrders = async (customerId) => {
  if (!customerId) {
    throw new Error('Customer ID is required')
  }
  
  const response = await fetch(`${API_URL}/orders/customer/${customerId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  if (!response.ok) {
    throw new Error('Failed to fetch customer orders')
  }
  const result = await response.json()
  return result.data || [] // Lấy mảng orders từ trường data
}

export default function CustomersPage() {
  const { toast } = useToast()
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [customerTypeFilter, setCustomerTypeFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentCustomer, setCurrentCustomer] = useState(null)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    points: 0,
    totalSpent: 0,
    createdAt: new Date().toISOString().split("T")[0],
    rank: "no-rank",
  })
  const [customerOrders, setCustomerOrders] = useState([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)

  // Fetch customers on component mount
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setIsLoading(true)
        const data = await fetchCustomers()
        if (Array.isArray(data)) {
          setCustomers(data)
          setError(null)
        } else {
          throw new Error('Invalid data format received from server')
        }
      } catch (err) {
        console.error('Error loading customers:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadCustomers()
  }, [])

  // Lọc khách hàng theo từ khóa tìm kiếm và loại thành viên
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.address.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = customerTypeFilter === "all" || customer.rank === customerTypeFilter

    return matchesSearch && matchesType
  })

  // Xử lý thêm khách hàng mới
  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin khách hàng",
        variant: "destructive",
      })
      return
    }

    try {
      const addedCustomer = await addCustomer(newCustomer)
      setCustomers(prevCustomers => [...prevCustomers, addedCustomer])
      setIsAddDialogOpen(false)
      setNewCustomer({
        name: "",
        phone: "",
        address: "",
        points: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString().split("T")[0],
        rank: "no-rank",
      })
      toast({
        title: "Thành công",
        description: "Đã thêm khách hàng mới",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi thêm khách hàng",
        variant: "destructive",
      })
    }
  }

  // Hàm xác định hạng dựa trên điểm
  const determineRank = (points) => {
    if (points >= 1000) return "diamond"
    if (points >= 500) return "gold"
    if (points >= 200) return "silver"
    if (points >= 50) return "bronze"
    return "no-rank"
  }

  // Xử lý cập nhật khách hàng
  const handleUpdateCustomer = async () => {
    if (!currentCustomer) return

    try {
      // Đảm bảo points là số nguyên
      const points = parseInt(currentCustomer.points) || 0
      const rank = determineRank(points)

      const updatedData = {
        ...currentCustomer,
        points,
        rank
      }

      console.log('Updating customer with data:', updatedData) // Debug log
      const updatedCustomer = await updateCustomer(updatedData)
      console.log('Received updated customer:', updatedCustomer) // Debug log
      
      // Cập nhật state với dữ liệu mới từ server
      setCustomers(prevCustomers => 
        prevCustomers.map(customer => 
          customer._id === updatedCustomer._id ? updatedCustomer : customer
        )
      )
      
      setIsEditDialogOpen(false)
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin khách hàng",
      })
    } catch (error) {
      console.error('Update error:', error)
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi cập nhật khách hàng",
        variant: "destructive",
      })
    }
  }

  // Cập nhật hàm xử lý thay đổi điểm
  const handlePointsChange = (e) => {
    const points = parseInt(e.target.value) || 0
    const newRank = determineRank(points)
    setCurrentCustomer(prev => ({
      ...prev,
      points,
      rank: newRank
    }))
  }

  // Xử lý xóa khách hàng
  const handleDeleteCustomer = async () => {
    if (!currentCustomer) return

    try {
      await deleteCustomer(currentCustomer._id)
      setCustomers(prevCustomers => 
        prevCustomers.filter(customer => customer._id !== currentCustomer._id)
      )
      setIsDeleteDialogOpen(false)
      toast({
        title: "Thành công",
        description: "Đã xóa khách hàng",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi xóa khách hàng",
        variant: "destructive",
      })
    }
  }

  // Lấy danh sách các loại thành viên duy nhất
  const customerTypes = ["all", ...Array.from(new Set(customers.map((customer) => customer.rank)))]

  // Hiển thị màu sắc dựa trên loại thành viên
  const getCustomerTypeColor = (rank) => {
    switch (rank) {
      case "gold":
        return "bg-yellow-100 text-yellow-800"
      case "silver":
        return "bg-gray-100 text-gray-800"
      case "bronze":
        return "bg-orange-100 text-orange-800"
      case "no-rank":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  // Fetch customer orders when viewing details
  const handleViewCustomer = async (customer) => {
    try {
      if (!customer || !customer._id) {
        toast({
          title: "Lỗi",
          description: "Không tìm thấy thông tin khách hàng",
          variant: "destructive",
        })
        return
      }

      setCurrentCustomer(customer)
      setIsViewDialogOpen(true)
      setIsLoadingOrders(true)
      
      const orders = await fetchCustomerOrders(customer._id)
      setCustomerOrders(Array.isArray(orders) ? orders : [])
    } catch (error) {
      console.error('Error loading customer details:', error)
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tải thông tin chi tiết",
        variant: "destructive",
      })
    } finally {
      setIsLoadingOrders(false)
    }
  }

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
        <h2 className="text-3xl font-bold tracking-tight">Quản lý khách hàng</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              <Plus className="mr-2 h-4 w-4" />
              Thêm khách hàng
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Thêm khách hàng mới</DialogTitle>
              <DialogDescription>Nhập thông tin chi tiết cho khách hàng mới</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Họ và tên <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    placeholder="Nhập họ và tên"
                    className="border-gray-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Số điện thoại <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    placeholder="Nhập số điện thoại"
                    className="border-gray-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="join-date" className="text-sm font-medium">
                    Ngày đăng ký
                  </Label>
                  <Input
                    id="join-date"
                    type="date"
                    value={newCustomer.createdAt}
                    onChange={(e) => setNewCustomer({ ...newCustomer, createdAt: e.target.value })}
                    className="border-gray-300"
                  />
                </div>
                <div className="col-span-2 grid gap-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Địa chỉ
                  </Label>
                  <textarea
                    id="address"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                    placeholder="Nhập địa chỉ khách hàng"
                    className="h-20 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Hủy
              </Button>
              <Button
                onClick={handleAddCustomer}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                Thêm khách hàng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách khách hàng</CardTitle>
          <CardDescription>Quản lý tất cả khách hàng và thành viên của cửa hàng</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={customerTypeFilter} onValueChange={setCustomerTypeFilter}>
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList className="flex-wrap">
                {customerTypes.map((type) => (
                  <TabsTrigger key={type} value={type}>
                    {type === "all" ? "Tất cả" : type}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm khách hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </div>

            <TabsContent value={customerTypeFilter} className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Họ và tên</TableHead>
                      <TableHead>Số điện thoại</TableHead>
                      <TableHead>Địa chỉ</TableHead>
                      <TableHead>Điểm tích lũy</TableHead>
                      <TableHead>Loại thành viên</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          Không tìm thấy khách hàng nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              {customer.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              {customer.phone}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {customer.address || "—"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-500" />
                              {customer.points}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getCustomerTypeColor(
                                customer.rank,
                              )}`}
                            >
                              {customer.rank}
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
                                  onClick={() => handleViewCustomer(customer)}
                                >
                                  <User className="mr-2 h-4 w-4" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setCurrentCustomer(customer)
                                    setIsEditDialogOpen(true)
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setCurrentCustomer(customer)
                                    setIsDeleteDialogOpen(true)
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Xóa
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

      {/* Dialog xem chi tiết khách hàng */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto custom-scrollbar">
          <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: #e2e8f0;
              border-radius: 20px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: #cbd5e1;
            }
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #e2e8f0 transparent;
            }
          `}</style>
          <DialogHeader>
            <DialogTitle>Chi tiết khách hàng</DialogTitle>
            <DialogDescription>Thông tin chi tiết về khách hàng</DialogDescription>
          </DialogHeader>
          {currentCustomer && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="rounded-full bg-blue-100 p-4">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{currentCustomer.name}</h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getCustomerTypeColor(
                      currentCustomer.rank,
                    )}`}
                  >
                    {currentCustomer.rank}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Số điện thoại</p>
                  <p className="font-medium">{currentCustomer?.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Địa chỉ</p>
                  <p>{currentCustomer?.address || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ngày đăng ký</p>
                  <p>{currentCustomer?.createdAt ? new Date(currentCustomer.createdAt).toLocaleDateString() : "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Điểm tích lũy</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{currentCustomer?.points || 0}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Loại thành viên</p>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getCustomerTypeColor(
                      currentCustomer.rank,
                    )}`}
                  >
                    {currentCustomer.rank}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng chi tiêu</p>
                  <p className="text-lg font-bold text-blue-600">
                    {(currentCustomer?.totalSpent || 0).toLocaleString()} VNĐ
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-4 text-sm font-medium text-muted-foreground">Lịch sử mua hàng gần đây</p>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã đơn</TableHead>
                        <TableHead>Ngày</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Phương thức</TableHead>
                        <TableHead className="text-right">Tổng tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingOrders ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                              <span>Đang tải...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : customerOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            Chưa có đơn hàng nào
                          </TableCell>
                        </TableRow>
                      ) : (
                        customerOrders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell className="font-medium">
                              {order._id.slice(-6).toUpperCase()}
                            </TableCell>
                            <TableCell>
                              {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </TableCell>
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
                            <TableCell>
                              <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                                {order.paymentMethod}
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {order.totalAmount.toLocaleString()} VNĐ
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa khách hàng */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Chỉnh sửa khách hàng</DialogTitle>
            <DialogDescription>Cập nhật thông tin cho khách hàng</DialogDescription>
          </DialogHeader>
          {currentCustomer && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name" className="text-sm font-medium">
                    Họ và tên <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-name"
                    value={currentCustomer.name}
                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, name: e.target.value })}
                    className="border-gray-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone" className="text-sm font-medium">
                    Số điện thoại <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-phone"
                    value={currentCustomer.phone}
                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, phone: e.target.value })}
                    className="border-gray-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-address" className="text-sm font-medium">
                    Địa chỉ
                  </Label>
                  <Input
                    id="edit-address"
                    value={currentCustomer.address}
                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, address: e.target.value })}
                    className="border-gray-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-points" className="text-sm font-medium">
                    Điểm tích lũy
                  </Label>
                  <Input
                    id="edit-points"
                    type="number"
                    value={currentCustomer.points}
                    onChange={handlePointsChange}
                    className="border-gray-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-rank" className="text-sm font-medium">
                    Loại thành viên
                  </Label>
                  <select
                    id="edit-rank"
                    value={currentCustomer.rank}
                    disabled
                    className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="no-rank">Chưa có hạng</option>
                    <option value="bronze">Thành viên Đồng</option>
                    <option value="silver">Thành viên Bạc</option>
                    <option value="gold">Thành viên Vàng</option>
                    <option value="diamond">Thành viên Kim cương</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-join-date" className="text-sm font-medium">
                    Ngày đăng ký
                  </Label>
                  <Input
                    id="edit-join-date"
                    type="date"
                    value={currentCustomer.createdAt}
                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, createdAt: e.target.value })}
                    className="border-gray-300"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleUpdateCustomer}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa khách hàng */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa khách hàng này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>
              Xóa khách hàng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
