import { Model, DataTypes } from "sequelize";
import sequelize from '../config/database.js';

export class Publicacion extends Model {}

Publicacion.init(
    {
        idPublicacion: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        titulo: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        descripcion: {
            type: DataTypes.TEXT,
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