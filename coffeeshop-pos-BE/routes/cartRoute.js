const express = require("express");
const router = express.Router();
const {
    createCart,
    updateCart,
    deleteCart,
    addToCart,
    removeFromCart,
    clearCart,
} = require("../controllers/cartController");
const { verifyToken, isEmployee } = require("../middleware/authMiddleware");

router.post("/", verifyToken, isEmployee, createCart);
router.put("/:id", verifyToken, isEmployee, updateCart);
router.delete("/:id", verifyToken, isEmployee, deleteCart);
router.post("/add-to-cart", verifyToken, isEmployee, addToCart);
router.post("/remove-from-cart", verifyToken, isEmployee, removeFromCart);
router.post("/clear-cart", verifyToken, isEmployee, clearCart);

module.exports = router; 