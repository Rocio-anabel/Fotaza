import { Usuario } from "../models/Usuario.js";

export async function authMiddleware(req, res, next) {
  const user = req.session.user; 
  if(!user) {
    res.redirect('/auth/login');
    return;
  }

  const userId = Number(user.id);

  try {
    const usuario = await Usuario.findByPk(userId, {
      attributes: ['idUsuario'],
    });

    if (!usuario) {
      res.redirect('/auth/login');
      return;
    }

    res.locals.currentUser = {
      id: usuario.idUsuario
    };
  } catch (error) {
    console.error('[!] Error al autenticar usuario:', error);
  }

  next();
}