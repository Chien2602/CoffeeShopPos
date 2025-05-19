const express = require("express");
const router = express.Router();
const {
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProductById,
} = require("../controllers/productController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, isAdmin, createProduct);
router.put("/:id", verifyToken, isAdmin, updateProduct);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);
router.get("/", getProduct);
router.get("/:id", getProductById);

module.exports = router;
