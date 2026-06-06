import express from 'express'
import { buscarPublicaciones } from '../controllers/PublicacionController.js'

const router = express.Router();

router.post('/', buscarPublicaciones)

export default router;