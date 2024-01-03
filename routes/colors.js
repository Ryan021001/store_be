import express from 'express';
import { colorController } from '../controllers/index.js';

const router = express.Router();

router.get('/', colorController.getColors);

export default router;
