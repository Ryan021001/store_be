import express from 'express';
import { cartController } from '../controllers/index.js';

const router = express.Router();

router.patch('/', cartController.updateCartItem);
router.post('/', cartController.insertCartItem);
router.get('/:userId', cartController.getCartsByUserId);
router.delete('/:cartItemId', cartController.deleteCartItem);
router.get('/check/:userId', cartController.checkEmptyCart);

export default router;
