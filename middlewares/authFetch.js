import { Usuario } from "../models/Usuario.js";

export async function authFetch(req, res, next){

    const user = req.session.user; 
    if(!user) {
      return res.status(401).json({
            mensaje: 'No autenticado'
        });
    }

    const userId = Number(user.id);

    try {
      const usuario = await Usuario.findByPk(userId, {
        attributes: ['idUsuario'],
      });

      if (!usuario) {
        return res.status(401).json({
            mensaje: 'No autenticado'
        });
      }

      res.locals.currentUser = {
        id: usuario.idUsuario
      };
    } catch (error) {
      console.error('[!] Error al autenticar usuario:', error);
    }
    next();

}