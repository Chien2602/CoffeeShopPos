const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const createCart = async (req, res) => {
  try {
    const { employeeId, items = [] } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        message: "Vui lòng nhập ID nhân viên",
      });
    }

    const existingCart = await Cart.findOne({ employeeId });
    if (existingCart) {
      return res.status(400).json({
        message: "Giỏ hàng đã tồn tại",
      });
    }

    if (items && items.length > 0) {
      if (!Array.isArray(items)) {
        return res.status(400).json({
          message: "Danh sách sản phẩm không hợp lệ",
        });
      }

      for (const item of items) {
        if (!item.productId || !item.quantity || item.quantity <= 0) {
          return res.status(400).json({
            message: "Thông tin sản phẩm không hợp lệ",
          });
        }

        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(400).json({
            message: `Sản phẩm với ID ${item.productId} không tồn tại`,
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Sản phẩm ${product.title} chỉ còn ${product.stock} sản phẩm`,
          });
        }
      }
    }

    const cart = await Cart.create({ 
      employeeId, 
      items: items || [] 
    });

    res.status(201).json({
      message: "Tạo giỏ hàng thành công",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

const getCart = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) {
      return res.status(400).json({
        message: "Vui lòng nhập ID nhân viên",
      });
    }

    const cart = await Cart.findOne({ employeeId }).populate(
      "items.productId",
      "title price thumbnail stock"
    );

    if (!cart) {
      return res.status(404).json({
        message: "Không tìm thấy giỏ hàng",
      });
    }

    const total = calculateTotal(cart.items);

    res.status(200).json({
      cart,
      total: total
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateCart = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { items } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        message: "Vui lòng nhập ID nhân viên",
      });
    }

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        message: "Thông tin sản phẩm không hợp lệ",
      });
    }

    const existingCart = await Cart.findOne({ employeeId });
    if (!existingCart) {
      return res.status(404).json({
        message: "Không tìm thấy giỏ hàng",
      });
    }

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          message: "Thông tin sản phẩm không hợp lệ",
        });
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          message: `Sản phẩm với ID ${item.productId} không tồn tại`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm ${product.title} chỉ còn ${product.stock} sản phẩm`,
        });
      }
    }

    const cart = await Cart.findOneAndUpdate(
      { employeeId },
      { items },
      { new: true }
    ).populate("items.productId", "title price thumbnail stock");

    const total = calculateTotal(cart.items);

    res.status(200).json({
      message: "Cập nhật giỏ hàng thành công",
      cart,
      total: total
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteCart = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) {
      return res.status(400).json({
        message: "Vui lòng nhập ID nhân viên",
      });
    }

    const cart = await Cart.findOneAndDelete({ employeeId });
    if (!cart) {
      return res.status(404).json({
        message: "Không tìm thấy giỏ hàng",
      });
    }

    res.status(200).json({
      message: "Xóa giỏ hàng thành công",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { employeeId, productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({
        message: `Sản phẩm ${product.title} chỉ còn ${product.stock} sản phẩm`,
      });
    }

    const cart = await Cart.findOneAndUpdate(
      { employeeId },
      { 
        $push: { 
          items: { 
            productId, 
            quantity, 
            price: product.price,
            title: product.title,
            thumbnail: product.thumbnail
          } 
        } 
      },
      { new: true }
    ).populate("items.productId", "title price thumbnail stock");

    const total = calculateTotal(cart.items);

    res.status(200).json({
      message: "Thêm sản phẩm vào giỏ hàng thành công",
      cart,
      total: total
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { employeeId, productId } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { employeeId },
      { $pull: { items: { productId } } },
      { new: true }
    ).populate("items.productId", "title price thumbnail stock");

    res.status(200).json({
      message: "Xóa sản phẩm khỏi giỏ hàng thành công",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const cart = await Cart.findOneAndUpdate(
      { employeeId },
      { $set: { items: [] } },
      { new: true }
    ).populate("items.productId", "title price thumbnail stock");

    res.status(200).json({
      message: "Xóa tất cả sản phẩm khỏi giỏ hàng thành công",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createCart,
  getCart,
  updateCart,
  deleteCart,
  addToCart,
  removeFromCart,
  clearCart,
};
