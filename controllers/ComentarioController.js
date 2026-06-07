import { Comentario } from "../models/Comentario.js";
import { Imagen } from "../models/Imagen.js";
import { comentarioSchema } from "../schemas/comentarioSchema.js";
import { Usuario } from "../models/Usuario.js";


export const comentarImagen = async (req, res) => {
    try {
        const resultado = comentarioSchema.safeParse(req.body);
        if(!resultado.success){
            return res.status(400).send('Los datos enviados son inválidos');
        }
        const {idImagen, comentario} = req.body

        const img = Imagen.findByPk(idImagen, {
            attributes: ["idImagen"]
        });

        if(!img){
            return res.status(404).send("Imagen no encontrada")
        }

        const nuevoComentario = await Comentario.create({
            texto: comentario,
            id_imagen: idImagen,
            id_usuario: req.session.user.id
        })

        const usuario = await Usuario.findByPk(req.session.user.id, {
            attributes: ["nombre", "apellido", "avatar"]
        });
        if(usuario.avatar){
            usuario.avatar = `data:image/jpeg;base64,${usuario.avatar.toString('base64')}`;
        }
        
        res.status(200).json({comentario: nuevoComentario.texto, usuario: {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            avatar: usuario.avatar}});
    } catch (error) {
        console.error('Error al comentar una imagen: ', error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        return;
        
    }
}