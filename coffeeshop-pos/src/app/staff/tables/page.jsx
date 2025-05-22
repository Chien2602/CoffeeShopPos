"use client"

import { useState, useEffect } from "react"
import { TableManagement } from "@/components/table-management"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Coffee, Users, Clock, Info, Plus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function TablesPage() {
  const [tables, setTables] = useState([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedTable, setSelectedTable] = useState(null)
  const [newTable, setNewTable] = useState({
    tableNumber: "",
    capacity: "",
    isActive: "Trống"
  })
  const token = sessionStorage.getItem('authToken')
  
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('http://localhost:3001/tables', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch tables')
        }
        const data = await response.json()
        console.log(data)
        setTables(data)
      } catch (error) {
        console.error('Error fetching tables:', error)
        toast({
          title: "Lỗi",
          description: error.message,
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchTables()
    }
  }, [token])

  // Update table status
  const handleTableStatusChange = async (tableId, tableData) => {
    try {
      // If tableId is null, this is an add table request
      if (!tableId) {
        // Check if table number already exists
        const existingTable = tables.find(table => table.tableNumber === tableData.tableNumber)
        if (existingTable) {
          toast({
            title: "Lỗi",
            description: `Bàn số ${tableData.tableNumber} đã tồn tại`,
            variant: "destructive"
          })
          return
        }

        const response = await fetch('http://localhost:3001/tables', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(tableData)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to add table')
        }

        const data = await response.json()
        setTables([...tables, data])
        setIsAddDialogOpen(false)
        toast({
          title: "Thành công",
          description: "Thêm bàn mới thành công"
        })
        return
      }

      // This is an update table request
      const tableToUpdate = tables.find(table => table._id === tableId)
      if (!tableToUpdate) {
        throw new Error('Table not found')
      }

      const response = await fetch(`http://localhost:3001/tables/${tableId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          tableNumber: tableToUpdate.tableNumber,
          capacity: tableToUpdate.capacity,
          isActive: tableData
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update table status')
      }

      const data = await response.json()
      console.log(data)
      // Update local state with the updated table from response
      setTables(tables.map(table => 
        table._id === tableId ? data.table : table
      ))
      toast({
        title: "Thành công",
        description: data.message || "Cập nhật trạng thái bàn thành công"
      })
    } catch (error) {
      console.error('Error updating table status:', error)
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  // Lọc bàn theo trạng thái
  const filteredTables = tables.filter((table) => {
    return statusFilter === "all" || table.isActive === statusFilter
  })

  // Đếm số lượng bàn theo trạng thái
  const availableCount = tables.filter((table) => table.isActive === "Trống").length
  const occupiedCount = tables.filter((table) => table.isActive === "Đang phục vụ").length
  const reservedCount = tables.filter((table) => table.isActive === "Đã đặt trước").length
  const cleaningCount = tables.filter((table) => table.isActive === "Đang dọn dẹp").length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-800">Quản lý bàn</h2>
          <p className="mt-1 text-gray-500">Quản lý và theo dõi trạng thái các bàn trong cửa hàng</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (!open) {
            setSelectedTable(null)
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
              Thêm bàn mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedTable ? 'Cập nhật bàn' : 'Thêm bàn mới'}</DialogTitle>
              <DialogDescription>
                {selectedTable ? 'Cập nhật thông tin bàn' : 'Nhập thông tin bàn mới cần thêm vào hệ thống'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tableNumber" className="text-right">
                  Số bàn
                </Label>
                <Input
                  id="tableNumber"
                  value={newTable.tableNumber}
                  onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })}
                  className="col-span-3"
                  placeholder="VD: 1"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">
                  Sức chứa
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newTable.capacity}
                  onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
                  className="col-span-3"
                  placeholder="VD: 4"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Trạng thái
                </Label>
                <Select
                  value={newTable.isActive}
                  onValueChange={(value) => setNewTable({ ...newTable, isActive: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trống">Trống</SelectItem>
                    <SelectItem value="Đã đặt trước">Đã đặt trước</SelectItem>
                    <SelectItem value="Đang phục vụ">Đang phục vụ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false)
                setSelectedTable(null)
                setNewTable({
                  tableNumber: "",
                  capacity: "",
                  isActive: "Trống"
                })
              }}>
                Hủy
              </Button>
              <Button 
                onClick={() => handleTableStatusChange(selectedTable, newTable.isActive)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {selectedTable ? 'Cập nhật' : 'Thêm bàn'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Bàn trống</p>
                <p className="mt-1 text-3xl font-bold text-green-600">{availableCount}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3 text-green-600">
                <Coffee className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Đang phục vụ</p>
                <p className="mt-1 text-3xl font-bold text-red-600">{occupiedCount}</p>
              </div>
              <div className="rounded-full bg-red-100 p-3 text-red-600">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Đã đặt trước</p>
                <p className="mt-1 text-3xl font-bold text-blue-600">{reservedCount}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Đang dọn dẹp</p>
                <p className="mt-1 text-3xl font-bold text-yellow-600">{cleaningCount}</p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3 text-yellow-600">
                <Coffee className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Sơ đồ bàn</CardTitle>
          <CardDescription>Quản lý và cập nhật trạng thái các bàn</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter} className="mb-4">
            <TabsList className="w-full justify-start gap-1 bg-gray-100/80 p-1">
              <TabsTrigger
                value="all"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white"
              >
                Tất cả ({tables.length})
              </TabsTrigger>
              <TabsTrigger
                value="available"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-500 data-[state=active]:text-white"
              >
                Trống ({availableCount})
              </TabsTrigger>
              <TabsTrigger
                value="occupied"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-500 data-[state=active]:text-white"
              >
                Đang phục vụ ({occupiedCount})
              </TabsTrigger>
              <TabsTrigger
                value="reserved"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white"
              >
                Đã đặt trước ({reservedCount})
              </TabsTrigger>
              <TabsTrigger
                value="cleaning"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-yellow-500 data-[state=active]:text-white"
              >
                Đang dọn dẹp ({cleaningCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={statusFilter} className="mt-4">
              <div className="rounded-lg border border-gray-100 bg-white p-4">
                {filteredTables.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center text-center text-gray-400">
                    <Info className="mb-2 h-12 w-12 text-gray-300" />
                    <p className="font-medium">Không có bàn nào</p>
                    <p className="mt-1 text-sm">Không tìm thấy bàn nào với trạng thái đã chọn</p>
                  </div>
                ) : (
                  <TableManagement 
                    tables={filteredTables} 
                    onTableStatusChange={handleTableStatusChange}
                    editable={true} 
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Hướng dẫn trạng thái</CardTitle>
          <CardDescription>Ý nghĩa của các trạng thái bàn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
              <Badge className="h-8 w-8 rounded-full bg-green-100 p-1.5 text-green-600">
                <Coffee className="h-5 w-5" />
              </Badge>
              <div>
                <p className="font-medium text-gray-800">Trống</p>
                <p className="text-sm text-gray-500">Bàn sẵn sàng phục vụ khách hàng</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
              <Badge className="h-8 w-8 rounded-full bg-red-100 p-1.5 text-red-600">
                <Users className="h-5 w-5" />
              </Badge>
              <div>
                <p className="font-medium text-gray-800">Đang phục vụ</p>
                <p className="text-sm text-gray-500">Bàn đang có khách sử dụng</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
              <Badge className="h-8 w-8 rounded-full bg-blue-100 p-1.5 text-blue-600">
                <Clock className="h-5 w-5" />
              </Badge>
              <div>
                <p className="font-medium text-gray-800">Đã đặt trước</p>
                <p className="text-sm text-gray-500">Bàn đã được đặt cho khách hàng</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
              <Badge className="h-8 w-8 rounded-full bg-yellow-100 p-1.5 text-yellow-600">
                <Coffee className="h-5 w-5" />
              </Badge>
              <div>
                <p className="font-medium text-gray-800">Đang dọn dẹp</p>
                <p className="text-sm text-gray-500">Bàn đang được dọn dẹp</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
