"use client"

import { useState, useRef, useEffect } from "react"
import { Edit, MoreHorizontal, Plus, Search, Trash2, Upload, X, ImageIcon } from "lucide-react"
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

// API endpoints
const API_URL = "http://localhost:3001"
const token = sessionStorage.getItem("authToken")

// API functions
const fetchProducts = async () => {
  const response = await fetch(`${API_URL}/products`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  const result = await response.json()
  console.log('API Response:', result)
  return result || [] // Return the array directly since it's already an array of products
}

const fetchCategories = async () => {
  const response = await fetch(`${API_URL}/categories`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }
  const result = await response.json()
  console.log('Categories:', result)
  return result || []
}

const addProduct = async (productData) => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...productData,
      isActive: "Còn hàng",
      isDeleted: false,
      stock: 100
    }),
  })
  if (!response.ok) {
    throw new Error('Failed to add product')
  }
  const result = await response.json()
  console.log('Add Product Response:', result)
  return result // Return the new product object directly
}

const updateProduct = async (productId, productData) => {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  })
  if (!response.ok) {
    throw new Error('Failed to update product')
  }
  const result = await response.json()
  console.log('Update Product Response:', result)
  return result // Return the updated product object directly
}

const deleteProduct = async (productId) => {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  if (!response.ok) {
    throw new Error('Failed to delete product')
  }
  return response.json()
}

// Add Cloudinary upload function
const uploadToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'coffeeshop') // Replace with your upload preset

  try {
    const response = await fetch('https://api.cloudinary.com/v1_1/dxkqibtzv/image/upload', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error('Failed to upload image')
    }
    
    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw error
  }
}

