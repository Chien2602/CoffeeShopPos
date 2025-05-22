const express = require("express");
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrderById,
    getOrdersByEmployeeId
} = require("../controllers/orderController");
const { verifyToken, isEmployee } = require("../middleware/authMiddleware");

router.post("/", verifyToken, isEmployee, createOrder);
router.get("/", verifyToken, isEmployee, getOrders);
router.get("/:id", verifyToken, isEmployee, getOrderById);
router.get("/employee/:employeeId", verifyToken, isEmployee, getOrdersByEmployeeId);

module.exports = router;