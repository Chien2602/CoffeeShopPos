const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

const createOrder = async (req, res) => {
    try {
        const { employeeId, customerId, tableId, totalAmount, items, paymentMethod, status } = req.body;
        
        if (!employeeId || !tableId || !totalAmount || !items || !Array.isArray(items) || !paymentMethod) {
            return res.status(400).json({ 
                success: false,
                message: "Vui lòng nhập đầy đủ thông tin" 
            });
        }
        const validPaymentMethods = ['Tiền mặt', 'Thẻ ngân hàng', 'Ví điện tử'];
        if (!validPaymentMethods.includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Phương thức thanh toán không hợp lệ"
            });
        }

        // Fetch product details for each item
        const itemsWithDetails = await Promise.all(items.map(async (item) => {
            const product = await Product.findById(item.productId);
            if (!product) {
                throw new Error(`Không tìm thấy sản phẩm với ID: ${item.productId}`);
            }
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                total: item.total,
                title: product.title,
                thumbnail: product.thumbnail
            };
        }));

        // Create the order with items directly
        const order = await Order.create({ 
            employeeId, 
            customerId, 
            tableId, 
            totalAmount,
            paymentMethod,
            status: status || 'Đã thanh toán',
            items: itemsWithDetails
        });

        // Return the order with populated data
        const populatedOrder = await Order.findById(order._id)
            .populate('customerId', 'name phone')
            .populate('tableId', 'tableNumber')
            .populate('items.productId', 'title price thumbnail');

        res.status(201).json({
            success: true,
            data: populatedOrder,
            message: "Tạo đơn hàng thành công"
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ 
            success: false,
            message: error.message || "Lỗi khi tạo đơn hàng" 
        });
    }
};
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('employeeId', 'name')
            .populate('customerId', 'name phone')
            .populate('tableId', 'tableNumber')
            .populate({
                path: 'items',
                populate: {
                    path: 'productId',
                    select: 'title price'
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ 
            success: false,
            message: error.message || "Lỗi khi lấy danh sách đơn hàng" 
        });
    }
}

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ 
                success: false,
                message: "Vui lòng nhập id" 
            });
        }

        const order = await Order.findById(id)
            .populate('employeeId', 'name')
            .populate('customerId', 'name phone')
            .populate('tableId', 'tableNumber')
            .populate({
                path: 'items',
                populate: {
                    path: 'productId',
                    select: 'title price'
                }
            });

        if (!order) {
            return res.status(404).json({ 
                success: false,
                message: "Không tìm thấy đơn hàng" 
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ 
            success: false,
            message: error.message || "Lỗi khi lấy thông tin đơn hàng" 
        });
    }
}


const getOrdersByEmployeeId = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const orders = await Order.find({ employeeId: employeeId })
            .populate('tableId', 'tableNumber')
            .populate('customerId', 'name')
            .populate('employeeId', 'name')
            .populate({
                path: 'items.productId',
                select: 'title price thumbnail'
            });

        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    getOrdersByEmployeeId
};
