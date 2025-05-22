const express = require('express');
const router = express.Router();
const {
    createCustomer,
    getCustomers,
    updateCustomer,
    getCustomerById,
    deleteCustomer
} = require('../controllers/customerController');
const { verifyToken, isEmployee } = require('../middleware/authMiddleware');

router.post('/', verifyToken, createCustomer);
router.get('/', verifyToken, getCustomers);
router.put('/:id', verifyToken, updateCustomer);
router.get('/:id', verifyToken, getCustomerById);
router.delete('/:id', verifyToken, deleteCustomer);
module.exports = router;