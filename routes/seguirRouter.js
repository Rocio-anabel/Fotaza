import express from 'express'
import { seguirUsuario } from '../controllers/SeguirController.js';
import { authFetch } from '../middlewares/authFetch.js';

const router = express.Router();

router.post('/', authFetch, seguirUsuario);

export default router;