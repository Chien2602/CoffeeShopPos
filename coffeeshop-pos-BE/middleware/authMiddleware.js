const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const crypto = require('crypto');


const generateSecureKey = (length = 64) => {
    return crypto.randomBytes(length).toString('hex');
};

const JWT_CONFIG = {
    ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET || generateSecureKey(),
    REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET || generateSecureKey(),
    ACCESS_TOKEN_EXPIRES_IN: '1h',
    REFRESH_TOKEN_EXPIRES_IN: '7d',
};

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Không tìm thấy token',
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_CONFIG.ACCESS_TOKEN_SECRET);
        
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                message: 'Người dùng không tồn tại',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Token không hợp lệ',
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token đã hết hạn',
            });
        }
        res.status(500).json({
            message: error.message,
        });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            message: 'Không có quyền truy cập',
        });
    }
};

const isEmployee = (req, res, next) => {
    if (req.user && req.user.role === 'employee') {
        next();
    } else {
        res.status(403).json({
            message: 'Không có quyền truy cập',
        });
    }
};  

module.exports = {
    verifyToken,
    isAdmin,
    isEmployee,
}; 