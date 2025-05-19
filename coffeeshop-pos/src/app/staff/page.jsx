"use client"

import { useState } from "react"
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
} from "lucide-react"

// Thêm sau các import
// Tùy chỉnh scrollbar
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

// Dữ liệu mẫu cho sản phẩm
const initialProducts = [
  {
    id: 1,
    name: "Cà phê đen",
    category: "Cà phê",
    price: 25000,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Cà phê sữa",
    category: "Cà phê",
    price: 30000,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Trà sữa trân châu",
    category: "Trà sữa",
    price: 35000,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    name: "Trà sữa matcha",
    category: "Trà sữa",
    price: 35000,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 5,
    name: "Nước ép cam",
    category: "Nước ép",
    price: 40000,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 6,
    name: "Nước ép táo",
    category: "Nước ép",
    price: 40000,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 7,
    name: "Sinh tố xoài",
    category: "Sinh tố",
    price: 45000,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 8,
    name: "Sinh tố dâu",
    category: "Sinh tố",
    price: 45000,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 9,
    name: "Soda chanh",
    category: "Soda",
    price: 35000,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 10,
    name: "Soda việt quất",
    category: "Soda",
    price: 35000,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 11,
    name: "Trà đào",
    category: "Trà",
    price: 30000,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 12,
    name: "Trà chanh",
    category: "Trà",
    price: 25000,
    image: "/placeholder.svg?height=80&width=80",
  },
]

// Dữ liệu mẫu cho bàn
const initialTables = [
  { id: 1, name: "Bàn 1", capacity: 4, status: "available" },
  { id: 2, name: "Bàn 2", capacity: 2, status: "available" },
  { id: 3, name: "Bàn 3", capacity: 6, status: "occupied", customer: "Nguyễn Văn A", timeOccupied: "14:30" },
  { id: 4, name: "Bàn 4", capacity: 4, status: "available" },
  { id: 5, name: "Bàn 5", capacity: 8, status: "reserved", customer: "Trần Thị B", timeOccupied: "18:00" },
  { id: 6, name: "Bàn 6", capacity: 2, status: "available" },
]

// Dữ liệu mẫu cho khách hàng
const initialCustomers = [
  { id: 1, name: "Nguyễn Văn A", phone: "0901234567", points: 120, discount: 10000 },
  { id: 2, name: "Trần Thị B", phone: "0912345678", points: 85, discount: 5000 },
  { id: 3, name: "Lê Văn C", phone: "0923456789", points: 210, discount: 20000 },
]

// Thay đổi phần lọc danh mục để thêm icon
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

export default function POSPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState(initialProducts)
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

  // Lọc sản phẩm theo từ khóa tìm kiếm và danh mục
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Lọc khách hàng theo từ khóa tìm kiếm
  const filteredCustomers = initialCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      customer.phone.includes(customerSearchTerm),
  )

  // Lấy danh sách các danh mục duy nhất
  const categories = ["all", ...Array.from(new Set(products.map((product) => product.category)))]

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item,
        ),
      )
    } else {
      setCart([...cart, { ...product, quantity: 1, total: product.price }])
    }
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: product.name,
    })
  }

  // Tăng số lượng sản phẩm trong giỏ hàng
  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price } : item,
      ),
    )
  }

  // Giảm số lượng sản phẩm trong giỏ hàng
  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1, total: (item.quantity - 1) * item.price }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCart([])
    setSelectedTable(null)
    setSelectedCustomer(null)
  }

  // Tính tổng tiền hàng
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0)

  // Tính thuế (10%)
  const tax = subtotal * 0.1

  // Tính tổng tiền thanh toán
  const total = subtotal + tax

  // Xử lý thanh toán
  const handlePayment = () => {
    if (cart.length === 0) {
      toast({
        title: "Giỏ hàng trống",
        description: "Vui lòng thêm sản phẩm vào giỏ hàng",
        variant: "destructive",
      })
      return
    }

    setIsPaymentDialogOpen(false)
    setIsPrintDialogOpen(true)

    // Cập nhật trạng thái bàn nếu có
    if (selectedTable) {
      // Trong thực tế, bạn sẽ cập nhật trạng thái bàn trong cơ sở dữ liệu
      toast({
        title: "Đã cập nhật trạng thái bàn",
        description: `${selectedTable.name} đã được đánh dấu là trống`,
      })
    }

    // Cập nhật điểm tích lũy cho khách hàng nếu có
    if (selectedCustomer) {
      // Trong thực tế, bạn sẽ cập nhật điểm tích lũy trong cơ sở dữ liệu
      toast({
        title: "Đã cập nhật điểm tích lũy",
        description: `Khách hàng ${selectedCustomer.name} đã được cộng ${Math.floor(total / 10000)} điểm`,
      })
    }

    // Tạo mã đơn hàng mới cho lần thanh toán tiếp theo
    setOrderNumber(Math.floor(900 + Math.random() * 100).toString())
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

  // Thêm trước return statement
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
            {categories.map((category) => (
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
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md"
              >
                <div className="bg-gray-100 aspect-square flex items-center justify-center">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="bg-gray-600 text-white p-2">
                  <h3 className="font-medium">{product.name}</h3>
                </div>
                <div className="flex items-center justify-between p-2 border-t-0 border-gray-200">
                  <p className="font-bold">{product.price.toLocaleString()} VND</p>
                  <Button
                    size="sm"
                    className="h-8 bg-green-500 hover:bg-green-600 text-white rounded-full px-3"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Thêm
                  </Button>
                </div>
              </div>
            ))}
          </div>
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
                    key={item.id}
                    className="flex items-center gap-3 border border-gray-100 rounded-lg p-2 hover:bg-gray-50"
                  >
                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 shadow-sm">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center border border-gray-200 rounded-full bg-white shadow-sm">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full hover:bg-red-50 hover:text-red-500 p-0"
                            onClick={() => decreaseQuantity(item.id)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full hover:bg-green-50 hover:text-green-500 p-0"
                            onClick={() => increaseQuantity(item.id)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="text-gray-700 font-medium text-sm">{item.price.toLocaleString()} đ</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 flex-shrink-0"
                      onClick={() => removeFromCart(item.id)}
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
              >
                <UserCircle className="mr-2 h-5 w-5 text-blue-500" />
                {selectedCustomer ? selectedCustomer.name : "Chọn khách hàng"}
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-10 bg-blue-50 hover:bg-blue-100 border-blue-200"
                onClick={() => setIsTableDialogOpen(true)}
              >
                <CoffeeIcon className="mr-2 h-5 w-5 text-amber-600" />
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
              <TableManagement
                tables={initialTables}
                onTableSelect={(table) => {
                  setSelectedTable(table)
                  setIsTableDialogOpen(false)
                }}
                selectable={true}
                editable={false}
              />
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
              <div className="mb-4 flex items-center gap-2 border border-gray-200 rounded-md p-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
                  value={customerSearchTerm}
                  onChange={(e) => setCustomerSearchTerm(e.target.value)}
                  className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
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
                        key={customer.id}
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
            </div>
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
