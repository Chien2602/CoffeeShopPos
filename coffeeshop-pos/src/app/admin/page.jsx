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

const API_URL = "http://localhost:3001"
const token = sessionStorage.getItem("authToken")

// API functions
const fetchDashboardStats = async () => {
  try {
    const response = await fetch(`${API_URL}/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    if (!response.ok) throw new Error('Failed to fetch dashboard stats')
    return await response.json()
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw error
  }
}

const fetchRevenueData = async () => {
  try {
    const response = await fetch(`${API_URL}/dashboard/revenue`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    if (!response.ok) throw new Error('Failed to fetch revenue data')
    return await response.json()
  } catch (error) {
    console.error('Error fetching revenue data:', error)
    throw error
  }
}

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    newCustomers: 0,
    revenueChange: 0,
    ordersChange: 0,
    productsChange: 0,
    customersChange: 0
  })
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: [{
      label: "Doanh thu (triệu VNĐ)",
      data: [],
      backgroundColor: "rgba(59, 130, 246, 0.5)",
      borderColor: "rgba(59, 130, 246, 1)",
      borderWidth: 1,
    }]
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch dashboard data in parallel
        const [statsData, revenueData] = await Promise.all([
          fetchDashboardStats(),
          fetchRevenueData()
        ])

        // Update stats
        setStats({
          totalRevenue: statsData.totalRevenue,
          totalOrders: statsData.totalOrders,
          totalProducts: statsData.totalProducts,
          newCustomers: statsData.newCustomers,
          revenueChange: statsData.revenueChange,
          ordersChange: statsData.ordersChange,
          productsChange: statsData.productsChange,
          customersChange: statsData.customersChange
        })

        // Update revenue chart data
        setRevenueData(prev => ({
          ...prev,
          labels: revenueData.labels,
          datasets: [{
            ...prev.datasets[0],
            data: revenueData.data
          }]
        }))

      } catch (err) {
        console.error('Error loading dashboard data:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (mounted) {
      loadDashboardData()
    }
  }, [mounted])

  if (!mounted) return null

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
        <h2 className="text-3xl font-bold tracking-tight">Tổng quan</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng doanh thu</p>
                <p className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} VNĐ</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className={`flex items-center pt-4 text-sm ${stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.revenueChange >= 0 ? (
                <ArrowUpIcon className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDownIcon className="mr-1 h-4 w-4" />
              )}
              <span>{Math.abs(stats.revenueChange)}% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng đơn hàng</p>
                <p className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</p>
              </div>
              <div className="rounded-full bg-orange-100 p-3">
                <ShoppingCart className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className={`flex items-center pt-4 text-sm ${stats.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.ordersChange >= 0 ? (
                <ArrowUpIcon className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDownIcon className="mr-1 h-4 w-4" />
              )}
              <span>{Math.abs(stats.ordersChange)}% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sản phẩm đã bán</p>
                <p className="text-2xl font-bold">{stats.totalProducts.toLocaleString()}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <Coffee className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className={`flex items-center pt-4 text-sm ${stats.productsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.productsChange >= 0 ? (
                <ArrowUpIcon className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDownIcon className="mr-1 h-4 w-4" />
              )}
              <span>{Math.abs(stats.productsChange)}% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Khách hàng mới</p>
                <p className="text-2xl font-bold">{stats.newCustomers.toLocaleString()}</p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className={`flex items-center pt-4 text-sm ${stats.customersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.customersChange >= 0 ? (
                <ArrowUpIcon className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDownIcon className="mr-1 h-4 w-4" />
              )}
              <span>{Math.abs(stats.customersChange)}% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
      </div>

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
    </div>
  )
}
