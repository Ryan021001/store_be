import express from 'express';
import multer from 'multer';
import { categoryController } from '../controllers/index.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
});

router.get('/', categoryController.getCategories);
router.patch('/', upload.single('image'), categoryController.updateCategory);
router.post('/', upload.single('image'), categoryController.insertCategory);
router.delete('/:categoryId', categoryController.deleteCategory);
router.get('/:categoryId', categoryController.getCategoryById);

export default router;
