const express = require("express");
const router = express.Router();
const {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getCategoryById,
    createMultipleCategories,
} = require("../controllers/categoryController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, isAdmin, createCategory);
router.put("/:id", verifyToken, isAdmin, updateCategory);
router.delete("/:id", verifyToken, isAdmin, deleteCategory);
router.get("/", getCategory);
router.get("/:id", getCategoryById);
router.post("/multiple", verifyToken, isAdmin, createMultipleCategories);

module.exports = router;