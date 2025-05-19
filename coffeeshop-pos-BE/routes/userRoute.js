const express = require("express");
const router = express.Router();
const {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getUserById,
  register,
  login,
  refreshToken,
  logout,
} = require("../controllers/userController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

router.post("/create", verifyToken, isAdmin, createUser);

router.get("/", verifyToken, isAdmin, getUser);
router.get("/:id", verifyToken, isAdmin, getUserById);

router.put("/:id", verifyToken, isAdmin, updateUser);
router.delete("/:id", verifyToken, isAdmin, deleteUser);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

module.exports = router;
