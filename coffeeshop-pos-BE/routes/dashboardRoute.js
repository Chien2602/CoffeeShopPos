const express = require('express');
const router = express.Router();
const { 
    getDashboardStats, 
    getRevenueData, 
    getTopProducts, 
    getOrderTrends 
} = require('../controllers/dashboardController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// All dashboard routes are protected and require admin access
router.use(verifyToken);
router.use(isAdmin);

router.get('/stats', getDashboardStats);

// Get revenue data for charts
router.get('/revenue', getRevenueData);

// Get top selling products
router.get('/top-products', getTopProducts);

// Get order trends
router.get('/order-trends', getOrderTrends);

module.exports = router;
