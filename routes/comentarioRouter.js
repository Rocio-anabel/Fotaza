import express from 'express';
import { authFetch } from '../middlewares/authFetch.js';
import { comentarImagen } from '../controllers/comentarioController.js';

const router= express.Router();

router.post('/', authFetch, comentarImagen);



export default router;
