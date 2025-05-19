"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Plus, Search, Trash2, User, Phone, Mail, Star } from "lucide-react"
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

// Dữ liệu mẫu cho khách hàng
const initialCustomers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyenvana@example.com",
    points: 120,
    totalSpent: 1250000,
    joinDate: "2023-01-15",
    type: "Thành viên Vàng",
  },
  {
    id: 2,
    name: "Trần Thị B",
    phone: "0912345678",
    email: "tranthib@example.com",
    points: 85,
    totalSpent: 950000,
    joinDate: "2023-02-20",
    type: "Thành viên Bạc",
  },
  {
    id: 3,
    name: "Lê Văn C",
    phone: "0923456789",
    email: "levanc@example.com",
    points: 210,
    totalSpent: 2100000,
    joinDate: "2022-11-05",
    type: "Thành viên Vàng",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    phone: "0934567890",
    email: "phamthid@example.com",
    points: 45,
    totalSpent: 450000,
    joinDate: "2023-03-10",
    type: "Thành viên Đồng",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    phone: "0945678901",
    email: "hoangvane@example.com",
    points: 320,
    totalSpent: 3200000,
    joinDate: "2022-09-15",
    type: "Thành viên Kim cương",
  },
  {
    id: 6,
    name: "Ngô Thị F",
    phone: "0956789012",
    email: "ngothif@example.com",
    points: 150,
    totalSpent: 1500000,
    joinDate: "2023-01-25",
    type: "Thành viên Vàng",
  },
  {
    id: 7,
    name: "Đỗ Văn G",
    phone: "0967890123",
    email: "dovang@example.com",
    points: 75,
    totalSpent: 750000,
    joinDate: "2023-02-28",
    type: "Thành viên Bạc",
  },
  {
    id: 8,
    name: "Vũ Thị H",
    phone: "0978901234",
    email: "vuthih@example.com",
    points: 180,
    totalSpent: 1800000,
    joinDate: "2022-12-10",
    type: "Thành viên Vàng",
  },
]

