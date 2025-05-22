const express = require("express");
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrderById,
    getOrdersByEmployeeId,
    getOrdersByCustomerId
} = require("../controllers/orderController");
const { verifyToken, isEmployee } = require("../middleware/authMiddleware");

router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.get("/:id", verifyToken, getOrderById);
router.get("/employee/:employeeId", verifyToken, getOrdersByEmployeeId);
router.get("/customer/:customerId", verifyToken, getOrdersByCustomerId);
module.exports = router;