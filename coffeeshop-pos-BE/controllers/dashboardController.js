const User = require('../models/userModel');
const Order = require('../models/orderModel');

// Get overall dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        // Get current month and previous month
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        // Get total revenue and orders for current and previous month in a single aggregation
        const [currentMonthStats, previousMonthStats] = await Promise.all([
            Order.aggregate([
                {
                    $match: {
                        createdAt: { 
                            $gte: currentMonthStart,
                            $lte: currentMonthEnd
                        },
                        status: "Đã thanh toán"
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: { $toDouble: "$totalAmount" } },
                        totalOrders: { $sum: 1 }
                    }
                }
            ]),
            Order.aggregate([
                {
                    $match: {
                        createdAt: { 
                            $gte: previousMonthStart,
                            $lte: previousMonthEnd
                        },
                        status: "Đã thanh toán"
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: { $toDouble: "$totalAmount" } },
                        totalOrders: { $sum: 1 }
                    }
                }
            ])
        ]);

        // Get total products sold for current and previous month
        const [currentMonthProducts, previousMonthProducts] = await Promise.all([
            Order.aggregate([
                {
                    $match: {
                        createdAt: { 
                            $gte: currentMonthStart,
                            $lte: currentMonthEnd
                        },
                        status: "Đã thanh toán"
                    }
                },
                {
                    $unwind: "$items"
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: { $toInt: "$items.quantity" } }
                    }
                }
            ]),
            Order.aggregate([
                {
                    $match: {
                        createdAt: { 
                            $gte: previousMonthStart,
                            $lte: previousMonthEnd
                        },
                        status: "Đã thanh toán"
                    }
                },
                {
                    $unwind: "$items"
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: { $toInt: "$items.quantity" } }
                    }
                }
            ])
        ]);

        // Get new customers for current and previous month
        const [currentMonthCustomers, previousMonthCustomers] = await Promise.all([
            User.countDocuments({ 
                createdAt: { 
                    $gte: currentMonthStart,
                    $lte: currentMonthEnd
                }
            }),
            User.countDocuments({ 
                createdAt: { 
                    $gte: previousMonthStart,
                    $lte: previousMonthEnd
                }
            })
        ]);

        // Calculate percentage changes
        const calculateChange = (current, previous) => {
            if (!previous) return 0;
            if (current === 0 && previous === 0) return 0;
            const change = ((current - previous) / previous) * 100;
            return Math.round(change * 100) / 100; // Round to 2 decimal places
        };

        const currentRevenue = currentMonthStats[0]?.totalRevenue || 0;
        const previousRevenue = previousMonthStats[0]?.totalRevenue || 0;
        const currentOrders = currentMonthStats[0]?.totalOrders || 0;
        const previousOrders = previousMonthStats[0]?.totalOrders || 0;
        const currentProducts = currentMonthProducts[0]?.total || 0;
        const previousProducts = previousMonthProducts[0]?.total || 0;

        const stats = {
            totalRevenue: Math.round(currentRevenue),
            totalOrders: currentOrders,
            totalProducts: currentProducts,
            newCustomers: currentMonthCustomers,
            revenueChange: calculateChange(currentRevenue, previousRevenue),
            ordersChange: calculateChange(currentOrders, previousOrders),
            productsChange: calculateChange(currentProducts, previousProducts),
            customersChange: calculateChange(currentMonthCustomers, previousMonthCustomers)
        };

        res.json(stats);
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ error: 'Error fetching dashboard stats' });
    }
};

// Get revenue data for the last 12 months
const getRevenueData = async (req, res) => {
    try {
        const now = new Date();
        const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const revenueData = await Order.aggregate([
            {
                $match: {
                    createdAt: { 
                        $gte: twelveMonthsAgo,
                        $lte: currentMonthEnd
                    },
                    status: "Đã thanh toán"
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    total: { $sum: { $toDouble: "$totalAmount" } }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Fill in missing months with zero revenue
        const months = [];
        for (let i = 0; i < 12; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.unshift({
                year: date.getFullYear(),
                month: date.getMonth() + 1
            });
        }

        const filledData = months.map(month => {
            const existingData = revenueData.find(
                item => item._id.year === month.year && item._id.month === month.month
            );
            return {
                _id: month,
                total: existingData ? Math.round(existingData.total) : 0
            };
        });

        const labels = filledData.map(item => {
            const date = new Date(item._id.year, item._id.month - 1);
            return date.toLocaleString('vi-VN', { month: 'short' });
        });

        const data = filledData.map(item => item.total);

        res.json({ labels, data });
    } catch (error) {
        console.error('Revenue data error:', error);
        res.status(500).json({ error: 'Error fetching revenue data' });
    }
};

// Get top selling products
const getTopProducts = async (req, res) => {
    try {
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const topProducts = await Order.aggregate([
            {
                $match: {
                    createdAt: { 
                        $gte: currentMonthStart,
                        $lte: currentMonthEnd
                    },
                    status: "Đã thanh toán"
                }
            },
            {
                $unwind: "$items"
            },
            {
                $group: {
                    _id: "$items.productId",
                    name: { $first: "$items.title" },
                    totalQuantity: { $sum: "$items.quantity" }
                }
            },
            {
                $sort: { totalQuantity: -1 }
            },
            {
                $limit: 6
            }
        ]);

        const labels = topProducts.map(product => product.name);
        const data = topProducts.map(product => product.totalQuantity);

        res.json({ labels, data });
    } catch (error) {
        console.error('Top products error:', error);
        res.status(500).json({ error: 'Error fetching top products' });
    }
};

// Get order trends for the last 12 months
const getOrderTrends = async (req, res) => {
    try {
        const now = new Date();
        const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const orderTrends = await Order.aggregate([
            {
                $match: {
                    createdAt: { 
                        $gte: twelveMonthsAgo,
                        $lte: currentMonthEnd
                    },
                    status: "Đã thanh toán"
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Fill in missing months with zero orders
        const months = [];
        for (let i = 0; i < 12; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.unshift({
                year: date.getFullYear(),
                month: date.getMonth() + 1
            });
        }

        const filledData = months.map(month => {
            const existingData = orderTrends.find(
                item => item._id.year === month.year && item._id.month === month.month
            );
            return {
                _id: month,
                count: existingData ? existingData.count : 0
            };
        });

        const labels = filledData.map(item => {
            const date = new Date(item._id.year, item._id.month - 1);
            return date.toLocaleString('vi-VN', { month: 'short' });
        });

        const data = filledData.map(item => item.count);

        res.json({ labels, data });
    } catch (error) {
        console.error('Order trends error:', error);
        res.status(500).json({ error: 'Error fetching order trends' });
    }
};

module.exports = {
    getDashboardStats,
    getRevenueData,
    getTopProducts,
    getOrderTrends
};
