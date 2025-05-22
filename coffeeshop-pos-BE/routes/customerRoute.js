const express = require('express');
const router = express.Router();
const {
    createCustomer,
    getCustomers,
    updateCustomer,
    getCustomerById
} = require('../controllers/customerController');
const { verifyToken, isEmployee } = require('../middleware/authMiddleware');

router.post('/', verifyToken, isEmployee, createCustomer);
router.get('/', verifyToken, isEmployee, getCustomers);
router.put('/:id', verifyToken, isEmployee, updateCustomer);
router.get('/:id', verifyToken, isEmployee, getCustomerById);

module.exports = router;