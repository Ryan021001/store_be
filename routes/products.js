import express from 'express';
import multer from 'multer';
import { productController } from '../controllers/index.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
});

router.get('/', productController.getProducts);
router.patch('/', upload.single('image'), productController.updateProduct);
router.post('/', upload.single('image'), productController.insertProduct);
router.delete('/:productId', productController.deleteProduct);
router.get('/search', productController.searchProducts);
router.get('/:productId', productController.getProductById);

export default router;
