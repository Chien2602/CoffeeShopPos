"use client"

import { useState, useEffect } from "react"
import { Users, Edit, Trash2, Plus, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export function TableManagement({
  tables: initialTables,
  onTableSelect,
  onTablesChange,
  selectable = false,
  editable = true,
}) {
  const { toast } = useToast()
  const [tables, setTables] = useState(initialTables)
  const [selectedTable, setSelectedTable] = useState(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newTable, setNewTable] = useState({
    name: "",
    capacity: "4",
    status: "available",
  })

  useEffect(() => {
    if (onTablesChange) {
      onTablesChange(tables)
    }
  }, [tables, onTablesChange])

  const handleTableClick = (table) => {
    if (selectable && table.status === "available") {
      setSelectedTable(table)
      if (onTableSelect) {
        onTableSelect(table)
      }
    } else if (selectable && table.status !== "available") {
      toast({
        title: "Bàn không khả dụng",
        description: `Bàn ${table.name} hiện đang ${getStatusText(table.status)}`,
        variant: "destructive",
      })
    }
  }

  const handleAddTable = () => {
    if (!newTable.name) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên bàn",
        variant: "destructive",
      })
      return
    }

    const newId = tables.length > 0 ? Math.max(...tables.map((t) => t.id)) + 1 : 1
    const tableToAdd = {
      id: newId,
      name: newTable.name,
      capacity: Number.parseInt(newTable.capacity),
      status: newTable.status,
    }

    setTables([...tables, tableToAdd])
    setNewTable({
      name: "",
      capacity: "4",
      status: "available",
    })
    setIsAddDialogOpen(false)

    toast({
      title: "Thành công",
      description: `Đã thêm ${tableToAdd.name}`,
    })
  }

  const handleUpdateTable = () => {
    if (!selectedTable) return

    const updatedTables = tables.map((table) => (table.id === selectedTable.id ? selectedTable : table))
    setTables(updatedTables)
    setIsEditDialogOpen(false)

    toast({
      title: "Thành công",
      description: `Đã cập nhật ${selectedTable.name}`,
    })
  }

  const handleDeleteTable = () => {
    if (!selectedTable) return

    const updatedTables = tables.filter((table) => table.id !== selectedTable.id)
    setTables(updatedTables)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Thành công",
      description: `Đã xóa ${selectedTable.name}`,
    })
  }

  const getStatusText = (status) => {
    switch (status) {
      case "available":
        return "Trống"
      case "occupied":
        return "Đang phục vụ"
      case "reserved":
        return "Đã đặt trước"
      case "cleaning":
        return "Đang dọn dẹp"
      default:
        return "Không xác định"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      case "occupied":
        return "bg-red-100 text-red-800 border-red-200"
      case "reserved":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cleaning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusBgColor = (status) => {
    switch (status) {
      case "available":
        return "bg-gradient-to-br from-green-50 to-green-100"
      case "occupied":
        return "bg-gradient-to-br from-red-50 to-red-100"
      case "reserved":
        return "bg-gradient-to-br from-blue-50 to-blue-100"
      case "cleaning":
        return "bg-gradient-to-br from-yellow-50 to-yellow-100"
      default:
        return "bg-gradient-to-br from-gray-50 to-gray-100"
    }
  }

  return (
    <div className="space-y-4">
      {editable && (
        <div className="flex justify-end">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <Plus className="mr-2 h-4 w-4" />
                Thêm bàn
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl text-gray-800">Thêm bàn mới</DialogTitle>
                <DialogDescription>Nhập thông tin chi tiết cho bàn mới</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="table-name" className="text-gray-700">
                    Tên bàn
                  </Label>
                  <Input
                    id="table-name"
                    value={newTable.name}
                    onChange={(e) => setNewTable({ ...newTable, name: e.target.value })}
                    placeholder="Nhập tên bàn (VD: Bàn 1)"
                    className="border-gray-200"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="table-capacity" className="text-gray-700">
                    Sức chứa
                  </Label>
                  <Input
                    id="table-capacity"
                    type="number"
                    value={newTable.capacity}
                    onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
                    min="1"
                    max="20"
                    className="border-gray-200"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="table-status" className="text-gray-700">
                    Trạng thái
                  </Label>
                  <Select
                    value={newTable.status}
                    onValueChange={(value) => setNewTable({ ...newTable, status: value })}
                  >
                    <SelectTrigger id="table-status" className="border-gray-200">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Trống</SelectItem>
                      <SelectItem value="occupied">Đang phục vụ</SelectItem>
                      <SelectItem value="reserved">Đã đặt trước</SelectItem>
                      <SelectItem value="cleaning">Đang dọn dẹp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="border-gray-200" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button
                  onClick={handleAddTable}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  Thêm bàn
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {tables.map((table) => (
          <Card
            key={table.id}
            className={`group cursor-pointer border-0 transition-all hover:shadow-md ${
              selectable && table.status === "available" ? "hover:-translate-y-1" : ""
            } ${getStatusBgColor(table.status)}`}
            onClick={() => handleTableClick(table)}
          >
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div
                  className={`mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-white/80 shadow-sm ${
                    table.status === "available"
                      ? "text-green-600"
                      : table.status === "occupied"
                        ? "text-red-600"
                        : table.status === "reserved"
                          ? "text-blue-600"
                          : "text-yellow-600"
                  }`}
                >
                  <Coffee className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">{table.name}</h3>
                <div className="mt-1 flex items-center gap-1 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{table.capacity} người</span>
                </div>
                <Badge
                  className={`mt-2 ${getStatusColor(table.status)} border px-3 py-1 text-xs font-medium shadow-sm`}
                >
                  {getStatusText(table.status)}
                </Badge>
                {table.customer && (
                  <div className="mt-2 text-xs text-gray-600">
                    <span className="font-medium">Khách:</span> {table.customer}
                  </div>
                )}
                {table.timeOccupied && (
                  <div className="mt-1 text-xs text-gray-600">
                    <span className="font-medium">Thời gian:</span> {table.timeOccupied}
                  </div>
                )}
              </div>
              {editable && (
                <div className="mt-3 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-gray-200 bg-white/80 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedTable(table)
                      setIsEditDialogOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-gray-200 bg-white/80 text-red-500 opacity-0 shadow-sm transition-opacity hover:text-red-700 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedTable(table)
                      setIsDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog chỉnh sửa bàn */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-800">Chỉnh sửa bàn</DialogTitle>
            <DialogDescription>Cập nhật thông tin cho bàn</DialogDescription>
          </DialogHeader>
          {selectedTable && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-table-name" className="text-gray-700">
                  Tên bàn
                </Label>
                <Input
                  id="edit-table-name"
                  value={selectedTable.name}
                  onChange={(e) => setSelectedTable({ ...selectedTable, name: e.target.value })}
                  className="border-gray-200"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-table-capacity" className="text-gray-700">
                  Sức chứa
                </Label>
                <Input
                  id="edit-table-capacity"
                  type="number"
                  value={selectedTable.capacity}
                  onChange={(e) => setSelectedTable({ ...selectedTable, capacity: Number.parseInt(e.target.value) })}
                  min="1"
                  max="20"
                  className="border-gray-200"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-table-status" className="text-gray-700">
                  Trạng thái
                </Label>
                <Select
                  value={selectedTable.status}
                  onValueChange={(value) => setSelectedTable({ ...selectedTable, status: value })}
                >
                  <SelectTrigger id="edit-table-status" className="border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Trống</SelectItem>
                    <SelectItem value="occupied">Đang phục vụ</SelectItem>
                    <SelectItem value="reserved">Đã đặt trước</SelectItem>
                    <SelectItem value="cleaning">Đang dọn dẹp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedTable.status === "occupied" || selectedTable.status === "reserved" ? (
                <div className="grid gap-2">
                  <Label htmlFor="edit-table-customer" className="text-gray-700">
                    Tên khách hàng
                  </Label>
                  <Input
                    id="edit-table-customer"
                    value={selectedTable.customer || ""}
                    onChange={(e) => setSelectedTable({ ...selectedTable, customer: e.target.value })}
                    placeholder="Nhập tên khách hàng"
                    className="border-gray-200"
                  />
                </div>
              ) : null}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" className="border-gray-200" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleUpdateTable}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa bàn */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-800">Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa {selectedTable?.name} không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="border-gray-200" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteTable}>
              Xóa bàn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
