import { Usuario } from "../models/Usuario.js";
import { UsuarioSeguidor } from "../models/UsuarioSeguidor.js";
import { Publicacion } from "../models/Publicacion.js";
import { Comentario } from "../models/Comentario.js";
import { Imagen } from "../models/Imagen.js";
import { Etiqueta } from "../models/Etiqueta.js";
import { Voto } from "../models/Voto.js";
import { literal } from "sequelize";

export const mostrarPerfil = async(req, res) => {
    try {
        const idUsuario = Number(req.params.id);
    
        if (isNaN(idUsuario)) {
                return res.status(400).send('ID inválido');
        }
        let autenticado = false;
        let avatar = null;
        let idAutenticado = null
        if(req.session.user){
            autenticado = true;
            idAutenticado = req.session.user.id
            const user = await Usuario.findByPk(req.session.user.id, {
                attributes: ['avatar']
            })
            if(user.avatar){
                avatar = `data:image/jpeg;base64,${user.avatar.toString('base64')}`;
            }
        }
    
    
    
        const usuario = await Usuario.findByPk(idUsuario, {
            attributes: ['idUsuario', 'nombre', 'apellido', 'avatar', 'bio']
        });
        
        if(!usuario){
            return res.status(404).render('error',{autenticado, avatar, codigoError: 404, mensaje: 'Perfil no encontrado'});
        }
        if(usuario.avatar){
                usuario.avatar = `data:image/jpeg;base64,${usuario.avatar.toString('base64')}`;
        }
    
        const seguidores = await UsuarioSeguidor.findAndCountAll({
            where: {
              id_usuario: idUsuario
            }
        });
    
        const seguidos = await UsuarioSeguidor.findAndCountAll({
            where: {
                id_seguidor: idUsuario
            }
        });
        
        
        const publicaciones = await Publicacion.findAll({
            where: {
                id_usuario: idUsuario
            },
            include: [
                        {
                            model: Usuario,
                            required: true,
                            attributes: ['idUsuario', 'nombre', 'apellido', 'avatar']
                        },
                        {
                            model: Etiqueta,
                            required: true,
                            attributes: ['idEtiqueta', 'nombreEtiqueta']
                        },
                        {
                            model: Imagen,
                            required: true,
                            attributes: {
                                            include: [
                                                       [literal('(SELECT COUNT(*) FROM "Voto" WHERE "Voto"."id_imagen" = "Imagens"."id_imagen")'), 'cantidadVotos'],
                                                       [literal('(SELECT AVG("valor") FROM "Voto" WHERE "Voto"."id_imagen" = "Imagens"."id_imagen")'), 'promedioVotos'],
                                                       [literal(`(SELECT "Voto".valor FROM "Voto"  WHERE "Voto"."id_imagen" = "Imagens"."id_imagen" AND "Voto"."id_usuario" = ${idAutenticado})`),'votoUsuario']
                                                     ],
                                            exclude: ['marcaDeAgua', 'fecha_creacion', 'fecha_actualizacion', 'fecha_borrado']
                                        },
                            include: [
                                {
                                    model: Voto,
                                    required: false,
                                    attributes: ['idVoto', 'valor']
                                },
                                {
                                    model: Comentario,
                                    required: false,
                                    include: [
                                        {
                                            model: Usuario,
                                            required: true, 
                                            attributes: ['idUsuario', 'nombre', 'apellido', 'avatar']
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
            });
    
            if(!autenticado){
                const publicacionesSinLicencia = publicaciones.filter(publicacion => {
                    return publicacion.Imagens.every(imagen => !imagen.licencia);
                });
    
                const publicacionesJSON = publicacionesSinLicencia.map(p => p.toJSON());
    
                for (const publicacion of publicacionesJSON) {
                    if(publicacion.Usuario.avatar){
                        publicacion.Usuario.avatar = `data:image/jpeg;base64,${publicacion.Usuario.avatar.toString('base64')}`;
                    }
                    publicacion.Imagens = publicacion.Imagens.map(img => {
                        img.foto = `data:image/${img.extension};base64,${img.foto.toString('base64')}`;
                        img.promedioVotos = img.promedioVotos ? parseFloat(img.promedioVotos).toFixed(2) : null;
                        img.Comentarios = img.Comentarios.map(comentario => {
                            if(comentario.Usuario.avatar){
                                comentario.Usuario.avatar = `data:image/jpeg;base64,${comentario.Usuario.avatar.toString('base64')}`;
                            }
                            return comentario;
                            });
                        return img;
                    });
                }
                return res.render('perfil', {publicacionesJSON, autenticado, idAutenticado, avatar, usuario, seguidores: seguidores.count, seguidos: seguidos.count, siguiendo: false});
            }
            const publicacionesJSON = publicaciones.map(p => p.toJSON());
    
            for (const publicacion of publicacionesJSON) {
                    if(publicacion.Usuario.avatar){
                        publicacion.Usuario.avatar = `data:image/jpeg;base64,${publicacion.Usuario.avatar.toString('base64')}`;
                    }
                    publicacion.Imagens = publicacion.Imagens.map(img => {
                        img.foto = `data:image/${img.extension};base64,${img.foto.toString('base64')}`;
                        img.promedioVotos = img.promedioVotos ? parseFloat(img.promedioVotos).toFixed(2) : null;
                        img.Comentarios = img.Comentarios.map(comentario => {
                            if(comentario.Usuario.avatar){
                                comentario.Usuario.avatar = `data:image/jpeg;base64,${comentario.Usuario.avatar.toString('base64')}`;
                            }
                            return comentario;
                            });
                        return img;
                    });
            }

            const siguiendo = await UsuarioSeguidor.findOne({
                where:{
                    idUsuario: usuario.idUsuario,
                    id_seguidor: idAutenticado,
                    id_usuario: usuario.idUsuario,
                    id_seguidor: idAutenticado
                }
            });
            return res.render('perfil', {publicacionesJSON, autenticado, idAutenticado, avatar, usuario, seguidores: seguidores.count, seguidos: seguidos.count, siguiendo: !!siguiendo});
    } catch (error) {

        console.error('Error al mostrar perfil: ', error);
        return res.status(500).json({message: "Error interno del servidor"});
    }

}