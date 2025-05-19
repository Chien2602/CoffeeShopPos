"use client"

import { useState, useRef } from "react"
import { Edit, MoreHorizontal, Plus, Search, Trash2, Upload, X, ImageIcon, Printer } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Dữ liệu mẫu cho sản phẩm
const initialProducts = [
  {
    id: 1,
    name: "Cà phê đen",
    category: "Cà phê",
    price: 25000,
    image: "/placeholder.svg?height=50&width=50",
    status: "Còn hàng",
  },
  {
    id: 2,
    name: "Cà phê sữa",
    category: "Cà phê",
    price: 30000,
    image: "/placeholder.svg?height=50&width=50",
    status: "Còn hàng",
  },
  {
    id: 3,
    name: "Trà sữa trân châu",
    category: "Trà sữa",
    price: 35000,
    image: "/placeholder.svg?height=50&width=50",
    status: "Còn hàng",
  },
  {
    id: 4,
    name: "Trà sữa matcha",
    category: "Trà sữa",
    price: 35000,
    image: "/placeholder.svg?height=50&width=50",
    status: "Còn hàng",
  },
  {
    id: 5,
    name: "Nước ép cam",
    category: "Nước ép",
    price: 40000,
    image: "/placeholder.svg?height=50&width=50",
    status: "Còn hàng",
  },
  {
    id: 6,
    name: "Nước ép táo",
    category: "Nước ép",
    price: 40000,
    image: "/placeholder.svg?height=50&width=50",
    status: "Còn hàng",
  },
  {
    id: 7,
    name: "Sinh tố xoài",
    category: "Sinh tố",
    price: 45000,
    image: "/placeholder.svg?height=50&width=50",
    status: "Còn hàng",
  },
  {
    id: 8,
    name: "Sinh tố dâu",
    category: "Sinh tố",
    price: 45000,
    image: "/placeholder.svg?height=50&width=50",
    status: "Còn hàng",
  },
]

