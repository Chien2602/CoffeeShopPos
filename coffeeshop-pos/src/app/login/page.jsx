"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()

    // Đây là logic đăng nhập đơn giản cho demo
    // Trong thực tế, bạn sẽ cần kết nối với backend để xác thực
    if (username === "admin" && password === "admin") {
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng quản trị viên",
      })
      navigate("/admin")
    } else if (username === "staff" && password === "staff") {
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng nhân viên",
      })
      navigate("/staff")
    } else {
      toast({
        title: "Đăng nhập thất bại",
        description: "Tên đăng nhập hoặc mật khẩu không đúng",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-r from-blue-100 to-cyan-100">
      <Card className="w-[350px] shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Coffee className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">POS Bán Nước Uống</CardTitle>
          <CardDescription>Đăng nhập để tiếp tục</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Đăng nhập
            </Button>
          </CardFooter>
        </form>
        <div className="px-6 pb-4 text-center text-sm text-muted-foreground">
          <p className="mb-1">Demo đăng nhập:</p>
          <p>Admin: admin / admin</p>
          <p>Nhân viên: staff / staff</p>
        </div>
      </Card>
    </div>
  )
}
