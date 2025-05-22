const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const JWT_CONFIG = {
    ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET || 'your-access-token-secret-key',
    REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET || 'your-refresh-token-secret-key',
    ACCESS_TOKEN_EXPIRES_IN: '1h',
    REFRESH_TOKEN_EXPIRES_IN: '7d',
};

const createUser = async (req, res) => {
    try {
        const { fullname, email, password, phone, address, role, isActive, refreshToken } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin",
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Email không hợp lệ",
            });
        }

        const checkEmail = await User.findOne({ email });
        if (checkEmail) {
            return res.status(400).json({
                message: "Email đã tồn tại",
            });
        }
            
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            fullname,
            email,
            password: hashedPassword,
            phone: phone || "",
            address: address || "",
            role: role || "user",
            isActive: isActive !== undefined ? isActive : true,
            refreshToken: refreshToken || "",
        });

        const userResponse = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.status(201).json({
            message: "Tạo tài khoản thành công",
            data: userResponse
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname, email, password, phone, address, role, isActive, refreshToken } = req.body;

        if (!id) {
            return res.status(400).json({
                message: "Vui lòng nhập id",
            });
        }

        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({
                message: "Người dùng không tồn tại",
            });
        }
        const updateData = {};
        if (fullname !== undefined) updateData.fullname = fullname;
        if (email !== undefined) updateData.email = email;
        if (password !== undefined) updateData.password = password;
        if (phone !== undefined) updateData.phone = phone;
        if (address !== undefined) updateData.address = address;
        if (role !== undefined) updateData.role = role;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (refreshToken !== undefined) updateData.refreshToken = refreshToken;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "Không có thông tin nào được cập nhật",
            });
        }

        const user = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(400).json({
                message: "Cập nhật người dùng thất bại",
            });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Vui lòng nhập id" });
        }
        const user = await User.findByIdAndDelete(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Vui lòng nhập id" });
        }
        const user = await User.findById({_id: id});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_CONFIG.ACCESS_TOKEN_SECRET,
        { expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        JWT_CONFIG.REFRESH_TOKEN_SECRET,
        { expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRES_IN }
    );

    return { accessToken, refreshToken };
};

const register = async (req, res) => {
    try {
        const { fullname, email, password, role } = req.body;
        if (!fullname || !email || !password) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin",
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Email không hợp lệ",
            });
        }

        const checkEmail = await User.findOne({ email });
        if (checkEmail) {
            return res.status(400).json({
                message: "Email đã tồn tại",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullname,
            email,
            password: hashedPassword,
            role: role || "employee",
            isActive: true,
        });

        const { accessToken, refreshToken } = generateTokens(user);

        await User.findByIdAndUpdate(user._id, { refreshToken });

        res.status(201).json({
            message: "Đăng ký thành công",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Email không tồn tại",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Mật khẩu không chính xác",
            });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        await User.findByIdAndUpdate(user._id, { refreshToken });

        res.status(200).json({
            message: "Đăng nhập thành công",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({
                message: "Refresh token không tồn tại",
            });
        }

        const decoded = jwt.verify(refreshToken, JWT_CONFIG.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                message: "Refresh token không hợp lệ",
            });
        }

        const tokens = generateTokens(user);

        await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });

        res.status(200).json({
            message: "Làm mới token thành công",
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: "Token không hợp lệ",
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token đã hết hạn",
            });
        }
        res.status(500).json({
            message: error.message,
        });
    }
};

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({
                message: "Refresh token không tồn tại",
            });
        }

        await User.findOneAndUpdate(
            { refreshToken },
            { refreshToken: "" }
        );

        res.status(200).json({
            message: "Đăng xuất thành công",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUser,
    getUserById,
    register,
    login,
    refreshToken,
    logout,
    comparePassword
}
