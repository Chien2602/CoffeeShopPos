const express = require('express');
const router = express.Router();
const { uploadImage, deleteImage } = require('../controllers/uploadController');

// Route upload ảnh
router.post('/upload', uploadImage);

// Route xóa ảnh
router.delete('/delete/:public_id', deleteImage);

module.exports = router; 