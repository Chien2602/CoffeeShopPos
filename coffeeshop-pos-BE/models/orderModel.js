const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Table",
        required: true,
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Đang xử lý', 'Đã thanh toán', 'Đã hủy'],
        default: 'Đang xử lý',
    },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;
