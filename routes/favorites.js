import express from 'express';
import { favoriteController } from '../controllers/index.js';

const router = express.Router();

router.get('/:userId', favoriteController.getFavoritesByUserId);
router.post('/', favoriteController.insertFavorite);

export default router;