export default function CustomersPage() {
  const { toast } = useToast()
  const [customers, setCustomers] = useState(initialCustomers)
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
    email: "",
    points: 0,
    totalSpent: 0,
    joinDate: new Date().toISOString().split("T")[0],
    type: "Thành viên Đồng",
  })

  // Lọc khách hàng theo từ khóa tìm kiếm và loại thành viên
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = customerTypeFilter === "all" || customer.type === customerTypeFilter

    return matchesSearch && matchesType
  })

  // Xử lý thêm khách hàng mới
  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin khách hàng",
        variant: "destructive",
      })
      return
    }

    const newId = Math.max(...customers.map((c) => c.id)) + 1
    const customerToAdd = {
      id: newId,
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email || "",
      points: 0,
      totalSpent: 0,
      joinDate: newCustomer.joinDate,
      type: "Thành viên Đồng",
    }

    setCustomers([...customers, customerToAdd])
    setNewCustomer({
      name: "",
      phone: "",
      email: "",
      points: 0,
      totalSpent: 0,
      joinDate: new Date().toISOString().split("T")[0],
      type: "Thành viên Đồng",
    })
    setIsAddDialogOpen(false)

    toast({
      title: "Thành công",
      description: "Đã thêm khách hàng mới",
    })
  }

  // Xử lý cập nhật khách hàng
  const handleUpdateCustomer = () => {
    if (!currentCustomer) return

    const updatedCustomers = customers.map((customer) =>
      customer.id === currentCustomer.id ? currentCustomer : customer,
    )

    setCustomers(updatedCustomers)
    setIsEditDialogOpen(false)

    toast({
      title: "Thành công",
      description: "Đã cập nhật thông tin khách hàng",
    })
  }

  // Xử lý xóa khách hàng
  const handleDeleteCustomer = () => {
    if (!currentCustomer) return

    const updatedCustomers = customers.filter((customer) => customer.id !== currentCustomer.id)
    setCustomers(updatedCustomers)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Thành công",
      description: "Đã xóa khách hàng",
    })
  }

  // Lấy danh sách các loại thành viên duy nhất
  const customerTypes = ["all", ...Array.from(new Set(customers.map((customer) => customer.type)))]

  // Hiển thị màu sắc dựa trên loại thành viên
  const getCustomerTypeColor = (type) => {
    switch (type) {
      case "Thành viên Kim cương":
        return "bg-purple-100 text-purple-800"
      case "Thành viên Vàng":
        return "bg-yellow-100 text-yellow-800"
      case "Thành viên Bạc":
        return "bg-gray-100 text-gray-800"
      case "Thành viên Đồng":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
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
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    placeholder="Nhập địa chỉ email"
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
                    value={newCustomer.joinDate}
                    onChange={(e) => setNewCustomer({ ...newCustomer, joinDate: e.target.value })}
                    className="border-gray-300"
                  />
                </div>
                <div className="col-span-2 grid gap-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Địa chỉ
                  </Label>
                  <textarea
                    id="address"
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
                      <TableHead>Email</TableHead>
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
                              {customer.email || "—"}
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
                                customer.type,
                              )}`}
                            >
                              {customer.type}
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
                                    setCurrentCustomer(customer)
                                    setIsViewDialogOpen(true)
                                  }}
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chi tiết khách hàng</DialogTitle>
            <DialogDescription>Thông tin chi tiết về khách hàng</DialogDescription>
          </DialogHeader>
          {currentCustomer && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center space-y-2 pb-4">
                <div className="rounded-full bg-blue-100 p-6">
                  <User className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">{currentCustomer.name}</h3>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getCustomerTypeColor(
                    currentCustomer.type,
                  )}`}
                >
                  {currentCustomer.type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Số điện thoại</p>
                  <p className="font-medium">{currentCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{currentCustomer.email || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ngày đăng ký</p>
                  <p>{currentCustomer.joinDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Điểm tích lũy</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{currentCustomer.points}</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Tổng chi tiêu</p>
                  <p className="text-lg font-bold text-blue-600">{currentCustomer.totalSpent.toLocaleString()} VNĐ</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">Lịch sử mua hàng gần đây</p>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã đơn</TableHead>
                        <TableHead>Ngày</TableHead>
                        <TableHead className="text-right">Tổng tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">ORD-001</TableCell>
                        <TableCell>2023-05-15</TableCell>
                        <TableCell className="text-right">75,000 VNĐ</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">ORD-002</TableCell>
                        <TableCell>2023-05-10</TableCell>
                        <TableCell className="text-right">120,000 VNĐ</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">ORD-003</TableCell>
                        <TableCell>2023-05-05</TableCell>
                        <TableCell className="text-right">65,000 VNĐ</TableCell>
                      </TableRow>
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
                  <Label htmlFor="edit-email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={currentCustomer.email}
                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, email: e.target.value })}
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
                    onChange={(e) =>
                      setCurrentCustomer({ ...currentCustomer, points: Number.parseInt(e.target.value) })
                    }
                    className="border-gray-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-type" className="text-sm font-medium">
                    Loại thành viên
                  </Label>
                  <select
                    id="edit-type"
                    value={currentCustomer.type}
                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, type: e.target.value })}
                    className="rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="Thành viên Đồng">Thành viên Đồng</option>
                    <option value="Thành viên Bạc">Thành viên Bạc</option>
                    <option value="Thành viên Vàng">Thành viên Vàng</option>
                    <option value="Thành viên Kim cương">Thành viên Kim cương</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-join-date" className="text-sm font-medium">
                    Ngày đăng ký
                  </Label>
                  <Input
                    id="edit-join-date"
                    type="date"
                    value={currentCustomer.joinDate}
                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, joinDate: e.target.value })}
                    className="border-gray-300"
                  />
                </div>
                <div className="col-span-2 grid gap-2">
                  <Label htmlFor="edit-address" className="text-sm font-medium">
                    Địa chỉ
                  </Label>
                  <textarea
                    id="edit-address"
                    placeholder="Nhập địa chỉ khách hàng"
                    className="h-20 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
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
