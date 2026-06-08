import express from 'express';
import { mostrarPerfil } from '../controllers/PerfilController.js';

const router = express.Router();

router.get('/:id', mostrarPerfil);

export default router;
