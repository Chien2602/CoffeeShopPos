# Coffee Shop POS System

Hệ thống quản lý và bán hàng cho quán cà phê, được xây dựng với MERN Stack (MongoDB, Express.js, React.js, Node.js).

## 🚀 Tính năng chính

### Admin Dashboard
- Quản lý sản phẩm (thêm, sửa, xóa)
- Quản lý danh mục
- Quản lý nhân viên
- Thống kê doanh thu
- Phân quyền người dùng

### POS System
- Giao diện bán hàng trực quan
- Quản lý đơn hàng
- Quản lý kho

## 🛠️ Công nghệ sử dụng

### Frontend
- React.js
- Tailwind CSS
- Shadcn UI
- Chart.js
- Cloudinary (lưu trữ hình ảnh)

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Mongoose

## 📋 Yêu cầu hệ thống

- Node.js (v18 trở lên)
- MongoDB
- npm hoặc yarn
- Git

## 🚀 Cài đặt và chạy dự án

### 1. Clone repository
```bash
git clone <repository-url>
```

### 2. Cài đặt dependencies

#### Frontend
```bash
cd coffeeshop-pos
npm install
```

#### Backend
```bash
cd coffeeshop-pos-BE
npm install
```

### 3. Cấu hình môi trường

#### Backend (.env)
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/coffeeshop
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Chạy dự án

#### Backend
```bash
cd coffeeshop-pos-BE
nodemon server
```

#### Frontend
```bash
cd coffeeshop-pos
npm run dev
```

Truy cập ứng dụng tại: http://localhost:3001


## 📝 API Endpoints

### Authentication
- POST /auth/login
- POST /auth/register
- GET /auth/profile

### Products
- GET /products
- POST /products
- PUT /products/:id
- DELETE /products/:id

### Categories
- GET /categories
- POST /categories
- PUT /categories/:id
- DELETE /categories/:id

### Orders
- GET /orders
- POST /orders
- PUT /orders/:id
- GET /orders/:id

### Dashboard
- GET /dashboard/stats
- GET /dashboard/revenue
- GET /dashboard/top-products
- GET /dashboard/order-trends

## 🙏 Cảm ơn

Cảm ơn bạn đã quan tâm đến dự án này. Nếu có bất kỳ câu hỏi hoặc góp ý nào, vui lòng tạo issue hoặc liên hệ trực tiếp. 