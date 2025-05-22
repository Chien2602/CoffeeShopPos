const Category = require("../models/categoryModel");

const createCategory = async (req, res) => {
  try {
    const { title, description, thumbnail, isActive } = req.body;
    if (!title || !thumbnail) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }
    const category = await Category.create({
      title,
      description: description || "",
      thumbnail,
      isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json({
      message: "Tạo danh mục thành công",
      category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMultipleCategories = async (req, res) => {
  try {
    const { categories } = req.body;

    if (!categories || !Array.isArray(categories)) {
      return res.status(400).json({
        message: "Danh sách danh mục không hợp lệ",
      });
    }

    for (const category of categories) {
      if (!category.title || !category.thumbnail) {
        return res.status(400).json({
          message: "Vui lòng nhập đầy đủ thông tin cho tất cả danh mục",
        });
      }
    }

    const createdCategories = await Category.insertMany(
      categories.map((category) => ({
        title: category.title,
        description: category.description || "",
        thumbnail: category.thumbnail,
        isActive: category.isActive !== undefined ? category.isActive : true,
      }))
    );

    res.status(201).json({
      message: "Tạo danh mục thành công",
      categories: createdCategories,
      total: createdCategories.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, thumbnail, isActive } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Vui lòng nhập id",
      });
    }

    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục",
      });
    }
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "Không có thông tin nào được cập nhật",
      });
    }

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Cập nhật danh mục thành công",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Vui lòng nhập id" });
    }
    const category = await Category.findByIdAndDelete(id);
    res.status(200).json({
      message: "Xóa danh mục thành công",
      category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Vui lòng nhập id" });
    }
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getCategoryById,
  createMultipleCategories,
};
