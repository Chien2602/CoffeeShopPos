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
import PrivateRoute from './protectedRoute'
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
        <Route index element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="products" element={<PrivateRoute><ProductsPage /></PrivateRoute>} />
        <Route path="orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
        <Route path="payments" element={<PrivateRoute><PaymentsPage /></PrivateRoute>} />
        <Route path="staff" element={<PrivateRoute><StaffPage /></PrivateRoute>} />
        <Route path="customers" element={<PrivateRoute><CustomersPage /></PrivateRoute>} />
      </Route>

      <Route path="/staff" element={
        <div className="flex h-screen">
          <StaffSidebar />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      }>
        <Route index element={<PrivateRoute><StaffDashboard /></PrivateRoute>} />
        <Route path="tables" element={<PrivateRoute><TablesPage /></PrivateRoute>} />
        <Route path="history" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
      </Route>
    </Routes>
  )
}

export default App