import { UsuarioSeguidor } from "../models/UsuarioSeguidor.js";


export const seguirUsuario = async (req, res) => {

    try{

        const idSeguidor = req.session.user.id;

        const idSeguido = Number(req.body.idUsuario);


        if(idSeguidor === idSeguido){

            return res.status(400).send(
                'No puedes seguirte a ti mismo'
            );

        }
        const seguimiento =
            await UsuarioSeguidor.findOne({

                where: {
                    idUsuario: idSeguido,
                    idSeguidor: idSeguidor,
                    id_usuario: idSeguido,
                    id_seguidor: idSeguidor
                }

            });
        if(seguimiento){

            await seguimiento.destroy();

            return res.json({
                siguiendo: false
            });

        }
        const seguimientoExistente =
            await UsuarioSeguidor.findOne({

                where: {
                    idUsuario: idSeguido,
                    idSeguidor: idSeguidor,
                    id_usuario: idSeguido,
                    id_seguidor: idSeguidor
                },
                paranoid: false

            });
        if(seguimientoExistente){

            await seguimientoExistente.restore();

            return res.json({
                siguiendo: true
            });

        }

        await UsuarioSeguidor.create({
            idUsuario: idSeguido,
            idSeguidor: idSeguidor,
            id_usuario: idSeguido,
            id_seguidor: idSeguidor
        });

        return res.json({
            siguiendo: true
        });

    }catch(error){

        console.error('Error al seguir: ', error);
        return res.status(500).json({message: "Error interno del servidor"});

    }

}