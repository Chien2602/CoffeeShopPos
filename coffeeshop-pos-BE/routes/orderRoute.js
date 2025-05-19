const express = require("express");
const router = express.Router();
const {
    createOrder,
    getOrder,
    getOrderById,
} = require("../controllers/orderController");
const { verifyToken, isEmployee } = require("../middleware/authMiddleware");

router.post("/", verifyToken, isEmployee, createOrder);
router.get("/", verifyToken, isEmployee, getOrder);
router.get("/:id", verifyToken, isEmployee, getOrderById);

module.exports = router;