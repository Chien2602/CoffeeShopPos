const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

const createProduct = async (req, res) => {
  try {
    const { title, price, categoryId, thumbnail, stock } = req.body;
    if (!title || !price || !categoryId || !thumbnail || !stock) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({
        message: "Danh mục không tồn tại",
      });
    }
    const product = await Product.create({
      title,
      price,
      categoryId,
      thumbnail,
      stock,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createMultipleProducts = async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({
        message: "Danh sách sản phẩm không hợp lệ",
      });
    }
    for (const product of products) {
      if (!product.title || !product.price || !product.categoryId || !product.thumbnail || !product.stock) {
        return res.status(400).json({
          message: "Vui lòng nhập đầy đủ thông tin cho tất cả sản phẩm",
        });
      }
    }
    const createdProducts = await Product.insertMany(
      products.map(product => ({
        title: product.title,
        price: product.price,
        categoryId: product.categoryId,
        thumbnail: product.thumbnail,
        stock: product.stock,
      }))
    );
    res.status(201).json({
      message: "Tạo sản phẩm thành công",
      products: createdProducts,
      total: createdProducts.length,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      categoryId,
      thumbnail,
      stock,
      isActive,
      isDeleted,
    } = req.body;

    const products = await Product.findById(id);
    if (!products) {
      return res.status(404).json({
        message: "Sản phẩm không tồn tại",
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (categoryId !== undefined) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({
          message: "Danh mục không tồn tại",
        });
      }
      updateData.categoryId = categoryId;
    }
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (stock !== undefined) updateData.stock = stock;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isDeleted !== undefined) updateData.isDeleted = isDeleted;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "Không có thông tin nào được cập nhật",
      });
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(400).json({
        message: "Cập nhật sản phẩm thất bại",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Vui lòng nhập id sản phẩm",
      });
    }
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        message: "Sản phẩm không tồn tại",
      });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({
        message: "Vui lòng nhập id sản phẩm",
      });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Sản phẩm không tồn tại",
      });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getProduct,
  createMultipleProducts,
};
