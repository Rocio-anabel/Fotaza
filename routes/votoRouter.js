import express from 'express';
import {votarImagen} from '../controllers/VotoController.js'
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authMiddleware, votarImagen);

export default router;