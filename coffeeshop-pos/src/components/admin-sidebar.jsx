"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { Coffee, LayoutDashboard, LogOut, Menu, Package, ShoppingCart, Users, X, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const routes = [
  {
    label: "Tổng quan",
    icon: LayoutDashboard,
    href: "/admin",
    color: "text-sky-500",
  },
  {
    label: "Sản phẩm",
    icon: Coffee,
    href: "/admin/products",
    color: "text-violet-500",
  },
  {
    label: "Đơn hàng",
    icon: ShoppingCart,
    href: "/admin/orders",
    color: "text-pink-700",
  },
  {
    label: "Nhân viên",
    icon: Users,
    href: "/admin/staff",
    color: "text-orange-700",
  },
  {
    label: "Khách hàng",
    icon: Users,
    href: "/admin/customers",
    color: "text-blue-700",
  },
]

export function AdminSidebar() {
  const pathname = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <div className="mb-2 flex items-center justify-between">
                <Link to="/admin" className="flex items-center gap-2 px-2">
                  <Package className="h-6 w-6" />
                  <h2 className="text-lg font-semibold">POS Admin</h2>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              <div className="space-y-1">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    to={route.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                      pathname === route.href ? "bg-muted text-primary" : "text-muted-foreground",
                    )}
                  >
                    <route.icon className={cn("h-5 w-5", route.color)} />
                    {route.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="px-3 py-2">
              <div className="space-y-1">
                <Link
                  to="/"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary"
                >
                  <LogOut className="h-5 w-5" />
                  Đăng xuất
                </Link>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <div className="hidden border-r bg-muted/40 md:block md:w-64">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4">
            <Link to="/admin" className="flex items-center gap-2 font-semibold">
              <Package className="h-6 w-6" />
              <span>POS Admin</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 py-2 text-sm font-medium">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  to={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    pathname === route.href ? "bg-muted text-primary" : "text-muted-foreground",
                  )}
                >
                  <route.icon className={cn("h-5 w-5", route.color)} />
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto border-t">
            <div className="grid items-start px-2 py-2 text-sm font-medium">
              <Link
                to="/login"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LogOut className="h-5 w-5" />
                Đăng xuất
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
