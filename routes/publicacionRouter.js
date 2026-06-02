import express from 'express';
import * as PublicacionController from '../controllers/PublicacionController.js';
import upload from "../middlewares/upload.js";
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.get('/crear', authMiddleware, PublicacionController.renderizarCrear);
router.post('/crear', upload.array('imagenes'), authMiddleware, PublicacionController.crearPublicacion);
router.get('/:id', PublicacionController.mostrarPublicacion);

export default router;