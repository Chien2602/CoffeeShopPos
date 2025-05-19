"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Plus, Search, Trash2, User } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

// Dữ liệu mẫu cho nhân viên
const initialStaff = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    position: "Quản lý",
    phone: "0901234567",
    email: "nguyenvana@example.com",
    status: "Đang làm việc",
  },
  {
    id: 2,
    name: "Trần Thị B",
    position: "Thu ngân",
    phone: "0912345678",
    email: "tranthib@example.com",
    status: "Đang làm việc",
  },
  {
    id: 3,
    name: "Lê Văn C",
    position: "Pha chế",
    phone: "0923456789",
    email: "levanc@example.com",
    status: "Đang làm việc",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    position: "Phục vụ",
    phone: "0934567890",
    email: "phamthid@example.com",
    status: "Đang làm việc",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    position: "Pha chế",
    phone: "0945678901",
    email: "hoangvane@example.com",
    status: "Nghỉ việc",
  },
]

export default function StaffPage() {
  const { toast } = useToast()
  const [staff, setStaff] = useState(initialStaff)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentStaff, setCurrentStaff] = useState(null)
  const [newStaff, setNewStaff] = useState({
    name: "",
    position: "",
    phone: "",
    email: "",
    status: "Đang làm việc",
  })

  // Lọc nhân viên theo từ khóa tìm kiếm
  const filteredStaff = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Xử lý thêm nhân viên mới
  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.position || !newStaff.phone || !newStaff.email) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin nhân viên",
        variant: "destructive",
      })
      return
    }

    const newId = Math.max(...staff.map((s) => s.id)) + 1
    const staffToAdd = {
      id: newId,
      name: newStaff.name,
      position: newStaff.position,
      phone: newStaff.phone,
      email: newStaff.email,
      status: newStaff.status,
    }

    setStaff([...staff, staffToAdd])
    setNewStaff({
      name: "",
      position: "",
      phone: "",
      email: "",
      status: "Đang làm việc",
    })
    setIsAddDialogOpen(false)

    toast({
      title: "Thành công",
      description: "Đã thêm nhân viên mới",
    })
  }

  // Xử lý cập nhật nhân viên
  const handleUpdateStaff = () => {
    if (!currentStaff) return

    const updatedStaff = staff.map((s) => (s.id === currentStaff.id ? currentStaff : s))

    setStaff(updatedStaff)
    setIsEditDialogOpen(false)

    toast({
      title: "Thành công",
      description: "Đã cập nhật thông tin nhân viên",
    })
  }

  // Xử lý xóa nhân viên
  const handleDeleteStaff = () => {
    if (!currentStaff) return

    const updatedStaff = staff.filter((s) => s.id !== currentStaff.id)
    setStaff(updatedStaff)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Thành công",
      description: "Đã xóa nhân viên",
    })
  }

  return (
    <div className="flex-1 space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý nhân viên</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              <Plus className="mr-2 h-4 w-4" />
              Thêm nhân viên
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Thêm nhân viên mới</DialogTitle>
              <DialogDescription>Nhập thông tin chi tiết cho nhân viên mới</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex justify-center">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-50">
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-16 w-16 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Họ và tên <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    placeholder="Nhập họ và tên"
                    className="border-gray-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="position" className="text-sm font-medium">
                    Chức vụ <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={newStaff.position}
                    onValueChange={(value) => setNewStaff({ ...newStaff, position: value })}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Chọn chức vụ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Quản lý">Quản lý</SelectItem>
                      <SelectItem value="Thu ngân">Thu ngân</SelectItem>
                      <SelectItem value="Pha chế">Pha chế</SelectItem>
                      <SelectItem value="Phục vụ">Phục vụ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Số điện thoại <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    placeholder="Nhập số điện thoại"
                    className="border-gray-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    placeholder="Nhập địa chỉ email"
                    className="border-gray-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Trạng thái
                  </Label>
                  <Select
                    value={newStaff.status}
                    onValueChange={(value) => setNewStaff({ ...newStaff, status: value })}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Đang làm việc">Đang làm việc</SelectItem>
                      <SelectItem value="Nghỉ việc">Nghỉ việc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="join-date" className="text-sm font-medium">
                    Ngày vào làm
                  </Label>
                  <Input id="join-date" type="date" className="border-gray-300" />
                </div>
                <div className="col-span-2 grid gap-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Địa chỉ
                  </Label>
                  <textarea
                    id="address"
                    placeholder="Nhập địa chỉ nhân viên"
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
                onClick={handleAddStaff}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                Thêm nhân viên
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhân viên</CardTitle>
          <CardDescription>Quản lý tất cả nhân viên trong cửa hàng của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm nhân viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Chức vụ</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Không tìm thấy nhân viên nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStaff.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {s.name}
                        </div>
                      </TableCell>
                      <TableCell>{s.position}</TableCell>
                      <TableCell>{s.phone}</TableCell>
                      <TableCell>{s.email}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            s.status === "Đang làm việc" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {s.status}
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
                                setCurrentStaff(s)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setCurrentStaff(s)
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
        </CardContent>
      </Card>

      {/* Dialog chỉnh sửa nhân viên */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Chỉnh sửa nhân viên</DialogTitle>
            <DialogDescription>Cập nhật thông tin cho nhân viên</DialogDescription>
          </DialogHeader>
          {currentStaff && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex justify-center">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-50">
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-16 w-16 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-name" className="text-sm font-medium">
                    Họ và tên <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-name"
                    value={currentStaff.name}
                    onChange={(e) => setCurrentStaff({ ...currentStaff, name: e.target.value })}
                    className="border-gray-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-position" className="text-sm font-medium">
                    Chức vụ <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={currentStaff.position}
                    onValueChange={(value) => setCurrentStaff({ ...currentStaff, position: value })}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Quản lý">Quản lý</SelectItem>
                      <SelectItem value="Thu ngân">Thu ngân</SelectItem>
                      <SelectItem value="Pha chế">Pha chế</SelectItem>
                      <SelectItem value="Phục vụ">Phục vụ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone" className="text-sm font-medium">
                    Số điện thoại <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-phone"
                    value={currentStaff.phone}
                    onChange={(e) => setCurrentStaff({ ...currentStaff, phone: e.target.value })}
                    className="border-gray-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email" className="text-sm font-medium">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={currentStaff.email}
                    onChange={(e) => setCurrentStaff({ ...currentStaff, email: e.target.value })}
                    className="border-gray-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status" className="text-sm font-medium">
                    Trạng thái
                  </Label>
                  <Select
                    value={currentStaff.status}
                    onValueChange={(value) => setCurrentStaff({ ...currentStaff, status: value })}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Đang làm việc">Đang làm việc</SelectItem>
                      <SelectItem value="Nghỉ việc">Nghỉ việc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-join-date" className="text-sm font-medium">
                    Ngày vào làm
                  </Label>
                  <Input id="edit-join-date" type="date" className="border-gray-300" />
                </div>
                <div className="col-span-2 grid gap-2">
                  <Label htmlFor="edit-address" className="text-sm font-medium">
                    Địa chỉ
                  </Label>
                  <textarea
                    id="edit-address"
                    placeholder="Nhập địa chỉ nhân viên"
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
              onClick={handleUpdateStaff}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa nhân viên */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa nhân viên này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteStaff}>
              Xóa nhân viên
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
