"use client"

import React, { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TableManagement } from "@/components/table-management"
import { PrintInvoice } from "@/components/print-invoice"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  CreditCard,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  User,
  Coffee,
  CupSodaIcon as Cup,
  GlassWater,
  Banana,
  Leaf,
  Sparkles,
  Percent,
  Trash2,
  UserCircle,
  CoffeeIcon,
  CircleDollarSign,
  BadgePercent,
  ShoppingBag,
  Loader2,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from "lucide-react"
import { Label } from "@/components/ui/label"
// import * as jwt_decode from 'jwt-decode';

const scrollbarStyles = `
  body {
    overflow: hidden; /* Ẩn thanh cuộn ngoài cùng của trang */
  }
  .scrollbar-thin::-webkit-scrollbar {
    width: 8px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-none {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`

const API_BASE_URL = "http://localhost:3001"

// Add function to decode JWT token
const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("Error decoding token:", error)
    return null
  }
}

export default function POSPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [tables, setTables] = useState([])
  const [customers, setCustomers] = useState([])
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedTable, setSelectedTable] = useState(null)
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false)
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customerSearchTerm, setCustomerSearchTerm] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt")
  const [orderNumber, setOrderNumber] = useState("985")
  const [editingItem, setEditingItem] = useState(null)
  const [loading, setLoading] = useState({
    products: true,
    categories: true,
    tables: true,
    customers: true,
  })
  const [error, setError] = useState({
    products: null,
    categories: null,
    tables: null,
    customers: null,
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage, setProductsPerPage] = useState(12)
  const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken")
  const user = token ? decodeToken(token) : null
  // console.log(user)

  // const user = jwt_decode(token);

  const [isAddCustomerDialogOpen, setIsAddCustomerDialogOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading((prev) => ({ ...prev, products: true }))
        const response = await fetch(`${API_BASE_URL}/products`)
        if (!response.ok) throw new Error("Failed to fetch products")
        const data = await response.json()
        console.log(data)
        setProducts(Array.isArray(data) ? data : [])
        setError((prev) => ({ ...prev, products: null }))
      } catch (err) {
        console.error("Error fetching products:", err)
        setError((prev) => ({ ...prev, products: err.message }))
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading((prev) => ({ ...prev, products: false }))
      }
    }
    fetchProducts()
  }, [toast])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading((prev) => ({ ...prev, categories: true }))
        const response = await fetch(`${API_BASE_URL}/categories`)
        if (!response.ok) throw new Error("Failed to fetch categories")
        const data = await response.json()
        setCategories(data)
        setError((prev) => ({ ...prev, categories: null }))
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError((prev) => ({ ...prev, categories: err.message }))
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading((prev) => ({ ...prev, categories: false }))
      }
    }
    fetchCategories()
  }, [toast])

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading((prev) => ({ ...prev, tables: true }))
        const response = await fetch(`${API_BASE_URL}/tables`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) throw new Error("Failed to fetch tables")
        const data = await response.json()
        if (Array.isArray(data)) {
          setTables(
            data.map((table) => ({
              ...table,
              id: table._id,
              name: `Bàn ${table.tableNumber}`,
              status: table.status || "available",
            })),
          )
        } else {
          console.error("Invalid data format received:", data)
          toast({
            title: "Lỗi dữ liệu",
            description: "Định dạng dữ liệu không hợp lệ",
            variant: "destructive",
          })
        }
        setError((prev) => ({ ...prev, tables: null }))
      } catch (err) {
        console.error("Error fetching tables:", err)
        setError((prev) => ({ ...prev, tables: err.message }))
        toast({
          title: "Error",
          description: "Failed to load tables. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading((prev) => ({ ...prev, tables: false }))
      }
    }
    fetchTables()
  }, [toast, token])

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading((prev) => ({ ...prev, customers: true }))
        const response = await fetch(`${API_BASE_URL}/customers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) throw new Error("Failed to fetch customers")
        const data = await response.json()
        if (Array.isArray(data)) {
          setCustomers(
            data.map((customer) => ({
              ...customer,
              id: customer._id,
              discount: customer.points >= 100 ? Math.floor(customer.points / 100) * 10000 : 0,
            })),
          )
        } else {
          console.error("Invalid customer data format:", data)
          toast({
            title: "Lỗi dữ liệu",
            description: "Định dạng dữ liệu khách hàng không hợp lệ",
            variant: "destructive",
          })
        }
        setError((prev) => ({ ...prev, customers: null }))
      } catch (err) {
        console.error("Error fetching customers:", err)
        setError((prev) => ({ ...prev, customers: err.message }))
        toast({
          title: "Error",
          description: "Failed to load customers. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading((prev) => ({ ...prev, customers: false }))
      }
    }
    fetchCustomers()
  }, [toast, token])

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ thông tin bắt buộc",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCustomer),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add customer")
      }

      const data = await response.json()
      setCustomers([...customers, data])
      setSelectedCustomer(data)
      setIsAddCustomerDialogOpen(false)
      setNewCustomer({
        name: "",
        phone: "",
        email: "",
        address: "",
      })

      toast({
        title: "Thành công",
        description: "Đã thêm khách hàng mới",
      })
    } catch (err) {
      console.error("Error adding customer:", err)
      toast({
        title: "Lỗi",
        description: err.message || "Không thể thêm khách hàng. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }

  const categoryList = ["all", ...categories.map((category) => category.title)]

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Cà phê":
        return <Coffee className="h-5 w-5 text-amber-700" />
      case "Trà sữa":
        return <Cup className="h-5 w-5 text-purple-600" />
      case "Nước ép":
        return <GlassWater className="h-5 w-5 text-orange-500" />
      case "Sinh tố":
        return <Banana className="h-5 w-5 text-yellow-500" />
      case "Soda":
        return <Sparkles className="h-5 w-5 text-blue-500" />
      case "Trà":
        return <Leaf className="h-5 w-5 text-green-600" />
      default:
        return <ShoppingBag className="h-5 w-5 text-gray-600" />
    }
  }

  const filteredProducts = Array.isArray(products)
    ? products.filter((product) => {
        const matchesSearch = product?.title?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory =
          categoryFilter === "all" ||
          (product?.categoryId && categories.find((cat) => cat._id === product.categoryId)?.title === categoryFilter)
        return matchesSearch && matchesCategory
      })
    : []

  // Thêm thông tin hiển thị kết quả tìm kiếm
  const searchInfo =
    filteredProducts.length === 0 ? "Không tìm thấy sản phẩm nào" : `Hiển thị ${filteredProducts.length} sản phẩm`

  // Lọc khách hàng theo từ khóa tìm kiếm
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      customer.phone?.includes(customerSearchTerm),
  )

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.productId === product._id)
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item,
        ),
      )
    } else {
      setCart([
        ...cart,
        {
          _id: product._id, // This will be used as the cart item ID
          productId: product._id, // This ensures the product ID matches the database
          title: product.title,
          price: product.price,
          quantity: 1,
          total: product.price,
          thumbnail: product.thumbnail,
        },
      ])
    }
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: product.title,
    })
  }

  // Tăng số lượng sản phẩm trong giỏ hàng
  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.productId === id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item,
      ),
    )
  }

  // Giảm số lượng sản phẩm trong giỏ hàng
  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((item) =>
          item.productId === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1, total: (item.quantity - 1) * item.price }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.productId !== id))
  }

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCart([])
    setSelectedTable(null)
    setSelectedCustomer(null)
  }

  // Chỉnh sửa số lượng sản phẩm
  const handleEditItem = (item) => {
    setEditingItem(item)
  }

  // Lưu chỉnh sửa số lượng sản phẩm
  const handleSaveEdit = (id, newQuantity) => {
    if (newQuantity > 0) {
      setCart(
        cart.map((item) =>
          item.productId === id ? { ...item, quantity: newQuantity, total: newQuantity * item.price } : item,
        ),
      )
    } else {
      removeFromCart(id)
    }
    setEditingItem(null)
  }

  // Tính tổng tiền hàng
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0)

  // Tính thuế (10%)
  const tax = subtotal * 0.1

  // Tính tổng tiền thanh toán
  const total = subtotal + tax

  // Xử lý thanh toán
  const handlePayment = async () => {
    if (cart.length === 0) {
      toast({
        title: "Giỏ hàng trống",
        description: "Vui lòng thêm sản phẩm vào giỏ hàng",
        variant: "destructive",
      })
      return
    }

    if (!selectedTable) {
      toast({
        title: "Chưa chọn bàn",
        description: "Vui lòng chọn bàn trước khi thanh toán",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Lỗi xác thực",
        description: "Vui lòng đăng nhập lại",
        variant: "destructive",
      })
      return
    }

    try {
      // Tạo đơn hàng mới
      const orderData = {
        tableId: selectedTable._id,
        customerId: selectedCustomer?._id || null,
        totalAmount: total,
        employeeId: user.id,
        items: cart.map((item) => ({
          productId: item._id, // Sử dụng _id thay vì productId
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        })),
        paymentMethod,
        status: "Đã thanh toán",
      }

      console.log('Order data being sent:', orderData); // Debug log

      // Gửi đơn hàng lên server
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create order")
      }

      const orderResult = await response.json()

      // Cập nhật trạng thái bàn
      const tableResponse = await fetch(`${API_BASE_URL}/tables/${selectedTable.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: "Đang phục vụ" }),
      })

      if (!tableResponse.ok) {
        console.error("Failed to update table status")
        toast({
          title: "Cảnh báo",
          description: "Không thể cập nhật trạng thái bàn",
          variant: "destructive",
        })
      }

      // Cập nhật điểm tích lũy cho khách hàng nếu có
      if (selectedCustomer) {
        const newPoints = Math.floor(total / 10000)
        const customerResponse = await fetch(`${API_BASE_URL}/customers/${selectedCustomer.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            points: selectedCustomer.points + newPoints,
          }),
        })

        if (!customerResponse.ok) {
          console.error("Failed to update customer points")
          toast({
            title: "Cảnh báo",
            description: "Không thể cập nhật điểm tích lũy",
            variant: "destructive",
          })
        }
      }

      setIsPaymentDialogOpen(false)
      setIsPrintDialogOpen(true)

      // Tạo mã đơn hàng mới cho lần thanh toán tiếp theo
      setOrderNumber(Math.floor(900 + Math.random() * 100).toString())

      // Clear cart and selections
      clearCart()

      toast({
        title: "Thanh toán thành công",
        description: `Đơn hàng #${orderNumber} đã được thanh toán`,
      })
    } catch (err) {
      console.error("Error processing payment:", err)
      toast({
        title: "Lỗi thanh toán",
        description: err.message || "Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }

  // Dữ liệu cho hóa đơn
  const invoiceData = {
    orderNumber: orderNumber,
    date: new Date().toLocaleString(),
    table: selectedTable ? selectedTable.name : null,
    staff: "Nhân viên demo",
    customer: selectedCustomer,
    items: cart,
    subtotal: subtotal,
    tax: tax,
    total: total,
    paymentMethod: paymentMethod,
  }

  // Reset pagination when search or category filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, categoryFilter])

  return (
    <>
      <style jsx global>
        {scrollbarStyles}
      </style>
      <div className="flex h-screen flex-col md:flex-row">
        {/* Phần trái: Danh sách sản phẩm */}
        <div className="flex-1 overflow-auto bg-white p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 h-screen">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">POS Bán Nước Uống</h1>
            <div className="relative w-[300px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-gray-200"
              />
            </div>
          </div>

          <div className="mb-4 flex overflow-x-auto bg-gray-100 p-2 rounded-md">
            {loading.categories ? (
              <div className="flex items-center justify-center p-2 w-full">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Đang tải danh mục...</span>
              </div>
            ) : (
              categoryList.map((category) => (
                <Button
                  key={category}
                  variant="ghost"
                  className={`mr-1 flex items-center justify-center ${
                    categoryFilter === category ? "bg-white shadow-sm font-medium" : "bg-transparent hover:bg-white/60"
                  }`}
                  onClick={() => setCategoryFilter(category)}
                >
                  {getCategoryIcon(category)}
                  <span className="ml-1.5">{category === "all" ? "Tất cả" : category}</span>
                </Button>
              ))
            )}
          </div>

          {loading.products ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />
              <p className="text-gray-500">Đang tải sản phẩm...</p>
            </div>
          ) : error.products ? (
            <div className="flex flex-col items-center justify-center h-64 text-red-500">
              <p>Không thể tải sản phẩm. Vui lòng thử lại.</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Tải lại
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center text-sm text-gray-500 mb-4">{searchInfo}</div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts
                  .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
                  .map((product) => (
                    <div
                      key={product._id}
                      className="overflow-hidden rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md"
                    >
                      <div className="bg-gray-100 aspect-square flex items-center justify-center">
                        <img
                          src={product.thumbnail || "/placeholder.svg?height=80&width=80"}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="bg-[#48A6A7] text-white p-2">
                        <h3 className="font-medium">{product.title}</h3>
                      </div>
                      <div className="flex items-center justify-between p-2 border-t-0 border-gray-200">
                        <p className="font-bold">{product.price?.toLocaleString()} VND</p>
                        <Button
                          size="sm"
                          className="h-8 bg-[#57B4BA] hover:bg-[#006A71] cursor-pointer text-white rounded-full px-3"
                          onClick={() => addToCart(product)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Thêm
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Pagination Controls */}
              {filteredProducts.length > productsPerPage && (
                <div className="flex justify-center items-center mt-6 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === Math.ceil(filteredProducts.length / productsPerPage) ||
                        (page >= currentPage - 1 && page <= currentPage + 1),
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && <span className="text-gray-500">...</span>}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={`h-8 w-8 p-0 ${
                            currentPage === page ? "bg-[#48A6A7] hover:bg-[#006A71] text-white" : "hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredProducts.length / productsPerPage)))
                    }
                    disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Phần phải: Giỏ hàng và thanh toán */}
        <div className="w-full border-t border-gray-200 md:w-[350px] md:border-l md:border-t-0 h-screen flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center">
              <ShoppingBag className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-medium">Giỏ hàng</h2>
            </div>
            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center"
                  onClick={clearCart}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Xóa tất cả
                </Button>
              )}
              <span className="text-gray-500 text-sm bg-gray-200 px-2 py-1 rounded-md">#{orderNumber}</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 scrollbar-none">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center text-gray-400 py-16">
                <div className="bg-gray-100 rounded-full p-4 mb-4">
                  <ShoppingCart className="h-16 w-16 text-gray-300" />
                </div>
                <p className="text-lg font-medium">Giỏ hàng trống</p>
                <p className="mt-2 text-sm max-w-[250px]">Thêm sản phẩm bằng cách nhấp vào các mục ở bên trái</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 border border-gray-100 rounded-lg p-2 hover:bg-gray-50"
                  >
                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 shadow-sm">
                      <img
                        src={item.thumbnail || "/placeholder.svg?height=80&width=80"}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.title}</h4>
                      <div className="flex items-center justify-between mt-1">
                        {editingItem?.productId === item.productId ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="1"
                              value={editingItem.quantity}
                              onChange={(e) =>
                                setEditingItem({ ...editingItem, quantity: Number.parseInt(e.target.value) || 0 })
                              }
                              className="w-16 h-8 text-center"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(item.productId, editingItem.quantity)}
                              className="h-8 bg-green-500 hover:bg-green-600"
                            >
                              Lưu
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center border border-gray-200 rounded-full bg-white shadow-sm">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full hover:bg-red-50 hover:text-red-500 p-0"
                              onClick={() => decreaseQuantity(item.productId)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span
                              className="w-6 text-center text-xs font-medium cursor-pointer"
                              onClick={() => handleEditItem(item)}
                            >
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full hover:bg-green-50 hover:text-green-500 p-0"
                              onClick={() => increaseQuantity(item.productId)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        <span className="text-gray-700 font-medium text-sm">{item.price?.toLocaleString()} đ</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 flex-shrink-0"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="mb-4 space-y-2 bg-white rounded-lg p-3 shadow-sm">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 flex items-center">
                  <ShoppingBag className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  Tạm tính:
                </span>
                <span>{subtotal.toLocaleString()} VND</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 flex items-center">
                  <Percent className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  Thuế (10%):
                </span>
                <span>{tax.toLocaleString()} VND</span>
              </div>
              {selectedCustomer && selectedCustomer.discount > 0 && (
                <div className="flex justify-between text-green-600 text-sm">
                  <span className="flex items-center">
                    <BadgePercent className="h-3.5 w-3.5 mr-1.5" />
                    Giảm giá:
                  </span>
                  <span>-{selectedCustomer.discount.toLocaleString()} VND</span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-2 text-base border-t border-dashed border-gray-200 mt-2">
                <span className="flex items-center">
                  <CircleDollarSign className="h-4 w-4 mr-1.5 text-blue-500" />
                  Tổng cộng:
                </span>
                <span className="text-blue-600">
                  {(total - (selectedCustomer?.discount || 0) > 0
                    ? total - (selectedCustomer?.discount || 0)
                    : 0
                  ).toLocaleString()}{" "}
                  VND
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                className="w-full justify-start h-10 bg-blue-50 hover:bg-blue-100 border-blue-200"
                onClick={() => setIsCustomerDialogOpen(true)}
                disabled={loading.customers}
              >
                {loading.customers ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserCircle className="mr-2 h-5 w-5 text-blue-500" />
                )}
                {selectedCustomer ? selectedCustomer.name : "Chọn khách hàng"}
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-10 bg-blue-50 hover:bg-blue-100 border-blue-200"
                onClick={() => setIsTableDialogOpen(true)}
                disabled={loading.tables}
              >
                {loading.tables ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CoffeeIcon className="mr-2 h-5 w-5 text-amber-600" />
                )}
                {selectedTable ? selectedTable.name : "Chọn bàn"}
              </Button>

              <Button
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white h-12 mt-2 shadow-sm"
                disabled={cart.length === 0}
                onClick={() => setIsPaymentDialogOpen(true)}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Thanh toán
              </Button>
            </div>
          </div>
        </div>

        {/* Dialog chọn bàn */}
        <Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Chọn bàn</DialogTitle>
              <DialogDescription>Chọn bàn cho đơn hàng này</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {loading.tables ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  <span className="ml-3">Đang tải danh sách bàn...</span>
                </div>
              ) : (
                <TableManagement
                  tables={tables}
                  onTableSelect={(table) => {
                    setSelectedTable(table)
                    setIsTableDialogOpen(false)
                  }}
                  selectable={true}
                  editable={false}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog chọn khách hàng */}
        <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chọn khách hàng</DialogTitle>
              <DialogDescription>Tìm kiếm và chọn khách hàng</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-md p-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
                    value={customerSearchTerm}
                    onChange={(e) => setCustomerSearchTerm(e.target.value)}
                    className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <Button
                  variant="outline"
                  className="whitespace-nowrap"
                  onClick={() => setIsAddCustomerDialogOpen(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Thêm mới
                </Button>
              </div>
              {loading.customers ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-3">Đang tải danh sách khách hàng...</span>
                </div>
              ) : (
                <div className="max-h-[300px] overflow-auto">
                  {filteredCustomers.length === 0 ? (
                    <div className="flex h-20 flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 text-center text-gray-400">
                      <User className="mb-1 h-5 w-5" />
                      <p className="text-sm">Không tìm thấy khách hàng</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredCustomers.map((customer) => (
                        <div
                          key={customer._id}
                          className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
                          onClick={() => {
                            setSelectedCustomer(customer)
                            setIsCustomerDialogOpen(false)
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              <UserCircle className="h-6 w-6" />
                            </div>
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-gray-500">{customer.phone}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-sm text-amber-600">
                              <BadgePercent className="h-3.5 w-3.5 mr-1" />
                              {customer.points} điểm
                            </div>
                            {customer.discount > 0 && (
                              <div className="text-xs text-green-600 flex items-center justify-end mt-1">
                                <Percent className="h-3 w-3 mr-1" />
                                Giảm {customer.discount.toLocaleString()} đ
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog thêm khách hàng mới */}
        <Dialog open={isAddCustomerDialogOpen} onOpenChange={setIsAddCustomerDialogOpen}>
          <DialogContent className="[&>div]:backdrop-blur-sm [&>div]:bg-white/80">
            <DialogHeader>
              <DialogTitle>Thêm khách hàng mới</DialogTitle>
              <DialogDescription>Nhập thông tin chi tiết của khách hàng</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="customer-name" className="text-gray-700">
                  Họ và tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customer-name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="Nhập họ và tên"
                  className="border-gray-200"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customer-phone" className="text-gray-700">
                  Số điện thoại <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customer-phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  placeholder="Nhập số điện thoại"
                  className="border-gray-200"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customer-address" className="text-gray-700">
                  Địa chỉ
                </Label>
                <Input
                  id="customer-address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  placeholder="Nhập địa chỉ"
                  className="border-gray-200"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="border-gray-200" onClick={() => setIsAddCustomerDialogOpen(false)}>
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

        {/* Dialog thanh toán */}
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thanh toán</DialogTitle>
              <DialogDescription>Chọn phương thức thanh toán</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-6 space-y-3 rounded-lg bg-gray-50 p-4">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính:</span>
                  <span>{subtotal.toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Thuế (10%):</span>
                  <span>{tax.toLocaleString()} VND</span>
                </div>
                {selectedCustomer && selectedCustomer.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center">
                      <Percent className="mr-1 h-4 w-4" /> Giảm giá:
                    </span>
                    <span>-{selectedCustomer.discount.toLocaleString()} VND</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-dashed border-gray-300 pt-3 text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span>
                    {(total - (selectedCustomer?.discount || 0) > 0
                      ? total - (selectedCustomer?.discount || 0)
                      : 0
                    ).toLocaleString()}{" "}
                    VND
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium">Phương thức thanh toán</label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={paymentMethod === "Tiền mặt" ? "default" : "outline"}
                    className={`justify-start ${paymentMethod === "Tiền mặt" ? "bg-green-500 hover:bg-green-600" : "border-gray-200"}`}
                    onClick={() => setPaymentMethod("Tiền mặt")}
                  >
                    <CircleDollarSign className="mr-2 h-4 w-4" />
                    Tiền mặt
                  </Button>
                  <Button
                    variant={paymentMethod === "Thẻ ngân hàng" ? "default" : "outline"}
                    className={`justify-start ${paymentMethod === "Thẻ ngân hàng" ? "bg-blue-500 hover:bg-blue-600" : "border-gray-200"}`}
                    onClick={() => setPaymentMethod("Thẻ ngân hàng")}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Thẻ
                  </Button>
                  <Button
                    variant={paymentMethod === "Ví điện tử" ? "default" : "outline"}
                    className={`justify-start ${paymentMethod === "Ví điện tử" ? "bg-purple-500 hover:bg-purple-600" : "border-gray-200"}`}
                    onClick={() => setPaymentMethod("Ví điện tử")}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Ví điện tử
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                Hủy
              </Button>
              <Button
                onClick={handlePayment}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                Xác nhận thanh toán
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog in hóa đơn */}
        <PrintInvoice open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen} orderData={invoiceData} />
      </div>
    </>
  )
}
