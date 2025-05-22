const Table = require("../models/tableModel");

const createTable = async (req, res) => {
    try {
        const { tableNumber, capacity, isActive } = req.body;
        if (!tableNumber || !capacity) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
        }
        const table = await Table.create({ tableNumber, capacity, isActive });
        res.status(201).json({ message: "Tạo bàn thành công", table });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateTable = async (req, res) => {
    try {
        const { id } = req.params;
        const { tableNumber, capacity, isActive } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Vui lòng nhập id" });
        }
        const table = await Table.findByIdAndUpdate(id, { tableNumber, capacity, isActive }, { new: true });
        res.status(200).json({ message: "Cập nhật bàn thành công", table });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteTable = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Vui lòng nhập id" });
        }
        const table = await Table.findByIdAndDelete(id);
        res.status(200).json({ message: "Xóa bàn thành công", table });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getTable = async (req, res) => {
    try {
        const tables = await Table.find();
        res.status(200).json(tables);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getTableById = async (req, res) => {
    try {
        const { id } = req.params;
        const table = await Table.findById(id);
        res.status(200).json(table);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createTable,
    updateTable,
    deleteTable,
    getTable,
    getTableById
};
