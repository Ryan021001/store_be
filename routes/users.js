import express from 'express';
import { body } from 'express-validator';
import { userController } from '../controllers/index.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
});

router.post(
  '/login',
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
  userController.login
);
router.post('/register', userController.register);
router.get('/', userController.getUsers);
router.get('/:userId', userController.getUserById);
router.delete('/:userId', userController.deleteUser);
router.patch('/', upload.single('image'),userController.updateUser);
router.patch('/password', userController.changePassword);
export default router;
