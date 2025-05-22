const express = require("express");
const router = express.Router();
const {
    createTable,
    updateTable,
    deleteTable,
    getTable,
    getTableById
} = require("../controllers/tableController");
const { verifyToken, isEmployee } = require("../middleware/authMiddleware");

router.post("/", verifyToken, isEmployee, createTable);
router.put("/:id", verifyToken, isEmployee, updateTable);
router.delete("/:id", verifyToken, isEmployee, deleteTable);
router.get("/", getTable);
router.get("/:id", getTableById);

module.exports = router;
