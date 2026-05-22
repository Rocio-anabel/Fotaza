import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

export class Comentario extends Model {}

Comentario.init(
    {
        idComentario: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        texto: {
            type: DataTypes.STRING,
        }
    },
    {
        sequelize,
        underscored: true,
        timestamps: true,
        createdAt: 'fecha_creacion',
        updatedAt: 'fecha_actualizacion',
        paranoid: true,
        deletedAt: 'fecha_borrado'
    }
)