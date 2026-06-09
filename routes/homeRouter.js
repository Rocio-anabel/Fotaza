import express from 'express'
import { home } from '../controllers/HomeController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authMiddleware, home);
export default router