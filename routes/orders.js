import express from 'express';
import { orderController } from '../controllers/index.js';

const router = express.Router();

router.get('/', orderController.getOrders);
router.get('/order/:orderId', orderController.getOrderById);
router.patch('/', orderController.updateOrder);
router.post('/', orderController.insertOrder);
router.delete('/:orderId', orderController.deleteOrder);
router.get('/:userId', orderController.getOrdersByUserId);

export default router;
