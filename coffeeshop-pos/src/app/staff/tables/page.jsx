"use client"

import { useState } from "react"
import { TableManagement } from "@/components/table-management"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Coffee, Users, Clock, Info } from "lucide-react"

// Dữ liệu mẫu cho bàn
const initialTables = [
  { id: 1, name: "Bàn 1", capacity: 4, status: "available" },
  { id: 2, name: "Bàn 2", capacity: 2, status: "available" },
  { id: 3, name: "Bàn 3", capacity: 6, status: "occupied", customer: "Nguyễn Văn A", timeOccupied: "14:30" },
  { id: 4, name: "Bàn 4", capacity: 4, status: "available" },
  { id: 5, name: "Bàn 5", capacity: 8, status: "reserved", customer: "Trần Thị B", timeOccupied: "18:00" },
  { id: 6, name: "Bàn 6", capacity: 2, status: "available" },
  { id: 7, name: "Bàn 7", capacity: 4, status: "cleaning" },
  { id: 8, name: "Bàn 8", capacity: 6, status: "available" },
  { id: 9, name: "Bàn 9", capacity: 2, status: "occupied", customer: "Lê Văn C", timeOccupied: "15:45" },
  { id: 10, name: "Bàn 10", capacity: 8, status: "available" },
  { id: 11, name: "Bàn 11", capacity: 4, status: "available" },
  { id: 12, name: "Bàn 12", capacity: 2, status: "reserved", customer: "Phạm Thị D", timeOccupied: "19:30" },
]

export default function TablesPage() {
  const [tables, setTables] = useState(initialTables)
  const [statusFilter, setStatusFilter] = useState("all")

  // Lọc bàn theo trạng thái
  const filteredTables = tables.filter((table) => {
    return statusFilter === "all" || table.status === statusFilter
  })

  // Đếm số lượng bàn theo trạng thái
  const availableCount = tables.filter((table) => table.status === "available").length
  const occupiedCount = tables.filter((table) => table.status === "occupied").length
  const reservedCount = tables.filter((table) => table.status === "reserved").length
  const cleaningCount = tables.filter((table) => table.status === "cleaning").length

  return (
    <div className="flex-1 space-y-6 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-800">Quản lý bàn</h2>
          <p className="mt-1 text-gray-500">Quản lý và theo dõi trạng thái các bàn trong cửa hàng</p>
        </div>
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
                  <TableManagement tables={filteredTables} onTablesChange={setTables} editable={true} />
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
