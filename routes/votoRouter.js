import express from 'express';
import {votarImagen} from '../controllers/VotoController.js'
import { authFetch } from '../middlewares/authFetch.js';

const router = express.Router();

router.post('/', authFetch, votarImagen);

export default router;