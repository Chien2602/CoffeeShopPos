const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
    },
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Table",
        required: true,
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        total: {
            type: Number,
            required: true,
            min: 0
        },
        title: {
            type: String,
            required: true
        },
        thumbnail: {
            type: String
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Tiền mặt', 'Thẻ ngân hàng', 'Ví điện tử']
    },
    status: {
        type: String,
        required: true,
        enum: ['Đã thanh toán', 'Đang xử lý', 'Đã hủy'],
        default: 'Đã thanh toán'
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;