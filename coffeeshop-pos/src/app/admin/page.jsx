"use client"

import { useEffect, useState } from "react"
import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpIcon, ArrowDownIcon, Coffee, DollarSign, ShoppingCart, Users } from "lucide-react"

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Dữ liệu cho biểu đồ doanh thu
  const revenueData = {
    labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
    datasets: [
      {
        label: "Doanh thu (triệu VNĐ)",
        data: [12, 19, 15, 17, 22, 24, 25, 27, 24, 23, 25, 28],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  }

  // Dữ liệu cho biểu đồ sản phẩm bán chạy
  const productData = {
    labels: ["Cà phê", "Trà sữa", "Nước ép", "Sinh tố", "Soda", "Trà"],
    datasets: [
      {
        label: "Số lượng bán",
        data: [120, 190, 150, 170, 110, 130],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  // Dữ liệu cho biểu đồ xu hướng đơn hàng
  const orderTrendData = {
    labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
    datasets: [
      {
        label: "Số đơn hàng",
        data: [65, 78, 80, 81, 85, 87, 90, 91, 92, 95, 97, 99],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }

  if (!mounted) return null

  return (
    <div className="flex-1 space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tổng quan</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng doanh thu</p>
                <p className="text-2xl font-bold">256.5M VNĐ</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center pt-4 text-sm text-green-600">
              <ArrowUpIcon className="mr-1 h-4 w-4" />
              <span>12.5% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng đơn hàng</p>
                <p className="text-2xl font-bold">1,024</p>
              </div>
              <div className="rounded-full bg-orange-100 p-3">
                <ShoppingCart className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center pt-4 text-sm text-green-600">
              <ArrowUpIcon className="mr-1 h-4 w-4" />
              <span>8.2% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sản phẩm đã bán</p>
                <p className="text-2xl font-bold">1,540</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <Coffee className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="flex items-center pt-4 text-sm text-green-600">
              <ArrowUpIcon className="mr-1 h-4 w-4" />
              <span>5.3% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Khách hàng mới</p>
                <p className="text-2xl font-bold">320</p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center pt-4 text-sm text-red-600">
              <ArrowDownIcon className="mr-1 h-4 w-4" />
              <span>3.1% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          <TabsTrigger value="products">Sản phẩm bán chạy</TabsTrigger>
          <TabsTrigger value="orders">Xu hướng đơn hàng</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Doanh thu theo tháng</CardTitle>
              <CardDescription>Tổng doanh thu của cửa hàng trong 12 tháng qua</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Bar
                  data={revenueData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm bán chạy</CardTitle>
              <CardDescription>Các sản phẩm bán chạy nhất trong tháng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Bar
                  data={productData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Xu hướng đơn hàng</CardTitle>
              <CardDescription>Số lượng đơn hàng theo tháng trong năm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Line
                  data={orderTrendData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
