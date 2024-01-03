import express from 'express';
import { addressController } from '../controllers/index.js';

const router = express.Router();

router.get('/', addressController.getAddresses);
router.get('/:userId', addressController.getAddressByUserId);
router.get('/address/:addressId', addressController.getAddressById);
router.get('/default/:userId', addressController.getDefaultAddress);
router.patch('/', addressController.updateAddress);
router.post('/', addressController.insertAddress);
router.delete('/:addressId', addressController.deleteAddress);

export default router;
