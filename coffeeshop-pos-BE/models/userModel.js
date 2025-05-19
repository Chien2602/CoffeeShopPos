const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'employee'],
        default: 'employee',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    refreshToken: {
        type: String,
        required: false,
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema, "users");

module.exports = User;