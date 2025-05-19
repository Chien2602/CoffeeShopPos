"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Printer, Coffee, Phone, MapPin, Calendar, User, CreditCard, CheckCircle } from "lucide-react"
import ReactToPrint from "react-to-print"

export function PrintInvoice({ open, onOpenChange, orderData }) {
  const invoiceRef = useRef(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Xem trước hóa đơn</DialogTitle>
          <DialogDescription>Xem trước và in hóa đơn</DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex justify-end">
          <ReactToPrint
            trigger={() => (
              <Button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                <Printer className="h-4 w-4" />
                In hóa đơn
              </Button>
            )}
            content={() => invoiceRef.current}
            documentTitle={`Hóa đơn-${orderData.orderNumber}`}
            onAfterPrint={() => onOpenChange(false)}
          />
        </div>

        <div className="mt-4 max-h-[60vh] overflow-auto rounded-md border p-6" ref={invoiceRef}>
          <div className="text-center">
            <div className="mb-2 flex justify-center">
              <Coffee className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold">POS Bán Nước Uống</h2>
            <p className="text-sm text-gray-500">123 Đường ABC, Quận XYZ, TP.HCM</p>
            <p className="text-sm text-gray-500">SĐT: 0123456789</p>
          </div>

          <div className="my-4 border-t border-dashed pt-4 text-center">
            <h3 className="text-lg font-bold">HÓA ĐƠN BÁN HÀNG</h3>
            <p className="text-sm text-gray-600">Số: #{orderData.orderNumber}</p>
          </div>

          <div className="mb-4 space-y-2 rounded-md bg-gray-50 p-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Ngày: {orderData.date}</span>
            </div>
            {orderData.table && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Bàn: {orderData.table}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Nhân viên: {orderData.staff}</span>
            </div>
            {orderData.customer && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  Khách hàng: {orderData.customer.name} - {orderData.customer.phone}
                </span>
              </div>
            )}
            {orderData.paymentMethod && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Thanh toán: {orderData.paymentMethod}</span>
              </div>
            )}
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2 text-left">Sản phẩm</th>
                <th className="py-2 text-center">SL</th>
                <th className="py-2 text-right">Đơn giá</th>
                <th className="py-2 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {orderData.items &&
                orderData.items.map((item, index) => (
                  <tr key={index} className="border-b border-dashed border-gray-200">
                    <td className="py-2 text-left">{item.name}</td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2 text-right">{item.price.toLocaleString()}</td>
                    <td className="py-2 text-right">{(item.quantity * item.price).toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>{orderData.subtotal.toLocaleString()} VNĐ</span>
            </div>
            <div className="flex justify-between">
              <span>Thuế (10%):</span>
              <span>{orderData.tax.toLocaleString()} VNĐ</span>
            </div>
            {orderData.customer?.discount && orderData.customer.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Giảm giá:</span>
                <span>-{orderData.customer.discount.toLocaleString()} VNĐ</span>
              </div>
            )}
            <div className="flex justify-between border-t border-dashed pt-2 text-lg font-bold">
              <span>Tổng cộng:</span>
              <span>
                {(orderData.total - (orderData.customer?.discount || 0) > 0
                  ? orderData.total - (orderData.customer?.discount || 0)
                  : 0
                ).toLocaleString()}{" "}
                VNĐ
              </span>
            </div>
          </div>

          {orderData.customer?.points !== undefined && (
            <div className="mt-3 rounded-md bg-blue-50 p-2 text-center text-sm text-blue-700">
              <div className="flex items-center justify-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>Khách hàng tích lũy thêm {Math.floor(orderData.total / 10000)} điểm</span>
              </div>
              <div>Tổng điểm hiện tại: {orderData.customer.points + Math.floor(orderData.total / 10000)}</div>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm font-medium">Cảm ơn quý khách đã sử dụng dịch vụ!</p>
            <p className="text-xs text-gray-500">Hẹn gặp lại quý khách lần sau</p>
            <div className="mt-2 text-xs text-gray-400">
              <p>www.posbannuocuong.com</p>
              <p>Hotline: 1900 1234</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
