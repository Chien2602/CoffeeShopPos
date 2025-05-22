"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Coffee,
  Loader2,
  User,
  Lock,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPage() {
  const { toast } = useToast();
  const router = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [formStep, setFormStep] = useState(0);

  
  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData({
      ...loginData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  
  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterData({
      ...registerData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      const data = await response.json();
      console.log(data)

      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      if (loginData.rememberMe) {
        localStorage.setItem("authToken", data.accessToken);
      } else {
        sessionStorage.setItem("authToken", data.accessToken);
      }

      localStorage.setItem("userRole", data.role);

      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng ${data.name || loginData.fullname}`,
      });

      if (data.role === "admin") {
        router("/admin");
      } else {
        router("/staff");
      }
    } catch (error) {
      console.error("Login error:", error);

      toast({
        title: "Đăng nhập thất bại",
        description: error.message || "Tên đăng nhập hoặc mật khẩu không đúng",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Lỗi đăng ký",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive",
      });
      return;
    }
    if (!registerData.agreeTerms) {
      toast({
        title: "Lỗi đăng ký",
        description: "Bạn cần đồng ý với điều khoản dịch vụ",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: registerData.fullName,
          email: registerData.email,
          phone: registerData.phone,
          password: registerData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      toast({
        title: "Đăng ký thành công",
        description: "Tài khoản của bạn đã được tạo. Vui lòng đăng nhập.",
      });

      setRegisterData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
      });
      setFormStep(0);
      setActiveTab("login");
    } catch (error) {
      console.error("Registration error:", error);

      if (registerData.fullName && registerData.password) {
        toast({
          title: "Đăng ký thành công (Demo)",
          description: "Tài khoản của bạn đã được tạo. Vui lòng đăng nhập.",
        });
        setRegisterData({
          fullName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          agreeTerms: false,
        });
        setFormStep(0);
        setActiveTab("login");
        return;
      }

      toast({
        title: "Đăng ký thất bại",
        description:
          error.message || "Không thể tạo tài khoản. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = (e) => {
    e.preventDefault();

    if (formStep === 0) {
      if (
        !registerData.fullName ||
        !registerData.email ||
        !registerData.phone
      ) {
        toast({
          title: "Thông tin không đầy đủ",
          description: "Vui lòng điền đầy đủ thông tin cá nhân",
          variant: "destructive",
        });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerData.email)) {
        toast({
          title: "Email không hợp lệ",
          description: "Vui lòng nhập đúng định dạng email",
          variant: "destructive",
        });
        return;
      }

      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(registerData.phone)) {
        toast({
          title: "Số điện thoại không hợp lệ",
          description: "Vui lòng nhập số điện thoại 10 chữ số",
          variant: "destructive",
        });
        return;
      }
    }

    setFormStep(formStep + 1);
  };

  const prevStep = (e) => {
    e.preventDefault();
    setFormStep(formStep - 1);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      document.documentElement.style.setProperty("--mouse-x", x.toString());
      document.documentElement.style.setProperty("--mouse-y", y.toString());
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 relative overflow-hidden">
      <style jsx global>{`
        :root {
          --mouse-x: 0.5;
          --mouse-y: 0.5;
        }

        .bg-bubble {
          animation: float 8s ease-in-out infinite;
          background: radial-gradient(
            circle at calc(var(--mouse-x) * 100%) calc(var(--mouse-y) * 100%),
            rgba(0, 200, 255, 0.15),
            rgba(0, 200, 255, 0.05) 40%,
            transparent 60%
          );
        }

        .bg-bubble:nth-child(2) {
          animation-delay: -4s;
          background: radial-gradient(
            circle at calc(100% - var(--mouse-x) * 100%)
              calc(100% - var(--mouse-y) * 100%),
            rgba(72, 166, 167, 0.15),
            rgba(72, 166, 167, 0.05) 40%,
            transparent 60%
          );
        }

        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(2%, 1%) scale(1.01);
          }
          50% {
            transform: translate(0, 2%) scale(0.99);
          }
          75% {
            transform: translate(-2%, 1%) scale(1.01);
          }
        }

        .card-shine {
          --shine-angle: 15deg;
          position: absolute;
          inset: 0;
          background: linear-gradient(
            var(--shine-angle),
            transparent 20%,
            rgba(255, 255, 255, 0.1) 25%,
            transparent 30%
          );
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }

        .auth-card:hover .card-shine {
          opacity: 1;
        }
      `}</style>

      <div className="absolute inset-0 bg-bubble opacity-70"></div>
      <div className="absolute inset-0 bg-bubble opacity-70"></div>

      <div className="absolute top-10 left-10 opacity-10 rotate-[-15deg]">
        <Coffee className="h-32 w-32 text-teal-900" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-10 rotate-[15deg]">
        <Coffee className="h-32 w-32 text-teal-900" />
      </div>

      <div className="relative w-full max-w-md px-4 z-10">
        <Card className="w-full shadow-xl border-t-4 border-t-[#48A6A7] mt-10 overflow-hidden auth-card bg-white/90 backdrop-blur-sm">
          <div className="card-shine"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100/30 rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100/30 rounded-tr-full"></div>
          <CardHeader className="space-y-1 text-center relative">
            <CardTitle className="text-2xl font-bold text-gray-800">
              POS Bán Nước Uống
            </CardTitle>
            <CardDescription className="text-gray-600">
              Hệ thống quản lý bán hàng
            </CardDescription>
          </CardHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-[80%] mx-auto mb-4">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-[#48A6A7] data-[state=active]:text-white"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Đăng nhập
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-[#48A6A7] data-[state=active]:text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Đăng ký
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4 relative">
                  <div className="space-y-2">
                    <Label
                      htmlFor="login-fullname"
                      className="text-gray-700 flex items-center"
                    >
                      <Mail className="h-4 w-4 mr-2 text-[#48A6A7]" />
                      Email người dùng
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-fullname"
                        name="email"
                        placeholder="Nhập email đăng nhập"
                        value={loginData.email}
                        type="email"
                        onChange={handleLoginChange}
                        className="pl-3 border-gray-300 focus:border-[#48A6A7] focus:ring-[#48A6A7]"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="login-password"
                      className="text-gray-700 flex items-center"
                    >
                      <Lock className="h-4 w-4 mr-2 text-[#48A6A7]" />
                      Mật khẩu
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        name="password"
                        type="password"
                        placeholder="Nhập mật khẩu"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className="pl-3 border-gray-300 focus:border-[#48A6A7] focus:ring-[#48A6A7]"
                        required
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="relative flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#48A6A7] to-[#57B4BA] hover:from-[#3A8A8B] hover:to-[#4A9A9F] text-white font-medium py-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      "Đăng nhập"
                    )}
                  </Button>

                  <div className="text-center text-sm text-gray-500">
                    <p>
                      Chưa có tài khoản?
                      <Button
                        variant="link"
                        className="text-[#48A6A7] p-0 h-auto text-sm ml-1"
                        type="button"
                        onClick={() => setActiveTab("register")}
                      >
                        Đăng ký ngay
                      </Button>
                    </p>
                  </div>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="register" className="mt-0">
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4 relative">
                  {formStep === 0 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="fullName"
                          className="text-gray-700 flex items-center"
                        >
                          <User className="h-4 w-4 mr-2 text-[#48A6A7]" />
                          Họ và tên
                        </Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          placeholder="Nhập họ và tên"
                          value={registerData.fullName}
                          onChange={handleRegisterChange}
                          className="pl-3 border-gray-300 focus:border-[#48A6A7] focus:ring-[#48A6A7]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-gray-700 flex items-center"
                        >
                          <Mail className="h-4 w-4 mr-2 text-[#48A6A7]" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Nhập địa chỉ email"
                          value={registerData.email}
                          onChange={handleRegisterChange}
                          className="pl-3 border-gray-300 focus:border-[#48A6A7] focus:ring-[#48A6A7]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-gray-700 flex items-center"
                        >
                          <Phone className="h-4 w-4 mr-2 text-[#48A6A7]" />
                          Số điện thoại
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="Nhập số điện thoại"
                          value={registerData.phone}
                          onChange={handleRegisterChange}
                          className="pl-3 border-gray-300 focus:border-[#48A6A7] focus:ring-[#48A6A7]"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {formStep === 1 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="register-password"
                          className="text-gray-700 flex items-center"
                        >
                          <Lock className="h-4 w-4 mr-2 text-[#48A6A7]" />
                          Mật khẩu
                        </Label>
                        <Input
                          id="register-password"
                          name="password"
                          type="password"
                          placeholder="Tạo mật khẩu"
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          className="pl-3 border-gray-300 focus:border-[#48A6A7] focus:ring-[#48A6A7]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="confirmPassword"
                          className="text-gray-700 flex items-center"
                        >
                          <Lock className="h-4 w-4 mr-2 text-[#48A6A7]" />
                          Xác nhận mật khẩu
                        </Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="Nhập lại mật khẩu"
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          className="pl-3 border-gray-300 focus:border-[#48A6A7] focus:ring-[#48A6A7]"
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2 mt-4">
                        <input
                          type="checkbox"
                          id="agreeTerms"
                          name="agreeTerms"
                          checked={registerData.agreeTerms}
                          onChange={handleRegisterChange}
                          className="h-4 w-4 text-[#48A6A7] focus:ring-[#48A6A7] border-gray-300 rounded"
                        />
                        <Label htmlFor="agreeTerms" className="text-sm text-gray-600">
                          Tôi đồng ý với điều khoản dịch vụ và chính sách bảo mật
                        </Label>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center mt-4">
                    <div className="flex space-x-2">
                      <div
                        className={`h-2 w-8 rounded-full ${
                          formStep === 0 ? "bg-[#48A6A7]" : "bg-gray-200"
                        }`}
                      ></div>
                      <div
                        className={`h-2 w-8 rounded-full ${
                          formStep === 1 ? "bg-[#48A6A7]" : "bg-gray-200"
                        }`}
                      ></div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="relative flex flex-col space-y-4">
                  {formStep === 0 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="w-full bg-gradient-to-r from-[#48A6A7] to-[#57B4BA] hover:from-[#3A8A8B] hover:to-[#4A9A9F] text-white font-medium py-2"
                    >
                      Tiếp tục
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="flex space-x-2 w-full">
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        className="flex-1"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Quay lại
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-[#48A6A7] to-[#57B4BA] hover:from-[#3A8A8B] hover:to-[#4A9A9F] text-white font-medium"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          "Đăng ký"
                        )}
                      </Button>
                    </div>
                  )}

                  <div className="text-center text-sm text-gray-500">
                    <p>
                      Đã có tài khoản?
                      <Button
                        variant="link"
                        className="text-[#48A6A7] p-0 h-auto text-sm ml-1"
                        type="button"
                        onClick={() => setActiveTab("login")}
                      >
                        Đăng nhập
                      </Button>
                    </p>
                  </div>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
