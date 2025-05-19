const Order = require("../models/orderModel");

const createOrder = async (req, res) => {
    try {
        const { employeeId, customerId, tableId, cartId, totalAmount } = req.body;
        if (!employeeId || !customerId || !tableId || !cartId || !totalAmount) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
        }
        const order = await Order.create({ employeeId, customerId, tableId, cartId, totalAmount });
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getOrder = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Vui lòng nhập id" });
        }
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createOrder,
    getOrder,
    getOrderById,
};
