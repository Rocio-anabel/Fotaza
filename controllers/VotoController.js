import { Imagen } from "../models/Imagen.js";
import { Publicacion } from "../models/Publicacion.js";
import { Voto } from "../models/Voto.js";
import { votoSchema } from "../schemas/votoSchema.js";


export const votarImagen = async (req, res) => {
    try {
        const result = votoSchema.safeParse(req.body);
        if(!result.success){
            return res.status(400).send('Los datos enviados son inválidos');
        }
        const {idImagen, valor} = req.body;
        

        const img = await Imagen.findByPk(idImagen, {
            attributes: ["idImagen", "id_publicacion"]
        });

        if(!img){
            return res.status(404).send("Imagen no encontrada")
        }
        
        const publicacion = await Publicacion.findByPk(img.id_publicacion, {
            attributes:  ["id_usuario"]
        });
        if(publicacion.id_usuario === req.session.user.id){

            return res.status(403).send('No puedes votar tus propias imágenes');
        }

        const votoExistente = await Voto.findOne({
            where:{
                id_usuario: req.session.user.id,
                id_imagen: idImagen
            }
        });

        if(votoExistente){

            votoExistente.valor = valor;

            await votoExistente.save();

        }else{
            await Voto.create({
                valor: valor,
                id_imagen: idImagen,
                id_usuario: req.session.user.id
            });
        }
        return res.sendStatus(200);

    } catch (error) {
        console.error('Error al votar una imagen: ', error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        return;
    }
}