const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        thumbnail: {
            type: String,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        enum: ['Đang xử lý', 'Đã thanh toán', 'Đã hủy'],
        default: 'Đang xử lý'
    }
}, {
    timestamps: true
});

const Cart = mongoose.model("Cart", cartSchema, "carts");

module.exports = Cart;
