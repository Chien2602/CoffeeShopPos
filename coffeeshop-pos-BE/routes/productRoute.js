const express = require("express");
const router = express.Router();
const {
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProductById,
    createMultipleProducts,
} = require("../controllers/productController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, isAdmin, createProduct);
router.put("/:id", verifyToken, isAdmin, updateProduct);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);
router.get("/", getProduct);
router.get("/:productId", getProductById);
router.post("/multiple", verifyToken, isAdmin, createMultipleProducts);

module.exports = router;
