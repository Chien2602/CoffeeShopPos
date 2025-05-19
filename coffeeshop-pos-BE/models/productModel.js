const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    isActive: {
        type: String,
        enum: ['Còn hàng', 'Hết hàng'],
        default: 'Còn hàng',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
