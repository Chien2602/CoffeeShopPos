const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    total: {
        type: Number,
        required: true,
        min: 0,
    },
    title: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
    }
}, { timestamps: true });

const OrderItem = mongoose.model("OrderItem", orderItemSchema, "orderItems");

module.exports = OrderItem; 