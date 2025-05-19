const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    isActive: {
        type: String,
        enum: ['Trống', 'Đã đặt', 'Đang phục vụ', 'Đang dọn dẹp'],
        default: 'Trống',
    },
}, { timestamps: true });

const Table = mongoose.model("Table", tableSchema, "tables");

module.exports = Table;