export default function ProductsPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPrintLabelDialogOpen, setIsPrintLabelDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    status: "Còn hàng",
    image: "/placeholder.svg?height=50&width=50",
  })
  const [previewImage, setPreviewImage] = useState(null)
  const fileInputRef = useRef(null)
  const editFileInputRef = useRef(null)

  // Lọc sản phẩm theo từ khóa tìm kiếm và danh mục
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Xử lý tải lên hình ảnh
  const handleImageUpload = (e, isEdit = false) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result
        if (isEdit) {
          setCurrentProduct({ ...currentProduct, image: result })
        } else {
          setNewProduct({ ...newProduct, image: result })
          setPreviewImage(result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Xử lý thêm sản phẩm mới
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin sản phẩm",
        variant: "destructive",
      })
      return
    }

    const newId = Math.max(...products.map((p) => p.id)) + 1
    const productToAdd = {
      id: newId,
      name: newProduct.name,
      category: newProduct.category,
      price: Number.parseInt(newProduct.price),
      image: newProduct.image,
      status: newProduct.status,
    }

    setProducts([...products, productToAdd])
    setNewProduct({
      name: "",
      category: "",
      price: "",
      status: "Còn hàng",
      image: "/placeholder.svg?height=50&width=50",
    })
    setPreviewImage(null)
    setIsAddDialogOpen(false)

    toast({
      title: "Thành công",
      description: "Đã thêm sản phẩm mới",
    })
  }

  // Xử lý cập nhật sản phẩm
  const handleUpdateProduct = () => {
    if (!currentProduct) return

    const updatedProducts = products.map((product) => (product.id === currentProduct.id ? currentProduct : product))

    setProducts(updatedProducts)
    setIsEditDialogOpen(false)

    toast({
      title: "Thành công",
      description: "Đã cập nhật sản phẩm",
    })
  }

  // Xử lý xóa sản phẩm
  const handleDeleteProduct = () => {
    if (!currentProduct) return

    const updatedProducts = products.filter((product) => product.id !== currentProduct.id)
    setProducts(updatedProducts)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Thành công",
      description: "Đã xóa sản phẩm",
    })
  }

  // Lấy danh sách các danh mục duy nhất
  const categories = ["all", ...Array.from(new Set(products.map((product) => product.category)))]

  return (
    <div className="flex-1 space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              <Plus className="mr-2 h-4 w-4" />
              Thêm sản phẩm
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Thêm sản phẩm mới</DialogTitle>
              <DialogDescription>Nhập thông tin chi tiết cho sản phẩm mới</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex justify-center">
                  <div className="relative h-40 w-40 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleImageUpload(e)}
                      className="hidden"
                      accept="image/*"
                    />
                    <div
                      className="flex h-full w-full cursor-pointer flex-col items-center justify-center"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {previewImage ? (
                        <img
                          src={previewImage || "/placeholder.svg"}
                          alt="Preview"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <>
                          <Upload className="mb-2 h-8 w-8 text-gray-400" />
                          <p className="text-xs text-gray-500">Nhấp để tải lên hình ảnh</p>
                        </>
                      )}
                    </div>
                    {previewImage && (
                      <button
                        className="absolute right-1 top-1 rounded-full bg-white p-1 shadow-md"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPreviewImage(null)
                          setNewProduct({ ...newProduct, image: "/placeholder.svg?height=50&width=50" })
                        }}
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Nhập tên sản phẩm"
                    className="border-gray-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Danh mục <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={newProduct.category}
                    onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cà phê">Cà phê</SelectItem>
                      <SelectItem value="Trà sữa">Trà sữa</SelectItem>
                      <SelectItem value="Nước ép">Nước ép</SelectItem>
                      <SelectItem value="Sinh tố">Sinh tố</SelectItem>
                      <SelectItem value="Soda">Soda</SelectItem>
                      <SelectItem value="Trà">Trà</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price" className="text-sm font-medium">
                    Giá (VNĐ) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="Nhập giá sản phẩm"
                    className="border-gray-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Trạng thái
                  </Label>
                  <Select
                    value={newProduct.status}
                    onValueChange={(value) => setNewProduct({ ...newProduct, status: value })}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Còn hàng">Còn hàng</SelectItem>
                      <SelectItem value="Hết hàng">Hết hàng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 grid gap-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Mô tả
                  </Label>
                  <textarea
                    id="description"
                    placeholder="Nhập mô tả sản phẩm"
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
                onClick={handleAddProduct}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                Thêm sản phẩm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
          <CardDescription>Quản lý tất cả các sản phẩm trong cửa hàng của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={categoryFilter} onValueChange={setCategoryFilter}>
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList className="flex-wrap">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category === "all" ? "Tất cả" : category}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </div>

            <TabsContent value={categoryFilter} className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hình ảnh</TableHead>
                      <TableHead>Tên sản phẩm</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Giá (VNĐ)</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          Không tìm thấy sản phẩm nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.price.toLocaleString()}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                product.status === "Còn hàng"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {product.status}
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
                                    setCurrentProduct(product)
                                    setIsEditDialogOpen(true)
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setCurrentProduct(product)
                                    setIsPrintLabelDialogOpen(true)
                                  }}
                                >
                                  <Printer className="mr-2 h-4 w-4" />
                                  In nhãn sản phẩm
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setCurrentProduct(product)
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog chỉnh sửa sản phẩm */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Chỉnh sửa sản phẩm</DialogTitle>
            <DialogDescription>Cập nhật thông tin cho sản phẩm</DialogDescription>
          </DialogHeader>
          {currentProduct && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex justify-center">
                  <div className="relative h-40 w-40 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-2">
                    <input
                      type="file"
                      ref={editFileInputRef}
                      onChange={(e) => handleImageUpload(e, true)}
                      className="hidden"
                      accept="image/*"
                    />
                    <div
                      className="flex h-full w-full cursor-pointer items-center justify-center"
                      onClick={() => editFileInputRef.current?.click()}
                    >
                      {currentProduct.image ? (
                        <img
                          src={currentProduct.image || "/placeholder.svg"}
                          alt={currentProduct.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <ImageIcon className="h-16 w-16 text-gray-400" />
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 text-center text-xs text-white">
                      Nhấp để thay đổi
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-name" className="text-sm font-medium">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-name"
                    value={currentProduct.name}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                    className="border-gray-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category" className="text-sm font-medium">
                    Danh mục <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={currentProduct.category}
                    onValueChange={(value) => setCurrentProduct({ ...currentProduct, category: value })}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cà phê">Cà phê</SelectItem>
                      <SelectItem value="Trà sữa">Trà sữa</SelectItem>
                      <SelectItem value="Nước ép">Nước ép</SelectItem>
                      <SelectItem value="Sinh tố">Sinh tố</SelectItem>
                      <SelectItem value="Soda">Soda</SelectItem>
                      <SelectItem value="Trà">Trà</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-price" className="text-sm font-medium">
                    Giá (VNĐ) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={currentProduct.price}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number.parseInt(e.target.value) })}
                    className="border-gray-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status" className="text-sm font-medium">
                    Trạng thái
                  </Label>
                  <Select
                    value={currentProduct.status}
                    onValueChange={(value) => setCurrentProduct({ ...currentProduct, status: value })}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Còn hàng">Còn hàng</SelectItem>
                      <SelectItem value="Hết hàng">Hết hàng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 grid gap-2">
                  <Label htmlFor="edit-description" className="text-sm font-medium">
                    Mô tả
                  </Label>
                  <textarea
                    id="edit-description"
                    placeholder="Nhập mô tả sản phẩm"
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
              onClick={handleUpdateProduct}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa sản phẩm */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Xóa sản phẩm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog in nhãn sản phẩm */}
      <Dialog open={isPrintLabelDialogOpen} onOpenChange={setIsPrintLabelDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>In nhãn sản phẩm</DialogTitle>
            <DialogDescription>Xem trước và in nhãn sản phẩm</DialogDescription>
          </DialogHeader>
          {currentProduct && (
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="flex flex-col items-center">
                  <img
                    src={currentProduct.image || "/placeholder.svg"}
                    alt={currentProduct.name}
                    className="mb-2 h-24 w-24 rounded-md object-contain"
                  />
                  <h3 className="text-lg font-bold">{currentProduct.name}</h3>
                  <p className="text-sm text-gray-500">{currentProduct.category}</p>
                  <div className="mt-2 text-xl font-bold text-blue-600">
                    {currentProduct.price.toLocaleString()} VNĐ
                  </div>
                  <div className="mt-1 text-xs text-gray-400">Mã SP: {currentProduct.id}</div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setIsPrintLabelDialogOpen(false)}>
                  <Printer className="mr-2 h-4 w-4" />
                  In nhãn
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
