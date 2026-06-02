import { Router } from "express";
import * as AuthController from '../controllers/authController.js';
import upload from "../middlewares/upload.js";

const router = Router();

router.get('/login', AuthController.renderizarLogin);
router.post('/login', AuthController.login);

router.get('/signup', AuthController.renderizarSignup);
router.post('/signup', upload.single('avatar'), AuthController.registrarse)

router.get('/logout', AuthController.logout)

export default router