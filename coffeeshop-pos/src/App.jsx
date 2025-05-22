import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import AuthPage from './app/auth/page'
import AdminDashboard from './app/admin/page'
import CustomersPage from './app/admin/customers/page'
import ProductsPage from './app/admin/products/page'
import OrdersPage from './app/admin/orders/page'
import PaymentsPage from './app/admin/payments/page'
import StaffPage from './app/admin/staff/page'
import StaffDashboard from './app/staff/page'
import HistoryPage from './app/staff/history/page'
import TablesPage from './app/staff/tables/page'
import { AdminSidebar } from './components/admin-sidebar'
import { StaffSidebar } from './components/staff-sidebar'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/admin" element={
        <div className="flex h-screen">
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="customers" element={<CustomersPage />} />
      </Route>

      <Route path="/staff" element={
        <div className="flex h-screen">
          <StaffSidebar />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      }>
        <Route index element={<StaffDashboard />} />
        <Route path="tables" element={<TablesPage />} />
        <Route path="history" element={<HistoryPage />} />
      </Route>
    </Routes>
  )
}

export default App