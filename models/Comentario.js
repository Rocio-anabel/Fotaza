import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

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
        tableName: 'Comentario',
        modelName: 'Comentario',
        timestamps: true,
        createdAt: 'fecha_creacion',
        updatedAt: 'fecha_actualizacion',
        paranoid: true,
        deletedAt: 'fecha_borrado'
    }
)