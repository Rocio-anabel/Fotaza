import { Publicacion } from "../models/Publicacion.js";
import { Imagen } from "../models/Imagen.js";
import { Etiqueta } from "../models/Etiqueta.js";
import sharp from "sharp";
import {literal, col, Op} from "sequelize";
import { Comentario } from "../models/Comentario.js";
import { Usuario} from "../models/Usuario.js";
import {Voto} from "../models/Voto.js";
import { publicacionSchema } from "../schemas/publicacionSchema.js";
import { imagenSchema } from "../schemas/imagenSchema.js";

export const renderizarCrear = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.session.user.id, {
        attributes: ['avatar']
        });

        
        res.render('crear-publicacion',  {avatar: usuario.avatar
            ? `data:image/jpeg;base64,${usuario.avatar.toString('base64')}`
            : '/images/avatar-default.svg',
            errors: [], data: {} });

    } catch (error) {
        console.error('Error al renderizar crear publicacion: ', error);
    }
    
}
export const crearPublicacion = async (req, res) => {
    try {
        const bodyResult = publicacionSchema.safeParse(req.body);
        const filesResult = imagenSchema.safeParse({ imagenes: req.files ?? [] });

        if (!bodyResult.success || !filesResult.success) {
          
          const errors = {
              ...(bodyResult.success ? {} : bodyResult.error.flatten().fieldErrors),
              ...(filesResult.success ? {} : filesResult.error.flatten().fieldErrors),
            };


          const usuario = await Usuario.findByPk(req.session.user.id, {
            attributes: ['avatar']
            });
        
            

          return res.render('crear-publicacion', {avatar: usuario.avatar
            ? `data:image/jpeg;base64,${usuario.avatar.toString('base64')}`
            : '/images/avatar-default.svg', errors, data: req.body});
        }

        const {titulo, descripcion, etiquetas, licencia, marcaAgua} = req.body;
        const idUsuario = req.session.user.id;
        const imagenes = req.files;

        const arrayEtiquetas = etiquetas.split(",");

        const publicacion = await Publicacion.create({
            titulo: titulo,
            descripcion: descripcion,
            id_usuario: idUsuario
        });

        for (const etiqueta of arrayEtiquetas) {
            await Etiqueta.create({
                 nombreEtiqueta: etiqueta.trim(),
                 id_publicacion: publicacion.idPublicacion
            });
        }

        for (const img of imagenes){
            const metadata = await sharp(img.buffer).metadata();
            if(licencia){
                let watermark = 'Fotaza';
                if(marcaAgua){
                    watermark= marcaAgua;
                }
                const fontSize = Math.round(metadata.width * 0.05); 
                const svgWidth = Math.round(metadata.width * 0.4);  
                const svgHeight = fontSize * 2;
                const svg = Buffer.from(`<svg height="${svgHeight}" width="${svgWidth}"> <text x="10" y="${fontSize * 1.5}" font-size="${fontSize}" fill="#fff" font-family="Arial">${watermark}</text></svg>`);
                const imgWatermark = await sharp(img.buffer)
                                            .composite([{ input: svg, tile: true, top: 0, left: 0, blend: "over"}])
                                            .toBuffer();
                await Imagen.create({
                foto: imgWatermark,
                ancho: metadata.width,
                altura: metadata.height,
                extension: metadata.format,
                licencia: true,
                marcaDeAgua: marcaAgua,
                id_publicacion: publicacion.idPublicacion
            })
            } else {
                await Imagen.create({
                foto: img.buffer,
                ancho: metadata.width,
                altura: metadata.height,
                extension: metadata.format,
                licencia: false,
                id_publicacion: publicacion.idPublicacion
            })
            }
            
        }


        res.status(201).redirect(`/publicacion/${publicacion.idPublicacion}`);
        
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        console.error("Error al crear publicación: ", + error);
        return;
    }
}

