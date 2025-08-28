const express = require('express');
const router = express.Router();
const order_itemsController = require('../controllers/order_item');

router.get('/', order_itemsController.getAllOrder_items);
router.get('/:id', order_itemsController.getOrder_itemsById);
router.post('/', order_itemsController.createOrder_items);
router.delete('/:id', order_itemsController.deleteOrder_items);


module.exports = router;