export default function ProductsPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [newProduct, setNewProduct] = useState({
    title: "",
    categoryId: "",
    price: "",
    isActive: "Còn hàng",
    isDeleted: false,
    stock: 100,
    thumbnail: "/placeholder.svg?height=50&width=50",
  })
  const [previewImage, setPreviewImage] = useState(null)
  const fileInputRef = useRef(null)
  const editFileInputRef = useRef(null)

  // Fetch products and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ])
        setProducts(productsData)
        setCategories(categoriesData)
        setError(null)
      } catch (err) {
        console.error('Error loading data:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Lọc sản phẩm theo từ khóa tìm kiếm và danh mục
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoryId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || product.categoryId === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  // Reset về trang 1 khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, categoryFilter])

  // Update handleImageUpload function
  const handleImageUpload = async (e, isEdit = false) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        // Show loading state
        if (isEdit) {
          setCurrentProduct(prev => ({ ...prev, isUploading: true }))
        } else {
          setNewProduct(prev => ({ ...prev, isUploading: true }))
        }

        // Upload to Cloudinary
        const imageUrl = await uploadToCloudinary(file)

        // Update state with the Cloudinary URL
        if (isEdit) {
          setCurrentProduct(prev => ({ ...prev, thumbnail: imageUrl, isUploading: false }))
        } else {
          setNewProduct(prev => ({ ...prev, thumbnail: imageUrl, isUploading: false }))
          setPreviewImage(imageUrl)
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải lên hình ảnh",
          variant: "destructive",
        })
        if (isEdit) {
          setCurrentProduct(prev => ({ ...prev, isUploading: false }))
        } else {
          setNewProduct(prev => ({ ...prev, isUploading: false }))
        }
      }
    }
  }

  // Update handleAddProduct function
  const handleAddProduct = async () => {
    if (!newProduct.title || !newProduct.categoryId || !newProduct.price) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin sản phẩm",
        variant: "destructive",
      })
      return
    }

    try {
      const productToAdd = {
        title: newProduct.title,
        categoryId: newProduct.categoryId,
        price: Number.parseInt(newProduct.price),
        thumbnail: newProduct.thumbnail,
        isActive: newProduct.isActive,
        isDeleted: false,
        stock: newProduct.stock
      }

      const result = await addProduct(productToAdd)
      setProducts([...products, result])
      setNewProduct({
        title: "",
        categoryId: "",
        price: "",
        isActive: "Còn hàng",
        isDeleted: false,
        stock: 100,
        thumbnail: "/placeholder.svg?height=50&width=50",
      })
      setPreviewImage(null)
      setIsAddDialogOpen(false)

      toast({
        title: "Thành công",
        description: "Đã thêm sản phẩm mới",
      })
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm sản phẩm mới",
        variant: "destructive",
      })
    }
  }

  // Xử lý cập nhật sản phẩm
  const handleUpdateProduct = async () => {
    if (!currentProduct) return

    try {
      const productToUpdate = {
        title: currentProduct.title,
        categoryId: currentProduct.categoryId,
        price: currentProduct.price,
        thumbnail: currentProduct.thumbnail,
        isActive: currentProduct.isActive,
        stock: currentProduct.stock
      }

      const result = await updateProduct(currentProduct._id, productToUpdate)
      const updatedProducts = products.map((product) => 
        product._id === currentProduct._id ? result : product // Use the updated product directly
      )

      setProducts(updatedProducts)
      setIsEditDialogOpen(false)

      toast({
        title: "Thành công",
        description: "Đã cập nhật sản phẩm",
      })
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật sản phẩm",
        variant: "destructive",
      })
    }
  }

  // Xử lý xóa sản phẩm
  const handleDeleteProduct = async () => {
    if (!currentProduct) return

    try {
      await deleteProduct(currentProduct._id)
      const updatedProducts = products.filter((product) => product._id !== currentProduct._id)
      setProducts(updatedProducts)
      setIsDeleteDialogOpen(false)

      toast({
        title: "Thành công",
        description: "Đã xóa sản phẩm",
      })
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa sản phẩm",
        variant: "destructive",
      })
    }
  }

  // Lấy danh sách các danh mục duy nhất
  const categoryFilters = ["all", ...Array.from(new Set(products.map((product) => product.categoryId)))]

  // Helper function to get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId)
    return category ? category.title : categoryId
  }

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
                      {newProduct.isUploading ? (
                        <div className="flex flex-col items-center">
                          <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                          <p className="text-xs text-gray-500">Đang tải lên...</p>
                        </div>
                      ) : previewImage ? (
                        <img
                          src={previewImage}
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
                    {previewImage && !newProduct.isUploading && (
                      <button
                        className="absolute right-1 top-1 rounded-full bg-white p-1 shadow-md"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPreviewImage(null)
                          setNewProduct({ ...newProduct, thumbnail: "/placeholder.svg?height=50&width=50" })
                        }}
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                    placeholder="Nhập tên sản phẩm"
                    className="border-gray-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Danh mục <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={newProduct.categoryId}
                    onValueChange={(value) => setNewProduct({ ...newProduct, categoryId: value })}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.title}
                        </SelectItem>
                      ))}
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
                    value={newProduct.isActive}
                    onValueChange={(value) => setNewProduct({ ...newProduct, isActive: value })}
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
                {categoryFilters.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category === "all" ? "Tất cả" : getCategoryName(category)}
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
                    {currentProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          Không tìm thấy sản phẩm nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentProducts.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell>
                            <img
                              src={product.thumbnail || "/placeholder.svg"}
                              alt={product.title}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{product.title}</TableCell>
                          <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                          <TableCell>{product.price.toLocaleString()}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                product.isActive === "Còn hàng"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {product.isActive}
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} của {filteredProducts.length} sản phẩm
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Trước
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
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
                      {currentProduct.thumbnail ? (
                        <img
                          src={currentProduct.thumbnail || "/placeholder.svg"}
                          alt={currentProduct.title}
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
                  <Label htmlFor="edit-title" className="text-sm font-medium">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-title"
                    value={currentProduct.title}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, title: e.target.value })}
                    className="border-gray-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category" className="text-sm font-medium">
                    Danh mục <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={currentProduct.categoryId}
                    onValueChange={(value) => setCurrentProduct({ ...currentProduct, categoryId: value })}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.title}
                        </SelectItem>
                      ))}
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
                    value={currentProduct.isActive}
                    onValueChange={(value) => setCurrentProduct({ ...currentProduct, isActive: value })}
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
    </div>
  )
}