export const mostrarPublicacion = async (req, res) => {
    try {
        const idPublicacion = Number(req.params.id);

        if (isNaN(idPublicacion)) {
            return res.status(400).send('ID inválido');
        }
        let usuario = null;
        let autenticado = false;
        let idUsuario = null;
        usuario = req.session.user
        if(usuario){
            idUsuario = usuario.id;
            usuario = await Usuario.findByPk(idUsuario, {
            attributes: ['avatar']
        });
            autenticado = true;
        }


        const publicacionCompleta = await Publicacion.findByPk(idPublicacion, {
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
            ]});

        if(!publicacionCompleta){
            return res.status(404).send("Publicacion no encontrada");
        }

        const publicacion = publicacionCompleta.toJSON();

        const publitienelicencia = publicacion.Imagens.some(imagen => imagen.licencia)

        if(publitienelicencia && !autenticado){
            return res.status(401).render('error', {autenticado, avatar: null, codigoError: 401, mensaje: 'Se requiere autenticación para acceder a esta página'});
        }
        

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


        
        

        res.render('publicacion', {publicacion, autenticado, avatar: usuario?.avatar
            ? `data:image/jpeg;base64,${usuario.avatar.toString('base64')}`
            : '/images/avatar-default.svg'});

    
    } catch (error) {
        console.error('Error al recuperar publicación: ', error);
        return res.status(500).json({message: "Error interno del servidor"});
    }
    
}

export const buscarPublicaciones = async (req, res) => {
    try {
        let usuario = null;
        let autenticado = false;
        if(req.session.user){
            usuario = await Usuario.findByPk(req.session.user.id, {
            attributes: ['avatar']
        });
            autenticado = true;
        }
        
        const {texto} = req.body;
        
        const publicaciones = await Publicacion.findAll({
            attributes: ['idPublicacion', 'id_usuario', 'titulo', 'descripcion'],
            include: [
                {
                    model: Usuario,
                    required: true,
                    attributes: ['idUsuario', 'nombre', 'apellido', 'avatar']
                },
                {
                    model: Imagen,
                    required: true,
                    attributes: {
                                    include: [
                                               [literal('(SELECT COUNT(*) FROM "Voto" WHERE "Voto"."id_imagen" = "Imagens"."id_imagen")'), 'cantidadVotos'],
                                               [literal('(SELECT AVG("valor") FROM "Voto" WHERE "Voto"."id_imagen" = "Imagens"."id_imagen")'), 'promedioVotos']
                                             ],
                                    exclude: ['marcaDeAgua', 'fecha_creacion', 'fecha_actualizacion', 'fecha_borrado']
                                },
                    include: [
                        {
                            model: Voto,
                            required: false,
                            attributes: ['idVoto', 'valor']
                        }
                    ]
                },
                {
                    model: Etiqueta,
                    required: true,
                    attributes: ['idEtiqueta', 'id_publicacion', 'nombreEtiqueta']
                }
            ],
            where: {
                [Op.or]: [
                    { titulo: { [Op.iLike]: `%${texto}%` } },
                    { descripcion: { [Op.iLike]: `%${texto}%` } },
                    { '$Etiqueta.nombre_etiqueta$': { [Op.iLike]: `%${texto}%` } },
                    { '$Usuario.nombre$': {[Op.iLike]: `%${texto}%`}},
                    { '$Usuario.apellido$': {[Op.iLike]: `%${texto}%`}}
                ]
            }
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
                    return img;
                });
            }
            return res.render('buscar', {publicacionesJSON, autenticado, avatar: null, texto});
        }
        const publicacionesJSON = publicaciones.map(p => p.toJSON());

        for (const publicacion of publicacionesJSON) {
                if(publicacion.Usuario.avatar){
                    publicacion.Usuario.avatar = `data:image/jpeg;base64,${publicacion.Usuario.avatar.toString('base64')}`;
                }
                publicacion.Imagens = publicacion.Imagens.map(img => {
                    img.foto = `data:image/${img.extension};base64,${img.foto.toString('base64')}`;
                    return img;
                });
        }

        return res.render('buscar', {publicacionesJSON, autenticado, avatar: usuario.avatar
            ? `data:image/jpeg;base64,${usuario.avatar.toString('base64')}`
            : '/images/avatar-default.svg', texto});



    } catch (error) {
        console.error('Error al buscar publicaciones: ', error);
        return res.status(500).json({message: "Error interno del servidor"});
    }
}

