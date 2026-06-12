import { Publicacion } from "../models/Publicacion.js";
import { Usuario } from "../models/Usuario.js";
import { Imagen } from "../models/Imagen.js";
import { UsuarioSeguidor } from "../models/UsuarioSeguidor.js";
import { Etiqueta } from "../models/Etiqueta.js";
import { Comentario } from "../models/Comentario.js";
import { Voto } from "../models/Voto.js";
import { literal, Op } from "sequelize";

export const home = async(req, res) => {
    try {
        const idUsuario = req.session.user.id;
    
        const usuario = await Usuario.findByPk(idUsuario, {
            attributes: ['avatar']
            });
        
    
        const idSeguidos = await UsuarioSeguidor.findAll({
            where: {
                id_seguidor: idUsuario,
                idSeguidor: idUsuario
            },
            attributes: ["idUsuario"]
        });
        const idsArray = idSeguidos.map(s => s.id_usuario);
    
        const publicacionesSeguidos = await Publicacion.findAll({
            where:{
                id_usuario: idsArray
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
                                                   [literal(`(SELECT "Voto".valor FROM "Voto"  WHERE "Voto"."id_imagen" = "Imagens"."id_imagen" AND "Voto"."id_usuario" = ${idUsuario})`),'votoUsuario']
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
    
        })
        const publicaciones = await Publicacion.findAll({
            order: [
            [literal('(SELECT COUNT(*) FROM "Voto" WHERE "Voto"."id_imagen" = "Imagens"."id_imagen")'), 'DESC']
            ],
            where: {
                id_usuario: {
                    [Op.ne]: idUsuario,
                }
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
                                                   [literal(`(SELECT "Voto".valor FROM "Voto"  WHERE "Voto"."id_imagen" = "Imagens"."id_imagen" AND "Voto"."id_usuario" = ${idUsuario})`),'votoUsuario']
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
        })
        const todasLasPublicaciones = [
        ...publicacionesSeguidos,
        ...publicaciones.filter(p => 
            !publicacionesSeguidos.some(ps => ps.idPublicacion === p.idPublicacion)
        )];
    
        const publicacionesJSON = todasLasPublicaciones.map(p => p.toJSON());
        
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
    
            res.render('home', {avatar: usuario.avatar
            ? `data:image/jpeg;base64,${usuario.avatar.toString('base64')}`
            : '/images/avatar-default.svg', publicacionesJSON});
    } catch (error) {
        console.error('Error al mostrar el home: ', error);
        return res.status(500).json({message: "Error interno del servidor"});
    }
}