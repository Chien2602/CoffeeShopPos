"use client"

import { useState, useEffect } from "react"
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

// Add API endpoints
const API_URL = "http://localhost:3001"
const token = sessionStorage.getItem("authToken")

// Add role mapping helper
const getRoleDisplay = (role) => {
  const roleMap = {
    'manager': 'Quản lý',
    'cashier': 'Thu ngân',
    'barista': 'Pha chế',
    'waiter': 'Phục vụ',
    'employee': 'Nhân viên'
  }
  return roleMap[role] || role
}

// API functions
const fetchStaff = async () => {
  try {
    const response = await fetch(`${API_URL}/users?role=employee`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch staff')
    }
    const data = await response.json()
    console.log('Fetched staff data:', data)
    return data
  } catch (error) {
    console.error('Error fetching staff:', error)
    throw error
  }
}

const addStaff = async (staffData) => {
  console.log('Adding staff with data:', staffData) // Debug log
  const requestData = {
    fullname: staffData.fullname,
    position: staffData.position,
    phone: staffData.phone,
    email: staffData.email,
    isActive: staffData.isActive,
    role: 'employee',
    password: '123456',
  }
  console.log('Request data:', requestData) // Debug log

  const response = await fetch(`${API_URL}/users/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(requestData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('Add staff failed:', errorData)
    throw new Error(errorData.message || 'Failed to add staff')
  }
  const result = await response.json()
  console.log('Add staff response:', result)
  return result
}

const updateStaff = async (staffId, staffData) => {
  console.log('Updating staff with data:', staffData) // Debug log
  const response = await fetch(`${API_URL}/users/${staffId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...staffData,
      fullname: staffData.fullname,
    }),
  })
  if (!response.ok) {
    const errorData = await response.json()
    console.error('Update failed:', errorData) // Debug log
    throw new Error('Failed to update staff')
  }
  const result = await response.json()
  console.log('Update staff response:', result) // Debug log
  return result
}

const deleteStaff = async (staffId) => {
  const response = await fetch(`${API_URL}/users/${staffId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  if (!response.ok) {
    throw new Error('Failed to delete staff')
  }
  return response.json()
}

export default function StaffPage() {
  const { toast } = useToast()
  const [staff, setStaff] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentStaff, setCurrentStaff] = useState(null)
  const [newStaff, setNewStaff] = useState({
    fullname: "",
    position: "",
    phone: "",
    email: "",
    isActive: true,
  })

  // Add loadStaff function
  const loadStaff = async () => {
    try {
      setIsLoading(true)
      const data = await fetchStaff()
      setStaff(data)
      setError(null)
    } catch (err) {
      console.error('Error loading staff:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Update useEffect to use loadStaff
  useEffect(() => {
    loadStaff()
  }, [])

  // Lọc nhân viên theo từ khóa tìm kiếm
  const filteredStaff = staff.filter(
    (s) =>
      s.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Update handleAddStaff to refresh data after adding
  const handleAddStaff = async () => {
    if (!newStaff.fullname || !newStaff.position || !newStaff.phone || !newStaff.email) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin nhân viên",
        variant: "destructive",
      })
      return
    }

    try {
      const staffToAdd = {
        fullname: newStaff.fullname.trim(),
        position: newStaff.position.trim(),
        phone: newStaff.phone.trim(),
        email: newStaff.email.trim(),
        isActive: newStaff.isActive,
      }

      await addStaff(staffToAdd)
      
      // Reset form
      setNewStaff({
        fullname: "",
        position: "",
        phone: "",
        email: "",
        isActive: true,
      })
      
      // Close dialog
      setIsAddDialogOpen(false)
      
      // Refresh staff data
      await loadStaff()

      toast({
        title: "Thành công",
        description: "Đã thêm nhân viên mới",
      })
    } catch (err) {
      console.error('Error adding staff:', err)
      toast({
        title: "Lỗi",
        description: err.message || "Không thể thêm nhân viên mới",
        variant: "destructive",
      })
    }
  }

  // Update handleUpdateStaff to refresh data after updating
  const handleUpdateStaff = async () => {
    if (!currentStaff) return

    try {
      const staffToUpdate = {
        fullname: currentStaff.fullname.trim(),
        position: currentStaff.position.trim(),
        phone: currentStaff.phone.trim(),
        email: currentStaff.email.trim(),
        isActive: currentStaff.isActive,
        role: currentStaff.role,
      }

      await updateStaff(currentStaff._id, staffToUpdate)
      
      // Close dialog
      setIsEditDialogOpen(false)
      
      // Refresh staff data
      await loadStaff()

      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin nhân viên",
      })
    } catch (err) {
      console.error('Update error:', err)
      toast({
        title: "Lỗi",
        description: err.message || "Không thể cập nhật thông tin nhân viên",
        variant: "destructive",
      })
    }
  }

  // Update handleDeleteStaff to refresh data after deleting
  const handleDeleteStaff = async () => {
    if (!currentStaff) return

    try {
      await deleteStaff(currentStaff._id)
      
      // Close dialog
      setIsDeleteDialogOpen(false)
      
      // Refresh staff data
      await loadStaff()

      toast({
        title: "Thành công",
        description: "Đã xóa nhân viên",
      })
    } catch (err) {
      console.error('Delete error:', err)
      toast({
        title: "Lỗi",
        description: err.message || "Không thể xóa nhân viên",
        variant: "destructive",
      })
    }
  }

  // Add useEffect to log staff changes
  useEffect(() => {
    console.log('Staff list updated:', staff)
  }, [staff])

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
                  <Label htmlFor="fullname" className="text-sm font-medium">
                    Họ và tên <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullname"
                    value={newStaff.fullname}
                    onChange={(e) => setNewStaff({ ...newStaff, fullname: e.target.value })}
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
                    value={newStaff.isActive ? "true" : "false"}
                    onValueChange={(value) => setNewStaff({ ...newStaff, isActive: value === "true" })}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Đang làm việc</SelectItem>
                      <SelectItem value="false">Nghỉ việc</SelectItem>
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
                    <TableRow key={s._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {s.fullname}
                        </div>
                      </TableCell>
                      <TableCell>{s.position}</TableCell>
                      <TableCell>{s.phone}</TableCell>
                      <TableCell>{s.email}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            s.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {s.isActive ? "Đang làm việc" : "Nghỉ việc"}
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
                  <Label htmlFor="edit-fullname" className="text-sm font-medium">
                    Họ và tên <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-fullname"
                    value={currentStaff.fullname}
                    onChange={(e) => setCurrentStaff({ ...currentStaff, fullname: e.target.value })}
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
                    value={currentStaff.isActive ? "true" : "false"}
                    onValueChange={(value) => setCurrentStaff({ ...currentStaff, isActive: value === "true" })}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Đang làm việc</SelectItem>
                      <SelectItem value="false">Nghỉ việc</SelectItem>
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
