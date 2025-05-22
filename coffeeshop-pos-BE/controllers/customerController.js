const Customer = require("../models/customerModel");

const createCustomer = async (req, res) => {
  const { name, phone, address } = req.body;

  try {
    if (!name || !phone || !address) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }
    const existingCustomer = await Customer.findOne({ phone });
    if (existingCustomer) {
      return res.status(400).json({ message: "Số điện thoại đã tồn tại" });
    }
    const customer = await Customer.create({
      name,
      phone,
      address,
      rank: "no-rank",
      points: 0,
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, address, points, rank } = req.body;

  try {
    const existingCustomer = await Customer.findById(id);
    if (!existingCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const updateData = {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(email && { email }),
      ...(address && { address }),
      ...(points && { points }),
      ...(rank && { rank }),
    };

    // Update customer
    const customer = await Customer.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true, // Enable validation on update
    });

    // If points were updated, update the rank
    if (points) {
      customer.updateRank();
      await customer.save();
    }

    res.status(200).json({
      success: true,
      data: customer,
      message: "Customer updated successfully",
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error updating customer",
    });
  }
};

const getCustomerById = async (req, res) => {
  const { id } = req.params;
  const customer = await Customer.findById(id);
  res.status(200).json(customer);
};

module.exports = {
  createCustomer,
  getCustomers,
  updateCustomer,
  getCustomerById,
};
