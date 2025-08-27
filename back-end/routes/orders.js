const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');

router.get('/', ordersController.getAllOrders);
router.get('/numberOrders', ordersController.getNumberOrders);
router.get('/totalOrders', ordersController.getTotalOrders);
router.get('/:id', ordersController.getOrderById);
router.post('/', ordersController.createOrder);
router.delete('/:id', ordersController.deleteOrder);

module.exports = router;