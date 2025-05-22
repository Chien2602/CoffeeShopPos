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
  onTableStatusChange
}) {
  const { toast } = useToast()
  const [tables, setTables] = useState(initialTables)
  const [selectedTable, setSelectedTable] = useState(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newTable, setNewTable] = useState({
    tableNumber: "",
    capacity: "",
    isActive: "Trống"
  })

  useEffect(() => {
    setTables(initialTables)
  }, [initialTables])

  useEffect(() => {
    if (onTablesChange) {
      onTablesChange(tables)
    }
  }, [tables, onTablesChange])

  const handleTableClick = (table) => {
    if (selectable && table.isActive === "Trống") {
      setSelectedTable(table)
      if (onTableSelect) {
        onTableSelect(table)
      }
    } else if (selectable && table.isActive !== "Trống") {
      toast({
        title: "Bàn không khả dụng",
        description: `Bàn ${table.tableNumber} hiện đang ${table.isActive}`,
        variant: "destructive",
      })
    }
  }

  const handleAddTable = () => {
    if (!newTable.tableNumber) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số bàn",
        variant: "destructive",
      })
      return
    }

    if (!newTable.capacity) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập sức chứa",
        variant: "destructive",
      })
      return
    }

    const tableToAdd = {
      tableNumber: newTable.tableNumber,
      capacity: Number.parseInt(newTable.capacity),
      isActive: newTable.isActive
    }

    if (onTableStatusChange) {
      onTableStatusChange(null, tableToAdd)
    }

    setNewTable({
      tableNumber: "",
      capacity: "",
      isActive: "Trống"
    })
    setIsAddDialogOpen(false)

    toast({
      title: "Thành công",
      description: `Đã thêm bàn ${tableToAdd.tableNumber}`,
    })
  }

  const handleUpdateTable = async () => {
    if (!selectedTable) return

    try {
      if (onTableStatusChange) {
        await onTableStatusChange(selectedTable._id, selectedTable.isActive)
      }
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error('Error updating table:', error)
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleDeleteTable = () => {
    if (!selectedTable) return

    const updatedTables = tables.filter((table) => table._id !== selectedTable._id)
    setTables(updatedTables)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Thành công",
      description: `Đã xóa ${selectedTable.name}`,
    })
  }

  const getStatusText = (status) => {
    switch (status) {
      case "Trống":
        return "Trống"
      case "Đang phục vụ":
        return "Đang phục vụ"
      case "Đã đặt trước":
        return "Đã đặt trước"
      case "Đang dọn dẹp":
        return "Đang dọn dẹp"
      default:
        return "Không xác định"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Trống":
        return "bg-green-100 text-green-800 border-green-200"
      case "Đang phục vụ":
        return "bg-red-100 text-red-800 border-red-200"
      case "Đã đặt trước":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Đang dọn dẹp":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusBgColor = (status) => {
    switch (status) {
      case "Trống":
        return "bg-gradient-to-br from-green-50 to-green-100"
      case "Đang phục vụ":
        return "bg-gradient-to-br from-red-50 to-red-100"
      case "Đã đặt trước":
        return "bg-gradient-to-br from-blue-50 to-blue-100"
      case "Đang dọn dẹp":
        return "bg-gradient-to-br from-yellow-50 to-yellow-100"
      default:
        return "bg-gradient-to-br from-gray-50 to-gray-100"
    }
  }

  return (
    <div className="space-y-4">
      {editable && (
        <div className="flex justify-end">
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open)
            if (!open) {
              setNewTable({
                tableNumber: "",
                capacity: "",
                isActive: "Trống"
              })
            }
          }}>
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
                  <Label htmlFor="table-number" className="text-gray-700">
                    Số bàn
                  </Label>
                  <Input
                    id="table-number"
                    value={newTable.tableNumber}
                    onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })}
                    placeholder="Nhập số bàn (VD: 1)"
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
                    value={newTable.isActive}
                    onValueChange={(value) => setNewTable({ ...newTable, isActive: value })}
                  >
                    <SelectTrigger id="table-status" className="border-gray-200">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Trống">Trống</SelectItem>
                      <SelectItem value="Đang phục vụ">Đang phục vụ</SelectItem>
                      <SelectItem value="Đã đặt trước">Đã đặt trước</SelectItem>
                      <SelectItem value="Đang dọn dẹp">Đang dọn dẹp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="border-gray-200" onClick={() => {
                  setIsAddDialogOpen(false)
                  setNewTable({
                    tableNumber: "",
                    capacity: "",
                    isActive: "Trống"
                  })
                }}>
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
            key={table._id}
            className={`group cursor-pointer border-0 transition-all hover:shadow-md ${
              selectable && table.isActive === "Trống" ? "hover:-translate-y-1" : ""
            } ${getStatusBgColor(table.isActive)}`}
            onClick={() => handleTableClick(table)}
          >
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div
                  className={`mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-white/80 shadow-sm ${
                    table.isActive === "Trống"
                      ? "text-green-600"
                      : table.isActive === "Đang phục vụ"
                        ? "text-red-600"
                        : table.isActive === "Đã đặt trước"
                          ? "text-blue-600"
                          : "text-yellow-600"
                  }`}
                >
                  <Coffee className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Bàn {table.tableNumber}</h3>
                <div className="mt-1 flex items-center gap-1 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{table.capacity} người</span>
                </div>
                <Badge
                  className={`mt-2 ${getStatusColor(table.isActive)} border px-3 py-1 text-xs font-medium shadow-sm`}
                >
                  {table.isActive}
                </Badge>
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
                <Label htmlFor="edit-table-number" className="text-gray-700">
                  Số bàn
                </Label>
                <Input
                  id="edit-table-number"
                  value={selectedTable.tableNumber}
                  onChange={(e) => setSelectedTable({ ...selectedTable, tableNumber: e.target.value })}
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
                  value={selectedTable.isActive}
                  onValueChange={(value) => setSelectedTable({ ...selectedTable, isActive: value })}
                >
                  <SelectTrigger id="edit-table-status" className="border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trống">Trống</SelectItem>
                    <SelectItem value="Đang phục vụ">Đang phục vụ</SelectItem>
                    <SelectItem value="Đã đặt trước">Đã đặt trước</SelectItem>
                    <SelectItem value="Đang dọn dẹp">Đang dọn dẹp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
